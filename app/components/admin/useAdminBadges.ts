"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/app/lib/api";

export function useAdminBadges() {
  const [badges, setBadges] = useState({ pendingSellers: 0, openReports: 0 });

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      adminApi.sellerApplications({ status: "PENDING", limit: 1 }),
      adminApi.reports({ status: "OPEN", limit: 1 }),
    ]).then(([sellerResult, reportResult]) => {
      if (cancelled) return;

      setBadges({
        pendingSellers: sellerResult.status === "fulfilled" ? sellerResult.value.meta.total : 0,
        openReports: reportResult.status === "fulfilled" ? reportResult.value.meta.total : 0,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return badges;
}
