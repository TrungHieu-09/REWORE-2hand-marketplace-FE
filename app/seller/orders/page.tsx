import RecentOrdersTable from "../../components/seller/RecentOrdersTable";

export default function SellerOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#f2dfd1]">
        <div>
          <h1 className="text-2xl font-bold text-[#231a11]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Orders &amp; Shipments
          </h1>
          <p className="text-xs text-[#655d52]">Fulfill customer purchases, print shipping labels, and track deliveries</p>
        </div>
      </div>
      <RecentOrdersTable />
    </div>
  );
}
