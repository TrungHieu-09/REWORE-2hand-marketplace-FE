"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useHold } from "../context/HoldContext";

interface ChatMessage {
  id: string;
  sender: "buyer" | "seller";
  text: string;
  time: string;
  isProductCard?: boolean;
}

interface Conversation {
  id: string;
  shopName: string;
  shopAvatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  productId?: number;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetShop = searchParams.get("shop");
  const targetProductId = searchParams.get("productId")
    ? parseInt(searchParams.get("productId")!, 10)
    : null;

  const {
    heldItems,
    releaseHold,
    confirmSold,
    getRemainingSeconds,
    reputationScore,
  } = useHold();

  // Danh sách hội thoại mẫu
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "shop-1",
      shopName: "The Archive Room",
      shopAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      lastMessage: "Dạ món Wool Tweed Blazer còn giữ cho bạn trong 15p nhé!",
      lastTime: "Vừa xong",
      unreadCount: 1,
      productId: 1,
    },
    {
      id: "shop-2",
      shopName: "Silk & Stone",
      shopAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      lastMessage: "Bạn cần thêm ảnh chi tiết chất vải không ạ?",
      lastTime: "10:30",
      unreadCount: 0,
      productId: 2,
    },
    {
      id: "shop-3",
      shopName: "Maison Vintage",
      shopAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      lastMessage: "Cảm ơn bạn đã tham gia phiên đấu giá!",
      lastTime: "Hôm qua",
      unreadCount: 0,
      productId: 6,
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>("shop-1");
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Món đồ đang được giữ liên kết với cuộc hội thoại hiện tại
  const currentConv = conversations.find((c) => c.id === activeConvId);
  const activeHeldItem = heldItems.find(
    (item) =>
      item.shop.toLowerCase() === currentConv?.shopName.toLowerCase() ||
      item.id === currentConv?.productId
  );

  const secondsRemaining = activeHeldItem ? getRemainingSeconds(activeHeldItem.id) : 0;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Tin nhắn trong khung chat
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "shop-1": [
      {
        id: "m-init",
        sender: "buyer",
        text: "Chào shop! Mình vừa giữ món Wool Tweed Blazer trên REWORE và muốn chốt mua món này.",
        time: "10:45",
        isProductCard: true,
      },
      {
        id: "m-1",
        sender: "seller",
        text: "Chào bạn! Cảm ơn bạn đã quan tâm. Hệ thống REWORE đã khóa độc quyền món Wool Tweed Blazer cho bạn trong 15 phút rồi nhé ạ.",
        time: "10:46",
      },
      {
        id: "m-2",
        sender: "seller",
        text: "Bạn muốn nhận hàng qua hình thức chuyển khoản quét mã VietQR hay ship COD ạ? Cho shop xin thông tin địa chỉ & SĐT nhé!",
        time: "10:46",
      },
    ],
    "shop-2": [
      {
        id: "s2-1",
        sender: "seller",
        text: "Chào bạn, bạn có cần hỗ trợ gì về chiếc áo Silk Cami không ạ?",
        time: "10:30",
      },
    ],
    "shop-3": [
      {
        id: "s3-1",
        sender: "seller",
        text: "Chúc mừng bạn đã theo dõi phiên đấu giá của Maison Vintage!",
        time: "Hôm qua",
      },
    ],
  });

  // Tự động chuyển đến shop nếu có param từ URL
  useEffect(() => {
    if (targetShop) {
      const found = conversations.find(
        (c) => c.shopName.toLowerCase() === targetShop.toLowerCase()
      );
      if (found) {
        setActiveConvId(found.id);
      } else {
        // Tạo cuộc hội thoại mới với shop này
        const newId = `shop-${Date.now()}`;
        const newConv: Conversation = {
          id: newId,
          shopName: targetShop,
          shopAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          lastMessage: "Trao đổi chốt đơn món hàng đang giữ",
          lastTime: "Vừa xong",
          unreadCount: 0,
          productId: targetProductId || undefined,
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConvId(newId);

        // Tạo tin nhắn khởi đầu
        setMessages((prev) => ({
          ...prev,
          [newId]: [
            {
              id: `m-${Date.now()}`,
              sender: "buyer",
              text: `Chào shop! Mình vừa bấm giữ món hàng trên REWORE và muốn trao đổi chốt đơn.`,
              time: "Vừa xong",
              isProductCard: true,
            },
            {
              id: `m-${Date.now() + 1}`,
              sender: "seller",
              text: `Chào bạn! Cảm ơn bạn. Món đồ đang được giữ độc quyền cho bạn. Bạn có thể bấm nút "Chốt đơn & Thanh toán" ở trên hoặc nhắn tin địa chỉ giao hàng cho shop nhé!`,
              time: "Vừa xong",
            },
          ],
        }));
      }
    }
  }, [targetShop, targetProductId]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConvId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "buyer",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), userMsg],
    }));
    setInputMessage("");

    // Giả lập Shop trả lời tự động sau 1.2s
    setTimeout(() => {
      const sellerReplies = [
        "Shop đã nhận được thông tin của bạn! Bạn có thể bấm 'Chốt đơn & Thanh toán' ngay phía trên để nhận hàng nhé.",
        "Dạ shop đóng gói chuẩn hộp vintage cẩn thận cho bạn ngay. Bạn kiểm tra lại size và địa chỉ chuẩn giúp shop nha!",
        "Vâng ạ! Nếu bạn chuyển khoản trước qua VietQR sẽ được miễn phí vận chuyển toàn quốc đó ạ.",
      ];
      const randomReply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)];

      setMessages((prev) => ({
        ...prev,
        [activeConvId]: [
          ...(prev[activeConvId] || []),
          {
            id: `reply-${Date.now()}`,
            sender: "seller",
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
    }, 1200);
  };

  const handleCancelHold = (productId: number) => {
    if (confirm("Bạn có chắc chắn muốn hủy giữ món này không? Món đồ sẽ được mở lại cho cộng đồng và bạn không bị phạt điểm uy tín.")) {
      const res = releaseHold(productId);
      alert(res.message);
    }
  };

  const handleShopConfirmSold = (productId: number) => {
    const res = confirmSold(productId);
    alert(`${res.message}\nĐiểm uy tín mới của bạn: ${res.newScore} điểm!`);
  };

  return (
    <div className="min-h-screen bg-[#f7f4f0] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-[#786a60]">
            <Link href="/shop" className="hover:text-[#974226] transition-colors">
              Cửa hàng
            </Link>
            <span>/</span>
            <span className="text-[#231a11] font-semibold">Tin nhắn & Trao đổi giao dịch</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ede1d2] text-[#4d463b] rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#974226]">verified_user</span>
              <span>Điểm uy tín: <strong className="text-[#974226]">{reputationScore}</strong></span>
            </div>
            {heldItems.length > 0 && (
              <span className="px-3 py-1 bg-[#ffdbd0] text-[#7b2e14] rounded-full text-xs font-bold animate-pulse">
                Đang giữ {heldItems.length} món đồ
              </span>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-[24px] shadow-[0_10px_35px_-5px_rgba(43,33,24,0.06)] border border-[#dbc1b9]/40 overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          {/* ── CỘT TRÁI: DANH SÁCH HỘI THOẠI ── */}
          <div className="w-full md:w-[320px] lg:w-[360px] border-r border-[#dbc1b9]/30 flex flex-col bg-[#fcfaf7]">
            {/* Search conversations */}
            <div className="p-4 border-b border-[#dbc1b9]/30">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#88726c]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Tìm shop hoặc tin nhắn..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-full text-xs border border-[#dbc1b9]/60 focus:outline-none focus:border-[#974226]"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#dbc1b9]/20">
              {conversations.map((c) => {
                const isActive = c.id === activeConvId;
                const hasHeld = heldItems.some(
                  (i) => i.shop.toLowerCase() === c.shopName.toLowerCase()
                );

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isActive
                        ? "bg-[#feeadc]/60 border-l-4 border-l-[#974226]"
                        : "hover:bg-[#f6f0e8]/50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={c.shopAvatar}
                        alt={c.shopName}
                        width={44}
                        height={44}
                        className="rounded-full object-cover border border-[#dbc1b9]/40"
                      />
                      {hasHeld && (
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#974226] text-white rounded-full flex items-center justify-center text-[10px]"
                          title="Đang giữ hàng từ shop này"
                        >
                          <span className="material-symbols-outlined text-[10px]">lock</span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-sm font-semibold text-[#231a11] truncate">
                          {c.shopName}
                        </h4>
                        <span className="text-[11px] text-[#88726c]">{c.lastTime}</span>
                      </div>
                      <p className="text-xs text-[#55433d] truncate">{c.lastMessage}</p>

                      {hasHeld && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffdbd0] text-[#7b2e14] rounded text-[10px] font-bold">
                          <span>⏳ Đang giữ đồ ({timeFormatted})</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CỘT PHẢI: KHUNG CHAT & PINNED ITEM ── */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Top Header */}
            <div className="px-6 py-4 border-b border-[#dbc1b9]/30 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <Image
                  src={currentConv?.shopAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                  alt="Shop"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-[#dbc1b9]/40"
                />
                <div>
                  <h3 className="font-semibold text-sm text-[#231a11] flex items-center gap-1.5">
                    {currentConv?.shopName}
                    <span className="material-symbols-outlined text-[15px] text-[#974226]" title="Shop đã xác minh">
                      verified
                    </span>
                  </h3>
                  <span className="text-[11px] text-[#556138] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#556138] inline-block animate-pulse"></span>
                    Đang hoạt động · Phản hồi trong 2 phút
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href="/shop"
                  className="px-3 py-1.5 text-xs font-semibold text-[#655d52] hover:text-[#231a11] border border-[#dbc1b9] rounded-full transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">storefront</span>
                  Xem shop
                </Link>
              </div>
            </div>

            {/* ── PINNED HELD ITEM BANNER (Nếu có đồ đang giữ từ shop này) ── */}
            {activeHeldItem && (
              <div className="bg-[#fff1e8] border-b border-[#ffdbd0] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-12 h-14 relative rounded-md overflow-hidden flex-shrink-0 border border-[#dbc1b9]">
                    <Image
                      src={activeHeldItem.img}
                      alt={activeHeldItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#974226] text-white rounded text-[10px] font-bold uppercase tracking-wider">
                        ĐANG GIỮ HÀNG
                      </span>
                      <span className="text-xs font-bold text-[#ba1a1a] flex items-center gap-1 bg-[#ffdad6] px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        ⏳ {timeFormatted} còn lại
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#231a11] line-clamp-1 mt-0.5">
                      {activeHeldItem.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#974226]">
                      ${activeHeldItem.price} · {activeHeldItem.meta || "One-of-one Vintage"}
                    </span>
                  </div>
                </div>

                {/* Chốt đơn / Hủy giữ actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleCancelHold(activeHeldItem.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/60 rounded-full transition-colors border border-[#ffdad6]"
                    title="Hủy giữ mà không bị trừ điểm uy tín"
                  >
                    Hủy giữ
                  </button>

                  <Link
                    href={`/checkout?productId=${activeHeldItem.id}`}
                    className="px-4 py-1.5 text-xs font-bold bg-[#974226] hover:bg-[#b65a3c] text-white rounded-full transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                    Chốt đơn & Thanh toán
                  </Link>

                  {/* Nút giả lập Shop chốt bán */}
                  <button
                    onClick={() => handleShopConfirmSold(activeHeldItem.id)}
                    className="px-3 py-1.5 text-[11px] font-semibold bg-[#ede1d2] hover:bg-[#dbc1b9] text-[#4d463b] rounded-full transition-colors hidden lg:flex items-center gap-1"
                    title="Giả lập thao tác người bán bấm 'Xác nhận đã bán' để test luồng hoàn tất"
                  >
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    [Shop] Xác nhận đã bán
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fdfbf9]/60">
              {(messages[activeConvId] || []).map((msg) => {
                const isBuyer = msg.sender === "buyer";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBuyer ? "items-end" : "items-start"}`}
                  >
                    {/* Thẻ sản phẩm kèm trong tin nhắn đầu tiên */}
                    {msg.isProductCard && activeHeldItem && (
                      <div className="mb-2 max-w-[280px] bg-white rounded-xl border border-[#dbc1b9] p-3 shadow-sm flex gap-3">
                        <div className="w-12 h-14 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={activeHeldItem.img}
                            alt={activeHeldItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#974226] uppercase">
                            Món hàng đang giữ
                          </span>
                          <p className="text-xs font-semibold text-[#231a11] truncate">
                            {activeHeldItem.name}
                          </p>
                          <p className="text-xs font-bold text-[#974226]">${activeHeldItem.price}</p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isBuyer
                          ? "bg-[#974226] text-white rounded-br-none"
                          : "bg-white text-[#231a11] border border-[#dbc1b9]/40 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#88726c] mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick response chips */}
            <div className="px-6 pt-2 pb-1 bg-white border-t border-[#dbc1b9]/20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <span className="text-[11px] text-[#88726c] whitespace-nowrap">Gợi ý nhanh:</span>
              <button
                onClick={() => setInputMessage("Shop ơi, mình chốt chuyển khoản VietQR nhé, cho mình xin mã QR!")}
                className="text-[11px] px-2.5 py-1 bg-[#f2dfd1]/60 hover:bg-[#f2dfd1] text-[#7b2e14] rounded-full whitespace-nowrap transition-colors"
              >
                Chốt chuyển khoản VietQR
              </button>
              <button
                onClick={() => setInputMessage("Mình muốn nhận hàng theo hình thức ship COD kiểm tra hàng ạ.")}
                className="text-[11px] px-2.5 py-1 bg-[#f2dfd1]/60 hover:bg-[#f2dfd1] text-[#7b2e14] rounded-full whitespace-nowrap transition-colors"
              >
                Nhận hàng ship COD
              </button>
              <button
                onClick={() => setInputMessage("Áo này có vừa với người 1m68 nặng 60kg không bạn ơi?")}
                className="text-[11px] px-2.5 py-1 bg-[#f2dfd1]/60 hover:bg-[#f2dfd1] text-[#7b2e14] rounded-full whitespace-nowrap transition-colors"
              >
                Tư vấn thêm về kích cỡ (Size)
              </button>
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#dbc1b9]/30 flex items-center gap-3">
              <button
                type="button"
                className="p-2 text-[#88726c] hover:text-[#974226] transition-colors"
                title="Gửi hình ảnh hoặc bằng chứng chuyển khoản"
                onClick={() => alert("Tính năng gửi đính kèm ảnh chụp đang sẵn sàng.")}
              >
                <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
              </button>

              <input
                type="text"
                placeholder="Nhập tin nhắn trao đổi với shop về địa chỉ, thanh toán..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 py-2.5 px-4 bg-[#f7f4f0] rounded-full text-xs text-[#231a11] border border-[#dbc1b9]/50 focus:outline-none focus:border-[#974226]"
              />

              <button
                type="submit"
                className="p-2.5 bg-[#974226] text-white rounded-full hover:bg-[#b65a3c] transition-colors flex items-center justify-center shadow-sm disabled:opacity-40"
                disabled={!inputMessage.trim()}
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4f0] flex items-center justify-center">Đang tải tin nhắn...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
