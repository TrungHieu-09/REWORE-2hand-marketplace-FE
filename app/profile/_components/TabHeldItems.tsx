"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHold } from "../../context/HoldContext";

export default function TabHeldItems() {
  const router = useRouter();
  const {
    heldItems,
    waitlistItems,
    releaseHold,
    getRemainingSeconds,
    reputationScore,
  } = useHold();

  const handleCancelHold = (productId: number, name: string) => {
    if (confirm(`Bạn có chắc muốn hủy giữ "${name}" không? Món đồ sẽ được mở lại cho cộng đồng và bạn KHÔNG bị trừ điểm uy tín.`)) {
      const res = releaseHold(productId);
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
      {/* ── Policy Banner ── */}
      <div className="bg-[#feeadc]/60 border border-[#dbc1b9]/50 rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#974226] text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">lock_clock</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#231a11]">
              Chính Sách Giữ Hàng Độc Quyền (Hold Item)
            </h4>
            <p className="text-xs text-[#55433d] mt-0.5">
              Bạn có thể giữ tối đa <strong>3 món cùng lúc</strong> trong vòng <strong>15 phút</strong>. Hãy nhắn tin trao đổi với shop để chốt đơn đúng hẹn.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-semibold text-[#88726c]">Điểm uy tín:</span>
          <span className="px-3 py-1 bg-[#974226] text-white rounded-full text-xs font-bold">
            {reputationScore} điểm
          </span>
        </div>
      </div>

      {/* ── Danh sách món đang giữ ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11] flex items-center gap-2">
            Đang Giữ Hàng
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#974226] text-white rounded-full">
              {heldItems.length}/3
            </span>
          </h3>

          <Link
            href="/shop"
            className="text-xs font-semibold text-[#974226] hover:underline flex items-center gap-1"
          >
            <span>Khám phá thêm</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        {heldItems.length === 0 ? (
          <div className="bg-white rounded-[20px] p-12 text-center border border-[#dbc1b9]/30 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#f2dfd1] text-[#974226] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">lock_open</span>
            </div>
            <h4 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11] mb-2">
              Bạn Chưa Giữ Món Đồ Nào
            </h4>
            <p className="text-xs text-[#88726c] max-w-md leading-relaxed mb-6">
              Khi thấy một món đồ si độc bản ưng ý tại mục Cửa Hàng, hãy bấm <strong>&ldquo;Hold Item&rdquo;</strong> để giữ đồ trong 15 phút và nhắn tin thương lượng với shop.
            </p>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-[#974226] hover:bg-[#b65a3c] text-white rounded-full text-xs font-bold transition-colors shadow-sm"
            >
              Xem Cửa Hàng Ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {heldItems.map((item) => {
              const secondsLeft = getRemainingSeconds(item.id);
              const m = Math.floor(secondsLeft / 60);
              const s = secondsLeft % 60;
              const formatted = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[20px] p-5 border border-[#dbc1b9]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 hover:border-[#974226]/40 transition-colors"
                >
                  {/* Info Column */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-20 h-24 relative rounded-xl overflow-hidden flex-shrink-0 border border-[#dbc1b9]/50">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#974226] bg-[#ffdbd0] px-2 py-0.5 rounded uppercase">
                          Shop: {item.shop}
                        </span>
                        <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] animate-pulse">timer</span>
                          ⏳ {formatted} còn lại
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-[#231a11] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#88726c] mt-0.5">{item.meta || "Secondhand độc bản"}</p>
                      <p className="text-sm font-extrabold text-[#974226] mt-1.5">
                        ${item.price}
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#dbc1b9]/30">
                    {/* BƯỚC 3 - LỰA CHỌN B: HỦY GIỮ */}
                    <button
                      onClick={() => handleCancelHold(item.id, item.name)}
                      className="px-4 py-2 border border-[#dbc1b9] text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-full text-xs font-semibold transition-colors"
                      title="Hủy giữ mà không bị phạt điểm"
                    >
                      Hủy giữ
                    </button>

                    {/* BƯỚC 3 - LỰA CHỌN A: NHẮN TIN CHO SHOP */}
                    <Link
                      href={`/messages?shop=${encodeURIComponent(item.shop)}&productId=${item.id}`}
                      className="px-4 py-2 bg-[#655d52] hover:bg-[#231a11] text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                      Nhắn tin cho shop
                    </Link>

                    {/* Chốt đơn & Thanh toán ngay */}
                    <Link
                      href={`/checkout?productId=${item.id}`}
                      className="px-5 py-2 bg-[#974226] hover:bg-[#b65a3c] text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                      Thanh toán ngay
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Waitlist (Hàng Đợi) ── */}
      {waitlistItems.length > 0 && (
        <div className="mt-8">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#231a11] mb-3">
            Hàng Đợi Của Bạn (Waitlist)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {waitlistItems.map((w, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-[#dbc1b9]/40 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#655d52] uppercase">
                    Shop: {w.shop}
                  </span>
                  <h4 className="text-xs font-bold text-[#231a11] mt-0.5">{w.productName}</h4>
                  <span className="text-[11px] text-[#556138] mt-1 inline-block">
                    Vị trí hàng đợi: <strong>#{w.position}</strong>
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-[#ede1d2] text-[#4d463b] rounded-full text-[11px] font-semibold">
                  Đang chờ lượt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
