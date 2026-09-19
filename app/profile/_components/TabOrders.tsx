"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ApiError, ordersApi, sellerDisplayName, type Order, type OrderStatus } from "@/app/lib/api";

const NEXT_STATUSES: OrderStatus[] = ["PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

function formatVND(amount: number) {
  return "₫" + new Intl.NumberFormat("vi-VN").format(amount);
}

export default function TabOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    ordersApi
      .list({ role: "buyer", limit: 50 })
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setMessage(err instanceof ApiError ? err.message : "Could not load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    if (status === order.status || status === "PENDING") return;
    setUpdatingId(order.id);

    try {
      const res = await ordersApi.updateStatus(order.id, status);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? res.data : item)));
      setMessage("Order status updated.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Could not update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="opacity-0 animate-fade-in-up bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(43,33,24,0.07)] border border-[#dbc1b9]/30 overflow-hidden">
      <div className="p-6 border-b border-[#f2dfd1]">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#231a11] mb-1">
          Orders
        </h3>
        <p className="text-sm text-[#88726c]">
          {loading ? "Loading orders..." : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        </p>
        {message && <p className="text-sm text-[#974226] mt-2">{message}</p>}
      </div>

      {!loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
          <span className="material-symbols-outlined text-[64px] text-[#dbc1b9] mb-4">
            inventory_2
          </span>
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#231a11] mb-2">
            No Orders Yet
          </h3>
          <p className="text-[#88726c] max-w-sm text-sm leading-relaxed">
            You haven&apos;t won any auctions or placed any orders recently.
          </p>
          <a href="/auctions" className="mt-6 px-7 py-2.5 bg-[#974226] text-white rounded-full text-sm font-semibold hover:bg-[#b65a3c] transition-colors shadow-sm">
            Explore Auctions
          </a>
        </div>
      ) : (
        <div className="divide-y divide-[#f2dfd1]">
          {orders.map((order) => {
            const product = order.product;
            const image = product?.images?.[0];
            return (
              <div key={order.id} className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#fff8f5] transition-colors">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#feeadc] shrink-0">
                  {image ? (
                    <Image src={image} alt={product?.title ?? "Order item"} fill className="object-cover" />
                  ) : (
                    <div className="admin-image-placeholder h-full">
                      <span className="material-symbols-outlined">image_not_supported</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-[#231a11] truncate">{product?.title ?? "Order item"}</h4>
                  <p className="text-sm text-[#88726c] mt-1">Seller: {sellerDisplayName(order.seller)}</p>
                  <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11] mt-3">
                    {formatVND(order.totalPrice + order.shippingFee)}
                  </p>
                </div>
                <div className="sm:w-44 flex flex-col gap-2 justify-center">
                  <span className="inline-flex justify-center px-3 py-1 rounded-full bg-[#f2dfd1] text-[#55443d] text-xs font-semibold">
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(event) => updateStatus(order, event.target.value as OrderStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dbc1b9] bg-white text-[#231a11] text-xs font-semibold focus:outline-none focus:border-[#974226]"
                  >
                    <option value={order.status}>{order.status}</option>
                    {NEXT_STATUSES.filter((status) => status !== order.status).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


