"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useSeller } from "../context/SellerContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user, logout } = useAuth();
  const { sellerState } = useSeller();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // "Sell" nav destination
  const sellHref = sellerState.isSeller ? "/seller/dashboard" : "/profile/become-seller";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const isHomeActive = pathname === "/";
  const isShopActive = pathname === "/shop";
  const isAuctionsActive = pathname.startsWith("/auctions");
  const isWishlistActive = pathname.startsWith("/wishlist");
  const isSellActive = pathname.startsWith("/seller") || pathname.startsWith("/profile/become-seller");

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-inner">
        {/* ── Cluster 1: Left (Logo + Facebook-style Search) ── */}
        <div className="nav-left-cluster">
          <Link href="/" className="fb-brand" title="REWORE Home">
            REWORE
          </Link>

          <form onSubmit={handleSearchSubmit} className="fb-search-wrap">
            <span className="material-symbols-outlined text-[20px] text-[#786a60]">search</span>
            <input
              type="text"
              placeholder="Search REWORE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="fb-search-input"
            />
          </form>
        </div>

        {/* ── Cluster 2: Center (Large Icon Tabs + Active Blue Indicator) ── */}
        <div className="nav-center-cluster">
          {/* Home Tab */}
          <Link
            href="/"
            className={`fb-tab${isHomeActive ? " active" : ""}`}
            title="Home"
          >
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: isHomeActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              explore
            </span>
            {isHomeActive && <span className="fb-tab-indicator" />}
          </Link>

          {/* Shop Tab */}
          <Link
            href="/shop"
            className={`fb-tab${isShopActive ? " active" : ""}`}
            title="Shop & Feed"
          >
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: isShopActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              home
            </span>
            {isShopActive && <span className="fb-tab-indicator" />}
          </Link>

          {/* Auctions Tab */}
          <Link
            href="/auctions"
            className={`fb-tab${isAuctionsActive ? " active" : ""}`}
            title="Auctions"
          >
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: isAuctionsActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              gavel
            </span>
            {isAuctionsActive && <span className="fb-tab-indicator" />}
          </Link>

          {/* Wishlist Tab */}
          <Link
            href="/wishlist"
            className={`fb-tab${isWishlistActive ? " active" : ""}`}
            title="Wishlist"
          >
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: isWishlistActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            {isWishlistActive && <span className="fb-tab-indicator" />}
          </Link>

          {/* Sell / My Shop Tab (when logged in) */}
          {isLoggedIn && (
            <Link
              href={sellHref}
              className={`fb-tab${isSellActive ? " active" : ""}`}
              title={sellerState.isSeller ? "My Shop Dashboard" : "Become a Seller"}
            >
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: isSellActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                add_business
              </span>
              {isSellActive && <span className="fb-tab-indicator" />}
            </Link>
          )}
        </div>

        {/* ── Cluster 3: Right (Rounded Action Buttons + Profile Avatar) ── */}
        <div className="nav-right-cluster">
          {isLoggedIn ? (
            <>
              {/* 1. Quick Create / Sell (+) */}
              <Link
                href={sellHref}
                className="fb-action-btn"
                title={sellerState.isSeller ? "Add Item / My Shop" : "Sell Item"}
              >
                <span className="material-symbols-outlined text-[22px]">add</span>
              </Link>

              {/* 2. Messages / Chat */}
              <Link
                href="/messages"
                className="fb-action-btn relative"
                title="Messages & Negotiations"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </Link>

              {/* 3. Notifications */}
              <button
                type="button"
                className="fb-action-btn"
                title="Notifications"
                onClick={() => alert("You have no new notifications.")}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>

              {/* 4. Profile Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="fb-action-btn overflow-hidden border-2 border-transparent hover:border-[#8c5d3e] transition-colors"
                  title="Account Menu"
                >
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[22px] text-[#241b16]">person</span>
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="fb-profile-dropdown">
                    {/* User header */}
                    <div className="p-3 border-b border-[#e6ded5] bg-[#faf6f1] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8c5d3e] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                        {user?.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#241b16] truncate">{user?.name || "Account"}</p>
                        <p className="text-xs text-[#786a60] truncate">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="fb-dropdown-item"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#786a60]">account_circle</span>
                      <span>My Profile</span>
                    </Link>

                    {sellerState.isSeller && (
                      <Link
                        href="/seller/dashboard"
                        className="fb-dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[20px] text-[#8c5d3e]">storefront</span>
                        <span>Seller Dashboard</span>
                      </Link>
                    )}

                    {sellerState.verificationStatus === "pending" && !sellerState.isSeller && (
                      <Link
                        href="/profile/become-seller/status"
                        className="fb-dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[20px] text-[#e65100]">hourglass_empty</span>
                        <span>Verification Status</span>
                      </Link>
                    )}

                    <div className="h-[1px] bg-[#e6ded5] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="fb-dropdown-item text-[#dc2626] hover:bg-[#fee2e2]/40"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#dc2626]">logout</span>
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ── Guest: Login / Sign up ── */
            <div className="flex items-center gap-2">
              <Link href="/login" className="fb-guest-login">
                Log in
              </Link>
              <Link href="/register" className="fb-guest-signup" id="nav-signup">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            className="fb-mobile-toggle"
            id="mobile-toggle"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Tray ── */}
      {mobileOpen && (
        <div className="fb-mobile-menu" id="mobile-menu">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <span className="material-symbols-outlined text-[20px]">explore</span>
            Home
          </Link>
          <Link href="/shop" onClick={() => setMobileOpen(false)}>
            <span className="material-symbols-outlined text-[20px]">home</span>
            Shop
          </Link>
          <Link href="/auctions" onClick={() => setMobileOpen(false)}>
            <span className="material-symbols-outlined text-[20px]">gavel</span>
            Auctions
          </Link>
          <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            Wishlist
          </Link>
          {isLoggedIn && (
            <Link href={sellHref} onClick={() => setMobileOpen(false)}>
              <span className="material-symbols-outlined text-[20px]">add_business</span>
              {sellerState.isSeller ? "My Shop" : "Sell"}
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <div className="h-[1px] bg-[#e6ded5] my-2" />
              <Link href="/profile" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-[20px]">person</span>
                My Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 text-[#dc2626] font-semibold p-2.5 text-left w-full hover:bg-[#fee2e2]/30 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Log out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="fb-guest-login flex-1 text-center" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link href="/register" className="fb-guest-signup flex-1 text-center" onClick={() => setMobileOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
