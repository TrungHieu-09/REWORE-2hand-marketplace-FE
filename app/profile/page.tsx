"use client";

import { useState } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileSidebar, { ProfileTab } from "./_components/ProfileSidebar";
import TabOverview from "./_components/TabOverview";
import TabMyBids from "./_components/TabMyBids";
import TabSettings from "./_components/TabSettings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24">
      <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-10 flex flex-col gap-8">
        
        {/* Top Header Section */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <ProfileHeader />
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-w-0 pb-20">
            {activeTab === "overview" && <TabOverview />}
            {activeTab === "bids" && <TabMyBids />}
            {activeTab === "orders" && (
              <div className="opacity-0 animate-fade-in-up flex flex-col items-center justify-center text-center py-24 px-4 bg-white rounded-[20px] shadow-sm border border-[#f2dfd1]">
                <span className="material-symbols-outlined text-[64px] text-[#dbc1b9] mb-4">
                  inventory_2
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#231a11] mb-2">
                  No Orders Yet
                </h3>
                <p className="text-[#88726c] max-w-sm">
                  You haven't won any auctions or placed any orders recently. Start bidding to see your orders here.
                </p>
                <button className="mt-6 px-6 py-2.5 bg-[#b65a3c] text-white rounded-xl font-semibold shadow-md hover:bg-[#974226] transition-colors">
                  Explore Auctions
                </button>
              </div>
            )}
            {activeTab === "settings" && <TabSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
