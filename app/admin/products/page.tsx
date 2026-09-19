"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { EmptyState, LoadingSkeleton } from "../../components/admin/AdminStates";
import { DetailDrawer } from "../../components/admin/DetailDrawer";
import { PillButton } from "../../components/admin/PillButton";
import { availabilityStatusTone, productStatusTone, StatusBadge } from "../../components/admin/StatusBadge";
import { useAdminBadges } from "../../components/admin/useAdminBadges";
import { ApiError, adminApi, sellerDisplayName, type Product } from "../../lib/api";
import { formatShortDate, formatVnd, initials, normalizedStatusLabel } from "../_utils";

type ProductTab = "ALL" | "ACTIVE" | "HIDDEN" | "REMOVED";
type ModerationAction = "hide" | "remove";

const TABS: { key: ProductTab; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "ACTIVE", label: "Đang bán" },
  { key: "HIDDEN", label: "Đã ẩn" },
  { key: "REMOVED", label: "Đã gỡ" },
];

const availabilityLabel = (status?: Product["availabilityStatus"]) =>
  normalizedStatusLabel(status ?? "available");

const productImage = (product: Product) => product.images?.[0] ?? "";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [tab, setTab] = useState<ProductTab>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [toast, setToast] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [actionProduct, setActionProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<ModerationAction>("hide");
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [conflictBlocked, setConflictBlocked] = useState(false);
  const { pendingSellers, openReports } = useAdminBadges();

  useEffect(() => {
    let cancelled = false;
    const status = tab === "ALL" ? undefined : tab;

    adminApi
      .products({ limit: 80, status })
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setApiMessage("Products API chưa sẵn sàng hoặc chưa có quyền admin.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) => {
      const sellerName = sellerDisplayName(product.seller, product.sellerId);
      return `${product.title} ${sellerName}`.toLowerCase().includes(term);
    });
  }, [products, search]);

  const openModeration = (product: Product, type: ModerationAction) => {
    setActionProduct(product);
    setActionType(type);
    setReason("");
    setActionError("");
    setConflictBlocked(false);
  };

  const applyModeration = async () => {
    if (!actionProduct) return;
    if (!reason.trim()) {
      setActionError("Nhập lý do trước khi gửi.");
      return;
    }

    setBusyId(actionProduct.id);
    setActionError("");
    setConflictBlocked(false);
    try {
      const res =
        actionType === "hide"
          ? await adminApi.hideProduct(actionProduct.id, reason.trim())
          : await adminApi.removeProduct(actionProduct.id, reason.trim());

      setProducts((items) => items.map((item) => (item.id === actionProduct.id ? { ...item, ...res.data } : item)));
      setSelected((current) => (current?.id === actionProduct.id ? { ...current, ...res.data } : current));
      setActionProduct(null);
      setToast(actionType === "hide" ? "Đã ẩn tin sản phẩm." : "Đã gỡ tin sản phẩm.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setActionError("Sản phẩm đang có đơn xử lý. Không thể thực hiện thao tác này.");
        setConflictBlocked(true);
      } else {
        setActionError(err instanceof Error ? err.message : "Không thể cập nhật sản phẩm.");
      }
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminShell pendingSellers={pendingSellers} openReports={openReports}>
      {toast && <div className="admin-toast">{toast}</div>}

      <header className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <p className="admin-page-sub">Kiểm tra listing, trạng thái kiểm duyệt và tình trạng khả dụng.</p>
          {apiMessage && <p className="sp-foryou-sub" style={{ color: "#ba1a1a" }}>{apiMessage}</p>}
        </div>
        <span className="sp-count-badge">{filteredProducts.length} sản phẩm</span>
      </header>

      <section className="admin-panel admin-filter-bar">
        <label className="admin-search-wrap">
          <span className="material-symbols-outlined">search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên sản phẩm hoặc tên shop"
          />
        </label>
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
      ) : filteredProducts.length === 0 ? (
        <EmptyState icon="styler" title="Không có sản phẩm" desc="Không có sản phẩm nào khớp bộ lọc hiện tại." />
      ) : (
        <section className="sp-product-list admin-product-list">
          {filteredProducts.map((product) => (
            <article className="sp-card admin-product-card" key={product.id}>
              <div className="sp-card-img-wrap">
                {productImage(product) ? (
                  <Image src={productImage(product)} alt={product.title} fill style={{ objectFit: "cover" }} sizes="180px" />
                ) : (
                  <div className="admin-image-placeholder">
                    <span className="material-symbols-outlined">image_not_supported</span>
                    <span>Không có ảnh</span>
                  </div>
                )}
              </div>

              <div className="sp-card-body">
                <div className="sp-card-shop">
                  <span className="sp-shop-avatar">{initials(sellerDisplayName(product.seller, product.sellerId))}</span>
                  <span className="sp-shop-name">{sellerDisplayName(product.seller, product.sellerId)}</span>
                </div>
                <h2 className="sp-card-title">{product.title}</h2>
                <p className="sp-card-meta">
                  {[product.brand, product.size ? `Size ${product.size}` : null, product.category].filter(Boolean).join(" · ")}
                </p>
                <div className="sp-card-price-row">
                  <span className="sp-price">{formatVnd(product.price)}</span>
                  <span className="sp-bids">{product.viewCount} views</span>
                </div>

                <div className="admin-product-badges">
                  <StatusBadge label={normalizedStatusLabel(product.status)} tone={productStatusTone(product.status)} />
                  <StatusBadge label={availabilityLabel(product.availabilityStatus)} tone={availabilityStatusTone(product.availabilityStatus)} />
                </div>

                <div className="sp-card-footer admin-product-actions">
                  <span className="sp-card-detail">
                    <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                    {formatShortDate(product.createdAt)}
                  </span>
                  <div className="admin-product-action-set">
                    <PillButton
                      tone="orange"
                      disabled={busyId === product.id || product.status === "HIDDEN" || product.status === "REMOVED"}
                      onClick={() => openModeration(product, "hide")}
                    >
                      Ẩn tin
                    </PillButton>
                    <PillButton
                      tone="red"
                      disabled={busyId === product.id || product.status === "REMOVED"}
                      onClick={() => openModeration(product, "remove")}
                    >
                      Gỡ tin
                    </PillButton>
                    <PillButton tone="accent" onClick={() => setSelected(product)}>
                      Xem chi tiết
                    </PillButton>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <DetailDrawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? ""} subtitle="Product detail">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="admin-id-image admin-product-detail-image">
              {productImage(selected) ? (
                <Image src={productImage(selected)} alt={selected.title} fill style={{ objectFit: "cover" }} sizes="520px" />
              ) : (
                <div className="admin-image-placeholder">
                  <span className="material-symbols-outlined">image_not_supported</span>
                  <span>Không có ảnh</span>
                </div>
              )}
            </div>
            <div className="admin-detail-grid">
              <div className="admin-detail-box">
                <span className="admin-detail-label">Seller</span>
                <span className="admin-detail-value">{sellerDisplayName(selected.seller, selected.sellerId)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Price</span>
                <span className="sp-price text-[24px]">{formatVnd(selected.price)}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Status</span>
                <StatusBadge label={normalizedStatusLabel(selected.status)} tone={productStatusTone(selected.status)} />
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Availability</span>
                <StatusBadge label={availabilityLabel(selected.availabilityStatus)} tone={availabilityStatusTone(selected.availabilityStatus)} />
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Category</span>
                <span className="admin-detail-value">{selected.category}</span>
              </div>
              <div className="admin-detail-box">
                <span className="admin-detail-label">Created</span>
                <span className="admin-detail-value">{formatShortDate(selected.createdAt)}</span>
              </div>
            </div>
            <div className="admin-detail-box">
              <span className="admin-detail-label">Description</span>
              <p className="admin-detail-value">{selected.description}</p>
            </div>
          </div>
        )}
      </DetailDrawer>

      {actionProduct && (
        <div className="admin-drawer-backdrop admin-modal-backdrop" role="dialog" aria-modal="true">
          <section className="admin-action-modal">
            <div className="admin-drawer-head">
              <div>
                <p className="sp-rep-sub">{actionType === "hide" ? "Hide product" : "Remove product"}</p>
                <h2 className="admin-drawer-title">{actionProduct.title}</h2>
              </div>
              <button className="admin-icon-btn" onClick={() => setActionProduct(null)} aria-label="Close modal">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="admin-drawer-body">
              {actionError && (
                <div className="admin-warning-banner">
                  <span className="material-symbols-outlined">warning</span>
                  <span>{actionError}</span>
                </div>
              )}
              <label className="admin-detail-label" htmlFor="product-action-reason">Lý do bắt buộc</label>
              <textarea
                id="product-action-reason"
                className="admin-textarea"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Nhập lý do ẩn/gỡ tin để lưu vào log admin..."
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <PillButton
                  tone={actionType === "hide" ? "orange" : "red"}
                  disabled={conflictBlocked || busyId === actionProduct.id || !reason.trim()}
                  onClick={applyModeration}
                >
                  {actionType === "hide" ? "Xác nhận ẩn tin" : "Xác nhận gỡ tin"}
                </PillButton>
                <PillButton tone="muted" onClick={() => setActionProduct(null)}>
                  Hủy
                </PillButton>
              </div>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
