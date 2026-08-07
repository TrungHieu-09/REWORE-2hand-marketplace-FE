"use client";

export type ProfileTab = "overview" | "bids" | "orders" | "settings";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "bids", label: "My Bids", icon: "gavel" },
    { id: "orders", label: "Orders & Returns", icon: "shopping_bag" },
    { id: "settings", label: "Account Settings", icon: "settings" },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:sticky md:top-24 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? "bg-[#b65a3c] text-white shadow-md shadow-[#b65a3c]/30"
                    : "text-[#55443d] hover:bg-[#feeadc] hover:text-[#974226]"
                }
              `}
            >
              <span className="material-symbols-outlined text-[20px]">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
