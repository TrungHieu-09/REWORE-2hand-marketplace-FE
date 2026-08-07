import type { AuctionStatus } from "../_data/mock-auctions";

interface LiveBadgeProps {
  status: AuctionStatus;
  startsInLabel?: string;
  variant?: "pill" | "tag";
}

export default function LiveBadge({
  status,
  startsInLabel,
  variant = "pill",
}: LiveBadgeProps) {
  const base =
    variant === "pill"
      ? "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider backdrop-blur-sm shadow-sm"
      : "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-sm shadow-sm";

  if (status === "live") {
    return (
      <span className={`${base} bg-white/90 text-[#974226]`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b65a3c] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b65a3c]" />
        </span>
        LIVE
      </span>
    );
  }

  if (status === "starts_soon") {
    return (
      <span className={`${base} bg-white/90 text-[#55433d]`}>
        <span className="material-symbols-outlined text-[14px] text-[#88726c]">
          schedule
        </span>
        Starts in {startsInLabel}
      </span>
    );
  }

  if (status === "starts_tomorrow") {
    return (
      <span className={`${base} bg-white/90 text-[#55433d]`}>
        <span className="material-symbols-outlined text-[14px] text-[#88726c]">
          calendar_today
        </span>
        Starts Tomorrow
      </span>
    );
  }

  return null;
}
