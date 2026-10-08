import Link from "next/link";

export default function SellerReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ffdbd0] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#974226]">description</span>
      </div>
      <h1 className="text-[28px] font-semibold text-[#231a11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Reports &amp; Policies
      </h1>
      <p className="text-[15px] text-[#55433d] max-w-md">
        Review monthly payout statements, authentication guidelines, and fee schedules.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/seller/analytics"
          className="px-6 py-2.5 bg-[#974226] text-white rounded-xl text-sm font-semibold hover:bg-[#b65a3c] transition-colors"
        >
          View Analytics
        </Link>
        <Link
          href="/seller/dashboard"
          className="px-6 py-2.5 border border-[#dbc1b9] text-[#231a11] rounded-xl text-sm font-semibold hover:bg-[#feeadc] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
