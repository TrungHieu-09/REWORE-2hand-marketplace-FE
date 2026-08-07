"use client";

import { useState } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileTabNav, { ProfileTab } from "./_components/ProfileSidebar";
import ProfileRightSidebar from "./_components/ProfileRightSidebar";
import TabOverview from "./_components/TabOverview";
import TabMyBids from "./_components/TabMyBids";
import TabSettings from "./_components/TabSettings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24 pb-16">
      <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-10 md:py-14">

        {/* ── Two-column grid ── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          {/* ── LEFT COLUMN (8/12) ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>

            {/* Profile Header Card */}
            <ProfileHeader />

            {/* Horizontal Tab Nav */}
            <ProfileTabNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div>
              {activeTab === "overview" && <TabOverview />}
              {activeTab === "bids" && <TabMyBids />}
              {activeTab === "orders" && (
                <div className="opacity-0 animate-fade-in-up flex flex-col items-center justify-center text-center py-24 px-4 bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(43,33,24,0.07)] border border-[#dbc1b9]/30">
                  <span className="material-symbols-outlined text-[64px] text-[#dbc1b9] mb-4">
                    inventory_2
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#231a11] mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-[#88726c] max-w-sm text-sm leading-relaxed">
                    You haven&apos;t won any auctions or placed any orders recently. Start bidding to see your orders here.
                  </p>
                  <button className="mt-6 px-7 py-2.5 bg-[#974226] text-white rounded-full text-sm font-semibold hover:bg-[#b65a3c] transition-colors shadow-sm">
                    Explore Auctions
                  </button>
                </div>
              )}
              {activeTab === "settings" && <TabSettings />}
            </div>
          </div>

          {/* ── RIGHT COLUMN (4/12) ── */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <ProfileRightSidebar />
          </div>

        </div>
      </main>
    </div>
  );
}
