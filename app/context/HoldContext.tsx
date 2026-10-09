"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface HeldItem {
  id: number;
  name: string;
  shop: string;
  meta?: string;
  price: number;
  img: string;
  heldAt: number;
  expiresAt: number; // timestamp in ms
}

export interface WaitlistItem {
  productId: number;
  productName: string;
  shop: string;
  position: number;
  joinedAt: number;
}

export interface PurchasedItem {
  id: number;
  name: string;
  shop: string;
  price: number;
  img: string;
  purchasedAt: number;
  orderCode: string;
  status: "PAID" | "CONFIRMED";
}

interface HoldContextType {
  reputationScore: number;
  heldItems: HeldItem[];
  waitlistItems: WaitlistItem[];
  purchasedItems: PurchasedItem[];
  otherHeldProductIds: number[];
  holdItem: (product: {
    id: number;
    name: string;
    shop: string;
    price: number;
    img: string;
    meta?: string;
  }) => { success: boolean; message: string; reason?: string };
  releaseHold: (productId: number) => { success: boolean; message: string };
  joinWaitlist: (
    productId: number,
    productName: string,
    shop: string
  ) => { success: boolean; position: number };
  timeoutHold: (productId: number) => void;
  confirmSold: (
    productId: number,
    orderCode?: string
  ) => { success: boolean; newScore: number; message: string };
  isHeldByMe: (productId: number) => boolean;
  isHeldByOther: (productId: number) => boolean;
  isSold: (productId: number) => boolean;
  getRemainingSeconds: (productId: number) => number;
  getHeldItem: (productId: number) => HeldItem | undefined;
}

const HoldContext = createContext<HoldContextType | null>(null);

const STORAGE_KEYS = {
  REPUTATION: "rewore_reputation",
  HELD: "rewore_held_items",
  WAITLIST: "rewore_waitlist",
  PURCHASED: "rewore_purchased_items",
  OTHER_HELD: "rewore_other_held_ids",
};

const DEFAULT_REPUTATION = 86;
const HOLD_DURATION_SECONDS = 15 * 60; // 15 phút (900s)

