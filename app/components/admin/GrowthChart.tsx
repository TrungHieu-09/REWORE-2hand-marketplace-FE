"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type GrowthPoint = {
  date: string;
  users: number;
  gmv: number;
};

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-section-head">
        <div>
          <p className="sp-rep-sub">Growth</p>
          <h2 className="sp-section-title">User mới / GMV theo ngày</h2>
        </div>
      </div>
      <div className="admin-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="var(--outline)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="users" stroke="var(--outline)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="gmv" orientation="right" stroke="var(--outline)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 12,
                color: "var(--on-surface)",
                fontFamily: "var(--font-manrope)",
              }}
            />
            <Line yAxisId="users" type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={3} dot={{ r: 3 }} />
            <Line yAxisId="gmv" type="monotone" dataKey="gmv" stroke="#556138" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
