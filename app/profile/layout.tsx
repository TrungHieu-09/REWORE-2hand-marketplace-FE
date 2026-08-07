import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import AuthGuard from "@/app/components/AuthGuard";

export const metadata: Metadata = {
  title: "My Profile — REWORE",
  description: "Manage your account, active bids, and orders on REWORE.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />
      {children}
    </AuthGuard>
  );
}
