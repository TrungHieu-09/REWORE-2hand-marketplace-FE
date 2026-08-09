"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { useSeller } from "../../../context/SellerContext";

// ─────────────────────────────────────────────────────────────────────────────
// Seller Score Ring (like BuyerScore in ProfileRightSidebar)
// ─────────────────────────────────────────────────────────────────────────────
function SellerScoreRing({ score }: { score: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 400); return () => clearTimeout(t); }, []);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (visible ? (score / 100) * circumference : circumference);

  return (
    <div className="relative w-[90px] h-[90px] flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f2dfd1" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="#6d7a4f" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1.4s ease-out" }}
        />
      </svg>
      <span className="font-[family-name:var(--font-playfair)] text-[30px] font-bold text-[#231a11] relative z-10 leading-none">
        {score}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pending State (UI 12)
// ─────────────────────────────────────────────────────────────────────────────
function PendingState({ onSimulateApproval, onSimulateRejection }: {
  onSimulateApproval: () => void;
  onSimulateRejection: () => void;
}) {
  const [simulating, setSimulating] = useState(false);

  const handleApprove = () => {
    setSimulating(true);
    setTimeout(() => {
      onSimulateApproval();
      setSimulating(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* Hourglass icon */}
      <div className="w-24 h-24 rounded-full bg-[#f2dfd1] border border-[#dbc1b9]/40 flex items-center justify-center mb-8 shadow-sm">
        <span
          className="material-symbols-outlined text-[44px] text-[#974226]"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          hourglass_empty
        </span>
      </div>

      <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#231a11] mb-4 leading-tight max-w-[380px]">
        Your application is under review
      </h1>
      <p className="text-[15px] text-[#55433d] leading-relaxed max-w-[340px] mb-8">
        This usually takes less than 24 hours. We&apos;ll notify you once approved.
      </p>

      {/* Disabled dashboard button */}
      <button
        disabled
        className="flex items-center justify-center gap-2 w-full max-w-[340px] py-3.5 rounded-xl bg-[#f2dfd1] text-[#88726c] text-[14px] font-semibold mb-3 cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[18px]">dashboard</span>
        Go to Seller Dashboard
      </button>

      <Link
        href="/"
        className="text-[13px] text-[#88726c] underline underline-offset-4 hover:text-[#974226] transition-colors mb-10"
      >
        Return to Homepage
      </Link>

      {/* Demo controls */}
      <div className="w-full border-t border-dashed border-[#dbc1b9]/60 pt-6 mt-2">
        <p className="text-[11px] text-[#88726c] uppercase tracking-widest mb-4 font-semibold">
          ✦ Demo Controls
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleApprove}
            disabled={simulating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#dae9b5] text-[#3f4b25] text-[13px] font-semibold hover:bg-[#becc9b] transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {simulating ? "sync" : "check_circle"}
            </span>
            {simulating ? "Processing…" : "Simulate Approval"}
          </button>
          <button
            onClick={onSimulateRejection}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[13px] font-semibold hover:bg-[#ffb4ab] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
            Simulate Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Approved State (UI 13)
// ─────────────────────────────────────────────────────────────────────────────
function ApprovedState({ score }: { score: number }) {
  const LIVE_AUCTION_THRESHOLD = 75;
  const pointsToUnlock = Math.max(0, LIVE_AUCTION_THRESHOLD - score);
  const progressPct = Math.min((score / LIVE_AUCTION_THRESHOLD) * 100, 100);

  const badge =
    score < 60 ? "Starter" : score < 75 ? "Rising" : score < 85 ? "Trusted" : "Elite";

  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* Checkmark icon */}
      <div className="w-24 h-24 rounded-full bg-[#974226] flex items-center justify-center mb-8 shadow-lg">
        <span
          className="material-symbols-outlined text-[44px] text-white"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>

      <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#231a11] mb-4">
        You&apos;re now a REWORE Seller!
      </h1>
      <p className="text-[15px] text-[#55433d] leading-relaxed max-w-[360px] mb-8">
        Your application has been approved. You can now start listing your curated pieces to our community.
      </p>

      {/* Seller Score card */}
      <div className="w-full max-w-[380px] bg-[#fff8f5] rounded-xl border border-[#dbc1b9]/40 p-5 mb-8 text-left">
        {/* Score + label */}
        <div className="flex items-center gap-4 mb-5">
          <SellerScoreRing score={score} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#88726c] mb-1">Seller Score</p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#dae9b5]/60 text-[#3f4b25] text-[12px] font-semibold border border-[#becc9b]/50">
              {badge}
            </span>
          </div>
        </div>

        {/* Progress bar toward Live Auctions */}
        <div>
          <div className="flex justify-between text-[12px] text-[#88726c] mb-2 font-medium">
            <span>Current</span>
            <span>Live Auctions ({LIVE_AUCTION_THRESHOLD})</span>
          </div>
          <div className="w-full h-2 bg-[#f2dfd1] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#974226] rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {pointsToUnlock > 0 ? (
            <p className="text-[12px] text-[#88726c] text-center">
              {pointsToUnlock} points to unlock Live Auctions
            </p>
          ) : (
            <p className="text-[12px] text-[#6d7a4f] font-semibold text-center">
              ✓ Live Auctions unlocked!
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/seller/dashboard"
        className="flex items-center justify-center gap-2 w-full max-w-[340px] py-3.5 rounded-xl bg-[#974226] text-white text-[14px] font-semibold hover:bg-[#b65a3c] transition-colors shadow-md"
      >
        <span className="material-symbols-outlined text-[18px]">dashboard</span>
        Go to Seller Dashboard
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rejected State
// ─────────────────────────────────────────────────────────────────────────────
function RejectedState({ reason, onResubmit }: { reason: string; onResubmit: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* X icon */}
      <div className="w-24 h-24 rounded-full bg-[#ffdad6] border border-[#ffb4ab]/40 flex items-center justify-center mb-8 shadow-sm">
        <span
          className="material-symbols-outlined text-[44px] text-[#ba1a1a]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          cancel
        </span>
      </div>

      <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#231a11] mb-4">
        Verification unsuccessful
      </h1>
      <p className="text-[15px] text-[#55433d] leading-relaxed max-w-[380px] mb-4">
        We were unable to verify your identity. Please review the issue below and resubmit.
      </p>

      {/* Reason */}
      <div className="w-full max-w-[380px] bg-[#ffdad6]/40 border border-[#ffb4ab]/50 rounded-xl px-5 py-4 mb-8 text-left">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-[#93000a] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            error
          </span>
          <p className="text-[13px] text-[#93000a] leading-relaxed">{reason}</p>
        </div>
      </div>

      <button
        onClick={onResubmit}
        className="flex items-center justify-center gap-2 w-full max-w-[340px] py-3.5 rounded-xl bg-[#974226] text-white text-[14px] font-semibold hover:bg-[#b65a3c] transition-colors shadow-md mb-4"
      >
        <span className="material-symbols-outlined text-[18px]">refresh</span>
        Resubmit Application
      </button>
      <Link href="/" className="text-[13px] text-[#88726c] underline underline-offset-4 hover:text-[#974226] transition-colors">
        Return to Homepage
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Status Page
// ─────────────────────────────────────────────────────────────────────────────
export default function StatusPage() {
  const router = useRouter();
  const { sellerState, simulateApproval, simulateRejection, resetSeller } = useSeller();
  const { verificationStatus, sellerScore, rejectionReason } = sellerState;

  // If no verification was submitted, redirect back
  useEffect(() => {
    if (verificationStatus === "none") {
      router.replace("/profile/become-seller");
    }
  }, [verificationStatus, router]);

  const handleResubmit = () => {
    resetSeller();
    router.push("/profile/become-seller/verify");
  };

  const statusTitle: Record<string, string> = {
    pending: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f5] pt-24 pb-20 flex flex-col">
        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 mb-8 w-full">
          <nav className="flex items-center gap-2 text-[13px] text-[#88726c]">
            <Link href="/profile" className="hover:text-[#974226] transition-colors font-medium">Profile</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/profile/become-seller" className="hover:text-[#974226] transition-colors font-medium">Become a Seller</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#231a11] font-semibold">
              {statusTitle[verificationStatus] ?? "Status"}
            </span>
          </nav>
        </div>

        <main className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_12px_48px_-8px_rgba(43,33,24,0.09)] border border-[#dbc1b9]/30 p-8 md:p-12 opacity-0 animate-fade-in-up relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#ffdbd0]/20 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-[#f2dfd1]/20 pointer-events-none" />

            <div className="relative z-10">
              {verificationStatus === "pending" && (
                <PendingState
                  onSimulateApproval={simulateApproval}
                  onSimulateRejection={() =>
                    simulateRejection("Your ID photo was unclear or information did not match our records.")
                  }
                />
              )}
              {verificationStatus === "approved" && (
                <ApprovedState score={sellerScore} />
              )}
              {verificationStatus === "rejected" && (
                <RejectedState
                  reason={rejectionReason ?? "Verification failed. Please try again."}
                  onResubmit={handleResubmit}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
