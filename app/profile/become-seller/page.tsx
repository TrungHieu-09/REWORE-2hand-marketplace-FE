"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const STEPS = [
  {
    number: 1,
    icon: "badge",
    title: "Verify Identity",
    description: "Quick ID verification to keep our community safe.",
  },
  {
    number: 2,
    icon: "account_balance_wallet",
    title: "Link Payout Account",
    description: "Connect your bank or wallet for secure, fast payments.",
  },
  {
    number: 3,
    icon: "storefront",
    title: "Start Selling",
    description:
      "List your first item and reach thousands of vintage lovers.",
  },
];

const PERKS = [
  {
    icon: "local_offer",
    title: "List Unique Items",
    description:
      "Upload curated vintage pieces and reach buyers who truly appreciate them.",
  },
  {
    icon: "collections",
    title: "Join Curated Drops",
    description:
      "Participate in themed seasonal drops handpicked by REWORE editors.",
  },
  {
    icon: "gavel",
    title: "Host Live Auctions",
    description:
      "Unlock live auction hosting as your trust score grows.",
  },
  {
    icon: "verified",
    title: "Verified Seller Badge",
    description:
      "Build credibility with a badge that buyers can trust instantly.",
  },
];

export default function BecomeSeller() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f5] pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 mb-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#88726c]">
            <Link
              href="/profile"
              className="hover:text-[#974226] transition-colors font-medium"
            >
              Profile
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="text-[#231a11] font-semibold">
              Become a Seller
            </span>
          </nav>
        </div>

        <main className="max-w-[1280px] mx-auto px-5 md:px-12">
          {/* ── Hero Card ── */}
          <div className="bg-white rounded-[24px] shadow-[0_12px_48px_-8px_rgba(43,33,24,0.09)] border border-[#dbc1b9]/30 p-8 md:p-14 text-center mb-10 relative overflow-hidden opacity-0 animate-fade-in-up">
            {/* Decorative circles */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#ffdbd0]/30 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#f2dfd1]/40 pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ffdbd0]/60 border border-[#ffb59e]/40 mb-6 mx-auto shadow-sm">
              <span
                className="material-symbols-outlined text-[28px] text-[#974226]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                storefront
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#231a11] mb-4 leading-tight relative z-10">
              Turn your closet into cash
            </h1>
            <p className="text-[16px] text-[#55433d] leading-relaxed max-w-xl mx-auto mb-10 relative z-10">
              Sellers on REWORE can list unique items, participate in curated
              drops, and unlock the power of live auctions as their trust score
              grows.
            </p>

            {/* ── Steps ── */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-0 mb-10">
              {STEPS.map((step, i) => (
                <div key={step.number} className="flex md:flex-row items-center w-full md:w-auto">
                  {/* Step block */}
                  <div
                    className="flex flex-col items-center text-center w-full md:w-[190px] cursor-default"
                    onMouseEnter={() => setHoveredStep(step.number)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Circle */}
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 transition-all duration-300 ${
                        hoveredStep === step.number
                          ? "border-[#974226] bg-[#974226] shadow-md scale-110"
                          : "border-[#974226] bg-white"
                      }`}
                    >
                      <span
                        className={`text-[15px] font-bold font-[family-name:var(--font-playfair)] transition-colors ${
                          hoveredStep === step.number
                            ? "text-white"
                            : "text-[#974226]"
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-[#231a11] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-[#88726c] leading-relaxed max-w-[160px]">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block flex-1 h-px bg-[#dbc1b9] mx-2 mt-[-38px] min-w-[32px]" />
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="relative z-10 border-t border-[#f2dfd1] mb-8" />

            {/* CTA */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Link
                href="/profile/become-seller/verify"
                className="block w-full max-w-[560px] py-4 rounded-full bg-[#974226] text-white font-semibold text-[15px] tracking-wide text-center hover:bg-[#b65a3c] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Verification
              </Link>
              <p className="text-[13px] text-[#88726c]">Takes about 5 minutes</p>
            </div>
          </div>

          {/* ── Perks Grid ── */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.12s" }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold text-[#231a11] mb-6 text-center">
              Why sell on REWORE?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="bg-white rounded-[20px] p-6 border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] hover:shadow-[0_10px_32px_-6px_rgba(43,33,24,0.1)] hover:-translate-y-0.5 transition-all duration-300 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ffdbd0]/50 border border-[#ffb59e]/30 flex items-center justify-center mb-4 group-hover:bg-[#974226] group-hover:border-[#974226] transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-[20px] text-[#974226] group-hover:text-white transition-colors duration-300"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {perk.icon}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[17px] font-semibold text-[#231a11] mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-[13px] text-[#88726c] leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trust Strip ── */}
          <div
            className="mt-10 rounded-[20px] bg-[#f2dfd1]/40 border border-[#dbc1b9]/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.22s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#974226] flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[22px] text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-[#231a11]">
                  Safe & Trusted Community
                </h3>
                <p className="text-[13px] text-[#55433d] mt-0.5">
                  Every seller is verified. Every transaction is protected.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {[
                { label: "Sellers verified", value: "10K+" },
                { label: "Items listed", value: "85K+" },
                { label: "Avg. payout time", value: "48h" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl px-5 py-3 border border-[#dbc1b9]/30 shadow-sm text-center"
                >
                  <span className="font-[family-name:var(--font-playfair)] text-[22px] font-bold text-[#974226] block leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-semibold text-[#88726c] uppercase tracking-wide mt-1 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
