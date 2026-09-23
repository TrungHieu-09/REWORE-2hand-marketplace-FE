"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DataTable, type DataColumn } from "../../components/admin/DataTable";
import { PillButton } from "../../components/admin/PillButton";
import { orderStatusTone, StatusBadge } from "../../components/admin/StatusBadge";
import { useAdminBadges } from "../../components/admin/useAdminBadges";
import { ApiError, adminApi, sellerDisplayName, type Order } from "../../lib/api";
import { formatShortDate, formatVnd, normalizedStatusLabel } from "../_utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const { pendingSellers, openReports } = useAdminBadges();

  useEffect(() => {
    let cancelled = false;

    adminApi
      .orders({ limit: 50 })
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch(() => {
        if (!cancelled) setApiMessage("Orders API chưa sẵn sàng hoặc chưa có quyền admin.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const markPaid = async (order: Order) => {
    setBusyId(order.id);
    try {
      const res = await adminApi.confirmOrderPayment(order.id);
      setOrders((items) => items.map((item) => (item.id === order.id ? res.data : item)));
    } catch (err) {
      setApiMessage(err instanceof ApiError ? err.message : "Không thể xác nhận thanh toán.");
    } finally {
      setBusyId("");
    }
  };

  const columns = useMemo<DataColumn<Order>[]>(
    () => [
      {
        key: "id",
        header: "Mã đơn",
        render: (order) => (
          <div>
            <p className="font-bold text-[#231a11]">{order.id}</p>
            <p className="text-[12px] text-[#88726c]">{formatShortDate(order.createdAt)}</p>
          </div>
        ),
      },
      {
        key: "product",
        header: "Sản phẩm",
        render: (order) => (
          <div>
            <p className="font-semibold text-[#231a11]">{order.product?.title ?? "Auction order"}</p>
            <p className="text-[12px] text-[#88726c]">{order.product?.category ?? "Marketplace"}</p>
          </div>
        ),
      },
      {
        key: "people",
        header: "Buyer / Seller",
        render: (order) => (
          <div>
            <p className="text-[#231a11]">{order.buyer?.name ?? order.buyerId}</p>
            <p className="text-[12px] text-[#88726c]">{sellerDisplayName(order.seller, order.sellerId)}</p>
          </div>
        ),
      },
      {
        key: "amount",
        header: "Tổng tiền",
        render: (order) => <span className="sp-price text-[22px]">{formatVnd(order.totalPrice)}</span>,
      },
      {
        key: "status",
        header: "Thanh toán",
        render: (order) => (
          <StatusBadge
            label={normalizedStatusLabel(order.paymentStatus ?? order.status)}
            tone={orderStatusTone(order.paymentStatus ?? order.status)}
          />
        ),
      },
      {
        key: "action",
        header: "Thao tác",
        render: (order) =>
          (order.paymentStatus ?? "UNPAID") === "UNPAID" ? (
            <PillButton tone="green" disabled={busyId === order.id} onClick={() => markPaid(order)}>
              Xác nhận đã thanh toán
            </PillButton>
          ) : (
            <span className="text-[12px] font-semibold text-[#88726c]">No action</span>
          ),
      },
    ],
    [busyId]
  );

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Đơn hàng</h1>
          <p className="admin-page-sub">Theo dõi thanh toán, buyer/seller và xác nhận đơn unpaid.</p>
          {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
        </div>
        <span className="sp-count-badge">{orders.length} đơn</span>
      </header>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <DataTable
          rows={orders}
          columns={columns}
          empty={<EmptyState icon="receipt_long" title="Chưa có đơn hàng" desc="Đơn hàng mới sẽ xuất hiện tại đây." />}
        />
      )}
    </AdminShell>
  );
}
