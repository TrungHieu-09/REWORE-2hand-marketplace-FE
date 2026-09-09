"use client";

import { useEffect, useMemo, useState } from "react";
import type { Auction, AuctionCategory } from "./_data/mock-auctions";
import { FEATURED_AUCTIONS, GRID_AUCTIONS } from "./_data/mock-auctions";
import CategoryFilterBar from "./_components/CategoryFilterBar";
import FeaturedAuctionCard from "./_components/FeaturedAuctionCard";
import AuctionGridCard from "./_components/AuctionGridCard";
import ReputationSidebar from "./_components/ReputationSidebar";
import { ApiError, auctionsApi, type Auction as ApiAuction } from "@/app/lib/api";

const FALLBACK_IMAGES = [
  "/product1.png",
  "/product2.png",
  "/product3.png",
  "/shop-leather-bag.png",
  "/shop-denim-jeans.png",
];

function secondsUntil(iso: string) {
  return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000));
}

function startsInLabel(iso: string) {
  const seconds = secondsUntil(iso);
  if (seconds <= 0) return "Soon";
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return `${Math.max(1, Math.floor(seconds / 60))}m`;
  if (hours < 24) return `${hours}h`;
  if (hours < 48) return "Tomorrow";
  return `${Math.ceil(hours / 24)}d`;
}

function mapApiAuction(auction: ApiAuction, index: number): Auction {
  const product = auction.product;
  const isLive = auction.status === "LIVE";
  return {
    id: auction.id,
    title: product?.title ?? "REWORE Auction",
    category: product?.category ?? "Other",
    imageUrl: product?.images?.[0] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    imageAlt: product?.title ?? "REWORE auction item",
    status: isLive ? "live" : auction.status === "UPCOMING" ? "starts_soon" : "upcoming",
    currentBid: auction.currentBid,
    startingBid: auction.startPrice,
    endsInSeconds: isLive ? secondsUntil(auction.endTime) : undefined,
    startsInLabel: isLive ? undefined : startsInLabel(auction.startTime),
    watcherCount: auction._count?.bids ?? auction.bids?.length ?? 0,
  };
}

export default function LiveAuctionsPage() {
  const [activeCategory, setActiveCategory] = useState<AuctionCategory>("All");
  const [auctions, setAuctions] = useState<Auction[]>([
    ...FEATURED_AUCTIONS,
    ...GRID_AUCTIONS,
  ]);
  const [dataLoading, setDataLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    auctionsApi
      .list({ limit: 50 })
      .then((res) => {
        if (!cancelled) setAuctions(res.data.map(mapApiAuction));
      })
      .catch((err) => {
        if (!cancelled) {
          setApiMessage(
            err instanceof ApiError
              ? err.message
              : "Could not load auctions from API. Showing demo data."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(auctions.map((auction) => auction.category))).sort()],
    [auctions]
  );

  const filteredAuctions = useMemo(
    () =>
      activeCategory === "All"
        ? auctions
        : auctions.filter((auction) => auction.category === activeCategory),
    [activeCategory, auctions]
  );

  const filteredFeatured = filteredAuctions.filter(
    (auction) => auction.status === "live"
  );
  const filteredGrid = filteredAuctions.filter(
    (auction) => auction.status !== "live"
  );

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24">
      <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <header className="mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#231a11] leading-[1.1] tracking-tight mb-3">
              Auctions
            </h1>
            <p className="text-[#55443d] text-base leading-relaxed max-w-xl">
              Discover &amp; bid on curated vintage &amp; pre-loved pieces — live sessions, upcoming drops, and ending-soon finds.
            </p>
            <p className="mt-3 text-sm text-[#88726c]">
              {dataLoading ? "Loading auctions from API..." : `${auctions.length} auction${auctions.length !== 1 ? "s" : ""} loaded`}
            </p>
            {apiMessage && <p className="mt-2 text-sm text-[#ba1a1a]">{apiMessage}</p>}
          </header>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CategoryFilterBar
              active={activeCategory}
              categories={categories}
              onChange={setActiveCategory}
            />
          </div>

          {filteredFeatured.length > 0 && (
            <section className="mb-14 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#231a11] mb-6 flex items-center gap-2.5">
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

        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <ReputationSidebar />
        </div>
      </main>
    </div>
  );
}


