"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DataTable, type DataColumn } from "../../components/admin/DataTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { adminApi, type Product } from "../../lib/api";
import { mockApplications, mockReports } from "../_data";
import { formatShortDate, formatVnd } from "../_utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    adminApi
      .products({ limit: 50 })
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .catch(() => {
        if (!cancelled) setApiMessage("Products API chưa sẵn sàng hoặc chưa có dữ liệu.");
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

  const columns = useMemo<DataColumn<Product>[]>(
    () => [
      { key: "title", header: "Sản phẩm", render: (product) => <strong>{product.title}</strong> },
      { key: "seller", header: "Seller", render: (product) => product.seller?.name ?? product.sellerId },
      { key: "category", header: "Danh mục", render: (product) => product.category },
      { key: "price", header: "Giá", render: (product) => <span className="sp-price text-[22px]">{formatVnd(product.price)}</span> },
      { key: "status", header: "Status", render: (product) => <StatusBadge label={product.status} tone={product.status === "ACTIVE" ? "green" : product.status === "AUCTION" ? "red" : "orange"} /> },
      { key: "created", header: "Ngày tạo", render: (product) => formatShortDate(product.createdAt) },
    ],
    []
  );

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <p className="admin-page-sub">Kiểm tra listing, trạng thái và seller owner.</p>
          {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
        </div>
      </header>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <DataTable rows={products} columns={columns} empty={<EmptyState icon="styler" title="Chưa có sản phẩm" desc="Products API hiện chưa trả item nào." />} />
      )}
    </AdminShell>
  );
}
