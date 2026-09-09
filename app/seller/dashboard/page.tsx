"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useSeller } from "../../context/SellerContext";
import {
  ApiError,
  auctionsApi,
  ordersApi,
  productsApi,
  type Auction,
  type Order,
  type Product,
} from "@/app/lib/api";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { sellerState } = useSeller();
  const [products, setProducts] = useState<Product[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const sellerScore = Math.max(sellerState.sellerScore, user?.reputation ?? 0);
  const LIVE_THRESHOLD = 75;
  const canLiveAuction = sellerScore >= LIVE_THRESHOLD;
  const isSeller = sellerState.isSeller || user?.role === "SELLER" || user?.role === "ADMIN";

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    Promise.allSettled([
      productsApi.list({ sellerId: user.id, limit: 50 }),
      auctionsApi.list({ limit: 50 }),
      ordersApi.list({ role: "seller", limit: 50 }),
    ]).then(([productResult, auctionResult, orderResult]) => {
      if (cancelled) return;

      if (productResult.status === "fulfilled") setProducts(productResult.value.data);
      if (auctionResult.status === "fulfilled") {
        setAuctions(auctionResult.value.data.filter((auction) => auction.sellerId === user.id));
      }
      if (orderResult.status === "fulfilled") setOrders(orderResult.value.data);

      const firstError = [productResult, auctionResult, orderResult].find(
        (result) => result.status === "rejected"
      );
      if (firstError?.status === "rejected") {
        const err = firstError.reason;
        setMessage(err instanceof ApiError ? err.message : "Some seller data could not be loaded.");
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const paidRevenue = orders
    .filter((order) => ["PAID", "SHIPPED", "DELIVERED"].includes(order.status))
    .reduce((sum, order) => sum + order.totalPrice + order.shippingFee, 0);

  const features = [
    {
      icon: "add_circle",
      title: "List an Item",
      description: "Product create API is ready; this screen still needs a listing form.",
      available: isSeller,
      href: "#",
      stat: `${products.length} listings`,
    },
    {
      icon: "inventory_2",
      title: "My Listings",
      description: "Loaded from /api/products filtered by your seller id.",
      available: true,
      href: "#",
      stat: `${products.filter((product) => product.status === "ACTIVE").length} active`,
    },
    {
      icon: "gavel",
      title: "Live Auctions",
      description: canLiveAuction
        ? "Loaded from /api/auctions and filtered by seller id."
        : `Unlock at seller score ${LIVE_THRESHOLD}. You need ${LIVE_THRESHOLD - sellerScore} more points.`,
      available: canLiveAuction,
      href: "#",
      stat: `${auctions.filter((auction) => auction.status === "LIVE").length} live`,
    },
    {
      icon: "payments",
      title: "Earnings",
      description: "Loaded from seller orders that are paid, shipped, or delivered.",
      available: true,
      href: "#",
      stat: `₫${new Intl.NumberFormat("vi-VN").format(paidRevenue)}`,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f5] pt-24 pb-20">
        <main className="max-w-[1280px] mx-auto px-5 md:px-12">
          <div className="mb-10 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#974226] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  storefront
                </span>
              </div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#974226]">
                Seller Dashboard
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[44px] font-bold text-[#231a11] leading-tight mb-2">
              Welcome back, {user?.name ?? "Seller"}!
            </h1>
            <p className="text-[16px] text-[#55433d]">
              Your seller score is <strong className="text-[#974226]">{sellerScore}</strong>. {loading ? "Loading seller data..." : "Dashboard data is mapped to backend APIs."}
            </p>
            {message && <p className="mt-2 text-sm text-[#ba1a1a]">{message}</p>}
          </div>

          <div
            className="mb-10 bg-white rounded-[20px] border border-[#dbc1b9]/30 shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex-1 w-full">
              <div className="flex justify-between text-[12px] text-[#88726c] mb-2 font-medium">
                <span>Seller Score: {sellerScore}</span>
                <span>Live Auctions unlocks at {LIVE_THRESHOLD}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f2dfd1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#974226] rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((sellerScore / LIVE_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
            {canLiveAuction ? (
              <span className="shrink-0 px-3 py-1.5 rounded-full bg-[#dae9b5] text-[#3f4b25] text-[12px] font-bold border border-[#becc9b]/60 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                Live Auctions unlocked
              </span>
            ) : (
              <span className="shrink-0 text-[13px] text-[#88726c] font-medium">
                {LIVE_THRESHOLD - sellerScore} pts to Live Auctions
              </span>
            )}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.10s" }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className={`bg-white rounded-[20px] p-6 border shadow-[0_4px_20px_-4px_rgba(43,33,24,0.06)] flex flex-col gap-4 transition-all duration-300 ${
                  f.available
                    ? "border-[#dbc1b9]/30 hover:shadow-[0_10px_32px_-6px_rgba(43,33,24,0.1)] hover:-translate-y-0.5 cursor-pointer group"
                    : "border-[#f2dfd1] opacity-60 cursor-not-allowed"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  f.available
                    ? "bg-[#ffdbd0]/50 group-hover:bg-[#974226]"
                    : "bg-[#f2dfd1]"
                }`}>
                  <span
                    className={`material-symbols-outlined text-[22px] transition-colors duration-300 ${
                      f.available ? "text-[#974226] group-hover:text-white" : "text-[#88726c]"
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {f.icon}
                  </span>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#974226] mb-2">{f.stat}</p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[17px] font-semibold text-[#231a11] mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-[#88726c] leading-relaxed">{f.description}</p>
                </div>
                {f.available && (
                  <a href={f.href} className="mt-auto flex items-center gap-1 text-[12px] font-semibold text-[#974226] group-hover:gap-2 transition-all">
                    <span>Open</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          <div
            className="text-center opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.18s" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#f2dfd1]/40 border border-[#dbc1b9]/30 rounded-full px-5 py-2.5 text-[13px] text-[#88726c]">
              <span className="material-symbols-outlined text-[16px]">construction</span>
              Create product and create auction APIs are wrapped, but form UI is still pending.
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/profile" className="text-[13px] font-semibold text-[#974226] hover:underline underline-offset-4">
              ← Back to Profile
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}


