"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

interface WishlistItem {
  id: number;
  name: string;
  shop: string;
  meta: string;
  price: number;
  img: string;
  badge: "available" | "upcoming" | "auction";
}

const DEMO_ITEMS: WishlistItem[] = [
  { id: 1, name: "Leather Structure Bag", shop: "Curated Objects", meta: "Celine · OS · Very Good", price: 450, img: "/shop-leather-bag.png", badge: "auction" },
  { id: 2, name: "Silk Slip Dress", shop: "Maison Vintage", meta: "Prada · Size XS · Very Good", price: 680, img: "/shop-slip-dress.png", badge: "auction" },
  { id: 3, name: "Wool Tweed Blazer", shop: "The Archive Room", meta: "Ralph Lauren · Size M · Excellent", price: 185, img: "/shop-blazer.png", badge: "available" },
];

const BADGE_LABEL: Record<string, string> = {
  available: "AVAILABLE",
  upcoming: "UPCOMING",
  auction: "IN AUCTION",
};
const BADGE_CLS: Record<string, string> = {
  available: "badge-available",
  upcoming: "badge-upcoming",
  auction: "badge-auction",
};

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>(DEMO_ITEMS);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("rewore_authed") !== "true") {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  if (!authChecked) {
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

          {/* Header */}
          <div className="wl-header">
            <div>
              <h1 className="wl-title">Your Wishlist</h1>
              <p className="wl-sub">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
            </div>
            <a href="/shop" className="wl-browse-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>storefront</span>
              Browse Shop
            </a>
          </div>

          {items.length === 0 ? (
            /* Empty state */
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
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} sizes="280px" />
                    <div className={`wl-badge ${BADGE_CLS[item.badge]}`}>
                      {BADGE_LABEL[item.badge]}
                    </div>
                    <button className="wl-remove-btn" onClick={() => remove(item.id)} aria-label="Remove from wishlist">
                      <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                  </div>
                  <div className="wl-card-body">
                    <p className="wl-card-shop">{item.shop}</p>
                    <h3 className="wl-card-name">{item.name}</h3>
                    <p className="wl-card-meta">{item.meta}</p>
                    <div className="wl-card-footer">
                      <span className="wl-card-price">${item.price.toLocaleString()}</span>
                      <button className={`wl-cta${item.badge === "auction" ? " auction" : ""}`}>
                        {item.badge === "auction" ? "Join Auction" : "Hold Item"}
                      </button>
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
