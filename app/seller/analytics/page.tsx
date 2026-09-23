"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ApiError,
  ordersApi,
  productsApi,
  type Order,
  type Product,
} from "@/app/lib/api";

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  color?: string;
};

function StatCard({ icon, label, value, sub, color = "#974226" }: StatCardProps) {
  return (
    <div className="bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] p-6 flex flex-col gap-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ color, fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#88726c] mb-1">{label}</p>
        <p className="text-[26px] font-bold text-[#231a11] leading-tight">{value}</p>
        {sub && <p className="text-[12px] text-[#88726c] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

type MiniBarProps = { label: string; value: number; max: number; color?: string };
function MiniBar({ label, value, max, color = "#974226" }: MiniBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-[#55433d] w-32 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-[#f2dfd1] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[12px] font-semibold text-[#231a11] w-8 text-right">{value}</span>
    </div>
  );
}

export default function SellerAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSeller = user?.role === "SELLER";

  useEffect(() => {
    if (user && !isSeller && user.role !== "ADMIN") {
      router.replace("/seller/dashboard");
    }
  }, [user, isSeller, router]);

  useEffect(() => {
    if (!user?.id || (!isSeller && user.role !== "ADMIN")) return;

    Promise.allSettled([
      ordersApi.list({ role: "seller", limit: 200 }),
      productsApi.list({ sellerId: user.id, limit: 200 }),
    ]).then(([orderRes, productRes]) => {
      if (orderRes.status === "fulfilled") setOrders(orderRes.value.data);
      if (productRes.status === "fulfilled") setProducts(productRes.value.data);
      const firstErr = [orderRes, productRes].find((r) => r.status === "rejected");
      if (firstErr?.status === "rejected") {
        const e = firstErr.reason;
        setError(e instanceof ApiError ? e.message : "Không thể tải dữ liệu.");
      }
    }).finally(() => setLoading(false));
  }, [user?.id, isSeller, user?.role]);

  // ── Computed analytics ──────────────────────────────────────────────────────
  const totalRevenue = orders
    .filter((o) => ["PAID", "SHIPPED", "DELIVERED", "COMPLETED"].includes(o.status))
    .reduce((s, o) => s + o.totalPrice + o.shippingFee, 0);

  const pendingRevenue = orders
    .filter((o) => ["PENDING", "CONFIRMED"].includes(o.status))
    .reduce((s, o) => s + o.totalPrice + o.shippingFee, 0);

  const orderCountByStatus: Record<string, number> = {};
  for (const o of orders) {
    orderCountByStatus[o.status] = (orderCountByStatus[o.status] ?? 0) + 1;
  }

  const activeProducts = products.filter((p) => p.status === "ACTIVE").length;
  const soldProducts = products.filter((p) => p.status === "SOLD").length;
  const totalViews = products.reduce((s, p) => s + (p.viewCount ?? 0), 0);

  const topProducts = [...products]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 5);
  const maxViews = topProducts[0]?.viewCount ?? 1;

  const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING:   "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PAID:      "Đã thanh toán",
    SHIPPED:   "Đang giao",
    DELIVERED: "Đã giao",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã huỷ",
    REFUNDED:  "Hoàn tiền",
  };

  const statusOrder = ["PENDING","CONFIRMED","PAID","SHIPPED","DELIVERED","COMPLETED","CANCELLED","REFUNDED"];
  const statusColors: Record<string, string> = {
    PENDING:   "#f59e0b",
    CONFIRMED: "#3b82f6",
    PAID:      "#10b981",
    SHIPPED:   "#6366f1",
    DELIVERED: "#22c55e",
    COMPLETED: "#14b8a6",
    CANCELLED: "#ef4444",
    REFUNDED:  "#6b7280",
  };
  const maxOrderCount = Math.max(...Object.values(orderCountByStatus), 1);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f5] pt-24 pb-20">
        <main className="max-w-[1280px] mx-auto px-5 md:px-12">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#974226] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  query_stats
                </span>
              </div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#974226]">Seller Dashboard</p>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-[36px] font-bold text-[#231a11]">
              Analytics
            </h1>
            <p className="text-[15px] text-[#55433d] mt-1">
              Thống kê hiệu suất cửa hàng của bạn.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-[#dbc1b9]/30 p-6 h-36 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard
                  icon="payments"
                  label="Doanh thu đã nhận"
                  value={formatVnd(totalRevenue)}
                  sub={pendingRevenue > 0 ? `+${formatVnd(pendingRevenue)} đang chờ` : undefined}
                />
                <StatCard
                  icon="shopping_bag"
                  label="Tổng đơn hàng"
                  value={String(orders.length)}
                  sub={`${orderCountByStatus["DELIVERED"] ?? 0} đã giao thành công`}
                  color="#556138"
                />
                <StatCard
                  icon="inventory_2"
                  label="Sản phẩm đang bán"
                  value={String(activeProducts)}
                  sub={`${soldProducts} đã bán · ${products.length} tổng`}
                  color="#3b82f6"
                />
                <StatCard
                  icon="visibility"
                  label="Lượt xem sản phẩm"
                  value={totalViews.toLocaleString("vi-VN")}
                  sub={`Trung bình ${products.length > 0 ? Math.round(totalViews / products.length) : 0} lượt/sp`}
                  color="#8b5cf6"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Order status breakdown */}
                <div className="bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] p-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-[#231a11] mb-5">
                    Đơn hàng theo trạng thái
                  </h2>
                  {orders.length === 0 ? (
                    <p className="text-[13px] text-[#88726c] text-center py-8">Chưa có đơn hàng nào.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {statusOrder
                        .filter((s) => (orderCountByStatus[s] ?? 0) > 0)
                        .map((s) => (
                          <MiniBar
                            key={s}
                            label={ORDER_STATUS_LABELS[s] ?? s}
                            value={orderCountByStatus[s] ?? 0}
                            max={maxOrderCount}
                            color={statusColors[s]}
                          />
                        ))}
                    </div>
                  )}
                </div>

                {/* Top products by views */}
                <div className="bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] p-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-[#231a11] mb-5">
                    Sản phẩm nhiều lượt xem nhất
                  </h2>
                  {topProducts.length === 0 ? (
                    <p className="text-[13px] text-[#88726c] text-center py-8">Chưa có sản phẩm nào.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {topProducts.map((p) => (
                        <MiniBar
                          key={p.id}
                          label={p.title}
                          value={p.viewCount ?? 0}
                          max={maxViews}
                          color="#974226"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent orders table */}
              <div className="bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-[#231a11]">
                    Đơn hàng gần đây
                  </h2>
                  <a
                    href="/seller/orders"
                    className="text-[12px] font-semibold text-[#974226] hover:underline underline-offset-4"
                  >
                    Xem tất cả →
                  </a>
                </div>
                {orders.slice(0, 8).length === 0 ? (
                  <p className="text-[13px] text-[#88726c] text-center py-8">Chưa có đơn hàng nào.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-[#f2dfd1]">
                          <th className="text-left text-[#88726c] font-semibold py-2 pr-4">Sản phẩm</th>
                          <th className="text-left text-[#88726c] font-semibold py-2 pr-4">Buyer</th>
                          <th className="text-right text-[#88726c] font-semibold py-2 pr-4">Tổng tiền</th>
                          <th className="text-left text-[#88726c] font-semibold py-2">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 8).map((order) => (
                          <tr key={order.id} className="border-b border-[#f2dfd1]/60 last:border-0 hover:bg-[#fff8f5] transition-colors">
                            <td className="py-3 pr-4">
                              <span className="text-[#231a11] font-medium truncate block max-w-[180px]">
                                {order.product?.title ?? "—"}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-[#55433d]">{order.buyer?.name ?? "—"}</td>
                            <td className="py-3 pr-4 text-right font-semibold text-[#974226]">
                              {formatVnd(order.totalPrice + order.shippingFee)}
                            </td>
                            <td className="py-3">
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                                style={{
                                  background: `${statusColors[order.status]}18`,
                                  color: statusColors[order.status],
                                  borderColor: `${statusColors[order.status]}40`,
                                }}
                              >
                                {ORDER_STATUS_LABELS[order.status] ?? order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
