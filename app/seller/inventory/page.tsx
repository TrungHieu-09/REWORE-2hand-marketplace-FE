"use client";

import { useState } from "react";
import Link from "next/link";

type Item = { id: string; title: string; brand: string; category: string; size: string; condition: string; price: number; status: string; views: number; saves: number; daysListed: number; colorHint: string };

const ITEMS: Item[] = [
  { id: "1", title: "1970s Levis Sherpa Trucker Jacket", brand: "Levis", category: "Outerwear", size: "M / EU 48", condition: "Vintage A+", price: 8500000, status: "active", views: 214, saves: 31, daysListed: 12, colorHint: "#c4a882" },
  { id: "2", title: "Vintage Chanel 2.55 Flap Bag Black Caviar", brand: "Chanel", category: "Bags", size: "One Size", condition: "Excellent", price: 28500000, status: "active", views: 541, saves: 87, daysListed: 5, colorHint: "#2b2118" },
  { id: "3", title: "Maison Margiela Tabi Derby Shoes", brand: "Maison Margiela", category: "Footwear", size: "IT 40", condition: "Good", price: 9800000, status: "active", views: 128, saves: 19, daysListed: 20, colorHint: "#7a6352" },
  { id: "4", title: "1990s Helmut Lang Archive Blazer", brand: "Helmut Lang", category: "Tops", size: "42 US", condition: "Distressed Authentic", price: 14000000, status: "active", views: 372, saves: 45, daysListed: 8, colorHint: "#4a4540" },
  { id: "5", title: "Burberry Heritage Nova Check Trench", brand: "Burberry", category: "Outerwear", size: "L / EU 50", condition: "Very Good", price: 18900000, status: "active", views: 89, saves: 12, daysListed: 3, colorHint: "#c9aa7c" },
  { id: "6", title: "Prada 1999 Nylon Backpack Tessuto", brand: "Prada", category: "Bags", size: "One Size", condition: "Good", price: 4500000, status: "reserved", views: 203, saves: 38, daysListed: 14, colorHint: "#1a2a1a" },
  { id: "7", title: "Issey Miyake Pleats Please Wide Trousers", brand: "Issey Miyake", category: "Bottoms", size: "3 / L", condition: "Excellent", price: 6200000, status: "draft", views: 0, saves: 0, daysListed: 0, colorHint: "#8fa8b8" },
  { id: "8", title: "Y-3 Adidas Qasa High Sneakers", brand: "Y-3", category: "Footwear", size: "EU 43", condition: "Very Good", price: 7800000, status: "draft", views: 0, saves: 0, daysListed: 0, colorHint: "#e8e0d4" },
  { id: "9", title: "Comme des Garcons Play Heart Tee", brand: "Comme des Garcons", category: "Tops", size: "M", condition: "Good", price: 2800000, status: "archived", views: 56, saves: 8, daysListed: 45, colorHint: "#d4c4bc" },
];

const CATEGORIES = ["All", "Outerwear", "Tops", "Bottoms", "Bags", "Footwear", "Accessories"];
const STATUS_FILTERS = ["all", "active", "draft", "reserved", "archived"];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active:   { label: "Active",   bg: "bg-[#dae9b5]/60", text: "text-[#3f4b25]", dot: "bg-[#556138]" },
  draft:    { label: "Draft",    bg: "bg-[#f2dfd1]/70", text: "text-[#55433d]", dot: "bg-[#88726c]" },
  reserved: { label: "Reserved", bg: "bg-[#ffdbd0]/60", text: "text-[#7b2e14]", dot: "bg-[#974226]" },
  archived: { label: "Archived", bg: "bg-[#ede1d2]/50", text: "text-[#655d52]", dot: "bg-[#dbc1b9]" },
};

function fmt(n: number) { return '₫' + n.toLocaleString('vi-VN'); }

function Thumb({ color, title }: { color: string; title: string }) {
  const initials = title.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color }}>
      <span className="text-[22px] font-bold opacity-30 select-none text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{initials}</span>
    </div>
  );
}

