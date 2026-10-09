"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Tops");
  const [era, setEra] = useState("90s");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(`Sản phẩm "${name || 'Vintage Item'}" đã được đăng thành công vào Inventory!`);
      router.push("/seller/inventory");
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-2 text-[13px] text-[#88726c] mb-6">
        <Link href="/seller/inventory" className="hover:text-[#974226] font-medium">
          Inventory
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#231a11] font-semibold">New Listing</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[#f2dfd1] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ffdbd0] text-[#974226] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">add_circle</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>
              List New Vintage Item
            </h1>
            <p className="text-xs text-[#655d52]">Add an authenticated piece to your public inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
              Item Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1990s Yves Saint Laurent Trench Coat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
                Price (₫)
              </label>
              <input
                type="number"
                required
                placeholder="₫ 850,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
              >
                <option value="Tops">Tops & Shirts</option>
                <option value="Jackets">Jackets & Coats</option>
                <option value="Denim">Denim & Pants</option>
                <option value="Dresses">Dresses & Skirts</option>
                <option value="Accessories">Accessories & Bags</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
                Era
              </label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]"
              >
                <option value="70s">1970s</option>
                <option value="80s">1980s</option>
                <option value="90s">1990s</option>
                <option value="Y2K">Early 2000s (Y2K)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55433d] uppercase tracking-wider mb-2">
                Condition
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-sm focus:outline-none focus:border-[#974226]">
                <option>Mint / Like New</option>
                <option>Excellent Condition</option>
                <option>Very Good (Gentle wear)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f2dfd1]">
            <Link
              href="/seller/inventory"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#dbc1b9] text-[#55433d] hover:bg-[#feeadc]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitted}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#974226] text-white hover:bg-[#b65a3c] transition-all shadow-sm"
            >
              {submitted ? "Publishing…" : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
