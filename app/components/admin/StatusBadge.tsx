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

export function userStatusTone(isBanned?: boolean): BadgeTone {
  return isBanned ? "red" : "green";
}

export function roleTone(role: string): BadgeTone {
  if (role === "ADMIN") return "red";
  if (role === "SELLER") return "orange";
  return "neutral";
}

export function productStatusTone(status: string): BadgeTone {
  if (status === "ACTIVE") return "green";
  if (status === "HIDDEN" || status === "INACTIVE") return "orange";
  if (status === "REMOVED" || status === "SOLD") return "red";
  return "neutral";
}

export function availabilityStatusTone(status?: string): BadgeTone {
  if (status === "available") return "green";
  if (status === "upcoming_drop" || status === "held") return "orange";
  if (status === "sold") return "red";
  return "neutral";
}
