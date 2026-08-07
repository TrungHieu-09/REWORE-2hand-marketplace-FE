"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after component is mounted (localStorage has been read)
    if (mounted && !isLoggedIn) {
      router.replace("/login");
    }
  }, [mounted, isLoggedIn, router]);

  // While hydrating, show nothing (avoids flash + wrong redirect)
  if (!mounted) return null;

  // Logged in — show the page
  if (isLoggedIn) return <>{children}</>;

  // Not logged in — show nothing while redirect happens
  return null;
}
