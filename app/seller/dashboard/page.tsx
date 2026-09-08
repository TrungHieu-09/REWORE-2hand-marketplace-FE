import Link from "next/link";
import SellerStatCards from "../../components/seller/SellerStatCards";
import RecentOrdersTable from "../../components/seller/RecentOrdersTable";
import SellerScoreCard from "../../components/seller/SellerScoreCard";
import UrgentAttentionCard from "../../components/seller/UrgentAttentionCard";

export default function SellerDashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      {/* Welcome Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#974226] uppercase tracking-widest">Store Overview</span>
            <span className="text-[#dbc1b9]">•</span>
            <span className="text-[12px] text-[#655d52]">{today}</span>
          </div>
          <h1
            className="text-[32px] font-semibold text-[#231a11] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome back, Old Soul Studio
          </h1>
          <p className="text-[15px] text-[#55433d] mt-0.5">
            All systems running smoothly · 4 customer inquiries await response
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/seller/auctions/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#974226] text-[#974226] hover:bg-[#feeadc] text-[13px] font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            + Start Auction
          </Link>
          <Link
            href="/seller/inventory/new"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#974226] hover:bg-[#b65a3c] text-white text-[13px] font-bold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            + New Listing
          </Link>
        </div>
      </section>

      {/* Stat Cards */}
      <SellerStatCards />

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Orders Table (8 cols) */}
        <div className="lg:col-span-8">
          <RecentOrdersTable />
        </div>

        {/* Right: Score + Alerts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <SellerScoreCard />
          <UrgentAttentionCard />
        </div>
      </div>

      {/* Curator Advisory Banner */}
      <section className="mt-8 rounded-2xl bg-[#ede1d2]/40 border border-[#dbc1b9]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#974226]/10 text-[#974226] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
          </div>
          <div>
            <h4
              className="text-[18px] font-semibold text-[#231a11]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Curator Advisory: Autumn Outerwear Drop Scheduled
            </h4>
            <p className="text-[14px] text-[#55433d] mt-0.5">
              Pre-registered buyers have increased by +34% this week. Ensure all garments are inspected, measurements documented, and authenticity certificates uploaded prior to Friday 18:00.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-full bg-white text-[#231a11] text-[13px] font-bold border border-[#dbc1b9] hover:bg-[#feeadc] transition-all">
            Review Guidelines
          </button>
          <button className="px-5 py-2.5 rounded-full bg-[#974226] text-white text-[13px] font-bold hover:bg-[#b65a3c] transition-all shadow-sm">
            Schedule Items
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[#dbc1b9]/20 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#655d52] gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>REWORE</span>
          <span>— Curated Circular Luxury Platform</span>
        </div>
        <div className="flex items-center gap-6">
          {["Seller Policies", "Fee Schedule", "Authenticity Standards", "Support Concierge"].map((l) => (
            <a key={l} href="#" className="hover:text-[#974226] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
