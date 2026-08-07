import AuthGuard from "@/app/components/AuthGuard";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
