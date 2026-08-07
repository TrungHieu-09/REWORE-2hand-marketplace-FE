"use client";

export type ProfileTab = "overview" | "bids" | "orders" | "settings";

interface ProfileTabNavProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileTabNav({ activeTab, onTabChange }: ProfileTabNavProps) {
  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "bids", label: "My Bids" },
    { id: "orders", label: "Orders & Returns" },
    { id: "settings", label: "Account Settings" },
  ];

  return (
    <div className="flex overflow-x-auto border-b border-[#dbc1b9]/40 hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              pb-3 px-1 mr-8 text-[13px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border-b-2 -mb-px
              ${isActive
                ? "border-[#974226] text-[#974226]"
                : "border-transparent text-[#55443d] hover:text-[#231a11]"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
