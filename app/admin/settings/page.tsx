"use client";

import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState } from "../../components/admin/AdminStates";
import { useAdminBadges } from "../../components/admin/useAdminBadges";

export default function AdminSettingsPage() {
  const { pendingSellers, openReports } = useAdminBadges();

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
