import Link from "next/link";

export default function SellerAuctionsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ffdbd0] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#974226]">gavel</span>
      </div>
      <h1 className="text-[28px] font-semibold text-[#231a11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Auctions
      </h1>
      <p className="text-[15px] text-[#55433d] mb-6">Create and monitor live auctions for your rare pieces.</p>
      <div className="flex items-center gap-3">
        <Link
          href="/seller/auctions/new"
          className="px-6 py-2.5 rounded-xl bg-[#974226] text-white text-sm font-semibold hover:bg-[#b65a3c] transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">gavel</span>
          + Start Auction
        </Link>
        <Link
          href="/auctions/live"
          className="px-6 py-2.5 rounded-xl border border-[#dbc1b9] text-[#231a11] text-sm font-semibold hover:bg-[#feeadc] transition-all"
        >
          View Live Feed
        </Link>
      </div>
    </div>
  );
}