export default function SellerInventoryPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const counts = {
    active:   ITEMS.filter(i => i.status === "active").length,
    draft:    ITEMS.filter(i => i.status === "draft").length,
    reserved: ITEMS.filter(i => i.status === "reserved").length,
    archived: ITEMS.filter(i => i.status === "archived").length,
  };
  const totalValue = ITEMS.filter(i => i.status === "active" || i.status === "reserved").reduce((s, i) => s + i.price, 0);

  const filtered = ITEMS.filter(item => {
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    const matchCat    = categoryFilter === "All" || item.category === categoryFilter;
    const matchSearch = search === "" || item.title.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "newest")     return a.daysListed - b.daysListed;
    if (sortBy === "oldest")     return b.daysListed - a.daysListed;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "price-low")  return a.price - b.price;
    if (sortBy === "views")      return b.views - a.views;
    return 0;
  });

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:items-start justify-between pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#974226] uppercase tracking-widest">Inventory Management</span>
            <span className="text-[#dbc1b9]">&bull;</span>
            <span className="text-[12px] text-[#655d52]">Old Soul Studio</span>
          </div>
          <h1 className="text-[32px] font-semibold text-[#231a11] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Listings
          </h1>
          <p className="text-[15px] text-[#55433d] mt-0.5">Manage active listings, drafts, reservations and archived pieces.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/seller/inventory/new" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#974226] hover:bg-[#b65a3c] text-white text-[13px] font-bold shadow-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>+ New Listing
          </Link>
        </div>
      </section>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Listings", value: String(counts.active),   icon: "storefront", accent: "#556138", bg: "#dae9b5", suffix: "items" },
          { label: "In Draft",        value: String(counts.draft),    icon: "draft",      accent: "#88726c", bg: "#f2dfd1", suffix: "unpublished" },
          { label: "Reserved",        value: String(counts.reserved), icon: "lock",       accent: "#974226", bg: "#ffdbd0", suffix: "on hold" },
          { label: "Active Value",    value: fmt(totalValue),         icon: "payments",   accent: "#231a11", bg: "#f2dfd1", suffix: "estimated" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white border border-[#dbc1b9]/30 p-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(35,26,17,0.06)] hover:shadow-[0_4px_20px_rgba(35,26,17,0.10)] transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#88726c] uppercase tracking-widest">{s.label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <span className="material-symbols-outlined text-[17px]" style={{ color: s.accent }}>{s.icon}</span>
              </div>
            </div>
            <div>
              <div className="text-[26px] font-semibold text-[#231a11] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div className="text-[12px] text-[#88726c] mt-1">{s.suffix}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Panel ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 shadow-[0_2px_12px_rgba(35,26,17,0.05)] p-4 mb-6 flex flex-col gap-4">
        {/* Search + Sort + View */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#88726c] text-[18px]">search</span>
            <input id="inventory-search" type="text" placeholder="Search by title or brand..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#dbc1b9] bg-[#fff8f5] text-[14px] text-[#231a11] placeholder-[#88726c] focus:outline-none focus:border-[#231a11] transition-colors" />
          </div>
          <div className="relative">
            <select id="inventory-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-full border border-[#dbc1b9] bg-[#fff8f5] text-[14px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-colors cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="views">Most Viewed</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#88726c] text-[16px] pointer-events-none">expand_more</span>
          </div>
          <div className="flex rounded-full border border-[#dbc1b9] overflow-hidden shrink-0">
            {(["grid", "list"] as const).map(v => (
              <button key={v} id={"view-toggle-" + v} onClick={() => setView(v)}
                className={"flex items-center justify-center w-10 h-10 transition-colors " + (view === v ? "bg-[#231a11] text-white" : "bg-[#fff8f5] text-[#88726c] hover:bg-[#f2dfd1]")}>
                <span className="material-symbols-outlined text-[18px]">{v === "grid" ? "grid_view" : "view_list"}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Status tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => {
            const cnt = s === "all" ? ITEMS.length : ITEMS.filter(i => i.status === s).length;
            return (
              <button key={s} id={"status-tab-" + s} onClick={() => setStatusFilter(s)}
                className={"flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all " + (statusFilter === s ? "bg-[#231a11] text-white shadow-sm" : "bg-[#f2dfd1]/50 text-[#55433d] hover:bg-[#feeadc]")}>
                {s === "all" ? "All" : STATUS_CONFIG[s].label}
                <span className={"text-[11px] px-1.5 py-0.5 rounded-full font-bold " + (statusFilter === s ? "bg-white/20 text-white" : "bg-[#dbc1b9]/40 text-[#655d52]")}>{cnt}</span>
              </button>
            );
          })}
        </div>
        {/* Category chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} id={"cat-chip-" + cat.toLowerCase()} onClick={() => setCategoryFilter(cat)}
              className={"px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide transition-all " + (categoryFilter === cat ? "bg-[#974226] text-white" : "bg-[#feeadc]/60 text-[#974226] border border-[#dbc1b9]/40 hover:bg-[#feeadc]")}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results Meta ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-[#655d52]">Showing <span className="font-semibold text-[#231a11]">{filtered.length}</span> of <span className="font-semibold text-[#231a11]">{ITEMS.length}</span> listings</p>
        {(statusFilter !== "all" || categoryFilter !== "All" || search !== "") && (
          <button onClick={() => { setStatusFilter("all"); setCategoryFilter("All"); setSearch(""); }} className="text-[12px] text-[#974226] hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">close</span>Clear filters
          </button>
        )}
      </div>

      {/* ── Items ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#ffdbd0] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[28px] text-[#974226]">inventory_2</span>
          </div>
          <p className="text-[16px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>No listings found</p>
          <p className="text-[13px] text-[#88726c] mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => <InventoryCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(item => <InventoryListRow key={item.id} item={item} />)}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="mt-12 pt-6 border-t border-[#dbc1b9]/20 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#655d52] gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>REWORE</span>
          <span>&mdash; Curated Circular Luxury Platform</span>
        </div>
        <div className="flex items-center gap-6">
          {["Seller Policies", "Fee Schedule", "Authenticity Standards", "Support Concierge"].map(l => (
            <a key={l} href="#" className="hover:text-[#974226] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}

function InventoryCard({ item }: { item: Item }) {
  const st = STATUS_CONFIG[item.status];
  return (
    <div id={"item-card-" + item.id} className="group bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_2px_12px_rgba(35,26,17,0.06)] hover:shadow-[0_6px_28px_rgba(35,26,17,0.12)] transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f2dfd1]">
        <Thumb color={item.colorHint} title={item.title} />
        <span className={"absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm " + st.bg + " " + st.text}>
          <span className={"w-1.5 h-1.5 rounded-full " + st.dot} />{st.label}
        </span>
        <div className="absolute inset-0 bg-[#231a11]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <button id={"edit-" + item.id} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#231a11] flex items-center justify-center shadow-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button id={"preview-" + item.id} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#231a11] flex items-center justify-center shadow-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </button>
          <button id={"more-" + item.id} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#231a11] flex items-center justify-center shadow-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <span className="text-[10px] font-bold text-[#974226] uppercase tracking-widest">{item.brand}</span>
          <h3 className="text-[15px] font-semibold text-[#231a11] leading-snug mt-0.5 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-[#f2dfd1]/60 text-[11px] text-[#55433d] font-medium">{item.size}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#f2dfd1]/60 text-[11px] text-[#55433d] font-medium">{item.condition}</span>
        </div>
        <div className="mt-auto pt-2 border-t border-[#dbc1b9]/20 flex items-center justify-between">
          <span className="text-[17px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>{fmt(item.price)}</span>
          {item.status !== "draft" && (
            <div className="flex items-center gap-3 text-[11px] text-[#88726c]">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">visibility</span>{item.views}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">favorite</span>{item.saves}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InventoryListRow({ item }: { item: Item }) {
  const st = STATUS_CONFIG[item.status];
  return (
    <div id={"item-row-" + item.id} className="group bg-white rounded-2xl border border-[#dbc1b9]/30 shadow-[0_2px_8px_rgba(35,26,17,0.05)] hover:shadow-[0_4px_16px_rgba(35,26,17,0.10)] transition-all p-4 flex items-center gap-4">
      <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-[#f2dfd1]">
        <Thumb color={item.colorHint} title={item.title} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold text-[#974226] uppercase tracking-widest">{item.brand}</span>
          <span className="text-[#dbc1b9]">&middot;</span>
          <span className="text-[11px] text-[#88726c]">{item.category}</span>
        </div>
        <h3 className="text-[15px] font-semibold text-[#231a11] truncate" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-[#f2dfd1]/60 text-[11px] text-[#55433d]">{item.size}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#f2dfd1]/60 text-[11px] text-[#55433d]">{item.condition}</span>
        </div>
      </div>
      {item.status !== "draft" && (
        <div className="hidden md:flex items-center gap-6 text-[12px] text-[#88726c] shrink-0">
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">visibility</span>{item.views} views</span>
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">favorite</span>{item.saves} saves</span>
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">calendar_today</span>{item.daysListed}d ago</span>
        </div>
      )}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={"flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold " + st.bg + " " + st.text}>
          <span className={"w-1.5 h-1.5 rounded-full " + st.dot} />{st.label}
        </span>
        <span className="text-[16px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>{fmt(item.price)}</span>
      </div>
      <div className="hidden group-hover:flex items-center gap-2 shrink-0 ml-2">
        <button id={"row-edit-" + item.id} className="w-9 h-9 rounded-full border border-[#dbc1b9] text-[#55443d] hover:bg-[#feeadc] flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
        <button id={"row-more-" + item.id} className="w-9 h-9 rounded-full border border-[#dbc1b9] text-[#55443d] hover:bg-[#feeadc] flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[16px]">more_vert</span>
        </button>
      </div>
    </div>
  );
}