import AuthGuard from "@/app/components/AuthGuard";

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
