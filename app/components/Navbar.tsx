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
          <a href="/shop">Shop</a>
          <a href="/#how-it-works">How it Works</a>
          <a href="/auctions">Auctions</a>
          <a href="/wishlist">Wishlist</a>
        </div>
        <div className="nav-actions">
          <a href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#feeadc] text-[#974226] hover:bg-[#f8e5d6] transition-colors" title="My Profile">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </a>
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
        <a href="/shop" onClick={() => setMobileOpen(false)}>Shop</a>
        <a href="/#how-it-works" onClick={() => setMobileOpen(false)}>How it Works</a>
        <a href="/auctions" onClick={() => setMobileOpen(false)}>Auctions</a>
        <a href="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</a>
        <hr />
        <a href="/profile" className="flex items-center gap-2 text-[#974226]">
          <span className="material-symbols-outlined text-[20px]">person</span>
          My Profile
        </a>
      </div>
    </nav>
  );
}
