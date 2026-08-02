"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Countdown Timer Hook ─── */
function useCountdown(initialMs: number) {
  const [ms, setMs] = useState(initialMs);
  useEffect(() => {
    const id = setInterval(() => setMs((prev) => Math.max(0, prev - 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Scroll Animate Hook ─── */
function useScrollAnimate() {
  useEffect(() => {
    const els = document.querySelectorAll(".animate-in");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [...(entry.target.parentElement?.children ?? [])];
            const idx = siblings.indexOf(entry.target as Element);
            (entry.target as HTMLElement).style.transitionDelay = `${idx * 80}ms`;
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

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
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
      >
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
  const handleQuickView = () => {
    setQuickLabel("Opening…");
    setTimeout(() => setQuickLabel("Quick View"), 1500);
  };
  return (
    <article className="product-card animate-in" id={id}>
      <div className="product-img-wrap">
        <Image src={src} alt={alt} fill className="product-img" style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 25vw" />
        <div className="product-overlay">
          <button className="btn-quick-view" id={`quick-${id}`} onClick={handleQuickView}>
            {quickLabel}
          </button>
        </div>
        <div className="product-badge-era">{era}</div>
        {hot && <span className="product-badge-hot">🔥 Hot</span>}
        <WishlistBtn id={`wish-${id}`} />
      </div>
      <div className="product-info">
        <div className="product-tags">
          {tags.map((t) => (
            <span key={t.label} className={`tag ${t.cls}`}>{t.label}</span>
          ))}
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
        <div className="auction-live-badge">
          <span className="live-dot" />
          LIVE
        </div>
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
          <span id="timer-display">{timer}</span> remaining
        </div>
        <div className="product-footer">
          <div>
            <span style={{ fontSize: 11, color: "#88726c", fontFamily: "var(--font-manrope)" }}>Current bid</span>
            <br />
            <span className="product-price">₫ {bid.toLocaleString("vi-VN")}</span>
          </div>
          <button
            className="btn-bid"
            id="bid-btn"
            onClick={handleBid}
            style={label !== "Place Bid" ? { background: "#556138" } : undefined}
          >
            {label}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <div className="nav-inner">
        <a href="#hero" className="brand">REWORE</a>
        <div className="nav-links">
          <a href="#how-it-works">Shop</a>
          <a href="#how-it-works" className="active">How it Works</a>
          <a href="#drops">Auctions</a>
          <a href="#trust">Trust Score</a>
        </div>
        <div className="nav-actions">
          <a href="#" className="btn-ghost">Log in</a>
          <a href="#" className="btn-primary" id="nav-signup">Sign up</a>
        </div>
        <button
          className="mobile-menu-toggle"
          id="mobile-toggle"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`} id="mobile-menu">
        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>Shop</a>
        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it Works</a>
        <a href="#drops" onClick={() => setMobileOpen(false)}>Auctions</a>
        <a href="#trust" onClick={() => setMobileOpen(false)}>Trust Score</a>
        <hr />
        <a href="#">Log in</a>
        <a href="#" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }}>Sign up</a>
      </div>
    </nav>
  );
}

/* ─── Scroll To Top ─── */
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      className={`scroll-top${visible ? " visible" : ""}`}
      id="scroll-top-btn"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span className="material-symbols-outlined">keyboard_arrow_up</span>
    </button>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  useScrollAnimate();

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>eco</span>
            Sustainable Fashion
          </div>
          <h1 className="hero-title">
            Give clothes<br />
            <em>a second story.</em>
          </h1>
          <p className="hero-subtitle">
            Discover curated one-of-one vintage pieces and trade with confidence in our trust-based community.
          </p>
          <div className="hero-actions">
            <a href="#drops" className="btn-cta" id="hero-explore-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
              Explore Drops
            </a>
            <a href="#how-it-works" className="btn-outline" id="hero-works-btn">
              How REWORE Works
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">12K+</span>
              <span className="stat-label">Vintage Pieces</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">8.4K</span>
              <span className="stat-label">Happy Traders</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">98%</span>
              <span className="stat-label">Trust Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-img-wrap">
            <Image
              src="/hero.png"
              alt="Editorial vintage fashion scene — clothing rack by a sunlit window"
              fill
              className="hero-img"
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="hero-tag">
              <span className="tag-label">NEW DROP</span>
              <span className="tag-title">Summer Curations</span>
              <span className="tag-items">24 items · Just listed</span>
            </div>
            <div className="hero-badge-floating">
              <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1", color: "#974226" }}>verified</span>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#231a11", display: "block" }}>Trust Verified</span>
                <span style={{ fontSize: 11, color: "#55433d" }}>All sellers authenticated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[
            "Sustainable Fashion", "Curated Vintage Drops", "Trust Score Verified",
            "Live Auctions", "Circular Commerce", "One-of-One Pieces", "Conscious Wardrobing",
            "Sustainable Fashion", "Curated Vintage Drops", "Trust Score Verified",
            "Live Auctions", "Circular Commerce", "One-of-One Pieces", "Conscious Wardrobing",
          ].map((item, i) => (
            <span key={i}>✦ {item}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">The Process</p>
            <h2 className="section-title">The Circular Journey</h2>
            <p className="section-sub">Three simple steps to finding your next treasured garment.</p>
          </div>
          <div className="steps-grid">
            {[
              { id: "step-discover", num: "01", icon: "search", title: "Discover", desc: "Explore curated drops and live auctions of unique vintage finds. Filter by era, brand, or condition.", link: "#drops", linkText: "Browse drops" },
              { id: "step-secure", num: "02", icon: "lock", title: "Secure", desc: "Hold or bid on items using our integrated reservation system with buyer protection guarantee.", link: "#trust", linkText: "Learn more" },
              { id: "step-trade", num: "03", icon: "handshake", title: "Trade", desc: "Transact safely with Trust Score verified members. Rate your experience and build your reputation.", link: "#trust", linkText: "See Trust Score" },
            ].map((step) => (
              <div className="step-card animate-in" id={step.id} key={step.id}>
                <div className="step-icon-wrap">
                  <span className="material-symbols-outlined step-icon">{step.icon}</span>
                </div>
                <div className="step-number">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                <a href={step.link} className="step-link">
                  {step.linkText}{" "}
                  <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle" }}>arrow_forward</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DROPS */}
      <section className="section section-alt" id="drops">
        <div className="container">
          <div className="section-header-row">
            <div>
              <p className="section-eyebrow">Latest Drops</p>
              <h2 className="section-title" style={{ textAlign: "left", marginBottom: 0 }}>Featured Pieces</h2>
            </div>
            <a href="#" className="btn-outline-sm">
              View all drops{" "}
              <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle" }}>arrow_forward</span>
            </a>
          </div>

          <div className="products-grid">
            <ProductCard
              id="product-blazer"
              era="90s"
              src="/product1.png"
              alt="Vintage beige linen blazer"
              tags={[{ label: "Vintage", cls: "tag-olive" }, { label: "Designer", cls: "tag-mustard" }]}
              name="Linen Oversized Blazer"
              meta="Size M · Excellent Condition"
              price="₫ 420,000"
              original="₫ 680,000"
              rating="4.9"
            />
            <ProductCard
              id="product-bag"
              era="80s"
              hot
              src="/product2.png"
              alt="Vintage brown leather crossbody bag"
              tags={[{ label: "Rare", cls: "tag-olive" }, { label: "Leather", cls: "tag-terracotta" }]}
              name="Structured Leather Satchel"
              meta="One Size · Good Condition"
              price="₫ 680,000"
              original="₫ 1,200,000"
              rating="5.0"
            />
            <ProductCard
              id="product-skirt"
              era="70s"
              src="/product3.png"
              alt="Vintage floral midi skirt"
              tags={[{ label: "Vintage", cls: "tag-olive" }, { label: "Boho", cls: "tag-mustard" }]}
              name="Floral Midi Skirt"
              meta="Size S · Like New"
              price="₫ 295,000"
              original="₫ 450,000"
              rating="4.8"
            />
            <AuctionCard />
          </div>
        </div>
      </section>

      {/* TRUST SCORE */}
      <section className="section trust-section" id="trust">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-content">
              <p className="section-eyebrow">Community First</p>
              <h2 className="section-title" style={{ textAlign: "left" }}>Trade with Total Confidence</h2>
              <p className="trust-desc">
                Our Trust Score system creates a reputation economy where every transaction strengthens the community.
              </p>
              <ul className="trust-list">
                {[
                  { icon: "shield_person", title: "Identity Verified", desc: "All members go through our ID + social verification process before listing." },
                  { icon: "rate_review", title: "Mutual Reviews", desc: "Both buyers and sellers rate each transaction, building transparent profiles." },
                  { icon: "policy", title: "Buyer Protection", desc: "Your payment is held in escrow until you confirm the item arrived as described." },
                ].map((item) => (
                  <li className="trust-item" key={item.title}>
                    <div className="trust-item-icon">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-cta" id="trust-cta-btn" style={{ display: "inline-flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified_user</span>
                Get Trust Verified
              </a>
            </div>

            <div className="trust-visual">
              <div className="trust-card-demo animate-in">
                <div className="trust-profile">
                  <div className="trust-avatar">MH</div>
                  <div>
                    <p className="trust-name">Minh Hương</p>
                    <p className="trust-since">Member since 2023</p>
                  </div>
                  <div className="trust-badge-verified">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <div className="trust-score-display">
                  <div className="trust-score-ring">
                    <svg viewBox="0 0 80 80" className="score-svg">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#f2dfd1" strokeWidth="8" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#974226" strokeWidth="8"
                        strokeDasharray="196" strokeDashoffset="20" strokeLinecap="round"
                        transform="rotate(-90 40 40)" />
                    </svg>
                    <span className="score-num">4.9</span>
                  </div>
                  <div className="trust-score-info">
                    <p className="score-label">Trust Score</p>
                    <div className="score-stars">★★★★★</div>
                    <p className="score-trades">47 trades completed</p>
                  </div>
                </div>
                <div className="trust-metrics">
                  {[
                    { val: "100%", lbl: "Response rate" },
                    { val: "24h", lbl: "Avg. ship time" },
                    { val: "0", lbl: "Disputes" },
                  ].map((m) => (
                    <div className="metric" key={m.lbl}>
                      <span className="metric-val">{m.val}</span>
                      <span className="metric-lbl">{m.lbl}</span>
                    </div>
                  ))}
                </div>
                <div className="trust-reviews-preview">
                  <p className="review-text">&ldquo;Absolutely love the blazer! Exactly as described, packed beautifully. Will buy again!&rdquo;</p>
                  <p className="review-author">— Lan Anh T.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Community Voices</p>
            <h2 className="section-title">What Our Traders Say</h2>
          </div>
          <div className="testimonials-grid">
            {[
              {
                id: "t1", featured: false,
                text: "Found a 90s Levi's trucker jacket in perfect condition. The seller was transparent, shipping was fast. REWORE actually makes thrifting feel luxurious.",
                avatarBg: "#feeadc", avatarColor: "#974226", initials: "NT",
                name: "Ngọc Trâm", meta: "Buyer · Ho Chi Minh City",
              },
              {
                id: "t2", featured: true,
                text: "As a seller, the Trust Score gave my listings instant credibility. I sold 12 items in my first month. The escrow system made me feel completely safe.",
                avatarBg: "#dae9b5", avatarColor: "#3f4b25", initials: "PL",
                name: "Phương Linh", meta: "Seller · Hanoi · ★ Top Seller",
              },
              {
                id: "t3", featured: false,
                text: "The live auction feature is addictive! Snagged a vintage signed brooch for half the market price. The community here genuinely knows fashion.",
                avatarBg: "#f2dfd1", avatarColor: "#55433d", initials: "MK",
                name: "Minh Khoa", meta: "Buyer · Da Nang",
              },
            ].map((t) => (
              <div key={t.id} id={t.id} className={`testimonial-card animate-in${t.featured ? " featured-testimonial" : ""}`}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.avatarBg, color: t.avatarColor }}>{t.initials}</div>
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-meta">{t.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-content">
              <h2 className="cta-title">Ready to give your wardrobe a second story?</h2>
              <p className="cta-sub">Join 8,400+ conscious fashion lovers trading verified vintage pieces every day.</p>
              <div className="cta-actions">
                <a href="#" className="btn-cta-light" id="cta-start-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>storefront</span>
                  Start Selling Today
                </a>
                <a href="#drops" className="btn-outline-light" id="cta-browse-btn">Browse Drops</a>
              </div>
            </div>
            <div className="cta-decoration" aria-hidden="true">
              <div className="cta-circle c1" />
              <div className="cta-circle c2" />
              <div className="cta-circle c3" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#hero" className="brand">REWORE</a>
              <p className="footer-tagline">Curating Conscious Fashion.<br />One piece at a time.</p>
              <div className="footer-socials">
                {[
                  { id: "social-instagram", label: "Instagram", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                  { id: "social-tiktok", label: "TikTok", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.03-.07z"/></svg> },
                  { id: "social-facebook", label: "Facebook", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                ].map((s) => (
                  <a key={s.id} href="#" className="social-link" id={s.id} aria-label={s.label}>{s.svg}</a>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Marketplace</h4>
              {["Browse Drops", "Live Auctions", "New Arrivals", "Sell an Item"].map((l) => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              {["About Us", "Trust Score", "Sustainability Report", "Press Kit"].map((l) => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Support</h4>
              {["Help Center", "Contact", "Privacy Policy", "Terms of Service"].map((l) => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 REWORE. All rights reserved. Curating Conscious Fashion.</p>
            <p>Made with <span style={{ color: "#974226" }}>♥</span> for sustainable fashion.</p>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      <ScrollTop />
    </>
  );
}
