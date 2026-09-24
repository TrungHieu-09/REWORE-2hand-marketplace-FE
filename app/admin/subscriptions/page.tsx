"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DetailDrawer } from "../../components/admin/DetailDrawer";
import { PillButton } from "../../components/admin/PillButton";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { useAdminBadges } from "../../components/admin/useAdminBadges";
import {
  adminApi,
  type SellerSubscriptionRequest,
  type SellerSubscriptionRequestStatus,
} from "../../lib/api";
import { formatShortDate, formatVnd, initials, normalizedStatusLabel } from "../_utils";

type SubscriptionTab = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

const TABS: { key: SubscriptionTab; label: string }[] = [
  { key: "PENDING", label: "Đang chờ" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "ALL", label: "Tất cả" },
];

const statusTone = (status: SellerSubscriptionRequestStatus) => {
  if (status === "APPROVED") return "green";
  if (status === "REJECTED") return "red";
  return "orange";
};

const planExpiresText = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value)) : "Chưa có";

export default function AdminSubscriptionsPage() {
  const { pendingSellers, openReports } = useAdminBadges();
  const [tab, setTab] = useState<SubscriptionTab>("PENDING");
  const [requests, setRequests] = useState<SellerSubscriptionRequest[]>([]);
  const [selected, setSelected] = useState<SellerSubscriptionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      setLoading(true);
      setMessage("");

      adminApi.subscriptionRequests({ status: tab, limit: 50 })
        .then((res) => {
          if (!cancelled) setRequests(res.data);
        })
        .catch((err) => {
          if (!cancelled) {
            setRequests([]);
            setMessage(err instanceof Error ? err.message : "Không thể tải yêu cầu Premium.");
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [tab]);

  const pendingCount = useMemo(
    () => requests.filter((item) => item.status === "PENDING").length,
    [requests]
  );

  const replaceRequest = (request: SellerSubscriptionRequest) => {
    setRequests((items) => items.map((item) => (item.id === request.id ? request : item)));
    setSelected(request);
  };

  const approve = async (request: SellerSubscriptionRequest) => {
    setBusyId(request.id);
    setMessage("");
    try {
      const res = await adminApi.approveSubscriptionRequest(request.id, {
        note: `Approved Premium ${request.durationMonths} month(s) after manual payment review`,
      });
      replaceRequest(res.data);
      setMessage("Đã duyệt Premium và kích hoạt gói cho seller.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Không thể duyệt yêu cầu Premium.");
    } finally {
      setBusyId("");
    }
  };

  const reject = async (request: SellerSubscriptionRequest) => {
    if (!reason.trim()) {
      setMessage("Nhập lý do từ chối trước khi gửi.");
      return;
    }

    setBusyId(request.id);
    setMessage("");
    try {
      const res = await adminApi.rejectSubscriptionRequest(request.id, reason.trim());
      replaceRequest(res.data);
      setRejecting(false);
      setReason("");
      setMessage("Đã từ chối yêu cầu Premium.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Không thể từ chối yêu cầu Premium.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Gói Seller</h1>
          <p className="admin-page-sub">Duyệt yêu cầu Premium sau khi kiểm tra chuyển khoản thủ công.</p>
          {message && <p className="sp-foryou-sub" style={{ color: message.includes("Đã") ? "#556138" : "#ba1a1a" }}>{message}</p>}
        </div>
        <span className="sp-count-badge">{tab === "PENDING" ? pendingCount : requests.length} yêu cầu</span>
      </header>

      <section className="admin-panel">
        <div className="sp-quick-tabs admin-tabs-row">
          {TABS.map((item) => (
            <button
              key={item.key}
              className={`sp-quick-tab${tab === item.key ? " active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : requests.length === 0 ? (
        <EmptyState icon="workspace_premium" title="Chưa có yêu cầu" desc="Seller request Premium sẽ xuất hiện ở đây." />
      ) : (
        <section className="admin-list">
          {requests.map((request) => {
            const shopName = request.sellerProfile?.shopName ?? request.sellerProfile?.user?.name ?? "Seller";
            return (
              <button
                key={request.id}
                className="admin-list-card"
                onClick={() => {
                  setSelected(request);
                  setRejecting(false);
                  setReason("");
                }}
              >
                <span className="admin-list-avatar">{initials(shopName)}</span>
                <span className="admin-list-main">
                  <span className="admin-list-title">{shopName}</span>
                  <span className="admin-list-meta">
                    {request.durationMonths} tháng · {formatVnd(request.amount ?? 0)} · {formatShortDate(request.createdAt)}
                  </span>
                </span>
                <span className="admin-list-actions">
                  <StatusBadge label={normalizedStatusLabel(request.status)} tone={statusTone(request.status)} />
                  <span className="material-symbols-outlined text-[18px] text-[#88726c]">chevron_right</span>
                </span>
              </button>
            );
          })}
        </section>
      )}

      <DetailDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.sellerProfile?.shopName ?? "Premium request"}
        subtitle="Seller subscription"
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="admin-detail-grid">
              <div className="admin-detail-box">
                <span className="admin-detail-label">Shop</span>
                <span className="admin-detail-value">{selected.sellerProfile?.shopName ?? "Seller"}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Email</span>
                <span className="admin-detail-value">{selected.sellerProfile?.user?.email ?? "Not provided"}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Gói yêu cầu</span>
                <span className="admin-detail-value">{selected.plan}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Thời hạn</span>
                <span className="admin-detail-value">{selected.durationMonths} tháng</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Số tiền</span>
                <span className="admin-detail-value">{formatVnd(selected.amount ?? 0)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Gói hiện tại</span>
                <span className="admin-detail-value">{selected.sellerProfile?.subscriptionPlan ?? "FREE"}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Hết hạn hiện tại</span>
                <span className="admin-detail-value">{planExpiresText(selected.sellerProfile?.subscriptionExpiresAt)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Mã giao dịch</span>
                <span className="admin-detail-value">{selected.paymentReference || "Not provided"}</span>
              </div>
            </div>

            {selected.note && (
              <div className="admin-detail-box">
                <span className="admin-detail-label">Ghi chú seller</span>
                <span className="admin-detail-value">{selected.note}</span>
              </div>
            )}

            {selected.rejectedReason && (
              <div className="admin-reject-box">
                <span className="admin-detail-label">Lý do từ chối</span>
                <p className="admin-detail-value">{selected.rejectedReason}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <PillButton tone="green" disabled={busyId === selected.id || selected.status !== "PENDING"} onClick={() => approve(selected)}>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Duyệt Premium
              </PillButton>
              <PillButton tone="red" disabled={busyId === selected.id || selected.status !== "PENDING"} onClick={() => setRejecting((value) => !value)}>
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                Từ chối
              </PillButton>
            </div>

            {rejecting && (
              <div className="admin-reject-box">
                <label className="admin-detail-label" htmlFor="subscription-reject-reason">Lý do từ chối</label>
                <textarea
                  id="subscription-reject-reason"
                  className="admin-textarea"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Ví dụ: chưa thấy giao dịch chuyển khoản, sai nội dung..."
                />
                <div className="mt-3">
                  <PillButton tone="red" disabled={busyId === selected.id} onClick={() => reject(selected)}>
                    Gửi lý do
                  </PillButton>
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </AdminShell>
  );
}
