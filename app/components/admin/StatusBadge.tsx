"use client";

type BadgeTone = "green" | "orange" | "red" | "neutral";

const toneClass: Record<BadgeTone, string> = {
  green: "admin-badge-green",
  orange: "admin-badge-orange",
  red: "admin-badge-red",
  neutral: "admin-badge-neutral",
};

export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span className={`admin-status-badge ${toneClass[tone]}`}>
      <span className="admin-status-dot" />
      {label}
    </span>
  );
}

export function sellerStatusTone(status: string): BadgeTone {
  if (status === "APPROVED") return "green";
  if (status === "REJECTED") return "red";
  if (status === "PENDING" || status === "PENDING_VERIFICATION") return "orange";
  return "neutral";
}

export function reportStatusTone(status: string): BadgeTone {
  if (status === "RESOLVED") return "green";
  if (status === "DISMISSED") return "neutral";
  return "red";
}

export function orderStatusTone(status: string): BadgeTone {
  if (status === "PAID" || status === "SHIPPED" || status === "DELIVERED") return "green";
  if (status === "CANCELLED" || status === "REFUNDED") return "red";
  return "orange";
}
