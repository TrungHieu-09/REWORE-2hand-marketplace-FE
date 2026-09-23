"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ApiError,
  ordersApi,
  type Order,
  type OrderStatus,
} from "@/app/lib/api";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PAID: "Đã thanh toán",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã huỷ",
  REFUNDED: "Hoàn tiền",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-100 text-amber-800 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PAID:      "bg-emerald-100 text-emerald-800 border-emerald-200",
  SHIPPED:   "bg-indigo-100 text-indigo-800 border-indigo-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-teal-100 text-teal-800 border-teal-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED:  "bg-gray-100 text-gray-600 border-gray-200",
};

// Chuỗi transition hợp lệ mà seller có thể thực hiện
const SELLER_NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING:   "CONFIRMED",
  CONFIRMED: "SHIPPED",
  PAID:      "SHIPPED",
  SHIPPED:   "DELIVERED",
};

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
}

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isSeller = user?.role === "SELLER";

  useEffect(() => {
    if (user && !isSeller && user.role !== "ADMIN") {
      router.replace("/seller/dashboard");
    }
  }, [user, isSeller, router]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ordersApi.list({
        role: "seller",
        status: filter !== "ALL" ? (filter as OrderStatus) : undefined,
        page,
        limit: 15,
      });
      setOrders(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không thể tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await ordersApi.updateStatus(orderId, nextStatus);
      await fetchOrders();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

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
                  shopping_bag
                </span>
              </div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#974226]">
                Seller Dashboard
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-[36px] font-bold text-[#231a11]">
              Quản lý Đơn Hàng
            </h1>
            <p className="text-[15px] text-[#55433d] mt-1">
              Xem và xử lý đơn hàng từ buyer của bạn.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setFilter(opt.value); setPage(1); }}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
                  filter === opt.value
                    ? "bg-[#974226] text-white border-[#974226]"
                    : "bg-white text-[#55433d] border-[#dbc1b9] hover:border-[#974226] hover:text-[#974226]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-[#dbc1b9]/30 p-5 animate-pulse h-28" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[#dbc1b9]/30 shadow-sm p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#ffdbd0] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px] text-[#974226]">inbox</span>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[#231a11] mb-2">
                Chưa có đơn hàng
              </h3>
              <p className="text-[14px] text-[#88726c]">
                {filter !== "ALL" ? `Không có đơn nào với trạng thái "${STATUS_LABELS[filter as OrderStatus]}".` : "Bạn chưa nhận được đơn hàng nào."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const nextStatus = SELLER_NEXT_STATUS[order.status];
                const isUpdating = updatingId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 rounded-[12px] overflow-hidden flex-shrink-0 bg-[#f2dfd1]">
                      {order.product?.images?.[0] ? (
                        <img
                          src={order.product.images[0]}
                          alt={order.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-[24px] text-[#974226]">inventory_2</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                        <span className="text-[11px] text-[#88726c]">#{order.id.slice(-8).toUpperCase()}</span>
                      </div>
                      <p className="font-semibold text-[#231a11] text-[15px] truncate">
                        {order.product?.title ?? "Sản phẩm không còn tồn tại"}
                      </p>
                      <p className="text-[13px] text-[#55433d] mt-0.5">
                        Buyer: <span className="font-medium">{order.buyer?.name ?? "—"}</span>
                        {order.buyer?.email && <span className="text-[#88726c]"> · {order.buyer.email}</span>}
                      </p>
                      <p className="text-[12px] text-[#88726c] mt-0.5">
                        {formatDate(order.createdAt)}
                        {order.shippingAddress && (
                          <span className="ml-2">· 📍 {order.shippingAddress}</span>
                        )}
                      </p>
                    </div>

                    {/* Price + Action */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="font-bold text-[#974226] text-[16px]">
                        {formatVnd(order.totalPrice + order.shippingFee)}
                      </p>
                      {order.shippingFee > 0 && (
                        <p className="text-[11px] text-[#88726c]">
                          (Ship: {formatVnd(order.shippingFee)})
                        </p>
                      )}
                      {nextStatus && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, nextStatus)}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#974226] text-white text-[12px] font-semibold hover:bg-[#b65a3c] transition-colors disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                          ) : (
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          )}
                          {STATUS_LABELS[nextStatus]}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border border-[#dbc1b9] text-[13px] font-medium text-[#55433d] hover:border-[#974226] hover:text-[#974226] disabled:opacity-40 transition-colors"
              >
                ← Trước
              </button>
              <span className="px-4 py-2 text-[13px] text-[#88726c]">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full border border-[#dbc1b9] text-[13px] font-medium text-[#55433d] hover:border-[#974226] hover:text-[#974226] disabled:opacity-40 transition-colors"
              >
                Tiếp →
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
