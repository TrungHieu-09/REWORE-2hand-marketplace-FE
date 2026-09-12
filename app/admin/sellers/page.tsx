"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DetailDrawer } from "../../components/admin/DetailDrawer";
import { PillButton } from "../../components/admin/PillButton";
import { sellerStatusTone, StatusBadge } from "../../components/admin/StatusBadge";
import { adminApi, type SellerApplication, type SellerApplicationStatus } from "../../lib/api";
import { mockApplications, mockReports } from "../_data";
import { formatShortDate, initials, normalizedStatusLabel } from "../_utils";

type SellerTab = "ALL" | SellerApplicationStatus;

const TABS: { key: SellerTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

export default function AdminSellersPage() {
  const [tab, setTab] = useState<SellerTab>("ALL");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<SellerApplication[]>(mockApplications);
  const [selected, setSelected] = useState<SellerApplication | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    adminApi
      .sellerApplications({ limit: 50 })
      .then((res) => {
        if (!cancelled) setApplications(res.data);
      })
      .catch(() => {
        if (!cancelled) setApiMessage("Admin seller API chưa sẵn sàng. Đang hiển thị dữ liệu mẫu.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (tab === "ALL" ? applications : applications.filter((item) => item.status === tab)),
    [applications, tab]
  );

  const pendingSellers = applications.filter((item) => item.status === "PENDING" || item.status === "PENDING_VERIFICATION").length;
  const openReports = mockReports.filter((item) => item.status === "OPEN").length;

  const updateApplication = (next: SellerApplication) => {
    setApplications((items) => items.map((item) => (item.id === next.id ? next : item)));
    setSelected(next);
  };

  const legalName = (application: SellerApplication) =>
    application.legalName ?? application.user?.name ?? application.bankAccountName ?? "Unknown";
  const bankHolder = (application: SellerApplication) =>
    application.bankAccountHolder ?? application.bankAccountName ?? "Not provided";
  const idFront = (application: SellerApplication) =>
    application.idCardFrontImage ?? application.idCardFrontUrl ?? "/shop-blazer.png";
  const idBack = (application: SellerApplication) =>
    application.idCardBackImage ?? application.idCardBackUrl ?? "/shop-trench-coat.png";

  const approve = async (application: SellerApplication) => {
    setBusyId(application.id);
    setActionMessage("");
    try {
      const res = await adminApi.approveSellerApplication(application.id);
      updateApplication(res.data);
      setActionMessage("Đã duyệt seller.");
    } catch {
      updateApplication({ ...application, status: "APPROVED", reviewedAt: new Date().toISOString() });
      setActionMessage("Đã cập nhật giao diện duyệt seller bằng dữ liệu local.");
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
    try {
      const res = await adminApi.rejectSellerApplication(application.id, reason.trim());
      updateApplication(res.data);
      setActionMessage("Đã từ chối hồ sơ seller.");
    } catch {
      updateApplication({
        ...application,
        status: "REJECTED",
        rejectionReason: reason.trim(),
        reviewedAt: new Date().toISOString(),
      });
      setActionMessage("Đã cập nhật giao diện từ chối bằng dữ liệu local.");
    } finally {
      setBusyId("");
      setRejecting(false);
    }
  };

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Duyệt Seller</h1>
          <p className="admin-page-sub">Xem CCCD, đối chiếu tên tài khoản ngân hàng và duyệt thủ công.</p>
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
              onClick={() => {
                setSelected(application);
                setRejecting(false);
                setReason("");
                setActionMessage("");
              }}
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="admin-detail-label">CCCD mặt trước</span>
                <div className="admin-id-image">
                  <Image src={idFront(selected)} alt="ID card front" fill style={{ objectFit: "cover" }} sizes="260px" />
                </div>
              </div>
              <div>
                <span className="admin-detail-label">CCCD mặt sau</span>
                <div className="admin-id-image">
                  <Image src={idBack(selected)} alt="ID card back" fill style={{ objectFit: "cover" }} sizes="260px" />
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
