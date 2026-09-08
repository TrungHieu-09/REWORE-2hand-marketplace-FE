import Link from "next/link";

const alerts = [
  {
    id: "1",
    title: "Vintage Chanel Quilted Flap Bag",
    urgency: "timer",
    urgencyText: "Auction ending in 42 mins",
    urgencyColor: "text-[#974226]",
    price: "₫28,500,000",
    meta: "14 bids placed · Reserve Met",
    action: "View Auction",
    actionHref: "/seller/auctions",
    actionIcon: "arrow_forward",
  },
  {
    id: "2",
    title: "Burberry Heritage Trench (Beige)",
    urgency: "production_quantity_limits",
    urgencyText: "Only 1 remaining in stock",
    urgencyColor: "text-[#ba1a1a]",
    badge: "High Demand",
    meta: "3 buyers have item in cart",
    action: "Restock / Edit",
    actionHref: "/seller/inventory",
    actionIcon: "edit",
  },
  {
    id: "3",
    title: "Prada 1999 Nylon Messenger",
    urgency: "schedule",
    urgencyText: "Hold expiring in 18 mins",
    urgencyColor: "text-[#55433d]",
    buyerTag: "Buyer: @marcus_v",
    meta: "Reserved for ₫4,500,000",
    action: "Contact Buyer",
    actionHref: "#",
    actionIcon: "chat",
  },
];

export default function UrgentAttentionCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#dbc1b9]/30 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#ffdad6] text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[18px]">emergency_home</span>
          </span>
          <h3 className="text-[18px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Urgent Attention
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a]">
          3 Action Items
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="p-3.5 rounded-xl bg-[#fff1e8]/60 border border-[#dbc1b9]/30 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-[13px] font-semibold text-[#231a11] line-clamp-1">{a.title}</h4>
                <p className={`text-[12px] font-semibold flex items-center gap-1 mt-0.5 ${a.urgencyColor}`}>
                  <span className="material-symbols-outlined text-[14px]">{a.urgency}</span>
                  {a.urgencyText}
                </p>
              </div>
              <div className="shrink-0 ml-2">
                {a.price && (
                  <span className="text-[13px] font-semibold text-[#231a11]">{a.price}</span>
                )}
                {a.badge && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#ede1d2] text-[#6b6357] font-semibold">
                    {a.badge}
                  </span>
                )}
                {a.buyerTag && (
                  <span className="text-[11px] font-semibold text-[#655d52]">{a.buyerTag}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-[12px] pt-1 text-[#655d52]">
              <span>{a.meta}</span>
              <Link
                href={a.actionHref}
                className="text-[#974226] font-semibold hover:underline flex items-center gap-0.5"
              >
                {a.action}
                <span className="material-symbols-outlined text-[12px]">{a.actionIcon}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
