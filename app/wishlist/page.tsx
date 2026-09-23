"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  ApiError,
  apiAssetUrl,
  sellerDisplayName,
  wishlistApi,
  type Product,
  type WishlistItem as ApiWishlistItem,
} from "@/app/lib/api";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  shop: string;
  meta: string;
  priceLabel: string;
  img?: string;
  badge: "available" | "upcoming" | "auction";
}

const BADGE_LABEL: Record<WishlistItem["badge"], string> = {
  available: "AVAILABLE",
  upcoming: "UPCOMING",
  auction: "IN AUCTION",
};
const BADGE_CLS: Record<WishlistItem["badge"], string> = {
  available: "badge-available",
  upcoming: "badge-upcoming",
  auction: "badge-auction",
};

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

function mapWishlistItem(item: ApiWishlistItem): WishlistItem {
  const product = item.product;
  return {
    id: item.id,
    productId: item.productId,
    name: product.title,
    shop: sellerDisplayName(product.seller),
    meta: [
      product.brand,
      product.size ? `Size ${product.size}` : null,
      conditionLabel(product.condition),
      `${product._count?.wishlistItems ?? 0} saved`,
    ]
      .filter(Boolean)
      .join(" · "),
    priceLabel: formatVnd(product.price),
    img: apiAssetUrl(product.images[0]),
    badge: product.status === "AUCTION" ? "auction" : "available",
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    wishlistApi
      .list({ limit: 50 })
      .then((res) => {
        if (!cancelled) setItems(res.data.map(mapWishlistItem));
      })
      .catch((err) => {
        if (!cancelled) {
          setMessage(
            err instanceof ApiError
              ? err.message
              : "Could not load wishlist from API."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoading, isLoggedIn, router]);

  const remove = async (productId: string) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.productId !== productId));

    try {
      await wishlistApi.remove(productId);
    } catch (err) {
      setItems(previous);
      setMessage(
        err instanceof ApiError ? err.message : "Could not remove wishlist item."
      );
    }
  };

  if (isLoading || dataLoading || !isLoggedIn) {
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
              <h1 className="wl-title">Your Wishlist</h1>
              <p className="wl-sub">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
              {message && <p className="wl-sub" style={{ color: "#ba1a1a" }}>{message}</p>}
            </div>
            <a href="/shop" className="wl-browse-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>storefront</span>
              Browse Shop
            </a>
          </div>

          {items.length === 0 ? (
            <div className="wl-empty">
              <span className="material-symbols-outlined wl-empty-icon" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
              <h2 className="wl-empty-title">Nothing saved yet</h2>
              <p className="wl-empty-desc">Tap the heart icon on any item to save it here for later.</p>
              <a href="/shop" className="wl-empty-cta">Explore drops</a>
            </div>
          ) : (
            <div className="wl-grid">
              {items.map(item => (
                <div key={item.id} className="wl-card">
                  <div className="wl-card-img-wrap">
                    <Link href={`/products/${item.productId}`} className="wl-card-image-link" aria-label={`Xem ${item.name}`}>
                      {item.img ? (
                        <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} sizes="280px" />
                      ) : (
                        <div className="admin-image-placeholder">
                          <span className="material-symbols-outlined">image_not_supported</span>
                          <span>Không có ảnh</span>
                        </div>
                      )}
                    </Link>
                    <div className={`wl-badge ${BADGE_CLS[item.badge]}`}>
                      {BADGE_LABEL[item.badge]}
                    </div>
                    <button className="wl-remove-btn" onClick={() => remove(item.productId)} aria-label="Remove from wishlist">
                      <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                  </div>
                  <div className="wl-card-body">
                    <p className="wl-card-shop">{item.shop}</p>
                    <h3 className="wl-card-name">
                      <Link href={`/products/${item.productId}`}>{item.name}</Link>
                    </h3>
                    <p className="wl-card-meta">{item.meta}</p>
                    <div className="wl-card-footer">
                      <span className="wl-card-price">{item.priceLabel}</span>
                      <Link href={`/products/${item.productId}`} className={`wl-cta${item.badge === "auction" ? " auction" : ""}`}>
                        View Item
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


