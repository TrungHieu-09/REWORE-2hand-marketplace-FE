"use client";

import { useEffect, useState } from "react";

export default function ProfileRightSidebar() {
  const [scoreVisible, setScoreVisible] = useState(false);
  const BUYER_SCORE = 86;

  useEffect(() => {
    const t = setTimeout(() => setScoreVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ≈ 282.7
  const dashOffset = scoreVisible
    ? circumference - (BUYER_SCORE / 100) * circumference
    : circumference;

  return (
    <aside className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-5">

      {/* ── Buyer Score Card ── */}
      <div className="bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(43,33,24,0.08)] border border-[#dbc1b9]/30 p-6 flex flex-col items-center text-center">
        <div className="relative w-[120px] h-[120px] flex items-center justify-center mb-4">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Track */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke="#f2dfd1"
              strokeWidth="6"
            />
            {/* Progress */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke="#6d7a4f"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
            />
          </svg>
          <span className="font-[family-name:var(--font-playfair)] text-[40px] font-bold text-[#231a11] relative z-10 leading-none">
            {BUYER_SCORE}
          </span>
        </div>

        <h3 className="text-[11px] font-semibold text-[#231a11] uppercase tracking-[0.08em] mb-2 flex items-center gap-1.5">
          Buyer Score — Eligible
          <span
            className="material-symbols-outlined text-[15px] text-[#6d7a4f]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            verified_user
          </span>
        </h3>
        <p className="text-[13px] text-[#55443d] leading-relaxed">
          You can hold items, join queues, and participate in auctions.
        </p>
      </div>

      {/* ── Become a Seller Card ── */}
      <div className="relative rounded-[20px] p-6 border border-[#ffb59e]/40 bg-[#ffdbd0]/20 overflow-hidden group">
        {/* Ghost icon decor */}
        <div className="absolute top-0 right-0 -mt-3 -mr-3 opacity-[0.12] group-hover:scale-110 transition-transform duration-700 text-[#974226]">
          <span className="material-symbols-outlined text-[96px]">storefront</span>
        </div>

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#974226] text-white flex items-center justify-center mb-4 shadow-sm">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
          </div>
          <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[#3a0b00] mb-2 leading-snug">
            Have items to sell?
          </h3>
          <p className="text-[13px] text-[#7b2e14] mb-5 leading-relaxed">
            Turn your closet into cash. Verification takes about 5 minutes.
          </p>
          <button className="w-full font-semibold text-[13px] tracking-wide bg-[#974226] text-white py-3 px-4 rounded-full hover:bg-[#b65a3c] transition-colors shadow-sm">
            Get Started
          </button>
        </div>
      </div>

      {/* ── Account Details Card ── */}
      <div className="bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(43,33,24,0.08)] border border-[#dbc1b9]/30 p-6">
        <h3 className="text-[11px] font-semibold text-[#231a11] uppercase tracking-[0.08em] mb-4 border-b border-[#f2dfd1] pb-3">
          Account Details
        </h3>
        <div className="flex flex-col gap-4">
          {[
            { label: "Email", value: "e***@email.com", action: "Change" },
            { label: "Phone", value: "+84 ***-***-1234", action: "Change" },
            { label: "Payout Method", value: "Not Linked", action: "Link", italic: true },
          ].map(({ label, value, action, italic }) => (
            <div key={label} className="flex justify-between items-center">
              <div>
                <span className="block text-[11px] font-semibold text-[#88726c] mb-0.5 tracking-wide uppercase">
                  {label}
                </span>
                <span className={`block text-[14px] text-[#231a11] ${italic ? "italic text-[#88726c]" : ""}`}>
                  {value}
                </span>
              </div>
              <a href="#" className="text-[12px] font-semibold text-[#974226] hover:underline underline-offset-4">
                {action}
              </a>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
