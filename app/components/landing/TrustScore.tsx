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
                {[{ val: "100%", lbl: "Response rate" }, { val: "24h", lbl: "Avg. ship time" }, { val: "0", lbl: "Disputes" }].map((m) => (
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
  );
}
