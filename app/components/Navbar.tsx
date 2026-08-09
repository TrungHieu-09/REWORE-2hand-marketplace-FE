"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSeller } from "../context/SellerContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { sellerState } = useSeller();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "Sell" nav link destination
  const sellHref = sellerState.isSeller ? "/seller/dashboard" : "/profile/become-seller";

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <div className="nav-inner">
        <a href="/" className="brand">REWORE</a>

        <div className="nav-links">
          {/* Always visible */}
          <a href="/#how-it-works">How it Works</a>
          <a href={isLoggedIn ? "/shop" : "/#drops"}>Shop</a>
          <a href={isLoggedIn ? "/auctions" : "/#trust"}>Auctions</a>
          <a href={isLoggedIn ? "/wishlist" : "/#wishlist-intro"}>Wishlist</a>

          {/* Sell — only for logged-in users */}
          {isLoggedIn && (
            <a
              href={sellHref}
              className={`font-semibold transition-colors ${
                sellerState.isSeller
                  ? "text-[#556138] hover:text-[#6d7a4f]"
                  : "text-[#974226] hover:text-[#b65a3c]"
              }`}
              style={{ borderBottom: sellerState.isSeller ? "2px solid #6d7a4f" : "2px solid #974226", paddingBottom: "2px" }}
            >
              {sellerState.isSeller ? "My Shop" : "Sell"}
            </a>
          )}
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            /* ── Logged-in: Profile dropdown ── */
            <div className="relative group">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#feeadc] text-[#974226] hover:bg-[#f8e5d6] transition-colors"
                title="My Account"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#f2dfd1] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a
                  href="/profile"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#231a11] font-semibold hover:bg-[#fff8f5]"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  My Profile
                </a>
                {sellerState.isSeller && (
                  <a
                    href="/seller/dashboard"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#556138] font-semibold hover:bg-[#fff8f5] border-t border-[#f2dfd1]"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    Seller Dashboard
                  </a>
                )}
                {sellerState.verificationStatus === "pending" && !sellerState.isSeller && (
                  <a
                    href="/profile/become-seller/status"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#974226] font-semibold hover:bg-[#fff8f5] border-t border-[#f2dfd1]"
                  >
                    <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                    Verification Status
                  </a>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-[#ba1a1a] font-semibold hover:bg-[#fff8f5] border-t border-[#f2dfd1]"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Log out
                </button>
              </div>
            </div>
          ) : (
            /* ── Guest: Login / Sign up ── */
            <>
              <a href="/login" className="btn-ghost">Log in</a>
              <a href="/register" className="btn-primary" id="nav-signup">Sign up</a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-toggle"
          id="mobile-toggle"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`} id="mobile-menu">
        <a href="/#how-it-works" onClick={() => setMobileOpen(false)}>How it Works</a>
        <a href={isLoggedIn ? "/shop" : "/#drops"} onClick={() => setMobileOpen(false)}>Shop</a>
        <a href={isLoggedIn ? "/auctions" : "/#trust"} onClick={() => setMobileOpen(false)}>Auctions</a>
        <a href={isLoggedIn ? "/wishlist" : "/#wishlist-intro"} onClick={() => setMobileOpen(false)}>Wishlist</a>
        {isLoggedIn && (
          <a
            href={sellHref}
            className="font-semibold text-[#974226]"
            onClick={() => setMobileOpen(false)}
          >
            {sellerState.isSeller ? "My Shop" : "Sell"}
          </a>
        )}

        {isLoggedIn ? (
          <>
            <hr />
            <a href="/profile" className="flex items-center gap-2 text-[#231a11]">
              <span className="material-symbols-outlined text-[20px]">person</span>
              My Profile
            </a>
            {sellerState.isSeller && (
              <a href="/seller/dashboard" className="flex items-center gap-2 text-[#556138]">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                Seller Dashboard
              </a>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[#ba1a1a] w-full"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Log out
            </button>
          </>
        ) : (
          <>
            <hr />
            <a href="/login">Log in</a>
            <a href="/register" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }}>Sign up</a>
          </>
        )}
      </div>
    </nav>
  );
}
