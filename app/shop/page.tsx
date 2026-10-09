"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  ApiError,
  apiAssetUrl,
  productsApi,
  sellerDisplayName,
  wishlistApi,
  type Product as ApiProduct,
} from "@/app/lib/api";

type Badge = "available" | "upcoming" | "auction" | "held" | "sold";

interface Product {
  id: number;
  apiId?: string;
  shop: string;
  name: string;
  category: string;
  meta: string;
  price: number;
  priceLabel: string;
  badge: Badge;
  badgeLabel: string;
  cta: string;
  detail: string;
  detailIcon: string;
  wishlist: boolean;
  wishlistCount?: number;
  img?: string;
}

const SIZES = ["XS", "S", "M", "L", "XL"];
const STYLES = ["Vintage", "Y2K", "Minimalist", "Streetwear"];

const BADGE_CONFIG = {
  available: { icon: "check_circle", text: "AVAILABLE", cls: "badge-available" },
  upcoming:  { icon: "schedule",     text: "UPCOMING DROP", cls: "badge-upcoming" },
  auction:   { icon: "gavel",        text: "IN AUCTION", cls: "badge-auction" },
  held:      { icon: "lock_clock",    text: "ĐANG GIỮ", cls: "badge-held" },
  sold:      { icon: "block",         text: "HẾT HÀNG", cls: "badge-sold" },
};

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function conditionLabel(condition: ApiProduct["condition"]) {
  return condition
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapApiProduct(product: ApiProduct, index: number, wishlistIds: Set<string>): Product {
  const badge: Badge =
    product.status === "SOLD" || product.availabilityStatus === "sold"
      ? "sold"
      : product.status === "AUCTION"
      ? "auction"
      : product.availabilityStatus === "upcoming_drop"
      ? "upcoming"
      : product.availabilityStatus === "held"
      ? "held"
      : "available";

  return {
    id: index + 1,
    apiId: product.id,
    shop: sellerDisplayName(product.seller),
    name: product.title,
    category: product.category,
    meta: [product.brand, product.size ? `Size ${product.size}` : null, conditionLabel(product.condition)]
      .filter(Boolean)
      .join(" · "),
    price: product.price,
    priceLabel: formatVnd(product.price),
    badge,
    badgeLabel: BADGE_CONFIG[badge].text,
    cta: badge === "available" ? "Mua ngay" : "Xem chi tiết",
    detail: `${product._count?.wishlistItems ?? 0} saved · ${product.viewCount} views`,
    detailIcon: "favorite",
    wishlist: wishlistIds.has(product.id),
    wishlistCount: product._count?.wishlistItems ?? 0,
    img: apiAssetUrl(product.images[0]),
  };
}

export default function ShopPage() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [checkedCats, setCheckedCats] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | Badge>("all");
  const [dataLoading, setDataLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;

    let cancelled = false;

    Promise.allSettled([
      productsApi.list({ limit: 50, sortBy: "newest" }),
      wishlistApi.list({ limit: 50 }),
    ]).then(([productsResult, wishlistResult]) => {
      if (cancelled) return;

      const wishlistIds = new Set<string>();
      if (wishlistResult.status === "fulfilled") {
        wishlistResult.value.data.forEach((item) => wishlistIds.add(item.productId));
      }

      if (productsResult.status === "fulfilled" && productsResult.value.data.length > 0) {
        setProducts(productsResult.value.data.map((p, i) => mapApiProduct(p, i, wishlistIds)));
      } else if (productsResult.status === "rejected") {
        const err = productsResult.reason;
        setApiMessage(err instanceof ApiError ? err.message : "Could not load products from API.");
      }

      setDataLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isLoading, isLoggedIn]);

  const toggleWishlist = async (id: number) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const nextWishlist = !product.wishlist;
    setProducts((p) => p.map((x) => x.id === id ? { ...x, wishlist: nextWishlist } : x));

    if (!product.apiId) return;

    try {
      if (nextWishlist) {
        await wishlistApi.add(product.apiId);
      } else {
        await wishlistApi.remove(product.apiId);
      }
    } catch (err) {
      if (nextWishlist && err instanceof ApiError && err.status === 409) return;
      setProducts((p) => p.map((x) => x.id === id ? { ...x, wishlist: product.wishlist } : x));
      setApiMessage(err instanceof ApiError ? err.message : "Wishlist update failed.");
    }
  };

  const toggleCat = (cat: string) =>
    setCheckedCats((c) => c.includes(cat) ? c.filter((x) => x !== cat) : [...c, cat]);
  const toggleSize = (s: string) =>
    setSelectedSizes((c) => c.includes(s) ? c.filter((x) => x !== s) : [...c, s]);
  const toggleStyle = (s: string) =>
    setSelectedStyles((c) => c.includes(s) ? c.filter((x) => x !== s) : [...c, s]);
  const filtered = useMemo(
    () => activeFilter === "all" ? products : products.filter(p => p.badge === activeFilter),
    [activeFilter, products]
  );
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => counts.set(product.category, (counts.get(product.category) ?? 0) + 1));
    return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);
  const buyerScore = user?.reputation ?? 0;

  return (
    <>
      <Navbar />
      {isLoading || !isLoggedIn ? (
        <div className="sp-auth-loading">
          <span className="sp-auth-spinner" />
        </div>
      ) : (
      <div className="sp-root">
        <div className="sp-wrap">
          <aside className="sp-sidebar">
            <div className="sp-sidebar-inner">
              <div className="sp-filter-top">
                <h2 className="sp-filter-title">Filters</h2>
                <button className="sp-clear-all" onClick={() => { setCheckedCats([]); setSelectedSizes([]); setSelectedStyles([]); setActiveFilter("all"); }}>
                  Clear all
                </button>
              </div>

              <div className="sp-quick-tabs">
                {(["all", "available", "upcoming", "auction", "sold"] as const).map(f => (
                  <button key={f} className={`sp-quick-tab${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>
                    {f === "all" ? "All" : f === "available" ? "Available" : f === "upcoming" ? "Upcoming" : f === "auction" ? "Auction" : "Sold"}
                  </button>
                ))}
              </div>

              <div className="sp-filter-divider" />

              <div className="sp-filter-group">
                <p className="sp-filter-label">Category</p>
                {categories.map((cat) => (
                  <label key={cat.name} className="sp-check-row" onClick={() => toggleCat(cat.name)}>
                    <span className={`sp-checkbox${checkedCats.includes(cat.name) ? " checked" : ""}`}>
                      {checkedCats.includes(cat.name) && (
                        <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#fff", fontVariationSettings: "'FILL' 1" }}>check</span>
                      )}
                    </span>
                    <span className="sp-check-text">{cat.name}</span>
                    <span className="sp-check-count">{cat.count}</span>
                  </label>
                ))}
              </div>

              <div className="sp-filter-divider" />

              <div className="sp-filter-group">
                <p className="sp-filter-label">Size</p>
                <div className="sp-sizes">
                  {SIZES.map((s) => (
                    <button key={s} className={`sp-size${selectedSizes.includes(s) ? " active" : ""}`} onClick={() => toggleSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="sp-filter-divider" />

              <div className="sp-filter-group">
                <p className="sp-filter-label">Style</p>
                <div className="sp-tags">
                  {STYLES.map((s) => (
                    <button key={s} className={`sp-tag${selectedStyles.includes(s) ? " active" : ""}`} onClick={() => toggleStyle(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="sp-filter-divider" />

              <div className="sp-filter-group">
                <p className="sp-filter-label">Price Range</p>
                <div className="sp-price-inputs">
                  <input type="number" className="sp-price-input" placeholder="0" defaultValue="0" />
                  <span className="sp-price-sep">-</span>
                  <input type="number" className="sp-price-input" placeholder="2000000" defaultValue="2000000" />
                </div>
              </div>
            </div>
          </aside>

          <main className="sp-main">
            <section className="sp-foryou">
              <div className="sp-foryou-head">
                <div>
                  <h2 className="sp-section-title">For You</h2>
                  <p className="sp-foryou-sub">
                    {dataLoading ? "Loading marketplace inventory..." : "Personalised picks based on your style"}
                  </p>
                  {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
                </div>
                <span className="sp-count-badge">{filtered.length} items</span>
              </div>

              <div className="sp-product-list">
                {filtered.length === 0 && !dataLoading ? (
                  <div className="admin-empty">
                    <span className="material-symbols-outlined admin-empty-icon">inventory_2</span>
                    <h3>Chưa có sản phẩm</h3>
                    <p>Sản phẩm từ backend sẽ xuất hiện tại đây.</p>
                  </div>
                ) : filtered.map((p) => {
                  const badge = BADGE_CONFIG[p.badge];
                  return (
                    <article key={p.apiId ?? String(p.id)} className="sp-card">
                      <div className="sp-card-img-wrap">
                        <Link href={`/products/${p.apiId}`} className="sp-card-image-link" aria-label={`Xem ${p.name}`}>
                          {p.img ? (
                            <Image src={p.img} alt={p.name} fill style={{ objectFit: "cover" }} sizes="180px" />
                          ) : (
                            <div className="admin-image-placeholder">
                              <span className="material-symbols-outlined">image_not_supported</span>
                              <span>Không có ảnh</span>
                            </div>
                          )}
                        </Link>
                        <button
                          className={`sp-wish${p.wishlist ? " on" : ""}`}
                          onClick={() => toggleWishlist(p.id)}
                          aria-label="Wishlist"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: p.wishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <div className={`sp-badge ${badge.cls}`}>
                          <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                          {badge.text}
                        </div>
                      </div>

                      <div className="sp-card-body">
                        <div className="sp-card-shop">
                          <span className="sp-shop-avatar">{p.shop[0]}</span>
                          <span className="sp-shop-name">{p.shop}</span>
                        </div>
                        <h3 className="sp-card-title">
                          <Link href={`/products/${p.apiId}`}>{p.name}</Link>
                        </h3>
                        <p className="sp-card-meta">{p.meta}</p>

                        <div className="sp-card-price-row">
                          <span className="sp-price">{p.priceLabel}</span>
                          {p.badge === "auction" && <span className="sp-bids">Current bid · 3 bids</span>}
                        </div>

                        <div className="sp-card-footer">
                          <div className={`sp-card-detail${p.badge === "auction" ? " urgent" : ""}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{p.detailIcon}</span>
                            {p.detail}
                          </div>
                          <Link href={`/products/${p.apiId}`} className={`sp-cta${p.badge === "auction" ? " auction" : p.badge === "upcoming" ? " upcoming" : p.badge === "sold" ? " disabled" : ""}`}>
                            {p.cta}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </main>

          <aside className="sp-right">
            <div className="sp-rep">
              <div className="sp-rep-head">
                <span className="material-symbols-outlined sp-rep-icon" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                <div>
                  <p className="sp-rep-title">Your Reputation</p>
                  <p className="sp-rep-sub">Buyer Score</p>
                </div>
              </div>
              <div className="sp-rep-score-row">
                <span className="sp-rep-num">{buyerScore}</span>
                <span className="sp-rep-chip">{buyerScore >= 50 ? "Eligible" : "Starter"}</span>
              </div>
              <div className="sp-rep-track"><div className="sp-rep-fill" style={{ width: `${Math.min(Math.max(buyerScore, 0), 100)}%` }} /></div>
              <div className="sp-rep-tiers"><span>Starter</span><span>Trusted</span><span>Elite</span></div>
              <p className="sp-rep-desc">Participate in high-tier auctions and hold up to 3 items concurrently.</p>
            </div>
          </aside>
        </div>

        <footer className="sp-footer">
          <p className="sp-footer-copy">© 2024 REWORE. Curated Secondhand Fashion.</p>
          <div className="sp-footer-links">
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Sustainability Report</a>
            <a href="#">Press</a>
          </div>
        </footer>
      </div>
      )}
    </>
  );
}

