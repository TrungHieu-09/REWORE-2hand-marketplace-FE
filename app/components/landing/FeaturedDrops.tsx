"use client";

import Image from "next/image";
import { useState } from "react";
import { useCountdown } from "@/app/hooks/useAnimations";

/* ─── Wishlist Button ─── */
function WishlistBtn({ id }: { id: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      id={id}
      className="product-wishlist"
      aria-label="Add to wishlist"
      onClick={() => setLiked((v) => !v)}
      style={{ color: liked ? "var(--primary)" : undefined }}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
        favorite
      </span>
    </button>
  );
}

/* ─── Product Card ─── */
interface ProductProps {
  id: string;
  era: string;
  hot?: boolean;
  src: string;
  alt: string;
  tags: { label: string; cls: string }[];
  name: string;
  meta: string;
  price: string;
  original: string;
  rating: string;
}

function ProductCard({ id, era, hot, src, alt, tags, name, meta, price, original, rating }: ProductProps) {
  const [quickLabel, setQuickLabel] = useState("Quick View");
  return (
    <article className="product-card animate-in" id={id}>
      <div className="product-img-wrap">
        <Image src={src} alt={alt} fill className="product-img" style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 25vw" />
        <div className="product-overlay">
          <button className="btn-quick-view" id={`quick-${id}`} onClick={() => { setQuickLabel("Opening…"); setTimeout(() => setQuickLabel("Quick View"), 1500); }}>
            {quickLabel}
          </button>
        </div>
        <div className="product-badge-era">{era}</div>
        {hot && <span className="product-badge-hot">🔥 Hot</span>}
        <WishlistBtn id={`wish-${id}`} />
      </div>
      <div className="product-info">
        <div className="product-tags">
          {tags.map((t) => <span key={t.label} className={`tag ${t.cls}`}>{t.label}</span>)}
        </div>
        <h3 className="product-name">{name}</h3>
        <p className="product-meta">{meta}</p>
        <div className="product-footer">
          <div>
            <span className="product-price">{price}</span>
            <span className="product-original">{original}</span>
          </div>
          <div className="seller-trust">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--primary)", fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Auction Card ─── */
function AuctionCard() {
  const timer = useCountdown(2 * 3600000 + 14 * 60000 + 37000);
  const [bid, setBid] = useState(2100000);
  const [label, setLabel] = useState("Place Bid");
  const handleBid = () => {
    setBid((v) => v + 50000);
    setLabel("Bid placed! ✓");
    setTimeout(() => setLabel("Place Bid"), 2000);
  };
  return (
    <article className="product-card auction-card animate-in" id="product-auction">
      <div className="product-img-wrap auction-img-wrap">
        <div className="auction-placeholder">
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#88726c" }}>gavel</span>
          <p style={{ color: "#55433d", fontFamily: "var(--font-manrope)", fontSize: 14, marginTop: 8 }}>Live Auction</p>
        </div>
        <div className="auction-live-badge"><span className="live-dot" />LIVE</div>
      </div>
      <div className="product-info">
        <div className="product-tags">
          <span className="tag tag-terracotta">Auction</span>
          <span className="tag tag-olive">Rare Find</span>
        </div>
        <h3 className="product-name">Silk Scarf — Signed Piece</h3>
        <p className="product-meta">One Size · Mint Condition</p>
        <div className="auction-timer">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>timer</span>
          <span>{timer}</span> remaining
        </div>
        <div className="product-footer">
          <div>
            <span style={{ fontSize: 11, color: "#88726c", fontFamily: "var(--font-manrope)" }}>Current bid</span>
            <br />
            <span className="product-price">₫ {bid.toLocaleString("vi-VN")}</span>
          </div>
          <button className="btn-bid" onClick={handleBid} style={label !== "Place Bid" ? { background: "#556138" } : undefined}>
            {label}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Featured Drops Section ─── */
export default function FeaturedDrops() {
  return (
    <section className="section section-alt" id="drops">
      <div className="container">
        <div className="section-header-row">
          <div>
            <p className="section-eyebrow">Latest Drops</p>
            <h2 className="section-title" style={{ textAlign: "left", marginBottom: 0 }}>Featured Pieces</h2>
          </div>
          <a href="#" className="btn-outline-sm">
            View all drops <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle" }}>arrow_forward</span>
          </a>
        </div>
        <div className="products-grid">
          <ProductCard id="product-blazer" era="90s" src="/product1.png" alt="Vintage beige linen blazer"
            tags={[{ label: "Vintage", cls: "tag-olive" }, { label: "Designer", cls: "tag-mustard" }]}
            name="Linen Oversized Blazer" meta="Size M · Excellent Condition"
            price="₫ 420,000" original="₫ 680,000" rating="4.9" />
          <ProductCard id="product-bag" era="80s" hot src="/product2.png" alt="Vintage brown leather crossbody bag"
            tags={[{ label: "Rare", cls: "tag-olive" }, { label: "Leather", cls: "tag-terracotta" }]}
            name="Structured Leather Satchel" meta="One Size · Good Condition"
            price="₫ 680,000" original="₫ 1,200,000" rating="5.0" />
          <ProductCard id="product-skirt" era="70s" src="/product3.png" alt="Vintage floral midi skirt"
            tags={[{ label: "Vintage", cls: "tag-olive" }, { label: "Boho", cls: "tag-mustard" }]}
            name="Floral Midi Skirt" meta="Size S · Like New"
            price="₫ 295,000" original="₫ 450,000" rating="4.8" />
          <AuctionCard />
        </div>
      </div>
    </section>
  );
}
