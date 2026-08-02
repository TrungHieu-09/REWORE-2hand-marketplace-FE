"use client";

import Image from "next/image";

export default function Hero() {
  return (
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
            alt="Editorial vintage fashion scene"
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
  );
}
