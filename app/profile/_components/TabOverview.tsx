"use client";

import Image from "next/image";
import { ACTIVE_BIDS } from "../../auctions/_data/mock-auctions";

function formatVND(amount: number) {
  return "₫" + new Intl.NumberFormat("vi-VN").format(amount);
}

export default function TabOverview() {
  const stats = [
    { label: "Active Bids", value: 4, icon: "gavel" },
    { label: "Items Won", value: 12, icon: "emoji_events" },
    { label: "Total Spent", value: "₫24.5M", icon: "payments" },
  ];

  return (
    <div className="space-y-8 opacity-0 animate-fade-in-up">
      {/* Quick Stats */}
      <section>
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11] mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)] border border-[#f2dfd1] flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-full bg-[#fff1e8] text-[#974226] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-[#88726c] text-xs font-semibold uppercase tracking-wider mb-0.5">
                  {stat.label}
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#231a11]">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity (Active Bids preview) */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11]">
            Recent Activity
          </h3>
          <button className="text-[#974226] text-sm font-semibold hover:underline">
            View All
          </button>
        </div>
        
        <div className="bg-white rounded-[20px] shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)] border border-[#f2dfd1] overflow-hidden">
          {ACTIVE_BIDS.map((bid, i) => {
            const isWinning = bid.status === "winning";
            return (
              <div
                key={bid.id}
                className={`flex gap-4 p-5 ${
                  i < ACTIVE_BIDS.length - 1 ? "border-b border-[#f2dfd1]" : ""
                } hover:bg-[#fff8f5] transition-colors`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#feeadc]">
                  <Image src={bid.imageUrl} alt={bid.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-[#231a11] mb-1">
                    {bid.title}
                  </h4>
                  <p className="text-xs text-[#55443d]">
                    Your bid: <span className="font-semibold">{formatVND(bid.yourBid)}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end justify-center">
                  {isWinning ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#556138] bg-[#fcffeb] px-2 py-1 rounded border border-[#dae9b5]">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      Winning
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] px-2 py-1 rounded border border-[#ffb4ab]">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      Outbid
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
