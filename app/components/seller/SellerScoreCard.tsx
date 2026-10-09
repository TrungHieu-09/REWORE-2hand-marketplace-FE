export default function SellerScoreCard() {
  const score = 78;
  const maxScore = 100;
  const circumference = 2 * Math.PI * 50; // r=50
  const offset = circumference - (score / maxScore) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#dbc1b9]/30 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Seller Score &amp; Perks
        </h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f8e5d6] text-[#974226] font-bold">
          Tier III
        </span>
      </div>

      {/* Circular Ring */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="transparent" stroke="#ede1d2" strokeWidth="8" strokeLinecap="round" />
            <circle
              cx="60" cy="60" r="50" fill="transparent"
              stroke="#974226" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[36px] font-bold text-[#231a11] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              {score}
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#974226] mt-1">
              SELLER SCORE
            </span>
            <span className="text-[9px] text-[#556138] font-semibold">VERIFIED PRO</span>
          </div>
        </div>
        <span className="text-[12px] text-[#655d52] mt-2">{score} / {maxScore} points earned</span>
      </div>

      {/* Tier Info */}
      <div className="bg-[#fff1e8] p-3.5 rounded-xl border border-[#ede1d2]/80 mb-4">
        <div className="flex items-center justify-between text-[12px] mb-1">
          <span className="text-[#231a11] font-semibold">Next Tier Perk</span>
          <span className="text-[#974226] font-bold">12 pts needed</span>
        </div>
        <p className="text-[13px] text-[#55433d] leading-relaxed">
          Unlocked: <span className="font-semibold text-[#231a11]">Live Auctions</span> (75 required) · 12 points to{" "}
          <span className="font-semibold text-[#974226]">Premier Drop Access</span> (90 required).
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-[#dbc1b9]/20">
        <div className="p-2">
          <span className="block text-[16px] font-bold text-[#556138]">0.0%</span>
          <span className="text-[11px] text-[#655d52]">Dispute Rate</span>
        </div>
        <div className="p-2 border-l border-[#dbc1b9]/20">
          <span className="block text-[16px] font-bold text-[#974226]">99.2%</span>
          <span className="text-[11px] text-[#655d52]">On-Time Dispatch</span>
        </div>
      </div>
    </div>
  );
}