export function HoldProvider({ children }: { children: React.ReactNode }) {
  const [reputationScore, setReputationScore] = useState<number>(DEFAULT_REPUTATION);
  const [heldItems, setHeldItems] = useState<HeldItem[]>([]);
  const [waitlistItems, setWaitlistItems] = useState<WaitlistItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  // Sản phẩm mẫu do người khác đang giữ (để test tính năng Waitlist): mặc định sản phẩm id 4
  const [otherHeldProductIds, setOtherHeldProductIds] = useState<number[]>([4]);
  const [now, setNow] = useState<number>(Date.now());

  // Khôi phục từ localStorage
  useEffect(() => {
    try {
      const rep = localStorage.getItem(STORAGE_KEYS.REPUTATION);
      if (rep !== null) setReputationScore(parseInt(rep, 10));

      const savedHeld = localStorage.getItem(STORAGE_KEYS.HELD);
      if (savedHeld) {
        const parsed: HeldItem[] = JSON.parse(savedHeld);
        // Filter out expired items
        const current = Date.now();
        const valid = parsed.filter((i) => i.expiresAt > current);
        setHeldItems(valid);
      }

      const savedWaitlist = localStorage.getItem(STORAGE_KEYS.WAITLIST);
      if (savedWaitlist) setWaitlistItems(JSON.parse(savedWaitlist));

      const savedPurchased = localStorage.getItem(STORAGE_KEYS.PURCHASED);
      if (savedPurchased) setPurchasedItems(JSON.parse(savedPurchased));

      const savedOtherHeld = localStorage.getItem(STORAGE_KEYS.OTHER_HELD);
      if (savedOtherHeld) setOtherHeldProductIds(JSON.parse(savedOtherHeld));
    } catch (e) {
      console.error("Failed to load hold state from localStorage", e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPUTATION, reputationScore.toString());
  }, [reputationScore]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HELD, JSON.stringify(heldItems));
  }, [heldItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(waitlistItems));
  }, [waitlistItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASED, JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  // Tick mỗi giây để cập nhật đồng hồ đếm ngược và kiểm tra timeout
  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);

      // Kiểm tra hết giờ đếm ngược
      setHeldItems((prev) => {
        const expired = prev.filter((item) => item.expiresAt <= current);
        if (expired.length > 0) {
          // Trừ điểm uy tín mỗi món bị timeout
          const penalty = expired.length * 5;
          setReputationScore((r) => {
            const nextScore = Math.max(0, r - penalty);
            return nextScore;
          });

          // Hiển thị thông báo
          setTimeout(() => {
            alert(
              `⏳ HẾT THỜI GIAN GIỮ HÀNG!\nBạn đã để quá hạn ${expired
                .map((e) => `"${e.name}"`)
                .join(", ")} mà không hoàn tất giao dịch.\n` +
                `Hệ thống đã tự động giải phóng món đồ và TRỪ ${penalty} điểm uy tín (Credit Score).`
            );
          }, 100);

          return prev.filter((item) => item.expiresAt > current);
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 1. Giữ hàng (Hold Item)
  const holdItem = useCallback(
    (product: {
      id: number;
      name: string;
      shop: string;
      price: number;
      img: string;
      meta?: string;
    }) => {
      // Điều kiện A: Điểm uy tín >= 70
      if (reputationScore < 70) {
        return {
          success: false,
          reason: "LOW_REPUTATION",
          message: `Điểm uy tín hiện tại của bạn là ${reputationScore} (Yêu cầu tối thiểu 70 điểm để giữ hàng). Bạn không đủ điều kiện giữ hàng!`,
        };
      }

      // Điều kiện B: Chưa giữ quá 3 món
      if (heldItems.length >= 3) {
        return {
          success: false,
          reason: "LIMIT_EXCEEDED",
          message: "Bạn đang giữ tối đa 3 món đồ cho phép. Vui lòng hoàn tất giao dịch hoặc bấm 'Hủy giữ' để tiếp tục giữ món mới!",
        };
      }

      // Điều kiện C: Món đồ đã có người khác giữ
      if (otherHeldProductIds.includes(product.id)) {
        return {
          success: false,
          reason: "HELD_BY_OTHER",
          message: "Món đồ này hiện đã có người giữ! Bạn có muốn xếp hàng đợi (Waitlist)?",
        };
      }

      // Đã giữ rồi
      if (heldItems.some((i) => i.id === product.id)) {
        return {
          success: false,
          reason: "ALREADY_HELD",
          message: "Bạn đã đang giữ món đồ này trong danh sách của mình!",
        };
      }

      // Thành công: tạo lượt giữ 15 phút
      const current = Date.now();
      const newItem: HeldItem = {
        id: product.id,
        name: product.name,
        shop: product.shop,
        meta: product.meta,
        price: product.price,
        img: product.img,
        heldAt: current,
        expiresAt: current + HOLD_DURATION_SECONDS * 1000,
      };

      setHeldItems((prev) => [...prev, newItem]);
      return {
        success: true,
        message: `Giữ hàng "${product.name}" thành công! Bạn có 15 phút để nhắn tin chốt đơn với shop.`,
      };
    },
    [reputationScore, heldItems, otherHeldProductIds]
  );

  // 2. Hủy giữ (Release Hold)
  const releaseHold = useCallback((productId: number) => {
    const item = heldItems.find((i) => i.id === productId);
    if (!item) return { success: false, message: "Không tìm thấy món đồ đang giữ." };

    setHeldItems((prev) => prev.filter((i) => i.id !== productId));
    return {
      success: true,
      message: `Đã hủy giữ món "${item.name}". Món đồ đã được giải phóng cho cộng đồng và bạn KHÔNG bị trừ điểm uy tín!`,
    };
  }, [heldItems]);

  // 3. Xếp hàng đợi (Waitlist)
  const joinWaitlist = useCallback(
    (productId: number, productName: string, shop: string) => {
      const existing = waitlistItems.find((w) => w.productId === productId);
      if (existing) {
        return { success: true, position: existing.position };
      }

      const position = 1; // Số thứ tự trong hàng đợi
      const newWaitlist: WaitlistItem = {
        productId,
        productName,
        shop,
        position,
        joinedAt: Date.now(),
      };
      setWaitlistItems((prev) => [...prev, newWaitlist]);
      return { success: true, position };
    },
    [waitlistItems]
  );

  // 4. Hết giờ thủ công
  const timeoutHold = useCallback((productId: number) => {
    setHeldItems((prev) => {
      const target = prev.find((i) => i.id === productId);
      if (target) {
        setReputationScore((r) => Math.max(0, r - 5));
      }
      return prev.filter((i) => i.id !== productId);
    });
  }, []);

  // 5. Xác nhận đã bán / Chốt đơn thành công (+5 điểm uy tín)
  const confirmSold = useCallback(
    (productId: number, orderCode?: string) => {
      const held = heldItems.find((i) => i.id === productId);
      const code = orderCode || `RW-${Date.now().toString().slice(-6)}`;
      
      if (held) {
        setHeldItems((prev) => prev.filter((i) => i.id !== productId));
        setPurchasedItems((prev) => [
          ...prev,
          {
            id: held.id,
            name: held.name,
            shop: held.shop,
            price: held.price,
            img: held.img,
            purchasedAt: Date.now(),
            orderCode: code,
            status: "CONFIRMED",
          },
        ]);
      }

      // Cộng +5 điểm uy tín
      let nextRep = 0;
      setReputationScore((r) => {
        nextRep = r + 5;
        return nextRep;
      });

      return {
        success: true,
        newScore: nextRep,
        message: `Giao dịch hoàn tất! Món đồ chính thức đổi trạng thái ĐÃ BÁN. Bạn được cộng +5 ĐIỂM UY TÍN!`,
      };
    },
    [heldItems]
  );

  const isHeldByMe = useCallback(
    (productId: number) => heldItems.some((i) => i.id === productId),
    [heldItems]
  );

  const isHeldByOther = useCallback(
    (productId: number) => otherHeldProductIds.includes(productId),
    [otherHeldProductIds]
  );

  const isSold = useCallback(
    (productId: number) => purchasedItems.some((i) => i.id === productId),
    [purchasedItems]
  );

  const getRemainingSeconds = useCallback(
    (productId: number) => {
      const item = heldItems.find((i) => i.id === productId);
      if (!item) return 0;
      return Math.max(0, Math.floor((item.expiresAt - now) / 1000));
    },
    [heldItems, now]
  );

  const getHeldItem = useCallback(
    (productId: number) => heldItems.find((i) => i.id === productId),
    [heldItems]
  );

  return (
    <HoldContext.Provider
      value={{
        reputationScore,
        heldItems,
        waitlistItems,
        purchasedItems,
        otherHeldProductIds,
        holdItem,
        releaseHold,
        joinWaitlist,
        timeoutHold,
        confirmSold,
        isHeldByMe,
        isHeldByOther,
        isSold,
        getRemainingSeconds,
        getHeldItem,
      }}
    >
      {children}
    </HoldContext.Provider>
  );
}

export function useHold() {
  const context = useContext(HoldContext);
  if (!context) {
    throw new Error("useHold must be used within a HoldProvider");
  }
  return context;
}
