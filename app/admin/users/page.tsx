"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DataTable, type DataColumn } from "../../components/admin/DataTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { adminApi, type User } from "../../lib/api";
import { mockApplications, mockReports, mockUsers } from "../_data";
import { formatShortDate } from "../_utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    adminApi
      .users({ limit: 50 })
      .then((res) => {
        if (!cancelled) setUsers(res.data);
      })
      .catch(() => {
        if (!cancelled) setApiMessage("Users API chưa sẵn sàng hoặc chưa có quyền admin. Đang hiển thị dữ liệu mẫu.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingSellers = mockApplications.filter((item) => item.status === "PENDING" || item.status === "PENDING_VERIFICATION").length;
  const openReports = mockReports.filter((item) => item.status === "OPEN").length;

  const columns = useMemo<DataColumn<User>[]>(
    () => [
      { key: "name", header: "Người dùng", render: (user) => <strong>{user.name}</strong> },
      { key: "email", header: "Email", render: (user) => user.email },
      { key: "role", header: "Role", render: (user) => <StatusBadge label={user.role} tone={user.role === "ADMIN" ? "red" : user.role === "SELLER" ? "green" : "neutral"} /> },
      { key: "verified", header: "Email", render: (user) => <StatusBadge label={user.isVerified ? "VERIFIED" : "UNVERIFIED"} tone={user.isVerified ? "green" : "orange"} /> },
      { key: "created", header: "Ngày tạo", render: (user) => formatShortDate(user.createdAt) },
    ],
    []
  );

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Người dùng</h1>
          <p className="admin-page-sub">Danh sách buyer, seller và admin accounts.</p>
          {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
        </div>
      </header>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <DataTable rows={users} columns={columns} empty={<EmptyState icon="group" title="Chưa có người dùng" desc="Users sẽ xuất hiện khi backend trả dữ liệu." />} />
      )}
    </AdminShell>
  );
}
