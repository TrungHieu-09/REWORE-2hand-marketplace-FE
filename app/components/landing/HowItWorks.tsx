export default function HowItWorks() {
  const steps = [
    { id: "step-discover", num: "01", icon: "search", title: "Discover", desc: "Explore curated drops and live auctions of unique vintage finds. Filter by era, brand, or condition.", link: "#drops", linkText: "Browse drops" },
    { id: "step-secure", num: "02", icon: "lock", title: "Secure", desc: "Hold or bid on items using our integrated reservation system with buyer protection guarantee.", link: "#trust", linkText: "Learn more" },
    { id: "step-trade", num: "03", icon: "handshake", title: "Trade", desc: "Transact safely with Trust Score verified members. Rate your experience and build your reputation.", link: "#trust", linkText: "See Trust Score" },
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">The Process</p>
          <h2 className="section-title">The Circular Journey</h2>
          <p className="section-sub">Three simple steps to finding your next treasured garment.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
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
  );
}
