"use client";

import { useState } from "react";
import type { AuctionCategory } from "../_data/mock-auctions";
import { CATEGORIES } from "../_data/mock-auctions";

const SORT_OPTIONS = [
  "Ending Soon",
  "Starting Soon",
  "Highest Bid",
  "Lowest Bid",
  "Most Watched",
];

interface CategoryFilterBarProps {
  active: AuctionCategory;
  onChange: (cat: AuctionCategory) => void;
}

export default function CategoryFilterBar({
  active,
  onChange,
}: CategoryFilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("Ending Soon");

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`
                relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-[#b65a3c] text-white shadow-md shadow-[#b65a3c]/30 scale-105"
                    : "bg-[#f8e5d6] text-[#55433d] border border-[#dbc1b9] hover:bg-[#f2dfd1] hover:scale-105"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setSortOpen((p) => !p)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#88726c] text-[#231a11] text-xs font-semibold tracking-wide hover:bg-[#f2dfd1] transition-colors"
        >
          Sort by: {sort}
          <span
            className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
          >
            expand_more
          </span>
        </button>

        {sortOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#dbc1b9] overflow-hidden z-20">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSort(opt);
                  setSortOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors
                  ${opt === sort ? "bg-[#feeadc] text-[#974226]" : "text-[#231a11] hover:bg-[#fff1e8]"}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
