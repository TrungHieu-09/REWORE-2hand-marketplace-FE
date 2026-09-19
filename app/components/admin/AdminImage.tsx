"use client";

import { useMemo, useState } from "react";
import { API_BASE_URL } from "@/app/lib/api";

export function resolveApiAssetUrl(src?: string | null) {
  if (!src) return "";
  if (src.startsWith("blob:")) return "";
  if (src.startsWith("data:")) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return `${API_BASE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export function AdminImage({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState("");
  const resolvedSrc = useMemo(() => resolveApiAssetUrl(src), [src]);

  if (!resolvedSrc || failedSrc === resolvedSrc) {
    return (
      <div className={`admin-image-placeholder ${className}`}>
        <span className="material-symbols-outlined">broken_image</span>
        <span>Không có ảnh</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={`admin-image ${className}`}
      onError={() => setFailedSrc(resolvedSrc)}
    />
  );
}
