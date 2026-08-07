import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import AuthGuard from "@/app/components/AuthGuard";

export const metadata: Metadata = {
  title: "Auctions — REWORE",
  description:
    "Discover & bid on curated vintage and pre-loved pieces. Browse live sessions, upcoming drops, and ending-soon finds on REWORE.",
};

export default function AuctionsLayout({
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
