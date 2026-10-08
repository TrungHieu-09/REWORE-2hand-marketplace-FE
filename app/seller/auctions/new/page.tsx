"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewAuctionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [duration, setDuration] = useState("24h");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(`Phiên đấu giá "${title || 'Vintage Piece'}" đã được tạo thành công!`);
      router.push("/seller/auctions");
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-2 text-[13px] text-[#88726c] mb-6">
        <Link href="/seller/auctions" className="hover:text-[#974226] font-medium">
          Auctions
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#231a11] font-semibold">Start Auction</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[#f2dfd1] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ffdbd0] text-[#974226] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">gavel</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Start Live Auction
            </h1>
            <p className="text-xs text-[#655d52]">Host a live bidding event for a rare vintage piece</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
              Auction Item
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1999 Silk Scarf — Signed Piece"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
                Starting Bid (₫)
              </label>
              <input
                type="number"
                required
                placeholder="₫ 500,000"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
              >
                <option value="2h">Flash 2 Hours</option>
                <option value="6h">6 Hours</option>
                <option value="24h">24 Hours (Standard)</option>
                <option value="48h">48 Hours (Weekend)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f2dfd1]">
            <Link
              href="/seller/auctions"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#dbc1b9] text-[#55433d] hover:bg-[#feeadc]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitted}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#974226] text-white hover:bg-[#b65a3c] transition-all shadow-sm"
            >
              {submitted ? "Creating…" : "Launch Auction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
