"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  ApiError,
  productsApi,
  wishlistApi,
  type Product as ApiProduct,
} from "@/app/lib/api";

type Badge = "available" | "upcoming" | "auction";

interface Product {
  id: number;
  apiId?: string;
  shop: string;
  name: string;
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
  img: string;
}

const STORIES = [
  { id: 1, label: "Tonight's Drop", sublabel: "Exclusive", live: true,
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=280&fit=crop&auto=format" },
  { id: 2, label: "Live Auctions", sublabel: "Bidding now",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=280&fit=crop&auto=format" },
  { id: 3, label: "Y2K Revival", sublabel: "Trending",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=280&fit=crop&auto=format" },
  { id: 4, label: "Cozy Knits", sublabel: "Fall edit",
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=280&fit=crop&auto=format" },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1, shop: "The Archive Room", name: "Wool Tweed Blazer",
    meta: "Ralph Lauren · Size M · Excellent", price: 185, priceLabel: "$185",
    badge: "available", badgeLabel: "AVAILABLE",
    cta: "Hold Item", detail: "Qty locked: 1", detailIcon: "lock",
    wishlist: false, img: "/shop-blazer.png",
  },
  {
    id: 2, shop: "Silk & Stone", name: "Vintage Silk Cami",
    meta: "Unbranded · Size S · Good", price: 45, priceLabel: "$45",
    badge: "upcoming", badgeLabel: "UPCOMING DROP",
    cta: "Notify Me", detail: "Drops in 02:45:10", detailIcon: "schedule",
    wishlist: false, img: "/shop-silk-cami.png",
  },
  {
    id: 3, shop: "Curated Objects", name: "Leather Structure Bag",
    meta: "Celine · OS · Very Good", price: 450, priceLabel: "$450",
    badge: "auction", badgeLabel: "IN AUCTION",
    cta: "Join Auction", detail: "14m 30s left", detailIcon: "timer",
    wishlist: true, img: "/shop-leather-bag.png",
  },
  {
    id: 4, shop: "The Archive Room", name: "Linen Trench Coat",
    meta: "Acne Studios · Size L · Excellent", price: 320, priceLabel: "$320",
    badge: "available", badgeLabel: "AVAILABLE",
    cta: "Hold Item", detail: "Qty locked: 2", detailIcon: "lock",
    wishlist: false, img: "/shop-trench-coat.png",
  },
  {
    id: 5, shop: "Denim Archive", name: "90s Relaxed Denim Jeans",
    meta: "Levi's · Size 28 · Good", price: 75, priceLabel: "$75",
    badge: "upcoming", badgeLabel: "UPCOMING DROP",
    cta: "Notify Me", detail: "Drops in 05:12:00", detailIcon: "schedule",
    wishlist: false, img: "/shop-denim-jeans.png",
  },
  {
    id: 6, shop: "Maison Vintage", name: "Silk Slip Dress",
    meta: "Prada · Size XS · Very Good", price: 680, priceLabel: "$680",
    badge: "auction", badgeLabel: "IN AUCTION",
    cta: "Join Auction", detail: "2h 05m left", detailIcon: "timer",
    wishlist: true, img: "/shop-slip-dress.png",
  },
];

const CATEGORIES: { name: string; count: number }[] = [
  { name: "Tops", count: 42 },
  { name: "Jackets", count: 28 },
  { name: "Denim", count: 35 },
  { name: "Dresses", count: 19 },
  { name: "Accessories", count: 57 },
];
const SIZES = ["XS", "S", "M", "L", "XL"];
const STYLES = ["Vintage", "Y2K", "Minimalist", "Streetwear"];
const CURATORS = [
  { name: "Maison Vintage", sub: "Parisian aesthetic", avatar: "M", color: "#c4a882" },
  { name: "Denim Archive", sub: "Rare 90s finds", avatar: "D", color: "#8db0cc" },
  { name: "Silk & Stone", sub: "Luxe basics", avatar: "S", color: "#c8b89a" },
];

const BADGE_CONFIG = {
  available: { icon: "check_circle", text: "AVAILABLE", cls: "badge-available" },
  upcoming:  { icon: "schedule",     text: "UPCOMING DROP", cls: "badge-upcoming" },
  auction:   { icon: "gavel",        text: "IN AUCTION", cls: "badge-auction" },
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
  const imageFallbacks = [
    "/shop-blazer.png",
    "/shop-silk-cami.png",
    "/shop-leather-bag.png",
    "/shop-trench-coat.png",
    "/shop-denim-jeans.png",
    "/shop-slip-dress.png",
  ];

  return {
    id: index + 1,
    apiId: product.id,
    shop: product.seller?.name ?? "REWORE Seller",
    name: product.title,
    meta: [product.brand, product.size ? `Size ${product.size}` : null, conditionLabel(product.condition)]
      .filter(Boolean)
      .join(" · "),
    price: product.price,
    priceLabel: formatVnd(product.price),
    badge: "available",
    badgeLabel: "AVAILABLE",
    cta: "Hold Item",
    detail: `${product._count?.wishlistItems ?? 0} saved · ${product.viewCount} views`,
    detailIcon: "favorite",
    wishlist: wishlistIds.has(product.id),
    wishlistCount: product._count?.wishlistItems ?? 0,
    img: product.images[0] || imageFallbacks[index % imageFallbacks.length],
  };
}

export default function ShopPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [checkedCats, setCheckedCats] = useState(["Tops", "Jackets"]);
  const [selectedSizes, setSelectedSizes] = useState(["S", "M"]);
  const [selectedStyles, setSelectedStyles] = useState(["Minimalist"]);
  const [followed, setFollowed] = useState<string[]>([]);
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
        setApiMessage(err instanceof ApiError ? err.message : "Could not load products from API. Showing demo data.");
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
  const toggleFollow = (name: string) =>
    setFollowed((f) => f.includes(name) ? f.filter((x) => x !== name) : [name, ...f]);

  const filtered = useMemo(
    () => activeFilter === "all" ? products : products.filter(p => p.badge === activeFilter),
    [activeFilter, products]
  );

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
                {(["all", "available", "upcoming", "auction"] as const).map(f => (
                  <button key={f} className={`sp-quick-tab${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>
                    {f === "all" ? "All" : f === "available" ? "Available" : f === "upcoming" ? "Upcoming" : "Auction"}
                  </button>
                ))}
              </div>

              <div className="sp-filter-divider" />

              <div className="sp-filter-group">
                <p className="sp-filter-label">Category</p>
                {CATEGORIES.map((cat) => (
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
            <section className="sp-stories">
              <div className="sp-stories-header">
                <h2 className="sp-section-title">Curated Stories</h2>
                <a href="#" className="sp-see-all">See all <span className="material-symbols-outlined" style={{fontSize:14,verticalAlign:"middle"}}>arrow_forward</span></a>
              </div>
              <div className="sp-stories-grid">
                {STORIES.map((s) => (
                  <div key={s.id} className="sp-story">
                    <Image src={s.img} alt={s.label} fill style={{ objectFit: "cover" }} sizes="200px" />
                    <div className="sp-story-overlay" />
                    {s.live && (
                      <div className="sp-story-live"><span className="sp-live-dot" />LIVE</div>
                    )}
                    <div className="sp-story-bottom">
                      <span className="sp-story-sublabel">{s.sublabel}</span>
                      <span className="sp-story-name">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

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
                {filtered.map((p) => {
                  const badge = BADGE_CONFIG[p.badge];
                  return (
                    <article key={`${p.apiId ?? "demo"}-${p.id}`} className="sp-card">
                      <div className="sp-card-img-wrap">
                        <Image src={p.img} alt={p.name} fill style={{ objectFit: "cover" }} sizes="180px" />
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
                        <h3 className="sp-card-title">{p.name}</h3>
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
                          <button className={`sp-cta${p.badge === "auction" ? " auction" : p.badge === "upcoming" ? " upcoming" : ""}`}>
                            {p.cta}
                          </button>
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
                <span className="sp-rep-num">86</span>
                <span className="sp-rep-chip">Eligible</span>
              </div>
              <div className="sp-rep-track"><div className="sp-rep-fill" style={{ width: "86%" }} /></div>
              <div className="sp-rep-tiers"><span>Starter</span><span>Trusted</span><span>Elite</span></div>
              <p className="sp-rep-desc">Participate in high-tier auctions and hold up to 3 items concurrently.</p>
            </div>

            <div className="sp-right-divider" />

            <div className="sp-curators">
              <h3 className="sp-curators-title">Curators to Follow</h3>
              <div className="sp-curator-list">
                {CURATORS.map((c) => (
                  <div key={c.name} className="sp-curator">
                    <div className="sp-curator-av" style={{ background: c.color }}>{c.avatar}</div>
                    <div className="sp-curator-info">
                      <p className="sp-curator-name">{c.name}</p>
                      <p className="sp-curator-sub">{c.sub}</p>
                    </div>
                    <button
                      className={`sp-follow${followed.includes(c.name) ? " following" : ""}`}
                      onClick={() => toggleFollow(c.name)}
                    >
                      {followed.includes(c.name) ? (
                        <><span className="material-symbols-outlined" style={{ fontSize: 13 }}>check</span>Following</>
                      ) : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="sp-countdown-card">
              <div className="sp-countdown-badge">NEXT DROP</div>
              <p className="sp-countdown-title">Archive Drop #42</p>
              <p className="sp-countdown-sub">Tonight at 20:00</p>
              <div className="sp-countdown-timer">
                <div className="sp-timer-block"><span className="sp-timer-num">04</span><span className="sp-timer-unit">HRS</span></div>
                <span className="sp-timer-colon">:</span>
                <div className="sp-timer-block"><span className="sp-timer-num">32</span><span className="sp-timer-unit">MIN</span></div>
                <span className="sp-timer-colon">:</span>
                <div className="sp-timer-block"><span className="sp-timer-num">18</span><span className="sp-timer-unit">SEC</span></div>
              </div>
              <button className="sp-remind-btn">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>notifications</span>
                Remind me
              </button>
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

