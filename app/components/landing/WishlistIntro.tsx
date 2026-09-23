"use client";

export default function WishlistIntro() {
  return (
    <section className="wishlist-intro-section" id="wishlist-intro">
      <div className="container wishlist-intro-inner">
        {/* ── Left copy ── */}
        <div className="wishlist-intro-copy">
          <span
            className="material-symbols-outlined wishlist-intro-icon"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <p className="section-eyebrow" style={{ textAlign: "left" }}>Your Wardrobe, Curated</p>
          <h2
            className="section-title"
            style={{ textAlign: "left", marginBottom: "20px" }}
          >
            Save the Pieces<br />You Love
          </h2>
          <p className="wishlist-intro-desc">
            Bookmark rare vintage finds, track live auction items, and get instant alerts when prices drop. Your personal wishlist keeps your dream wardrobe always within reach.
          </p>

          <ul className="wishlist-intro-perks">
            {[
              { icon: "notifications", text: "Price drop & restock alerts" },
              { icon: "balance",               text: "Track live auction items" },
              { icon: "group",               text: "Share your wishlist with friends" },
            ].map((p) => (
              <li key={p.icon} className="wishlist-intro-perk">
                <span className="material-symbols-outlined wishlist-perk-icon">
                  {p.icon}
                </span>
                {p.text}
              </li>
            ))}
          </ul>

          <a href="/login" className="btn-primary wishlist-intro-cta">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              login
            </span>
            Sign in to start saving
          </a>
        </div>

        <div className="wishlist-intro-cards">
          <div className="wishlist-preview-card">
            <div className="wishlist-preview-img-wrap">
              <div className="admin-image-placeholder h-full">
                <span className="material-symbols-outlined">favorite</span>
                <span>Wishlist trống</span>
              </div>
              <span
                className="material-symbols-outlined wishlist-preview-heart"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <div className="wishlist-preview-body">
              <p className="wishlist-preview-name">Sản phẩm đã lưu sẽ hiện ở đây</p>
              <p className="wishlist-preview-price">Đăng nhập để đồng bộ wishlist từ backend.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
