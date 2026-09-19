"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DetailDrawer } from "../../components/admin/DetailDrawer";
import { PillButton } from "../../components/admin/PillButton";
import { reportStatusTone, StatusBadge } from "../../components/admin/StatusBadge";
import { adminApi, sellerDisplayName, type ReportStatus, type SellerReport } from "../../lib/api";
import { formatShortDate, initials, normalizedStatusLabel } from "../_utils";

type ReportTab = "ALL" | ReportStatus;

const TABS: { key: ReportTab; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "OPEN", label: "Đang mở" },
  { key: "RESOLVED", label: "Đã xử lý" },
  { key: "DISMISSED", label: "Bỏ qua" },
];

export default function AdminReportsPage() {
  const [tab, setTab] = useState<ReportTab>("OPEN");
  const [reports, setReports] = useState<SellerReport[]>([]);
  const [pendingSellers, setPendingSellers] = useState(0);
  const [selected, setSelected] = useState<SellerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      adminApi.reports({ limit: 50 }),
      adminApi.sellerApplications({ status: "PENDING", limit: 1 }),
    ]).then(([reportResult, sellerResult]) => {
      if (cancelled) return;

      if (reportResult.status === "fulfilled") {
        setReports(reportResult.value.data);
      } else {
        setReports([]);
        setApiMessage("Admin reports API chưa sẵn sàng hoặc chưa đăng nhập admin.");
      }

      if (sellerResult.status === "fulfilled") {
        setPendingSellers(sellerResult.value.meta.total);
      } else {
        setPendingSellers(0);
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (tab === "ALL" ? reports : reports.filter((report) => report.status === tab)),
    [reports, tab]
  );

  const openReports = reports.filter((item) => item.status === "OPEN").length;

  const patchReport = async (
    report: SellerReport,
    action: "warn" | "suspend" | "dismiss"
  ) => {
    setBusyId(report.id);
    setMessage("");
    const payload = {
      action,
      note:
        action === "dismiss"
          ? "Report dismissed by admin."
          : action === "suspend"
          ? "Seller suspended after valid report."
          : "Seller warned after valid report.",
    };

    try {
      const res = await adminApi.reviewReport(report.id, payload);
      setReports((items) => items.map((item) => (item.id === report.id ? res.data : item)));
      setSelected(res.data);
      setMessage("Đã cập nhật report.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Không thể cập nhật report.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Báo cáo</h1>
          <p className="admin-page-sub">Xử lý report seller, cảnh cáo hoặc khóa quyền bán khi cần.</p>
          {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
        </div>
        <span className="sp-count-badge">{filtered.length} report</span>
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
        <LoadingSkeleton rows={3} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="flag" title="Không có report" desc="Report theo bộ lọc này đang trống." />
      ) : (
        <section className="admin-list">
          {filtered.map((report) => (
            <button
              key={report.id}
              className="admin-list-card"
              onClick={() => {
                setSelected(report);
                setMessage("");
              }}
            >
              <span className="admin-list-avatar">{initials(sellerDisplayName(report.seller, "Seller"))}</span>
              <span className="admin-list-main">
                <span className="admin-list-title">{report.reason}</span>
                <span className="admin-list-meta">
                  {report.reporter?.name ?? "Buyer"} báo cáo {sellerDisplayName(report.seller, "Seller")} · {formatShortDate(report.createdAt)}
                </span>
              </span>
              <span className="admin-list-actions">
                <StatusBadge label={normalizedStatusLabel(report.status)} tone={reportStatusTone(report.status)} />
                <span className="material-symbols-outlined text-[18px] text-[#88726c]">chevron_right</span>
              </span>
            </button>
          ))}
        </section>
      )}

      <DetailDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.reason ?? ""}
        subtitle="Seller report"
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="admin-detail-grid">
              <div className="admin-detail-box">
                <span className="admin-detail-label">Người báo cáo</span>
                <span className="admin-detail-value">{selected.reporter?.name ?? selected.reporterId}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Seller bị báo cáo</span>
                <span className="admin-detail-value">{sellerDisplayName(selected.seller, selected.sellerId)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Ngày tạo</span>
                <span className="admin-detail-value">{formatShortDate(selected.createdAt)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Trạng thái</span>
                <StatusBadge label={normalizedStatusLabel(selected.status)} tone={reportStatusTone(selected.status)} />
              </div>
            </div>

            <div className="admin-detail-box">
              <span className="admin-detail-label">Nội dung</span>
              <p className="admin-detail-value">{selected.description ?? "No description provided."}</p>
            </div>

            {message && <p className="sp-foryou-sub">{message}</p>}

            <div className="flex flex-wrap gap-3">
              <PillButton
                tone="accent"
                disabled={busyId === selected.id || selected.status !== "OPEN"}
                onClick={() => patchReport(selected, "warn")}
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                Cảnh cáo
              </PillButton>
              <PillButton
                tone="red"
                disabled={busyId === selected.id || selected.status !== "OPEN"}
                onClick={() => patchReport(selected, "suspend")}
              >
                <span className="material-symbols-outlined text-[16px]">block</span>
                Khóa seller
              </PillButton>
              <PillButton
                tone="muted"
                disabled={busyId === selected.id || selected.status !== "OPEN"}
                onClick={() => patchReport(selected, "dismiss")}
              >
                <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                Bỏ qua
              </PillButton>
            </div>
          </div>
        )}
      </DetailDrawer>
    </AdminShell>
  );
}
