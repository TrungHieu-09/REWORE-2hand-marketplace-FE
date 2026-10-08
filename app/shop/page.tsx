"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useHold } from "../context/HoldContext";

type Badge = "available" | "upcoming" | "auction";

interface Product {
  id: number;
  shop: string;
  name: string;
  meta: string;
  price: number;
  badge: Badge;
  badgeLabel: string;
  cta: string;
  detail: string;
  detailIcon: string;
  wishlist: boolean;
  img: string;
}

interface Story {
  id: number;
  label: string;
  sublabel: string;
  live?: boolean;
  img: string;
  avatar?: string;
  actionText?: string;
  actionHref?: string;
}

const STORIES: Story[] = [
  { id: 1, label: "Tonight's Drop", sublabel: "Exclusive", live: true,
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    actionText: "Tham gia Drop", actionHref: "/shop?filter=upcoming" },
  { id: 2, label: "Live Auctions", sublabel: "Bidding now",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    actionText: "Vào phiên Đấu giá", actionHref: "/auctions" },
  { id: 3, label: "Y2K Revival", sublabel: "Trending",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: 4, label: "Cozy Knits", sublabel: "Fall edit",
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
  { id: 5, label: "Vintage Leather", sublabel: "Rare picks",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" },
  { id: 6, label: "Archive Denim", sublabel: "90s Vault",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" },
  { id: 7, label: "Silk & Stone", sublabel: "Minimalist",
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&h=100&fit=crop" },
  { id: 8, label: "Parisian Chic", sublabel: "Staff pick",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
  { id: 9, label: "Boho Archive", sublabel: "70s Vibes",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
];

const PRESET_STORY_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=900&fit=crop",
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1, shop: "The Archive Room", name: "Wool Tweed Blazer",
    meta: "Ralph Lauren · Size M · Excellent", price: 185,
    badge: "available", badgeLabel: "AVAILABLE",
    cta: "Hold Item", detail: "Qty locked: 1", detailIcon: "lock",
    wishlist: false, img: "/shop-blazer.png",
  },
  {
    id: 2, shop: "Silk & Stone", name: "Vintage Silk Cami",
    meta: "Unbranded · Size S · Good", price: 45,
    badge: "upcoming", badgeLabel: "UPCOMING DROP",
    cta: "Notify Me", detail: "Drops in 02:45:10", detailIcon: "schedule",
    wishlist: false, img: "/shop-silk-cami.png",
  },
  {
    id: 3, shop: "Curated Objects", name: "Leather Structure Bag",
    meta: "Celine · OS · Very Good", price: 450,
    badge: "auction", badgeLabel: "IN AUCTION",
    cta: "Join Auction", detail: "14m 30s left", detailIcon: "timer",
    wishlist: true, img: "/shop-leather-bag.png",
  },
  {
    id: 4, shop: "The Archive Room", name: "Linen Trench Coat",
    meta: "Acne Studios · Size L · Excellent", price: 320,
    badge: "available", badgeLabel: "AVAILABLE",
    cta: "Hold Item", detail: "Qty locked: 2", detailIcon: "lock",
    wishlist: false, img: "/shop-trench-coat.png",
  },
  {
    id: 5, shop: "Denim Archive", name: "90s Relaxed Denim Jeans",
    meta: "Levi''s · Size 28 · Good", price: 75,
    badge: "upcoming", badgeLabel: "UPCOMING DROP",
    cta: "Notify Me", detail: "Drops in 05:12:00", detailIcon: "schedule",
    wishlist: false, img: "/shop-denim-jeans.png",
  },
  {
    id: 6, shop: "Maison Vintage", name: "Silk Slip Dress",
    meta: "Prada · Size XS · Very Good", price: 680,
    badge: "auction", badgeLabel: "IN AUCTION",
    cta: "Join Auction", detail: "2h 05m left", detailIcon: "timer",
    wishlist: true, img: "/shop-slip-dress.png",
  },
];

const CATEGORIES: { name: string; count: number; icon: string }[] = [
  { name: "Tops", count: 42, icon: "checkroom" },
  { name: "Jackets", count: 28, icon: "dry_cleaning" },
  { name: "Denim", count: 35, icon: "layers" },
  { name: "Dresses", count: 19, icon: "styler" },
  { name: "Accessories", count: 57, icon: "watch" },
];
const SIZES = ["XS", "S", "M", "L", "XL"];
const STYLES = ["Vintage", "Y2K", "Minimalist", "Streetwear"];
const CURATORS = [
  { name: "Maison Vintage", sub: "Parisian aesthetic", avatar: "M", color: "#8c5d3e" },
  { name: "Denim Archive", sub: "Rare 90s finds", avatar: "D", color: "#9a6b4c" },
  { name: "Silk & Stone", sub: "Luxe basics", avatar: "S", color: "#704832" },
];

const BADGE_CONFIG = {
  available: { icon: "check_circle", text: "AVAILABLE", cls: "badge-available" },
  upcoming:  { icon: "schedule",     text: "UPCOMING DROP", cls: "badge-upcoming" },
  auction:   { icon: "gavel",        text: "IN AUCTION", cls: "badge-auction" },
};

export default function ShopPage() {
  const router = useRouter();
  const {
    reputationScore,
    heldItems,
    holdItem,
    releaseHold,
    joinWaitlist,
    isHeldByMe,
    isHeldByOther,
    isSold,
    getRemainingSeconds,
  } = useHold();
  const [activeHoldModalProduct, setActiveHoldModalProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [checkedCats, setCheckedCats] = useState(["Tops", "Jackets"]);
  const [selectedSizes, setSelectedSizes] = useState(["S", "M"]);
  const [selectedStyles, setSelectedStyles] = useState(["Minimalist"]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | Badge>("all");
  const { user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [storiesList, setStoriesList] = useState(STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSub, setNewSub] = useState("Vừa đăng");
  const [selectedPresetImg, setSelectedPresetImg] = useState(PRESET_STORY_IMAGES[0]);
  const storiesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const formatRemaining = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = storiesRef.current;
    if (!el) return;
    checkScroll();
    const timer = setTimeout(checkScroll, 200);
    const timer2 = setTimeout(checkScroll, 600);
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [storiesList.length]);

  const scrollStories = (direction: "left" | "right") => {
    if (storiesRef.current) {
      const scrollAmount = storiesRef.current.clientWidth * 0.75 || 280;
      storiesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newStory: Story = {
      id: Date.now(),
      label: newTitle.trim(),
      sublabel: newSub.trim() || "Vừa đăng",
      live: false,
      img: selectedPresetImg,
      avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    };
    setStoriesList([newStory, ...storiesList]);
    setNewTitle("");
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    if (activeStoryIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveStoryIndex(null);
      if (e.key === "ArrowRight") {
        setActiveStoryIndex((prev) => (prev !== null && prev < storiesList.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setActiveStoryIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : storiesList.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStoryIndex, storiesList.length]);

  useEffect(() => {
    if (localStorage.getItem("rewore_authed") !== "true") {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const toggleWishlist = (id: number) =>
    setProducts((p) => p.map((x) => x.id === id ? { ...x, wishlist: !x.wishlist } : x));
  const toggleCat = (cat: string) =>
    setCheckedCats((c) => c.includes(cat) ? c.filter((x) => x !== cat) : [...c, cat]);
  const toggleSize = (s: string) =>
    setSelectedSizes((c) => c.includes(s) ? c.filter((x) => x !== s) : [...c, s]);
  const toggleStyle = (s: string) =>
    setSelectedStyles((c) => c.includes(s) ? c.filter((x) => x !== s) : [...c, s]);
  const toggleFollow = (name: string) =>
    setFollowed((f) => f.includes(name) ? f.filter((x) => x !== name) : [name, ...f]);

  const handleProductCta = (p: Product) => {
    if (p.badge === "auction") {
      router.push("/auctions/live");
      return;
    }
    if (p.badge === "upcoming") {
      alert(`Đã bật thông báo cho "${p.name}"! Bạn sẽ nhận thông báo khi drop bắt đầu.`);
      return;
    }
    if (isSold(p.id)) {
      alert(`Món đồ "${p.name}" đã được bán.`);
      return;
    }
    if (isHeldByMe(p.id)) {
      setActiveHoldModalProduct(p);
      return;
    }
    if (isHeldByOther(p.id)) {
      const wantWaitlist = confirm(
        `Món đồ "${p.name}" hiện đang có người giữ.\n\nBạn có muốn XẾP HÀNG ĐỢI (Waitlist) vị trí #1 để nhận quyền giữ nếu người kia hủy không?`
      );
      if (wantWaitlist) {
        const res = joinWaitlist(p.id, p.name, p.shop);
        alert(`Bạn đã được thêm vào hàng đợi vị trí #${res.position} thành công!`);
      }
      return;
    }

    // BƯỚC 1: BẤM NÚT GIỮ HÀNG (HOLD ITEM)
    const res = holdItem({
      id: p.id,
      name: p.name,
      shop: p.shop,
      price: p.price,
      img: p.img,
      meta: p.meta,
    });

    if (!res.success) {
      alert(res.message);
      return;
    }

    // Thành công -> mở modal hành động lựa chọn (Nhắn tin / Thanh toán / Hủy)
    setActiveHoldModalProduct(p);
  };

  const handleStoryAction = (href?: string) => {
    setActiveStoryIndex(null);
    if (!href || href === "#" || href.includes("upcoming")) {
      setActiveFilter("upcoming");
      document.querySelector(".sp-foryou")?.scrollIntoView({ behavior: "smooth" });
    } else if (href.startsWith("/")) {
      router.push(href);
    } else {
      window.location.href = href;
    }
  };

  const filtered = activeFilter === "all" ? products : products.filter(p => p.badge === activeFilter);

  return (
    <>
      <Navbar />
      {!authChecked ? (
        <div className="sp-auth-loading">
          <span className="sp-auth-spinner" />
        </div>
      ) : (
      <div className="sp-root">
        <div className="sp-wrap">

          {/* ══ Filter Sidebar ══ */}
          <aside className="sp-sidebar">
            <div className="sp-sidebar-inner">
              <div className="sp-filter-top">
                <h2 className="sp-filter-title">Filters</h2>
                <button className="sp-clear-all" onClick={() => { setCheckedCats([]); setSelectedSizes([]); setSelectedStyles([]); setActiveFilter("all"); }}>
                  Clear all
                </button>
              </div>

              {/* Quick filter tabs */}
              <div className="sp-quick-tabs">
                {(["all", "available", "upcoming", "auction"] as const).map(f => (
                  <button key={f} className={`sp-quick-tab${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>
                    {f === "all" ? "All" : f === "available" ? "Available" : f === "upcoming" ? "Upcoming" : "Auction"}
                  </button>
                ))}
              </div>

              <div className="sp-filter-divider" />

              {/* Category */}
              <div className="sp-filter-group">
                <p className="sp-filter-label">Category</p>
                {CATEGORIES.map((cat) => (
                  <label key={cat.name} className="sp-check-row" onClick={() => toggleCat(cat.name)}>
                    <span className={`sp-checkbox${checkedCats.includes(cat.name) ? " checked" : ""}`}>
                      {checkedCats.includes(cat.name) && (
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff", fontVariationSettings: "'FILL' 1" }}>check</span>
                      )}
                    </span>
                    <span className="material-symbols-outlined sp-cat-icon">{cat.icon}</span>
                    <span className="sp-check-text">{cat.name}</span>
                    <span className="sp-check-count">{cat.count}</span>
                  </label>
                ))}
              </div>

              <div className="sp-filter-divider" />

              {/* Size */}
              <div className="sp-filter-group">
                <p className="sp-filter-label">Size</p>
                <div className="sp-sizes">
                  {SIZES.map((s) => (
                    <button key={s} className={`sp-size${selectedSizes.includes(s) ? " active" : ""}`} onClick={() => toggleSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="sp-filter-divider" />

              {/* Style */}
              <div className="sp-filter-group">
                <p className="sp-filter-label">Style</p>
                <div className="sp-tags">
                  {STYLES.map((s) => (
                    <button key={s} className={`sp-tag${selectedStyles.includes(s) ? " active" : ""}`} onClick={() => toggleStyle(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="sp-filter-divider" />

              {/* Price range */}
              <div className="sp-filter-group">
                <p className="sp-filter-label">Price Range</p>
                <div className="sp-price-inputs">
                  <input type="number" className="sp-price-input" placeholder="$0" defaultValue="0" />
                  <span className="sp-price-sep">—</span>
                  <input type="number" className="sp-price-input" placeholder="$2000" defaultValue="2000" />
                </div>
              </div>
            </div>
          </aside>

          {/* ══ Main ══ */}
          <main className="sp-main">

            {/* Story Bar */}
            <section className="sp-stories-bar">
              <div className="sp-stories-wrapper">
                {/* Floating Previous Arrow */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollStories("left")}
                    className="sp-stories-nav-btn prev"
                    aria-label="Previous stories"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                )}

                <div className="sp-stories-scroll" ref={storiesRef}>
                  {/* 1. Quick Create Story Card on the far left */}
                  <div
                    className="sp-story-create-card"
                    onClick={() => setIsCreateModalOpen(true)}
                    title="Nhấp để đăng story nhanh"
                  >
                    <div className="sp-create-media">
                      <Image
                        src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop"}
                        alt="Your profile"
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="120px"
                      />
                    </div>
                    <div className="sp-create-plus-badge">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <div className="sp-create-footer">
                      <span>Đăng story</span>
                    </div>
                  </div>

                  {/* 2. Existing Stories (FB Pattern) */}
                  {storiesList.map((s, idx) => (
                    <div
                      key={s.id}
                      className="sp-story"
                      onClick={() => setActiveStoryIndex(idx)}
                      title={`Xem story: ${s.label}`}
                    >
                      <Image src={s.img} alt={s.label} fill style={{ objectFit: "cover" }} sizes="120px" />
                      <div className="sp-story-avatar">
                        <Image
                          src={(s as any).avatar || s.img}
                          alt={s.label}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="36px"
                        />
                      </div>
                      <div className="sp-story-overlay" />
                      {s.live && (
                        <div className="sp-story-live">
                          <span className="sp-live-dot" />
                          LIVE
                        </div>
                      )}
                      <div className="sp-story-bottom">
                        <span className="sp-story-name">{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Next Arrow */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollStories("right")}
                    className="sp-stories-nav-btn next"
                    aria-label="Next stories"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                )}
              </div>
            </section>

            {/* For You */}
            <section className="sp-foryou">
              <div className="sp-foryou-head">
                <div>
                  <h2 className="sp-section-title">For You</h2>
                  <p className="sp-foryou-sub">Personalised picks based on your style</p>
                </div>
                <span className="sp-count-badge">{filtered.length} items</span>
              </div>

              {/* 2-Column Vertical Card Grid */}
              <div className="sp-product-list">
                {filtered.map((p) => {
                  const badge = BADGE_CONFIG[p.badge];
                  return (
                    <article key={p.id} className="sp-card">
                      {/* Top Image (1:1 Ratio) */}
                      <div className="sp-card-img-wrap">
                        <Image
                          src={p.img}
                          alt={p.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 640px) 100vw, 360px"
                        />
                        <button
                          className={`sp-wish${p.wishlist ? " on" : ""}`}
                          onClick={() => toggleWishlist(p.id)}
                          aria-label="Wishlist"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18, fontVariationSettings: p.wishlist ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            favorite
                          </span>
                        </button>
                        {isSold(p.id) ? (
                          <div className="sp-badge" style={{ background: "#655d52", color: "#fff" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>
                              check
                            </span>
                            ĐÃ BÁN
                          </div>
                        ) : isHeldByMe(p.id) ? (
                          <div className="sp-badge animate-pulse" style={{ background: "#974226", color: "#fff" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>
                              lock
                            </span>
                            ĐÃ GIỮ ({formatRemaining(getRemainingSeconds(p.id))})
                          </div>
                        ) : isHeldByOther(p.id) ? (
                          <div className="sp-badge" style={{ background: "#b65a3c", color: "#fff" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>
                              lock_clock
                            </span>
                            CÓ NGƯỜI ĐANG GIỮ
                          </div>
                        ) : (
                          <div className={`sp-badge ${badge.cls}`}>
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}
                            >
                              {badge.icon}
                            </span>
                            {badge.text}
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="sp-card-body">
                        <div className="sp-card-shop">
                          <span className="sp-shop-avatar">{p.shop[0]}</span>
                          <span className="sp-shop-name">{p.shop}</span>
                        </div>
                        <h3 className="sp-card-title">{p.name}</h3>
                        <p className="sp-card-meta">{p.meta}</p>

                        <div className="sp-card-price-row">
                          <span className="sp-price">${p.price.toLocaleString()}</span>
                          {p.badge === "auction" && <span className="sp-bids">Current bid · 3 bids</span>}
                        </div>

                        <div className="sp-card-footer">
                          <div className={`sp-card-detail${p.badge === "auction" || isHeldByMe(p.id) ? " urgent" : ""}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                              {isHeldByMe(p.id) ? "timer" : isHeldByOther(p.id) ? "group" : p.detailIcon}
                            </span>
                            <span>
                              {isSold(p.id)
                                ? "Đã giao dịch"
                                : isHeldByMe(p.id)
                                ? `⏳ ${formatRemaining(getRemainingSeconds(p.id))} còn lại`
                                : isHeldByOther(p.id)
                                ? "Đang có người giữ"
                                : p.detail}
                            </span>
                          </div>
                          <button
                            onClick={() => handleProductCta(p)}
                            disabled={isSold(p.id)}
                            className={`sp-cta${p.badge === "auction" ? " auction" : p.badge === "upcoming" ? " upcoming" : ""}`}
                            style={
                              isHeldByMe(p.id)
                                ? { background: "#974226", color: "#ffffff", fontWeight: 700 }
                                : isHeldByOther(p.id)
                                ? { background: "#ede1d2", color: "#4d463b", border: "1px solid #dbc1b9" }
                                : isSold(p.id)
                                ? { background: "#d0c5b7", color: "#655d52", cursor: "not-allowed" }
                                : {}
                            }
                          >
                            {isSold(p.id)
                              ? "Đã bán"
                              : isHeldByMe(p.id)
                              ? `Đã giữ · ${formatRemaining(getRemainingSeconds(p.id))}`
                              : isHeldByOther(p.id)
                              ? "Xếp hàng đợi"
                              : p.cta}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </main>

          {/* ══ Right Panel (Standalone Widget Cards) ══ */}
          <aside className="sp-right">

            {/* Widget 1: Reputation */}
            <div className="sp-widget-card sp-rep">
              <div className="sp-rep-head">
                <span className="material-symbols-outlined sp-rep-icon" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                <div>
                  <p className="sp-rep-title">Your Reputation</p>
                  <p className="sp-rep-sub">Buyer Score</p>
                </div>
              </div>
              <div className="sp-rep-score-row">
                <span className="sp-rep-num">{reputationScore}</span>
                <span className="sp-rep-chip" style={reputationScore < 70 ? { background: "#ffdad6", color: "#ba1a1a" } : {}}>
                  {reputationScore >= 70 ? "Eligible" : "Restricted"}
                </span>
              </div>
              <div className="sp-rep-track">
                <div
                  className="sp-rep-fill"
                  style={{
                    width: `${Math.min(100, reputationScore)}%`,
                    background: reputationScore < 70 ? "#ba1a1a" : undefined,
                  }}
                />
              </div>
              <div className="sp-rep-tiers">
                <span>Starter (0-69)</span><span>Trusted (70-89)</span><span>Elite (90+)</span>
              </div>
              <p className="sp-rep-desc">
                {reputationScore >= 70
                  ? "Participate in high-tier auctions and hold up to 3 items concurrently."
                  : "Điểm uy tín dưới 70: Bạn tạm thời bị khóa tính năng giữ hàng và đấu giá."}
              </p>
            </div>

            {/* Widget 2: Curators */}
            <div className="sp-widget-card sp-curators">
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

            {/* Widget 3: Drop countdown */}
            <div className="sp-widget-card sp-countdown-card">
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
              <button
                className="sp-remind-btn"
                onClick={() => alert("Đã đặt nhắc nhở cho Archive Drop #42 lúc 20:00 tối nay!")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>notifications</span>
                Remind me
              </button>
            </div>

          </aside>
        </div>

        {/* Footer */}
        <footer className="sp-footer">
          <p className="sp-footer-copy">© 2024 REWORE. Curated Secondhand Fashion.</p>
          <div className="sp-footer-links">
            <a href="/#how-it-works">About</a>
            <a href="/shop">Curations</a>
            <a href="/login">Privacy Policy</a>
            <a href="/#how-it-works">Sustainability</a>
            <a href="/auctions">Auctions</a>
          </div>
        </footer>
      </div>
      )}

      {/* ── Interactive Story Viewer Modal ── */}
      {activeStoryIndex !== null && storiesList[activeStoryIndex] && (
        <div className="sp-modal-backdrop" onClick={() => setActiveStoryIndex(null)}>
          <div className="sp-story-viewer" onClick={(e) => e.stopPropagation()}>
            {/* Progress Bar Segments */}
            <div className="sp-viewer-progress-bar">
              {storiesList.map((_, i) => (
                <div key={i} className="sp-viewer-progress-segment">
                  <div
                    className="sp-viewer-progress-fill"
                    style={{
                      width: i < activeStoryIndex ? "100%" : i === activeStoryIndex ? "100%" : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="sp-viewer-header">
              <div className="sp-viewer-author">
                <div className="sp-viewer-avatar">
                  <Image
                    src={storiesList[activeStoryIndex].img}
                    alt={storiesList[activeStoryIndex].label}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p className="sp-viewer-title">{storiesList[activeStoryIndex].label}</p>
                  <p className="sp-viewer-sub">{storiesList[activeStoryIndex].sublabel}</p>
                </div>
              </div>
              <button
                className="sp-viewer-close-btn"
                onClick={() => setActiveStoryIndex(null)}
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Previous Button */}
            <button
              className="sp-viewer-nav-btn prev"
              onClick={() => setActiveStoryIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : storiesList.length - 1))}
              aria-label="Story trước"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Story Media */}
            <div className="sp-viewer-media">
              <Image
                src={storiesList[activeStoryIndex].img}
                alt={storiesList[activeStoryIndex].label}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              
              {/* Action Link / CTA */}
              {storiesList[activeStoryIndex].actionText && (
                <div className="sp-viewer-action-container">
                  <button
                    type="button"
                    onClick={() => handleStoryAction(storiesList[activeStoryIndex].actionHref)}
                    className="sp-viewer-link-btn"
                  >
                    {storiesList[activeStoryIndex].actionText}
                    <span className="material-symbols-outlined">open_in_new</span>
                  </button>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              className="sp-viewer-nav-btn next"
              onClick={() => setActiveStoryIndex((prev) => (prev !== null && prev < storiesList.length - 1 ? prev + 1 : 0))}
              aria-label="Story tiếp theo"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Story Footer */}
            <div className="sp-viewer-footer">
              <input
                type="text"
                className="sp-viewer-input"
                placeholder="Trả lời..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                    alert("Đã gửi phản hồi tin nhắn thành công!");
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                type="button"
                className="sp-viewer-action-btn"
                aria-label="Thích"
                onClick={() => alert("Đã thích story!")}
              >
                <span className="material-symbols-outlined">favorite</span>
              </button>
              <button
                type="button"
                className="sp-viewer-action-btn"
                aria-label="Chia sẻ"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  alert("Đã sao chép liên kết story!");
                }}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Create Story Modal ── */}
      {isCreateModalOpen && (
        <div className="sp-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="sp-create-story-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-create-modal-header">
              <h3 className="sp-create-modal-title">Đăng story nhanh</h3>
              <button
                className="sp-viewer-close-btn"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined" style={{ color: "#231a11" }}>close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStory} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="sp-create-form-group">
                <label className="sp-create-form-label">Tiêu đề Story</label>
                <input
                  type="text"
                  className="sp-create-form-input"
                  placeholder="Ví dụ: Drop đồ vintage tối nay..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="sp-create-form-group">
                <label className="sp-create-form-label">Thẻ / Nhãn phụ</label>
                <input
                  type="text"
                  className="sp-create-form-input"
                  placeholder="Ví dụ: Exclusive, Trending..."
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                />
              </div>

              <div className="sp-create-form-group">
                <label className="sp-create-form-label">Chọn ảnh Story mẫu hoặc dán link ảnh</label>
                <div className="sp-create-img-presets">
                  {PRESET_STORY_IMAGES.map((imgUrl, i) => (
                    <div
                      key={i}
                      className={`sp-create-img-thumb${selectedPresetImg === imgUrl ? " selected" : ""}`}
                      onClick={() => setSelectedPresetImg(imgUrl)}
                    >
                      <Image src={imgUrl} alt={`Preset ${i}`} fill style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
                <input
                  type="url"
                  className="sp-create-form-input"
                  placeholder="Hoặc dán URL ảnh khác..."
                  value={selectedPresetImg}
                  onChange={(e) => setSelectedPresetImg(e.target.value)}
                  style={{ marginTop: 6 }}
                />
              </div>

              <button type="submit" className="sp-create-submit-btn">
                <span className="material-symbols-outlined">send</span>
                Đăng Story ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── HOLD ACTION MODAL (BƯỚC 3: LỰA CHỌN A HOẶC B) ── */}
      {activeHoldModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#dbc1b9] animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#dbc1b9]/40 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#974226]">lock_clock</span>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#231a11]">
                  Món Đồ Đang Được Giữ
                </h3>
              </div>
              <button
                onClick={() => setActiveHoldModalProduct(null)}
                className="text-[#88726c] hover:text-[#231a11]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Product summary */}
            <div className="flex gap-4 p-3 bg-[#fdfbf9] rounded-2xl border border-[#dbc1b9]/40 mb-4">
              <div className="w-16 h-20 relative rounded-xl overflow-hidden flex-shrink-0 border border-[#dbc1b9]/50">
                <Image
                  src={activeHoldModalProduct.img}
                  alt={activeHoldModalProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#974226] uppercase">
                  Shop: {activeHoldModalProduct.shop}
                </span>
                <h4 className="text-sm font-bold text-[#231a11] truncate mt-0.5">
                  {activeHoldModalProduct.name}
                </h4>
                <p className="text-xs text-[#88726c]">{activeHoldModalProduct.meta}</p>
                <p className="text-sm font-extrabold text-[#974226] mt-1">
                  ${activeHoldModalProduct.price}
                </p>
              </div>
            </div>

            {/* Countdown notice */}
            <div className="p-3 bg-[#fff1e8] rounded-xl border border-[#ffb59e] mb-5 flex items-center justify-between text-xs">
              <span className="text-[#7b2e14] font-semibold">Thời gian giữ độc quyền còn:</span>
              <span className="font-extrabold text-[#ba1a1a] bg-white px-2 py-0.5 rounded border border-[#ffdad6]">
                ⏳ {formatRemaining(getRemainingSeconds(activeHoldModalProduct.id))}
              </span>
            </div>

            {/* Action Buttons: LỰA CHỌN A & LỰA CHỌN B */}
            <div className="space-y-2.5">
              {/* Lựa chọn A: Nhắn tin cho shop */}
              <button
                onClick={() => {
                  const shopName = activeHoldModalProduct.shop;
                  const pId = activeHoldModalProduct.id;
                  setActiveHoldModalProduct(null);
                  router.push(`/messages?shop=${encodeURIComponent(shopName)}&productId=${pId}`);
                }}
                className="w-full py-3 px-4 bg-[#655d52] hover:bg-[#231a11] text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                LỰA CHỌN A: Nhắn tin cho shop (Tiếp tục giao dịch)
              </button>

              {/* Chốt đơn & Thanh toán ngay */}
              <button
                onClick={() => {
                  const pId = activeHoldModalProduct.id;
                  setActiveHoldModalProduct(null);
                  router.push(`/checkout?productId=${pId}`);
                }}
                className="w-full py-3 px-4 bg-[#974226] hover:bg-[#b65a3c] text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                Tiến hành chốt đơn & Thanh toán
              </button>

              {/* Lựa chọn B: Hủy giữ */}
              <button
                onClick={() => {
                  const res = releaseHold(activeHoldModalProduct.id);
                  setActiveHoldModalProduct(null);
                  alert(res.message);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#ffdad6]/40 text-[#ba1a1a] border border-[#ffdad6] rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">cancel</span>
                LỰA CHỌN B: Hủy giữ (Không bị trừ điểm uy tín)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
