"use client";

import { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  className?: string;
}

export default function CountdownTimer({
  initialSeconds,
  className = "",
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const isUrgent = seconds < 120;

  return (
    <span
      className={`font-mono tabular-nums tracking-tight transition-colors ${
        isUrgent ? "text-red-500 animate-pulse" : "text-[#b65a3c]"
      } ${className}`}
    >
      {mins}:{secs}
    </span>
  );
}
