"use client";

import type { ReactNode } from "react";

export function DetailDrawer({
  title,
  subtitle,
  open,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="admin-drawer-backdrop" role="dialog" aria-modal="true">
      <section className="admin-drawer">
        <div className="admin-drawer-head">
          <div>
            <p className="sp-rep-sub">{subtitle}</p>
            <h2 className="admin-drawer-title">{title}</h2>
          </div>
          <button className="admin-icon-btn" onClick={onClose} aria-label="Close detail">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="admin-drawer-body">{children}</div>
      </section>
    </div>
  );
}
