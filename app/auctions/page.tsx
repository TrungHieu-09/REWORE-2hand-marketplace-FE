"use client";

import { useState } from "react";
import type { AuctionCategory } from "./_data/mock-auctions";
import { FEATURED_AUCTIONS, GRID_AUCTIONS } from "./_data/mock-auctions";
import CategoryFilterBar from "./_components/CategoryFilterBar";
import FeaturedAuctionCard from "./_components/FeaturedAuctionCard";
import AuctionGridCard from "./_components/AuctionGridCard";
import ReputationSidebar from "./_components/ReputationSidebar";

export default function LiveAuctionsPage() {
  const [activeCategory, setActiveCategory] = useState<AuctionCategory>("All");

  const filteredGrid =
    activeCategory === "All"
      ? GRID_AUCTIONS
      : GRID_AUCTIONS.filter((a) => a.category === activeCategory);

  const filteredFeatured =
    activeCategory === "All"
      ? FEATURED_AUCTIONS
      : FEATURED_AUCTIONS.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24">
      <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-12 flex flex-col lg:flex-row gap-8">
        {/* ──────────────── LEFT / MAIN COLUMN ──────────────── */}
        <div className="flex-1 min-w-0">
          {/* Page Header */}
          <header className="mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#231a11] leading-[1.1] tracking-tight mb-3">
              Auctions
            </h1>
            <p className="text-[#55443d] text-base leading-relaxed max-w-xl">
              Discover & bid on curated vintage &amp; pre-loved pieces — live sessions, upcoming drops, and ending-soon finds.
            </p>
          </header>

          {/* Filter Bar */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CategoryFilterBar
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {/* ── Happening Now ── */}
          {filteredFeatured.length > 0 && (
            <section className="mb-14 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#231a11] mb-6 flex items-center gap-2.5">
                {/* Animated LIVE dot */}
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b65a3c] opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b65a3c]" />
                </span>
                Happening Now
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredFeatured.map((auction) => (
                  <FeaturedAuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            </section>
          )}

          {/* ── Upcoming & Ending Soon ── */}
          {filteredGrid.length > 0 && (
            <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#231a11] mb-6">
                Upcoming &amp; Ending Soon
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredGrid.map((auction) => (
                  <AuctionGridCard key={auction.id} auction={auction} />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {filteredFeatured.length === 0 && filteredGrid.length === 0 && (
            <div className="py-24 flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-5xl text-[#dbc1b9]">
                search_off
              </span>
              <p className="text-[#88726c] font-medium">
                No auctions in <strong>{activeCategory}</strong> right now.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-2 text-[#974226] text-sm font-semibold hover:underline"
              >
                View all auctions →
              </button>
            </div>
          )}
        </div>

        {/* ──────────────── RIGHT SIDEBAR ──────────────── */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <ReputationSidebar />
        </div>
      </main>
    </div>
  );
}
