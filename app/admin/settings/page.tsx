"use client";

import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState } from "../../components/admin/AdminStates";
import { mockApplications, mockReports } from "../_data";

export default function AdminSettingsPage() {
  const pendingSellers = mockApplications.filter((item) => item.status === "PENDING" || item.status === "PENDING_VERIFICATION").length;
  const openReports = mockReports.filter((item) => item.status === "OPEN").length;

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Cài đặt</h1>
          <p className="admin-page-sub">Khu vực cấu hình vận hành admin.</p>
        </div>
      </header>
      <EmptyState icon="settings" title="Chưa có cấu hình" desc="Các thiết lập vận hành sẽ được nối khi backend admin settings sẵn sàng." />
    </AdminShell>
  );
}
