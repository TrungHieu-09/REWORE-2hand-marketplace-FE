"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ActiveBid } from "../_data/mock-auctions";
import { ACTIVE_BIDS } from "../_data/mock-auctions";

const TRUST_SCORE = 86;

function formatVND(amount: number) {
  return "₫" + new Intl.NumberFormat("vi-VN").format(amount);
}

export default function ReputationSidebar() {
  const [barWidth, setBarWidth] = useState(0);

  // Animate the trust score bar on mount
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(TRUST_SCORE), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-5 md:sticky md:top-24 md:self-start">
      {/* ── Reputation Card ── */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.10)] border border-[#f2dfd1] transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(43,33,24,0.15)] hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-[#feeadc] flex items-center justify-center text-[#974226] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              verified_user
            </span>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#231a11]">
              Your Reputation
            </h3>
            <p className="text-[11px] text-[#88726c] font-medium tracking-wide">
              Verified Buyer
            </p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-[#fff8f5] rounded-xl p-4">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-semibold text-[#55443d] tracking-wide">
              Trust Score
            </span>
            <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#974226]">
              {TRUST_SCORE}
            </span>
          </div>

          {/* Animated progress bar */}
          <div className="h-2 rounded-full bg-[#f2dfd1] overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#974226] to-[#b65a3c] transition-all duration-1000 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-[#556138] font-medium">
            <span className="material-symbols-outlined text-[13px]">
              check_circle
            </span>
            Eligible for premium bids
          </p>
        </div>
      </div>

      {/* ── Active Bids Card ── */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.10)] border border-[#f2dfd1] transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(43,33,24,0.15)] hover:-translate-y-1">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#231a11]">
            My Active Bids
          </h3>
          <button className="text-[#974226] text-xs font-semibold hover:underline tracking-wide">
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {ACTIVE_BIDS.map((bid, i) => (
            <BidItem key={bid.id} bid={bid} showDivider={i < ACTIVE_BIDS.length - 1} />
          ))}
        </div>

        <button
          className="
            w-full mt-5 py-2.5 border border-[#88726c] text-[#231a11]
            rounded-xl text-xs font-semibold tracking-wide
            hover:bg-[#f2dfd1] transition-colors duration-200
          "
        >
          Manage Bids
        </button>
      </div>
    </aside>
  );
}

function BidItem({
  bid,
  showDivider,
}: {
  bid: ActiveBid;
  showDivider: boolean;
}) {
  const isWinning = bid.status === "winning";
  return (
    <>
      <div className="flex gap-3 group cursor-pointer">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#feeadc]">
          <Image
            src={bid.imageUrl}
            alt={bid.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4
            className={`text-xs font-semibold text-[#231a11] line-clamp-1 group-hover:text-[#974226] transition-colors ${!isWinning ? "opacity-70" : ""}`}
          >
            {bid.title}
          </h4>
          <p
            className={`text-[11px] text-[#55443d] mt-0.5 ${!isWinning ? "line-through opacity-60" : ""}`}
          >
            Your bid: {formatVND(bid.yourBid)}
          </p>
          {isWinning ? (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-[#556138] mt-1">
              <span className="material-symbols-outlined text-[12px]">
                trending_up
              </span>
              Winning
            </p>
          ) : (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-[#ba1a1a] mt-1">
              <span className="material-symbols-outlined text-[12px]">
                warning
              </span>
              Outbid
            </p>
          )}
        </div>
      </div>
      {showDivider && <div className="h-px bg-[#f2dfd1]" />}
    </>
  );
}
