"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminImage } from "../../components/admin/AdminImage";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DetailDrawer } from "../../components/admin/DetailDrawer";
import { PillButton } from "../../components/admin/PillButton";
import { sellerStatusTone, StatusBadge } from "../../components/admin/StatusBadge";
import { adminApi, type SellerApplication, type SellerApplicationStatus, type SellerSubscriptionPlan } from "../../lib/api";
import { formatShortDate, initials, normalizedStatusLabel } from "../_utils";

type SellerTab = "ALL" | SellerApplicationStatus;

const TABS: { key: SellerTab; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Đang chờ" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
];

const planExpiresText = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value)) : "Không giới hạn";

const addDaysIso = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export default function AdminSellersPage() {
  const [tab, setTab] = useState<SellerTab>("PENDING");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [openReports, setOpenReports] = useState(0);
  const [selected, setSelected] = useState<SellerApplication | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [subscriptionBusy, setSubscriptionBusy] = useState("");
  const [detailLoadingId, setDetailLoadingId] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      adminApi.sellerApplications({ limit: 50 }),
      adminApi.reports({ status: "OPEN", limit: 1 }),
    ]).then(([sellerResult, reportResult]) => {
      if (cancelled) return;

      if (sellerResult.status === "fulfilled") {
        setApplications(sellerResult.value.data);
      } else {
        setApplications([]);
        setApiMessage("Admin seller API chưa sẵn sàng hoặc chưa đăng nhập admin.");
      }

      if (reportResult.status === "fulfilled") {
        setOpenReports(reportResult.value.meta.total);
      } else {
        setOpenReports(0);
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      tab === "ALL"
        ? applications
        : applications.filter((item) =>
            tab === "PENDING"
              ? item.status === "PENDING" || item.status === "PENDING_VERIFICATION"
              : item.status === tab
          ),
    [applications, tab]
  );

  const pendingSellers = applications.filter((item) => item.status === "PENDING" || item.status === "PENDING_VERIFICATION").length;

  const returnToReviewList = (message: string) => {
    setSelected(null);
    setRejecting(false);
    setReason("");
    setActionMessage("");
    setPageMessage(message);
    setTab("PENDING");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const legalName = (application: SellerApplication) =>
    application.legalName ?? application.user?.name ?? application.bankAccountName ?? "Unknown";
  const bankHolder = (application: SellerApplication) =>
    application.bankAccountHolder ?? application.bankAccountName ?? "Not provided";
  const idFront = (application: SellerApplication) =>
    application.id_card_front_url ?? application.idCardFrontUrl ?? application.idCardFrontImage ?? "";
  const idBack = (application: SellerApplication) =>
    application.id_card_back_url ?? application.idCardBackUrl ?? application.idCardBackImage ?? "";
  const selfie = (application: SellerApplication) =>
    application.selfie_url ?? application.selfieUrl ?? "";

  const openApplication = async (application: SellerApplication) => {
    setSelected(application);
    setRejecting(false);
    setReason("");
    setActionMessage("");
    setDetailLoadingId(application.id);

    try {
      const res = await adminApi.sellerApplication(application.id);
      setSelected(res.data);
      setApplications((items) => items.map((item) => (item.id === res.data.id ? { ...item, ...res.data } : item)));
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Không thể tải ảnh xác minh.");
    } finally {
      setDetailLoadingId("");
    }
  };

  const refreshIdentityImages = async () => {
    if (!selected) return;

    setDetailLoadingId(selected.id);
    setActionMessage("");
    try {
      const res = await adminApi.sellerApplication(selected.id);
      setSelected(res.data);
      setApplications((items) => items.map((item) => (item.id === res.data.id ? { ...item, ...res.data } : item)));
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Không thể tải lại ảnh xác minh.");
    } finally {
      setDetailLoadingId("");
    }
  };

  const approve = async (application: SellerApplication) => {
    setBusyId(application.id);
    setActionMessage("");
    setPageMessage("");
    try {
      const res = await adminApi.approveSellerApplication(application.id);
      setApplications((items) => items.map((item) => (item.id === res.data.id ? res.data : item)));
      returnToReviewList("Đã duyệt seller. Hồ sơ đã được chuyển khỏi danh sách pending.");
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Không thể duyệt seller.");
    } finally {
      setBusyId("");
    }
  };

  const reject = async (application: SellerApplication) => {
    if (!reason.trim()) {
      setActionMessage("Nhập lý do từ chối trước khi gửi.");
      return;
    }

    setBusyId(application.id);
    setActionMessage("");
    setPageMessage("");
    try {
      const res = await adminApi.rejectSellerApplication(application.id, reason.trim());
      setApplications((items) => items.map((item) => (item.id === res.data.id ? res.data : item)));
      returnToReviewList("Đã từ chối hồ sơ seller. Hồ sơ đã được chuyển khỏi danh sách pending.");
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Không thể từ chối hồ sơ seller.");
    } finally {
      setBusyId("");
    }
  };

  const updateSubscription = async (application: SellerApplication, plan: SellerSubscriptionPlan) => {
    setSubscriptionBusy(`${application.id}:${plan}`);
    setActionMessage("");
    try {
      const res = await adminApi.updateSellerSubscription(application.id, {
        plan,
        expiresAt: plan === "PREMIUM" ? addDaysIso(30) : null,
        note: plan === "PREMIUM" ? "Premium package activated manually by admin" : "Seller subscription downgraded to Free",
      });
      setSelected(res.data);
      setApplications((items) => items.map((item) => (item.id === res.data.id ? { ...item, ...res.data } : item)));
      setActionMessage(plan === "PREMIUM" ? "Đã bật Premium 30 ngày cho seller." : "Đã chuyển seller về gói Free.");
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Không thể cập nhật gói seller.");
    } finally {
      setSubscriptionBusy("");
    }
  };

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Duyệt Seller</h1>
          <p className="admin-page-sub">Xem CCCD, đối chiếu tên tài khoản ngân hàng và duyệt thủ công.</p>
          {pageMessage && <p className="sp-foryou-sub" style={{ color: "#556138" }}>{pageMessage}</p>}
          {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
        </div>
        <span className="sp-count-badge">{filtered.length} hồ sơ</span>
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
      ) : filtered.length === 0 ? (
        <EmptyState icon="verified_user" title="Không có hồ sơ" desc="Không có seller application nào trong trạng thái này." />
      ) : (
        <section className="admin-list">
          {filtered.map((application) => (
            <button
              key={application.id}
              className="admin-list-card"
              onClick={() => openApplication(application)}
            >
              <span className="admin-list-avatar">{initials(application.shopName)}</span>
              <span className="admin-list-main">
                <span className="admin-list-title">{application.shopName}</span>
                <span className="admin-list-meta">
                  Nộp ngày {formatShortDate(application.createdAt)} · {legalName(application)}
                </span>
              </span>
              <span className="admin-list-actions">
                <StatusBadge
                  label={normalizedStatusLabel(application.status)}
                  tone={sellerStatusTone(application.status)}
                />
                <span className="material-symbols-outlined text-[18px] text-[#88726c]">chevron_right</span>
              </span>
            </button>
          ))}
        </section>
      )}

      <DetailDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.shopName ?? ""}
        subtitle="Seller application"
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="admin-detail-grid">
              <div className="admin-detail-box">
                <span className="admin-detail-label">Legal name</span>
                <span className="admin-detail-value">{legalName(selected)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Bank holder</span>
                <span className="admin-detail-value">{bankHolder(selected)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Phone</span>
                <span className="admin-detail-value">{selected.phone || selected.user?.phone || "Not provided"}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Bank</span>
                <span className="admin-detail-value">{selected.bankName ?? "Not provided"}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Pickup address</span>
                <span className="admin-detail-value">{selected.pickupAddress}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Account number</span>
                <span className="admin-detail-value">{selected.bankAccountNumber}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Seller plan</span>
                <span className="admin-detail-value">{selected.subscriptionPlan ?? "FREE"}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Plan expires</span>
                <span className="admin-detail-value">{planExpiresText(selected.subscriptionExpiresAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="admin-detail-label">Ảnh xác minh có thời hạn 5 phút</span>
              <PillButton tone="muted" disabled={detailLoadingId === selected.id} onClick={refreshIdentityImages}>
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Tải lại ảnh
              </PillButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="admin-detail-label">CCCD mặt trước</span>
                <div className="admin-id-image">
                  <AdminImage src={idFront(selected)} alt="CCCD mặt trước" />
                </div>
              </div>
              <div>
                <span className="admin-detail-label">CCCD mặt sau</span>
                <div className="admin-id-image">
                  <AdminImage src={idBack(selected)} alt="CCCD mặt sau" />
                </div>
              </div>
              <div>
                <span className="admin-detail-label">Selfie xác minh</span>
                <div className="admin-id-image">
                  <AdminImage src={selfie(selected)} alt="Selfie xác minh" />
                </div>
              </div>
            </div>

            {selected.sellingDescription && (
              <div className="admin-detail-box">
                <span className="admin-detail-label">Mô tả hàng bán</span>
                <span className="admin-detail-value">{selected.sellingDescription}</span>
              </div>
            )}

            {actionMessage && <p className="sp-foryou-sub">{actionMessage}</p>}

            {selected.status === "APPROVED" && (
              <div className="admin-detail-box">
                <span className="admin-detail-label">Gói seller</span>
                <div className="flex flex-wrap gap-3 mt-3">
                  <PillButton
                    tone="green"
                    disabled={Boolean(subscriptionBusy) || selected.subscriptionPlan === "PREMIUM"}
                    onClick={() => updateSubscription(selected, "PREMIUM")}
                  >
                    <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                    Bật Premium 30 ngày
                  </PillButton>
                  <PillButton
                    tone="muted"
                    disabled={Boolean(subscriptionBusy) || selected.subscriptionPlan === "FREE" || !selected.subscriptionPlan}
                    onClick={() => updateSubscription(selected, "FREE")}
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    Chuyển về Free
                  </PillButton>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <PillButton
                tone="green"
                disabled={busyId === selected.id || (selected.status !== "PENDING" && selected.status !== "PENDING_VERIFICATION")}
                onClick={() => approve(selected)}
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Duyệt
              </PillButton>
              <PillButton
                tone="red"
                disabled={busyId === selected.id || (selected.status !== "PENDING" && selected.status !== "PENDING_VERIFICATION")}
                onClick={() => setRejecting((value) => !value)}
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                Từ chối
              </PillButton>
            </div>

            {rejecting && (
              <div className="admin-reject-box">
                <label className="admin-detail-label" htmlFor="reject-reason">Lý do từ chối</label>
                <textarea
                  id="reject-reason"
                  className="admin-textarea"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Ví dụ: ảnh CCCD không rõ, tên tài khoản không khớp..."
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
