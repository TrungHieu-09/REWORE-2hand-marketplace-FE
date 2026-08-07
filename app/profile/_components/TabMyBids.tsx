"use client";

import Image from "next/image";
import { ACTIVE_BIDS } from "../../auctions/_data/mock-auctions";

function formatVND(amount: number) {
  return "₫" + new Intl.NumberFormat("vi-VN").format(amount);
}

export default function TabMyBids() {
  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#231a11] mb-1">
            My Bids
          </h3>
          <p className="text-sm text-[#88726c]">
            Track your active auctions and bidding history.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)] border border-[#f2dfd1] overflow-hidden">
        {ACTIVE_BIDS.map((bid, i) => {
          const isWinning = bid.status === "winning";
          return (
            <div
              key={bid.id}
              className={`flex flex-col sm:flex-row gap-5 p-6 ${
                i < ACTIVE_BIDS.length - 1 ? "border-b border-[#f2dfd1]" : ""
              } hover:bg-[#fff8f5] transition-colors`}
            >
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-[#feeadc]">
                <Image src={bid.imageUrl} alt={bid.title} fill className="object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="text-lg font-semibold text-[#231a11] mb-1">
                    {bid.title}
                  </h4>
                  <p className="text-sm text-[#55443d] mb-3">
                    Auction ends in: <span className="font-semibold text-[#974226]">12:05:30</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[11px] text-[#88726c] uppercase font-semibold tracking-wider mb-0.5">Your Bid</p>
                    <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11]">
                      {formatVND(bid.yourBid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#88726c] uppercase font-semibold tracking-wider mb-0.5">Status</p>
                    {isWinning ? (
                      <span className="flex items-center gap-1 text-[13px] font-semibold text-[#556138]">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        Winning
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[13px] font-semibold text-[#ba1a1a]">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        Outbid
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end sm:min-w-[140px]">
                {isWinning ? (
                  <button className="w-full py-2.5 bg-[#f2dfd1] text-[#55443d] rounded-xl text-xs font-semibold hover:bg-[#e9d7c8] transition-colors">
                    View Auction
                  </button>
                ) : (
                  <button className="w-full py-2.5 bg-[#b65a3c] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#b65a3c]/30 hover:bg-[#974226] hover:-translate-y-0.5 transition-all">
                    Increase Bid
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
