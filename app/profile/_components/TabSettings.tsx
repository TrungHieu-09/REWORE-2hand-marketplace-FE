"use client";

export default function TabSettings() {
  return (
    <div className="space-y-8 opacity-0 animate-fade-in-up">
      <div>
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#231a11] mb-1">
          Account Settings
        </h3>
        <p className="text-sm text-[#88726c]">
          Update your personal information and preferences.
        </p>
      </div>

      <div className="bg-white rounded-[20px] shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)] border border-[#f2dfd1] p-6 sm:p-8">
        <form className="space-y-6 max-w-xl">
          {/* Profile Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#231a11] border-b border-[#f2dfd1] pb-2">
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#55443d]">First Name</label>
                <input
                  type="text"
                  defaultValue="Elena"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#55443d]">Last Name</label>
                <input
                  type="text"
                  defaultValue="Rossi"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#55443d]">Email Address</label>
              <input
                type="email"
                defaultValue="elena.rossi@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4 pt-4">
            <h4 className="text-lg font-semibold text-[#231a11] border-b border-[#f2dfd1] pb-2">
              Preferences
            </h4>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-6 bg-[#b65a3c] rounded-full transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full translate-x-4 transition-transform" />
              </div>
              <span className="text-sm font-medium text-[#231a11] group-hover:text-[#974226] transition-colors">
                Receive auction outbid alerts via email
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-6 bg-[#dbc1b9] rounded-full transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
              </div>
              <span className="text-sm font-medium text-[#231a11] group-hover:text-[#974226] transition-colors">
                Receive marketing newsletters
              </span>
            </label>
          </div>

          <div className="pt-6">
            <button
              type="button"
              className="py-2.5 px-6 bg-[#b65a3c] text-white rounded-xl text-sm font-semibold shadow-md shadow-[#b65a3c]/30 hover:bg-[#974226] hover:-translate-y-0.5 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
