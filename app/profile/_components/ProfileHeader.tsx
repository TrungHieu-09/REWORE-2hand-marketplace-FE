"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileHeader() {
  const [barWidth, setBarWidth] = useState(0);
  const TRUST_SCORE = 86;

  // Animate trust score
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(TRUST_SCORE), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.10)] border border-[#f2dfd1] flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(43,33,24,0.12)]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fff1e8] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      {/* Avatar */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#feeadc] flex-shrink-0 z-10">
        <Image
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left z-10 flex flex-col justify-center h-full">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#231a11]">
            Elena Rossi
          </h2>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#fff8f5] text-[#974226] text-xs font-semibold rounded-full border border-[#f2dfd1]">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Verified Buyer
          </span>
        </div>
        <p className="text-[#55443d] text-sm mb-6">
          Member since October 2021 • Milano, Italy
        </p>

        {/* Trust Score Bar */}
        <div className="max-w-md w-full mx-auto md:mx-0 bg-[#fff8f5] rounded-xl p-4 border border-[#f2dfd1]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-semibold text-[#55443d] tracking-wide">
              Trust Score
            </span>
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#974226]">
              {TRUST_SCORE}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#f2dfd1] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#974226] to-[#b65a3c] transition-all duration-1000 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
