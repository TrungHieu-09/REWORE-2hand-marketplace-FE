"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileHeader() {
  const [scoreVisible, setScoreVisible] = useState(false);
  const BUYER_SCORE = 86;

  useEffect(() => {
    const t = setTimeout(() => setScoreVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // SVG ring progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (scoreVisible ? (BUYER_SCORE / 100) * circumference : circumference);

  return (
    <section className="bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(43,33,24,0.08)] border border-[#dbc1b9]/30 p-7 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
      {/* Subtle bg decor */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-[#fff1e8] rounded-full blur-3xl opacity-40 -translate-y-1/3 translate-x-1/4 pointer-events-none" />

      {/* Avatar */}
      <div className="relative w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full border border-[#dbc1b9]/30 shadow-sm overflow-hidden shrink-0 bg-[#feeadc] z-10">
        <Image
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left z-10 pt-1">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <h1 className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-[1.3] text-[#231a11]">
            Elena Rossi
          </h1>
          <span
            className="material-symbols-outlined text-[22px] text-[#974226]"
            style={{ fontVariationSettings: "'FILL' 1" }}
            title="Verified"
          >
            check_circle
          </span>
        </div>
        <p className="text-[#55443d] text-[15px] mb-4">
          @elenarossi · Member since October 2021
        </p>
        <button className="font-semibold text-[13px] tracking-wide px-6 py-2 rounded-full border border-[#974226] text-[#974226] hover:bg-[#974226] hover:text-white transition-colors duration-300">
          Edit Profile
        </button>
      </div>
    </section>
  );
}
