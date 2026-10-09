import Link from "next/link";

export default function SellerInventoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ffdbd0] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#974226]">inventory_2</span>
      </div>
      <h1 className="text-[28px] font-semibold text-[#231a11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Inventory
      </h1>
      <p className="text-[15px] text-[#55433d] mb-6">Manage your listings, drafts and archived items here.</p>
      <div className="flex items-center gap-3">
        <Link
          href="/seller/inventory/new"
          className="px-6 py-2.5 rounded-xl bg-[#974226] text-white text-sm font-semibold hover:bg-[#b65a3c] transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          List New Item
        </Link>
        <Link
          href="/seller/dashboard"
          className="px-6 py-2.5 rounded-xl border border-[#dbc1b9] text-[#231a11] text-sm font-semibold hover:bg-[#feeadc] transition-all"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
