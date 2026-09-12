"use client";

export function StatCard({
  icon,
  label,
  value,
  sub,
  progress,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  progress?: number;
}) {
  return (
    <article className="admin-stat-card">
      <div className="sp-rep-head">
        <span
          className="material-symbols-outlined sp-rep-icon"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <div>
          <p className="sp-rep-sub">{label}</p>
          {sub && <p className="admin-stat-sub">{sub}</p>}
        </div>
      </div>
      <div className="sp-rep-score-row">
        <span className="sp-rep-num">{value}</span>
      </div>
      {typeof progress === "number" && (
        <>
          <div className="sp-rep-track">
            <div className="sp-rep-fill" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
          </div>
          <div className="sp-rep-tiers">
            <span>Starter</span>
            <span>Trusted</span>
            <span>Elite</span>
          </div>
        </>
      )}
    </article>
  );
}
