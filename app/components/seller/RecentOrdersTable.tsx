import Link from "next/link";

const orders = [
  {
    id: "1",
    item: "1970s Yves Saint Laurent Trench Coat",
    detail: "Size: 40 EU · Vintage A+",
    buyer: "Elena Rossi",
    buyerRole: "Verified Buyer",
    initials: "ER",
    amount: "₫8,500,000",
    status: "Paid",
    statusStyle: "paid",
    date: "2 hrs ago",
    action: "Fulfill",
  },
  {
    id: "2",
    item: "Vintage Celine Silk Scarf",
    detail: "90x90cm · Pure Silk",
    buyer: "Marcus Vance",
    buyerRole: "Verified Buyer",
    initials: "MV",
    amount: "₫3,200,000",
    status: "Shipped",
    statusStyle: "shipped",
    date: "Today, 11:30 AM",
    action: "Track",
  },
  {
    id: "3",
    item: "1990s Schott Perfecto Leather",
    detail: "Size: 42 US · Distressed Steerhide",
    buyer: "Chloe Dupont",
    buyerRole: "Pro Collector",
    initials: "CD",
    amount: "₫14,000,000",
    status: "Pending Payout",
    statusStyle: "pending",
    date: "Yesterday",
    action: "Manage",
  },
  {
    id: "4",
    item: "Maison Margiela Tabi Boots",
    detail: "Size: 38 IT · Original Box Included",
    buyer: "Julian Tran",
    buyerRole: "Verified Buyer",
    initials: "JT",
    amount: "₫9,800,000",
    status: "Paid",
    statusStyle: "paid",
    date: "Oct 22",
    action: "Fulfill",
  },
];

const statusBadge: Record<string, string> = {
  paid: "bg-[#dae9b5] text-[#556138]",
  shipped: "bg-[#ffdbd0] text-[#974226]",
  pending: "bg-[#ede1d2] text-[#6b6357]",
};

const statusDot: Record<string, string> = {
  paid: "bg-[#556138]",
  shipped: "bg-[#974226]",
  pending: "bg-[#655d52]",
};

export default function RecentOrdersTable() {
  return (
    <section className="bg-white rounded-2xl border border-[#dbc1b9]/30 shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-[#ede1d2]/60 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Recent Orders
          </h2>
          <p className="text-[12px] text-[#655d52] mt-0.5">
            Purchases and fulfillment updates from verified community members
          </p>
        </div>
        <Link
          href="/seller/orders"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#974226] hover:underline"
        >
          View All Orders
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#dbc1b9]/20 bg-[#fff1e8]/40">
              <th className="py-3 px-6 text-[11px] font-bold text-[#655d52] uppercase tracking-wider">Item Details</th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#655d52] uppercase tracking-wider">Buyer</th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#655d52] uppercase tracking-wider">Amount</th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#655d52] uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#655d52] uppercase tracking-wider">Date</th>
              <th className="py-3 px-6 text-right text-[11px] font-bold text-[#655d52] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dbc1b9]/20">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-[#fff1e8]/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg bg-[#f2dfd1] border border-[#dbc1b9]/40 flex items-center justify-center text-[#88726c]">
                      <span className="material-symbols-outlined text-[20px]">checkroom</span>
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#231a11] line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {o.item}
                      </div>
                      <span className="text-[12px] text-[#655d52]">{o.detail}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ede1d2] flex items-center justify-center font-bold text-xs text-[#6b6357]">
                      {o.initials}
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold text-[#231a11] block">{o.buyer}</span>
                      <span className="text-[11px] text-[#556138]">{o.buyerRole}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-[14px] font-semibold text-[#231a11] whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {o.amount}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[o.statusStyle]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.statusStyle]}`} />
                    {o.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[12px] text-[#655d52] whitespace-nowrap">{o.date}</td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <button className="px-3 py-1.5 text-[12px] font-semibold rounded-lg border border-[#dbc1b9]/60 text-[#231a11] hover:bg-[#feeadc] transition-all">
                    {o.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#fff1e8]/20 border-t border-[#ede1d2]/40 flex items-center justify-between">
        <span className="text-[12px] text-[#655d52]">Showing 4 of 28 recent orders this month</span>
        <div className="flex gap-2">
          <button className="p-1 rounded border border-[#dbc1b9]/40 text-[#655d52] hover:bg-[#feeadc]">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="p-1 rounded border border-[#dbc1b9]/40 text-[#655d52] hover:bg-[#feeadc]">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
