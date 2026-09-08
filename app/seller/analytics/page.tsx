export default function SellerAnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ffdbd0] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#974226]">query_stats</span>
      </div>
      <h1 className="text-[28px] font-semibold text-[#231a11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Analytics
      </h1>
      <p className="text-[15px] text-[#55433d]">Track your store performance, views, and conversion rates.</p>
      <span className="mt-4 inline-flex items-center gap-2 text-[12px] text-[#88726c] bg-[#f2dfd1]/40 border border-[#dbc1b9]/30 rounded-full px-4 py-2">
        <span className="material-symbols-outlined text-[16px]">construction</span>
        Coming soon — connect to API
      </span>
    </div>
  );
}
