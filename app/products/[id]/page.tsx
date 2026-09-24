"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LoadingSkeleton } from "../../components/admin/AdminStates";
import { PillButton } from "../../components/admin/PillButton";
import { availabilityStatusTone, productStatusTone, StatusBadge } from "../../components/admin/StatusBadge";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import {
  ApiError,
  apiAssetUrl,
  cartApi,
  ordersApi,
  productsApi,
  sellerDisplayName,
  wishlistApi,
  type Product,
  type ProductCondition,
} from "../../lib/api";

const CONDITION_LABEL: Record<ProductCondition, string> = {
  NEW: "Mới",
  LIKE_NEW: "Như mới",
  GOOD: "Tốt",
  FAIR: "Khá",
  POOR: "Cũ",
};

const AVAILABILITY_LABEL: Record<string, string> = {
  available: "CÒN HÀNG",
  upcoming_drop: "SẮP DROP",
  held: "ĐANG GIỮ",
  sold: "HẾT HÀNG",
};

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProductImage({
  src,
  alt,
  className,
  loading,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const imageSrc = apiAssetUrl(src);

  if (!imageSrc || failed) {
    return (
      <div className="product-detail-image-fallback">
        <span className="material-symbols-outlined">image_not_supported</span>
        <span>Không có ảnh</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className={className}
      loading={loading}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id ?? "";
  const { isLoggedIn, isLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [wishlistOn, setWishlistOn] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [cartOn, setCartOn] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const [orderBusy, setOrderBusy] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setMessage("");

      productsApi
        .get(productId)
        .then((res) => {
          if (!cancelled) {
            setProduct(res.data);
            setActiveImage(0);
            if (isLoggedIn) {
              Promise.allSettled([
                cartApi.check(res.data.id),
                wishlistApi.check(res.data.id),
              ]).then(([cartResult, wishlistResult]) => {
                if (cancelled) return;
                if (cartResult.status === "fulfilled") setCartOn(cartResult.value.isInCart);
                if (wishlistResult.status === "fulfilled") setWishlistOn(wishlistResult.value.isInWishlist);
              });
            }
          }
        })
        .catch((err) => {
          if (!cancelled) setMessage(err instanceof ApiError ? err.message : "Không tải được sản phẩm.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isLoggedIn, productId]);

  const images = useMemo(() => product?.images ?? [], [product?.images]);
  const mainImage = images[activeImage] ?? images[0] ?? "";
  const sellerName = sellerDisplayName(product?.seller);
  const canBuy = product?.status === "ACTIVE" && product?.availabilityStatus === "available";

  const toggleWishlist = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const nextState = !wishlistOn;
    setWishlistOn(nextState);
    setWishlistBusy(true);
    setMessage("");

    try {
      if (nextState) {
        await wishlistApi.add(product.id);
      } else {
        await wishlistApi.remove(product.id);
      }
    } catch (err) {
      if (nextState && err instanceof ApiError && err.status === 409) return;
      setWishlistOn(!nextState);
      setMessage(err instanceof ApiError ? err.message : "Không cập nhật được wishlist.");
    } finally {
      setWishlistBusy(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setCartBusy(true);
    setMessage("");
    try {
      await cartApi.add(product.id);
      setCartOn(true);
      setMessage("Đã thêm vào giỏ hàng. Lưu ý: giỏ hàng không giữ hàng, ai mua trước thì sản phẩm sẽ hết hàng.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && err.message.includes("đã có")) {
        setCartOn(true);
        setMessage("Sản phẩm đã có trong giỏ hàng.");
        return;
      }
      setMessage(err instanceof ApiError ? err.message : "Không thể thêm vào giỏ hàng.");
    } finally {
      setCartBusy(false);
    }
  };

  const buyNow = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setOrderBusy(true);
    setMessage("");
    try {
      const res = await ordersApi.create({
        productId: product.id,
        shippingAddress: shippingAddress.trim() || undefined,
        note: orderNote.trim() || undefined,
      });
      setProduct((current) => current ? { ...current, status: "SOLD", availabilityStatus: "sold" } : current);
      setCartOn(false);
      setMessage(`${res.message} Mã đơn: ${res.data.id}`);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Không thể tạo đơn hàng.");
      if (err instanceof ApiError && err.status === 409) {
        setProduct((current) => current ? { ...current, status: "SOLD", availabilityStatus: "sold" } : current);
      }
    } finally {
      setOrderBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="product-detail-root">
        <main className="product-detail-wrap">
          <Link href="/shop" className="product-detail-back">
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại Shop
          </Link>

          {loading || isLoading ? (
            <LoadingSkeleton rows={4} />
          ) : !product ? (
            <section className="product-detail-empty">
              <span className="material-symbols-outlined">inventory_2</span>
              <h1>Không tìm thấy sản phẩm</h1>
              <p>{message || "Sản phẩm này có thể đã bị gỡ hoặc không còn khả dụng."}</p>
              <Link href="/shop">Xem sản phẩm khác</Link>
            </section>
          ) : (
            <>
              {message && (
                <div className="admin-warning-banner">
                  <span className="material-symbols-outlined">error</span>
                  <span>{message}</span>
                </div>
              )}

              <section className="product-detail-grid">
                <div className="product-detail-gallery">
                  <div className="product-detail-main-image">
                    {mainImage ? (
                      <ProductImage
                        src={mainImage}
                        alt={product.title}
                        className="product-detail-img"
                        loading="eager"
                        sizes="(max-width: 900px) 100vw, 56vw"
                      />
                    ) : (
                      <div className="product-detail-image-fallback">
                        <span className="material-symbols-outlined">image_not_supported</span>
                        <span>Không có ảnh</span>
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="product-detail-thumbs">
                      {images.map((image, index) => (
                        <button
                          type="button"
                          className={`product-detail-thumb${activeImage === index ? " active" : ""}`}
                          key={`${image}-${index}`}
                          onClick={() => setActiveImage(index)}
                          aria-label={`Xem ảnh ${index + 1}`}
                        >
                          <ProductImage src={image} alt={`${product.title} ${index + 1}`} sizes="90px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <aside className="product-detail-panel">
                  <div className="product-detail-status-row">
                    <StatusBadge label={product.status} tone={productStatusTone(product.status)} />
                    <StatusBadge
                      label={AVAILABILITY_LABEL[product.availabilityStatus ?? "available"] ?? String(product.availabilityStatus)}
                      tone={availabilityStatusTone(product.availabilityStatus)}
                    />
                    <span className="product-detail-save-count">
                      <span className="material-symbols-outlined">favorite</span>
                      {product._count?.wishlistItems ?? 0} saved
                    </span>
                  </div>

                  <h1>{product.title}</h1>
                  <p className="product-detail-price">{formatVnd(product.price)}</p>

                  <div className="product-detail-seller">
                    <span className="sp-shop-avatar">{sellerName[0]}</span>
                    <div>
                      <strong>{sellerName}</strong>
                      <small>{product.seller?.isVerified ? "Seller đã xác thực" : "REWORE seller"}</small>
                    </div>
                    {product.seller?.isVerified && (
                      <span className="material-symbols-outlined product-detail-verified">verified</span>
                    )}
                  </div>

                  <div className="product-detail-facts">
                    <div>
                      <span>Danh mục</span>
                      <strong>{product.category}</strong>
                    </div>
                    <div>
                      <span>Tình trạng</span>
                      <strong>{CONDITION_LABEL[product.condition]}</strong>
                    </div>
                    <div>
                      <span>Thương hiệu</span>
                      <strong>{product.brand || "Không ghi"}</strong>
                    </div>
                    <div>
                      <span>Size</span>
                      <strong>{product.size || "Không ghi"}</strong>
                    </div>
                    <div>
                      <span>Màu sắc</span>
                      <strong>{product.color || "Không ghi"}</strong>
                    </div>
                    <div>
                      <span>Lượt xem</span>
                      <strong>{product.viewCount}</strong>
                    </div>
                  </div>

                  {product.tags.length > 0 && (
                    <div className="product-detail-tags">
                      {product.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="product-detail-actions">
                    <div className="w-full grid gap-3 mb-2">
                      <input
                        className="admin-input"
                        value={shippingAddress}
                        onChange={(event) => setShippingAddress(event.target.value)}
                        placeholder="Địa chỉ nhận hàng"
                      />
                      <textarea
                        className="admin-textarea"
                        value={orderNote}
                        onChange={(event) => setOrderNote(event.target.value)}
                        placeholder="Ghi chú cho seller"
                      />
                    </div>
                    <PillButton type="button" tone="accent" disabled={!canBuy || orderBusy} onClick={buyNow}>
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      {canBuy ? (orderBusy ? "Đang tạo đơn..." : "Mua ngay") : "Hết hàng"}
                    </PillButton>
                    <PillButton type="button" tone="orange" disabled={!canBuy || cartBusy || cartOn} onClick={addToCart}>
                      <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                      {cartOn ? "Đã trong giỏ" : cartBusy ? "Đang thêm..." : "Thêm vào giỏ"}
                    </PillButton>
                    <PillButton type="button" tone="muted" disabled={wishlistBusy} onClick={toggleWishlist}>
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: wishlistOn ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      {wishlistOn ? "Đã lưu" : "Lưu wishlist"}
                    </PillButton>
                  </div>
                  <p className="product-detail-cart-note">
                    Giỏ hàng không giữ hàng. Khi người khác mua trước, sản phẩm trong giỏ sẽ chuyển sang hết hàng.
                  </p>
                </aside>
              </section>

              <section className="product-detail-description">
                <div className="seller-create-section-head">
                  <span className="material-symbols-outlined">notes</span>
                  <div>
                    <h2>Mô tả sản phẩm</h2>
                    <p>Thông tin do seller cung cấp.</p>
                  </div>
                </div>
                <p>{product.description}</p>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
