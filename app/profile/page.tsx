"use client";

import { useState } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileTabNav, { ProfileTab } from "./_components/ProfileSidebar";
import ProfileRightSidebar from "./_components/ProfileRightSidebar";
import TabOverview from "./_components/TabOverview";
import TabMyBids from "./_components/TabMyBids";
import TabOrders from "./_components/TabOrders";
import TabSettings from "./_components/TabSettings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>(() =>
    typeof window !== "undefined" && window.location.hash === "#settings"
      ? "settings"
      : "overview"
  );

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24 pb-16">
      <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <ProfileHeader />
            <ProfileTabNav activeTab={activeTab} onTabChange={setActiveTab} />
            <div id="settings">
              {activeTab === "overview" && <TabOverview />}
              {activeTab === "bids" && <TabMyBids />}
              {activeTab === "orders" && <TabOrders />}
              {activeTab === "settings" && <TabSettings />}
            </div>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <ProfileRightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
