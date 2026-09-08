"use client";

export default function SellerTopBar() {
  return (
    <header className="sticky top-0 z-40 bg-[#fff8f5] border-b border-[#dbc1b9]/30 flex justify-between items-center h-16 px-6">
      {/* Left: Search */}
      <div className="relative w-96">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#88726c] text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search orders, listings, buyers..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#dbc1b9]/50 text-[14px] placeholder:text-[#88726c] text-[#231a11] focus:outline-none focus:ring-1 focus:ring-[#231a11] focus:border-[#231a11] transition-all shadow-sm"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-full hover:bg-[#f2dfd1]/50 transition-all text-[#55433d] hover:text-[#231a11]"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#974226]" />
        </button>

        {/* Messages */}
        <button
          className="relative p-2.5 rounded-full hover:bg-[#f2dfd1]/50 transition-all text-[#55433d] hover:text-[#231a11]"
          title="Messages"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span className="absolute -top-0.5 -right-0.5 bg-[#974226] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="h-6 w-px bg-[#dbc1b9]/40 mx-1" />

        {/* Account */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-[#f2dfd1]/50 transition-all">
          <div className="w-8 h-8 rounded-full bg-[#ffdbd0] border border-[#dbc1b9] flex items-center justify-center text-[#974226] font-bold text-xs">
            OS
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[13px] font-bold text-[#231a11] leading-tight">My Store</span>
            <span className="block text-[11px] text-[#88726c] leading-tight">Consignment Pro</span>
          </div>
          <span className="material-symbols-outlined text-[#88726c] text-[18px]">expand_more</span>
        </button>
      </div>
    </header>
  );
}
