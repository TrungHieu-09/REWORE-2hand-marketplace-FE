"use client";

const WISHLIST_ITEMS = [
  {
    id: "wl1",
    name: "Linen Oversized Blazer",
    era: "90s",
    price: "₫ 420,000",
    tag: "Vintage",
    tagColor: "#3f4b25",
    tagBg: "#dae9b5",
    img: "/product1.png",
    saved: "142 saved",
  },
  {
    id: "wl2",
    name: "Structured Leather Satchel",
    era: "80s",
    price: "₫ 680,000",
    tag: "Rare Find",
    tagColor: "#7b3a10",
    tagBg: "#feeadc",
    img: "/product2.png",
    saved: "89 saved",
  },
  {
    id: "wl3",
    name: "Floral Midi Skirt",
    era: "70s",
    price: "₫ 295,000",
    tag: "On Auction",
    tagColor: "#fff",
    tagBg: "#b65a3c",
    img: "/product3.png",
    saved: "214 saved",
  },
];

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
              { icon: "notifications_active", text: "Price drop & restock alerts" },
              { icon: "gavel",               text: "Track live auction items" },
              { icon: "share",               text: "Share your wishlist with friends" },
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

        {/* ── Right mock cards ── */}
        <div className="wishlist-intro-cards">
          {WISHLIST_ITEMS.map((item, i) => (
            <div
              key={item.id}
              className="wishlist-preview-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Image */}
              <div className="wishlist-preview-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="wishlist-preview-img"
                />
                <span
                  className="wishlist-preview-era"
                >
                  {item.era}
                </span>
                <span
                  className="material-symbols-outlined wishlist-preview-heart"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
              {/* Info */}
              <div className="wishlist-preview-body">
                <div className="wishlist-preview-top">
                  <span
                    className="wishlist-preview-tag"
                    style={{ color: item.tagColor, background: item.tagBg }}
                  >
                    {item.tag}
                  </span>
                  <span className="wishlist-preview-saved">
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                      group
                    </span>
                    {item.saved}
                  </span>
                </div>
                <p className="wishlist-preview-name">{item.name}</p>
                <p className="wishlist-preview-price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
