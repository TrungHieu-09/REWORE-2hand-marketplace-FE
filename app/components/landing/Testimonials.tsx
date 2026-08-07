"use client";

import "./Testimonials.css";
import { useEffect } from "react";

export default function Testimonials() {
  const reviews = [
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
  ];

  useEffect(() => {
    const cards = document.querySelectorAll(".testimonial-card");
    // Fallback: show all after 300ms in case observer doesn't fire
    const fallback = setTimeout(() => {
      cards.forEach((c) => c.classList.add("visible"));
    }, 300);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [...(entry.target.parentElement?.children ?? [])];
            const idx = siblings.indexOf(entry.target as Element);
            (entry.target as HTMLElement).style.transitionDelay = `${idx * 100}ms`;
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    cards.forEach((c) => obs.observe(c));
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Community Voices</p>
          <h2 className="section-title">What Our Traders Say</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((t) => (
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
  );
}
