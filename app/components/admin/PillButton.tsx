"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type PillTone = "accent" | "dark" | "green" | "orange" | "red" | "muted";

const toneClass: Record<PillTone, string> = {
  accent: "admin-pill-accent",
  dark: "admin-pill-dark",
  green: "admin-pill-green",
  orange: "admin-pill-orange",
  red: "admin-pill-red",
  muted: "admin-pill-muted",
};

export function PillButton({
  children,
  tone = "accent",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: PillTone;
}) {
  return (
    <button className={`admin-pill ${toneClass[tone]} ${className}`} {...props}>
      {children}
    </button>
  );
}
