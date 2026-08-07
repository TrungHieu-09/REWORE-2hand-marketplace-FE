"use client";

import Image from "next/image";
import { ACTIVE_BIDS } from "../../auctions/_data/mock-auctions";

function formatVND(amount: number) {
  return "₫" + new Intl.NumberFormat("vi-VN").format(amount);
}

const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "Won auction — Archive Denim Jacket",
    time: "Yesterday",
    status: "Won",
    statusColor: "bg-[#dae9b5]/40 text-[#3f4b25] border border-[#becc9b]/60",
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=128&h=128",
  },
  {
    id: 2,
    title: "Purchased — Wool Tweed Blazer",
    time: "3 days ago",
    status: "Shipped",
    statusColor: "bg-[#ede1d2]/60 text-[#4d463b] border border-[#d0c5b7]/60",
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=128&h=128",
  },
  {
    id: 3,
    title: "Bid Placed — Silk Scarf",
    time: "4 days ago",
    status: "Active",
    statusColor: "bg-[#f2dfd1]/80 text-[#55443d] border border-[#dbc1b9]/60",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=128&h=128",
  },
];

export default function TabOverview() {
  const stats = [
    { label: "Items Purchased", value: "12" },
    { label: "Active Bids", value: "3" },
    { label: "Items Sold", value: "0" },
  ];

  return (
    <div className="flex flex-col gap-8 opacity-0 animate-fade-in-up">

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-[#dbc1b9]/30 shadow-[0_4px_16px_-4px_rgba(43,33,24,0.06)] flex flex-col justify-between h-24 hover:shadow-md transition-shadow"
          >
            <span className="text-[11px] font-semibold text-[#88726c] uppercase tracking-[0.08em]">
              {stat.label}
            </span>
            <span className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold text-[#231a11] leading-none">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Recent Activity ── */}
      <section>
        <h2 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[#231a11] mb-5">
          Recent Activity
        </h2>
        <div className="bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(43,33,24,0.07)] border border-[#dbc1b9]/30 overflow-hidden">
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 group cursor-pointer hover:bg-[#fff8f5] transition-colors ${
                i < RECENT_ACTIVITY.length - 1 ? "border-b border-[#f2dfd1]" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#feeadc] relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold text-[#231a11] truncate group-hover:text-[#974226] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[12px] text-[#88726c] mt-0.5">{item.time}</p>
              </div>
              {/* Badge */}
              <div className="shrink-0">
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
