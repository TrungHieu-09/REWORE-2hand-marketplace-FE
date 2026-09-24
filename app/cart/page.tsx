"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  ApiError,
  apiAssetUrl,
  cartApi,
  ordersApi,
  sellerDisplayName,
  type CartItem,
  type Product,
} from "../lib/api";

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function conditionLabel(condition: Product["condition"]) {
  return condition
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    cartApi
      .list({ limit: 50 })
      .then((res) => {
        if (!cancelled) setItems(res.data);
      })
      .catch((err) => {
        if (!cancelled) setMessage(err instanceof ApiError ? err.message : "Không tải được giỏ hàng.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoading, isLoggedIn, router]);

  const remove = async (productId: string) => {
    const previous = items;
    setItems((current) => current.filter((item) => item.productId !== productId));
    try {
      await cartApi.remove(productId);
    } catch (err) {
      setItems(previous);
      setMessage(err instanceof ApiError ? err.message : "Không thể xóa khỏi giỏ hàng.");
    }
  };

  const buy = async (item: CartItem) => {
    setBusyId(item.id);
    setMessage("");
    try {
      const res = await ordersApi.create({
        productId: item.productId,
        shippingAddress: shippingAddress.trim() || undefined,
        note: orderNote.trim() || undefined,
      });
      setItems((current) => current.filter((cartItem) => cartItem.id !== item.id));
      setMessage(`${res.message} Mã đơn: ${res.data.id}`);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Không thể tạo đơn hàng.");
      if (err instanceof ApiError && err.status === 409) {
        setItems((current) =>
          current.map((cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  isAvailable: false,
                  unavailableReason: "SOLD",
                  product: { ...cartItem.product, status: "SOLD", availabilityStatus: "sold" },
                }
              : cartItem
          )
        );
      }
    } finally {
      setBusyId("");
    }
  };

  if (isLoading || loading || !isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="sp-auth-loading"><span className="sp-auth-spinner" /></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wl-root">
        <div className="wl-wrap">
          <div className="wl-header">
            <div>
              <h1 className="wl-title">Giỏ hàng</h1>
              <p className="wl-sub">{items.length} sản phẩm. Giỏ hàng không giữ hàng, ai mua trước thì món đó hết hàng.</p>
              {message && <p className="wl-sub" style={{ color: message.includes("Đã") ? "#556138" : "#ba1a1a" }}>{message}</p>}
            </div>
            <Link href="/shop" className="wl-browse-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>storefront</span>
              Xem shop
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="wl-empty">
              <span className="material-symbols-outlined wl-empty-icon">shopping_cart</span>
              <h2 className="wl-empty-title">Giỏ hàng đang trống</h2>
              <p className="wl-empty-desc">Thêm món bạn thích vào giỏ, rồi mua trước khi người khác chốt mất.</p>
              <Link href="/shop" className="wl-empty-cta">Xem sản phẩm</Link>
            </div>
          ) : (
            <>
              <section className="admin-panel mb-5">
                <div className="grid gap-3">
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
                    placeholder="Ghi chú áp dụng cho đơn bạn bấm mua"
                  />
                </div>
              </section>
              <div className="wl-grid">
                {items.map((item) => {
                const product = item.product;
                const image = apiAssetUrl(product.images[0]);
                return (
                  <div key={item.id} className="wl-card">
                    <div className="wl-card-img-wrap">
                      <Link href={`/products/${item.productId}`} className="wl-card-image-link" aria-label={`Xem ${product.title}`}>
                        {image ? (
                          <Image src={image} alt={product.title} fill style={{ objectFit: "cover" }} sizes="280px" />
                        ) : (
                          <div className="admin-image-placeholder">
                            <span className="material-symbols-outlined">image_not_supported</span>
                            <span>Không có ảnh</span>
                          </div>
                        )}
                      </Link>
                      <div className={`wl-badge ${item.isAvailable ? "badge-available" : "badge-sold"}`}>
                        {item.isAvailable ? "AVAILABLE" : "HẾT HÀNG"}
                      </div>
                      <button className="wl-remove-btn" onClick={() => remove(item.productId)} aria-label="Xóa khỏi giỏ hàng">
                        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>close</span>
                      </button>
                    </div>
                    <div className="wl-card-body">
                      <p className="wl-card-shop">{sellerDisplayName(product.seller)}</p>
                      <h3 className="wl-card-name">
                        <Link href={`/products/${item.productId}`}>{product.title}</Link>
                      </h3>
                      <p className="wl-card-meta">
                        {[product.brand, product.size ? `Size ${product.size}` : null, conditionLabel(product.condition)]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <div className="wl-card-footer">
                        <span className="wl-card-price">{formatVnd(product.price)}</span>
                        <button
                          className="wl-cta"
                          disabled={!item.isAvailable || busyId === item.id}
                          onClick={() => buy(item)}
                        >
                          {item.isAvailable ? (busyId === item.id ? "Đang mua..." : "Mua ngay") : "Hết hàng"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
