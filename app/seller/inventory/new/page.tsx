"use client";

import { useState } from "react";
import Link from "next/link";

const BRANDS = ["Hermès", "YSL", "Chanel", "Prada", "Ralph Lauren", "Gucci", "Dior", "Balenciaga", "Valentino", "Burberry"];
const CATEGORIES = ["Outerwear", "Knitwear", "Dresses & Skirts", "Silk Scarves", "Leather Goods", "Footwear", "Denim", "Tops & Blouses", "Trousers", "Accessories"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "Custom / Vintage Fit"];
const CONDITIONS = [
  { value: "pristine", label: "Pristine / New with Tags" },
  { value: "excellent", label: "Excellent (Gently used, flawless)" },
  { value: "good", label: "Good (Minor vintage patina)" },
  { value: "fair", label: "Fair (Noticeable vintage wear)" },
];

export default function NewListingPage() {
  const [title, setTitle] = useState("1980s Saint Laurent Wool Gabardine Double-Breasted Trench Coat");
  const [brand, setBrand] = useState("Yves Saint Laurent");
  const [category, setCategory] = useState("Outerwear");
  const [condition, setCondition] = useState("excellent");
  const [selectedSize, setSelectedSize] = useState("M");
  const [notes, setNotes] = useState("Sourced from a private Paris archive, this late 1980s Saint Laurent Rive Gauche trench features a pristine heavyweight wool gabardine in warm camel tone. Features deep storm flaps, horn buttons, original waist belt with leather buckle, and clean viscose lining.");
  const [price, setPrice] = useState("18500000");
  const [listingFormat, setListingFormat] = useState<"fixed" | "auction">("fixed");
  const [startingBid, setStartingBid] = useState("9500000");
  const [reservePrice, setReservePrice] = useState("16000000");
  const [auctionDuration, setAuctionDuration] = useState("3days");
  const [scheduleLaunch, setScheduleLaunch] = useState("instant");
  const [uploadedCount] = useState(3);

  const numericPrice = Number(price.replace(/[^0-9]/g, "")) || 0;
  const fee = Math.round(numericPrice * 0.08);
  const payout = numericPrice - fee;
  const notesLen = notes.length;

  function fmtPrice(n: number) {
    return n.toLocaleString("vi-VN");
  }

  return (
    <>
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-5 border-b border-[#dbc1b9]/30 mb-8">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#655d52] mb-2">
            <Link href="/seller/dashboard" className="hover:text-[#974226] transition-colors">Store Overview</Link>
            <span className="material-symbols-outlined text-[14px] text-[#88726c]">chevron_right</span>
            <Link href="/seller/inventory" className="hover:text-[#974226] transition-colors">My Listings</Link>
            <span className="material-symbols-outlined text-[14px] text-[#88726c]">chevron_right</span>
            <span className="text-[#974226] font-semibold">Create New Listing</span>
          </div>
          <span className="text-[11px] font-bold text-[#974226] uppercase tracking-widest block mb-1">Archival Cataloging</span>
          <h1 className="text-[32px] font-semibold text-[#231a11] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create New Listing
          </h1>
          <p className="text-[15px] text-[#55433d] mt-0.5">Fill in the details below to curate and list your piece in the marketplace catalog.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-[12px] text-[#655d52] bg-[#f8e5d6]/60 px-3 py-1.5 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[16px] text-[#556138]">verified</span>
          <span>Verified Secondhand Standards Apply</span>
        </div>
      </div>

      {/* ── Two-Column Form ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT COL: Photography (5 cols) ──────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 shadow-[0_2px_12px_rgba(35,26,17,0.06)] p-6 space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>Item Photography</h2>
                <span className="text-[12px] font-bold text-[#974226] bg-[#ffdbd0]/60 px-2 py-0.5 rounded">{uploadedCount} / 6 Uploaded</span>
              </div>
              <p className="text-[12px] text-[#655d52] mt-1">Upload up to 6 high-resolution photos. First photo will be the cover image.</p>
            </div>

            {/* Primary Cover Slot */}
            <div className="relative group rounded-xl overflow-hidden border-2 border-[#974226]/40 bg-[#feeadc]/30 transition-all cursor-pointer">
              <div className="aspect-[3/4] w-full relative bg-gradient-to-br from-[#c4a882] via-[#a08060] to-[#7a6040] flex items-end">
                {/* simulated coat image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-48 bg-[#b89060]/80 rounded-lg shadow-lg relative">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#8a6840] rounded" />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-[#8a6840]" />
                    {[0,1,2,3].map(i => <div key={i} className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#6a4820] shadow" style={{ top: (60 + i*28) + "px" }} />)}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#231a11]/60 via-transparent to-[#000]/20" />
                {/* Cover badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#974226] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  Primary Cover
                </div>
                {/* Overlay controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button id="cover-crop" className="w-8 h-8 rounded-full bg-white/90 text-[#231a11] flex items-center justify-center hover:bg-white shadow">
                    <span className="material-symbols-outlined text-[16px]">crop</span>
                  </button>
                  <button id="cover-delete" className="w-8 h-8 rounded-full bg-white/90 text-[#ba1a1a] flex items-center justify-center hover:bg-white shadow">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
                {/* File info */}
                <div className="absolute bottom-3 left-3 right-3 text-white text-[12px]">
                  <p className="font-semibold">Main_Front_Facing.jpg</p>
                  <p className="text-white/80 text-[11px]">3.4 MB · Aspect 3:4</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Uploaded thumb 2 */}
              <div className="relative group rounded-lg overflow-hidden border border-[#dbc1b9]/40 aspect-square bg-gradient-to-br from-[#d4c0a0] to-[#b8a080] cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-6 bg-[#f5f0e8] rounded mx-auto flex items-center justify-center">
                      <div className="text-[7px] font-bold text-[#4a3820] leading-tight text-center">PARIS<br/>MADE IN<br/>FRANCE</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#231a11]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button className="w-7 h-7 rounded-full bg-white text-[#ba1a1a] flex items-center justify-center shadow"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                  <button className="w-7 h-7 rounded-full bg-white text-[#231a11] flex items-center justify-center shadow"><span className="material-symbols-outlined text-[14px]">drag_indicator</span></button>
                </div>
                <span className="absolute bottom-1 left-1.5 text-[10px] text-[#231a11] bg-white/90 px-1 rounded font-medium">Tag #2</span>
              </div>
              {/* Uploaded thumb 3 */}
              <div className="relative group rounded-lg overflow-hidden border border-[#dbc1b9]/40 aspect-square bg-gradient-to-br from-[#c8b898] to-[#a89878] cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-10 h-10 opacity-50">
                    {Array.from({length:16}).map((_,i) => <div key={i} className="bg-[#8a7050] rounded-[1px]" />)}
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#231a11]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button className="w-7 h-7 rounded-full bg-white text-[#ba1a1a] flex items-center justify-center shadow"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                  <button className="w-7 h-7 rounded-full bg-white text-[#231a11] flex items-center justify-center shadow"><span className="material-symbols-outlined text-[14px]">drag_indicator</span></button>
                </div>
                <span className="absolute bottom-1 left-1.5 text-[10px] text-[#231a11] bg-white/90 px-1 rounded font-medium">Fabric #3</span>
              </div>
              {/* Upload slot — highlighted */}
              <button id="add-photo-1" className="aspect-square rounded-lg border-2 border-dashed border-[#974226]/50 hover:border-[#974226] bg-[#ffdbd0]/20 hover:bg-[#ffdbd0]/40 flex flex-col items-center justify-center p-2 text-center transition-all group">
                <span className="material-symbols-outlined text-[#974226] group-hover:scale-110 transition-transform text-[22px]">add_a_photo</span>
                <span className="text-[11px] text-[#974226] font-semibold mt-1">+ Add Photo</span>
              </button>
              {/* Upload slot — back view */}
              <button id="add-photo-back" className="aspect-square rounded-lg border-2 border-dashed border-[#dbc1b9]/80 hover:border-[#974226]/60 bg-[#fff8f5] hover:bg-[#ffdbd0]/10 flex flex-col items-center justify-center p-2 text-center transition-all group">
                <span className="material-symbols-outlined text-[#88726c] group-hover:text-[#974226] transition-colors text-[20px]">add</span>
                <span className="text-[11px] text-[#655d52] mt-1">Back View</span>
              </button>
              {/* Upload slot — wear detail */}
              <button id="add-photo-detail" className="aspect-square rounded-lg border-2 border-dashed border-[#dbc1b9]/80 hover:border-[#974226]/60 bg-[#fff8f5] hover:bg-[#ffdbd0]/10 flex flex-col items-center justify-center p-2 text-center transition-all group">
                <span className="material-symbols-outlined text-[#88726c] group-hover:text-[#974226] transition-colors text-[20px]">add</span>
                <span className="text-[11px] text-[#655d52] mt-1">Wear Detail</span>
              </button>
            </div>

            {/* Reorder hint */}
            <div className="flex items-center justify-between text-[12px] text-[#655d52] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#88726c] text-[16px]">drag_handle</span>
                <span>Drag to reorder photos</span>
              </div>
              <span className="text-[#88726c]">Max 15MB each</span>
            </div>

            {/* Curator tip */}
            <div className="p-4 rounded-xl bg-[#ede1d2]/40 border border-[#dbc1b9]/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#556138] text-[20px] mt-0.5">auto_awesome</span>
              <div>
                <p className="text-[13px] font-bold text-[#231a11]">Curator's Authentication Tip</p>
                <p className="text-[12px] text-[#655d52] mt-0.5 leading-relaxed">Showcase garment tags, fabric composition, serial codes, and any gentle vintage wear to ensure authentic buyer trust.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COL: Details + Pricing (7 cols) ───────────────────────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── Card 1: Item Details ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 shadow-[0_2px_12px_rgba(35,26,17,0.06)] p-6 space-y-6">
            <div className="border-b border-[#dbc1b9]/20 pb-3">
              <h2 className="text-[20px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>Item Details &amp; Attributes</h2>
              <p className="text-[12px] text-[#655d52] mt-0.5">Categorize your archival piece accurately for vintage collectors.</p>
            </div>

            {/* Item Title */}
            <div className="space-y-1.5">
              <label htmlFor="item-title" className="block text-[14px] font-semibold text-[#231a11]">
                Item Title <span className="text-[#974226]">*</span>
              </label>
              <input id="item-title" type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] focus:ring-1 focus:ring-[#231a11]/20 transition-all" />
              <p className="text-[12px] text-[#655d52]">Use era, designer, fabric, and silhouette for optimal discoverability.</p>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label htmlFor="item-brand" className="block text-[14px] font-semibold text-[#231a11]">
                Brand / Maison <span className="text-[#974226]">*</span>
              </label>
              <div className="relative">
                <input id="item-brand" type="text" value={brand} onChange={e => setBrand(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] focus:ring-1 focus:ring-[#231a11]/20 transition-all" />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#88726c] text-[18px]">search</span>
              </div>
              {/* Brand pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[12px] text-[#655d52]">Frequent Maisons:</span>
                {BRANDS.slice(0, 5).map(b => (
                  <button key={b} type="button" onClick={() => setBrand(b)}
                    className={"text-[12px] px-2.5 py-1 rounded-full transition-colors font-semibold " + (brand === b ? "bg-[#974226]/10 text-[#974226] border border-[#974226]/30" : "bg-[#ede1d2]/60 hover:bg-[#ede1d2] text-[#6b6357]")}>
                    {b === "YSL" || b === "Yves Saint Laurent" ? "YSL" : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Category + Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="item-category" className="block text-[14px] font-semibold text-[#231a11]">Category <span className="text-[#974226]">*</span></label>
                <select id="item-category" value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-all cursor-pointer">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="item-condition" className="block text-[14px] font-semibold text-[#231a11]">Condition Grade <span className="text-[#974226]">*</span></label>
                <select id="item-condition" value={condition} onChange={e => setCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-all cursor-pointer">
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Sizing pills */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-[#231a11]">Garment Sizing <span className="text-[#974226]">*</span></label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} id={"size-" + s.replace(/s/g,"-")} type="button" onClick={() => setSelectedSize(s)}
                    className={"px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all " + (selectedSize === s ? "bg-[#974226] text-white shadow-sm" : "border border-[#dbc1b9]/60 text-[#655d52] hover:border-[#231a11]")}>
                    {s === selectedSize ? s + " (Selected)" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Curator notes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="item-notes" className="block text-[14px] font-semibold text-[#231a11]">Curator's Notes &amp; Provenance <span className="text-[#974226]">*</span></label>
                <span className={"text-[12px] " + (notesLen > 900 ? "text-[#ba1a1a]" : "text-[#655d52]")}>{notesLen} / 1000 chars</span>
              </div>
              <textarea id="item-notes" rows={5} value={notes} onChange={e => { if (e.target.value.length <= 1000) setNotes(e.target.value); }}
                className="w-full px-4 py-3 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[15px] text-[#231a11] leading-relaxed focus:outline-none focus:border-[#231a11] focus:ring-1 focus:ring-[#231a11]/20 transition-all resize-none" />
              <p className="text-[12px] text-[#655d52]">Detail the silhouette, fabric weight, archival era, fit notes, and provenance... (minimum 50 characters)</p>
            </div>
          </div>

          {/* ── Card 2: Pricing & Format ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#dbc1b9]/30 shadow-[0_2px_12px_rgba(35,26,17,0.06)] p-6 space-y-6">
            <div className="border-b border-[#dbc1b9]/20 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>Pricing &amp; Listing Format</h2>
                <p className="text-[12px] text-[#655d52] mt-0.5">Select your listing channel and set commerce terms.</p>
              </div>
              {/* Format toggle */}
              <div className="flex items-center gap-1 bg-[#feeadc] p-1 rounded-xl">
                <button id="format-fixed" type="button" onClick={() => setListingFormat("fixed")}
                  className={"px-3 py-1.5 text-[13px] font-semibold rounded-lg transition-all " + (listingFormat === "fixed" ? "bg-white text-[#231a11] shadow-sm" : "text-[#655d52] hover:text-[#231a11]")}>
                  Fixed Price
                </button>
                <button id="format-auction" type="button" onClick={() => setListingFormat("auction")}
                  className={"px-3 py-1.5 text-[13px] font-semibold rounded-lg transition-all " + (listingFormat === "auction" ? "bg-white text-[#231a11] shadow-sm" : "text-[#655d52] hover:text-[#231a11]")}>
                  Auction Format
                </button>
              </div>
            </div>

            {/* Price + Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="item-price" className="block text-[14px] font-semibold text-[#231a11]">Listing Price (₫ VND) <span className="text-[#974226]">*</span></label>
                <div className="relative">
                  <input id="item-price" type="text" value={fmtPrice(numericPrice)} onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full pl-4 pr-16 py-3 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[22px] font-bold text-[#231a11] focus:outline-none focus:border-[#231a11] focus:ring-1 focus:ring-[#231a11]/20 transition-all" style={{ fontFamily: "'Playfair Display', serif" }} />
                  <span className="absolute right-3 top-3.5 text-[13px] font-semibold text-[#655d52]">₫ VND</span>
                </div>
                <p className="text-[12px] text-[#655d52]">
                  Platform fee: 8% · You receive: <strong className="text-[#974226] font-bold">₫{fmtPrice(payout)}</strong>
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[14px] font-semibold text-[#231a11]">Quantity Available</label>
                <div className="relative flex items-center">
                  <input type="text" readOnly value="1 (Unique Vintage Piece)"
                    className="w-full px-4 pr-10 py-3 rounded-xl border border-[#dbc1b9] bg-[#ede1d2]/30 text-[15px] text-[#231a11] cursor-not-allowed" />
                  <span className="material-symbols-outlined absolute right-3 text-[#88726c] text-[18px]">lock</span>
                </div>
                <p className="text-[12px] text-[#655d52]">Vintage one-of-a-kind items are serialized to single units.</p>
              </div>
            </div>

            {/* Auction sub-card */}
            <div className={"rounded-xl border transition-all " + (listingFormat === "auction" ? "bg-[#fff1e8] border-[#974226]/30" : "bg-[#f2dfd1]/30 border-[#dbc1b9]/30 opacity-60")}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#974226] text-[20px]">gavel</span>
                    <h3 className="text-[14px] font-bold text-[#231a11]">Auction Format Options</h3>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#974226]/15 text-[#974226] font-bold">Enabled for Drop Week</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="auction-bid" className="block text-[12px] font-semibold text-[#231a11]">Starting Bid (₫ VND)</label>
                    <input id="auction-bid" type="text" value={fmtPrice(Number(startingBid))} onChange={e => setStartingBid(e.target.value.replace(/[^0-9]/g,""))}
                      disabled={listingFormat !== "auction"}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dbc1b9] bg-white text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-all disabled:bg-[#f2dfd1]/30 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="auction-reserve" className="block text-[12px] font-semibold text-[#231a11]">Reserve Price (Optional threshold)</label>
                    <input id="auction-reserve" type="text" value={fmtPrice(Number(reservePrice))} onChange={e => setReservePrice(e.target.value.replace(/[^0-9]/g,""))}
                      disabled={listingFormat !== "auction"}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dbc1b9] bg-white text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-all disabled:bg-[#f2dfd1]/30 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="auction-duration" className="block text-[12px] font-semibold text-[#231a11]">Auction Duration</label>
                    <select id="auction-duration" value={auctionDuration} onChange={e => setAuctionDuration(e.target.value)}
                      disabled={listingFormat !== "auction"}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dbc1b9] bg-white text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-all cursor-pointer disabled:bg-[#f2dfd1]/30 disabled:cursor-not-allowed">
                      <option value="24h">24 Hours</option>
                      <option value="3days">3 Days</option>
                      <option value="5days">5 Days</option>
                      <option value="7days">7 Days</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="auction-schedule" className="block text-[12px] font-semibold text-[#231a11]">Schedule Launch</label>
                    <select id="auction-schedule" value={scheduleLaunch} onChange={e => setScheduleLaunch(e.target.value)}
                      disabled={listingFormat !== "auction"}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dbc1b9] bg-white text-[15px] text-[#231a11] focus:outline-none focus:border-[#231a11] transition-all cursor-pointer disabled:bg-[#f2dfd1]/30 disabled:cursor-not-allowed">
                      <option value="instant">Instant Upon Approval</option>
                      <option value="friday">Scheduled Drop: Friday 8:00 PM</option>
                      <option value="monthly">Save for Monthly Curated Drop</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Footer ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 right-0 left-64 bg-white/95 backdrop-blur-md border-t border-[#dbc1b9]/30 py-3.5 px-8 z-40 shadow-lg">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] text-[#655d52]">
            <span className="w-2 h-2 rounded-full bg-[#556138]" />
            <span>Draft auto-saved 2 mins ago</span>
            <span className="text-[#88726c]">·</span>
            <span className="text-[#88726c]">All revisions preserved</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button id="btn-preview" type="button"
              className="px-4 py-2.5 rounded-full border border-[#88726c] text-[#231a11] hover:bg-[#f2dfd1]/50 text-[13px] font-semibold transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#974226] text-[16px]">visibility</span>
              Preview
            </button>
            <button id="btn-save-draft" type="button"
              className="px-5 py-2.5 rounded-full border border-[#974226] text-[#974226] hover:bg-[#feeadc] text-[13px] font-bold transition-all">
              Save as Draft
            </button>
            <button id="btn-publish" type="button"
              className="px-6 py-2.5 rounded-full bg-[#974226] hover:bg-[#b65a3c] text-white text-[13px] font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <span>Publish Listing</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      {/* Bottom spacing to prevent content being hidden behind sticky footer */}
      <div className="h-20" />
    </>
  );
}