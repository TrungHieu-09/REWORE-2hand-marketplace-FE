export default function TrustScore() {
  return (
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
            <a href="/login" className="btn-cta" id="trust-cta-btn" style={{ display: "inline-flex" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified_user</span>
              Get Trust Verified
            </a>
          </div>

          <div className="trust-visual">
            <div className="trust-card-preview animate-in">
              <div className="trust-profile">
                <div className="trust-avatar">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="trust-name">Your profile</p>
                  <p className="trust-since">Synced from your account activity</p>
                </div>
                <div className="trust-badge-verified">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="trust-score-display">
                <div className="trust-score-ring">
                  <svg viewBox="0 0 80 80" className="score-svg">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#f2dfd1" strokeWidth="8" />
                  </svg>
                  <span className="score-num">--</span>
                </div>
                <div className="trust-score-info">
                  <p className="score-label">Trust Score</p>
                  <p className="score-trades">Available after real marketplace transactions.</p>
                </div>
              </div>
              <div className="trust-metrics">
                {[{ val: "--", lbl: "Response rate" }, { val: "--", lbl: "Avg. ship time" }, { val: "--", lbl: "Disputes" }].map((m) => (
                  <div className="metric" key={m.lbl}>
                    <span className="metric-val">{m.val}</span>
                    <span className="metric-lbl">{m.lbl}</span>
                  </div>
                ))}
              </div>
              <div className="trust-reviews-preview">
                <p className="review-text">Reviews will appear here after completed orders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
