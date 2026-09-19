"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSeller } from "../context/SellerContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();
  const { sellerState } = useSeller();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const hasSellerApplication = ["pending", "rejected", "suspended"].includes(sellerState.verificationStatus);
  const sellHref = sellerState.isSeller
    ? "/seller/dashboard"
    : hasSellerApplication
    ? "/profile/become-seller/status"
    : "/profile/become-seller";
  const sellLabel = sellerState.isSeller ? "My Shop" : hasSellerApplication ? "Seller Status" : "Sell";

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <div className="nav-inner">
        <Link href={isAdmin ? "/admin" : "/"} className="brand">REWORE</Link>

        <div className="nav-links">
          {isAdmin ? (
            <Link href="/admin">Admin</Link>
          ) : (
            <>
              <Link href="/#how-it-works">How it Works</Link>
              <Link href={isLoggedIn ? "/shop" : "/#drops"}>Shop</Link>
              <Link href={isLoggedIn ? "/auctions" : "/#trust"}>Auctions</Link>
              <Link href={isLoggedIn ? "/wishlist" : "/#wishlist-intro"}>Wishlist</Link>
            </>
          )}

          {isLoggedIn && !isAdmin && (
            <Link
              href={sellHref}
              className={`font-semibold transition-colors ${
                sellerState.isSeller
                  ? "text-[#556138] hover:text-[#6d7a4f]"
                  : "text-[#974226] hover:text-[#b65a3c]"
              }`}
              style={{ borderBottom: sellerState.isSeller ? "2px solid #6d7a4f" : "2px solid #974226", paddingBottom: "2px" }}
            >
              {sellLabel}
            </Link>
          )}
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="relative group">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#feeadc] text-[#974226] hover:bg-[#f8e5d6] transition-colors"
                title="My Account"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#f2dfd1] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#974226] font-semibold hover:bg-[#fff8f5]"
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    Admin Dashboard
                  </Link>
                )}
                {!isAdmin && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#231a11] font-semibold hover:bg-[#fff8f5]"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      My Profile
                    </Link>
                    {sellerState.isSeller && (
                      <Link
                        href="/seller/dashboard"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#556138] font-semibold hover:bg-[#fff8f5] border-t border-[#f2dfd1]"
                      >
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        Seller Dashboard
                      </Link>
                    )}
                    {hasSellerApplication && !sellerState.isSeller && (
                      <Link
                        href="/profile/become-seller/status"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#974226] font-semibold hover:bg-[#fff8f5] border-t border-[#f2dfd1]"
                      >
                        <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                    Seller Status
                      </Link>
                    )}
                  </>
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
            <>
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/register" className="btn-primary" id="nav-signup">Sign up</Link>
            </>
          )}
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
        {isAdmin ? (
          <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>
        ) : (
          <>
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)}>How it Works</Link>
            <Link href={isLoggedIn ? "/shop" : "/#drops"} onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href={isLoggedIn ? "/auctions" : "/#trust"} onClick={() => setMobileOpen(false)}>Auctions</Link>
            <Link href={isLoggedIn ? "/wishlist" : "/#wishlist-intro"} onClick={() => setMobileOpen(false)}>Wishlist</Link>
          </>
        )}
        {isLoggedIn && !isAdmin && (
          <Link
            href={sellHref}
            className="font-semibold text-[#974226]"
            onClick={() => setMobileOpen(false)}
          >
            {sellLabel}
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <hr />
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 text-[#974226]" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                Admin Dashboard
              </Link>
            )}
            {!isAdmin && (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-[#231a11]" onClick={() => setMobileOpen(false)}>
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  My Profile
                </Link>
                {sellerState.isSeller && (
                  <Link href="/seller/dashboard" className="flex items-center gap-2 text-[#556138]" onClick={() => setMobileOpen(false)}>
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                    Seller Dashboard
                  </Link>
                )}
              </>
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
            <Link href="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
            <Link href="/register" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }} onClick={() => setMobileOpen(false)}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
