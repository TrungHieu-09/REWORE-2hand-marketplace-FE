import Link from "next/link";

export default function SellerAnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ffdbd0] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#974226]">query_stats</span>
      </div>
      <h1 className="text-[28px] font-semibold text-[#231a11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Analytics
      </h1>
      <p className="text-[15px] text-[#55433d] mb-6">Track your store performance, views, and conversion rates.</p>
      <div className="flex items-center gap-3">
        <Link
          href="/seller/dashboard"
          className="px-6 py-2.5 rounded-xl bg-[#974226] text-white text-sm font-semibold hover:bg-[#b65a3c] transition-all shadow-sm"
        >
          View Dashboard KPIs
        </Link>
        <Link
          href="/seller/reports"
          className="px-6 py-2.5 rounded-xl border border-[#dbc1b9] text-[#231a11] text-sm font-semibold hover:bg-[#feeadc] transition-all"
        >
          Monthly Reports
        </Link>
      </div>
    </div>
  );
}
