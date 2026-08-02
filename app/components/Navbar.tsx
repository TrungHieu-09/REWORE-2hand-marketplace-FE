"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
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
        <a href="/" className="brand">REWORE</a>
        <div className="nav-links">
          <a href="/#how-it-works">Shop</a>
          <a href="/#how-it-works" className="active">How it Works</a>
          <a href="/#drops">Auctions</a>
          <a href="/#trust">Trust Score</a>
        </div>
        <div className="nav-actions">
          <a href="/login" className="btn-ghost">Log in</a>
          <a href="/login" className="btn-primary" id="nav-signup">Sign up</a>
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
        <a href="/#how-it-works" onClick={() => setMobileOpen(false)}>Shop</a>
        <a href="/#how-it-works" onClick={() => setMobileOpen(false)}>How it Works</a>
        <a href="/#drops" onClick={() => setMobileOpen(false)}>Auctions</a>
        <a href="/#trust" onClick={() => setMobileOpen(false)}>Trust Score</a>
        <hr />
        <a href="/login">Log in</a>
        <a href="/login" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }}>Sign up</a>
      </div>
    </nav>
  );
}
