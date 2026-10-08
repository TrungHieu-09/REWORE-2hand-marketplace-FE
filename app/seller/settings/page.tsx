"use client";

import Link from "next/link";

export default function SellerSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-2 text-[13px] text-[#88726c] mb-6">
        <Link href="/seller/dashboard" className="hover:text-[#974226] font-medium">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#231a11] font-semibold">Store Settings</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#231a11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Store Settings
        </h1>
        <p className="text-xs text-[#655d52] mb-6">Configure your shop profile, shipping presets, and bank payout details</p>

        <form onSubmit={(e) => { e.preventDefault(); alert("Cài đặt cửa hàng đã được lưu thành công! ✓"); }} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="Old Soul Studio"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
              Store Bio / Tagline
            </label>
            <textarea
              rows={3}
              defaultValue="Curated vintage denim and outerwear sourced directly from Tokyo and Paris."
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
              Default Shipping Method
            </label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]">
              <option>Express Courier (24h - 48h)</option>
              <option>Standard Economy (3 - 5 days)</option>
              <option>Local In-Person Pickup</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f2dfd1]">
            <Link
              href="/seller/dashboard"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#dbc1b9] text-[#55433d] hover:bg-[#feeadc]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#974226] text-white hover:bg-[#b65a3c] transition-all shadow-sm"
            >
              Save Store Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
