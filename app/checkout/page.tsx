"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useHold } from "../context/HoldContext";
import { useAuth } from "../context/AuthContext";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") ? parseInt(searchParams.get("productId")!, 10) : 1;
  const { heldItems, confirmSold, getRemainingSeconds, reputationScore } = useHold();
  const { user } = useAuth();

  // Tìm món đồ trong danh sách giữ hàng hoặc fallback sản phẩm mặc định
  const heldItem = heldItems.find((i) => i.id === productId);

  const fallbackProduct = {
    id: 1,
    name: "Wool Tweed Blazer",
    shop: "The Archive Room",
    price: 185,
    meta: "Ralph Lauren · Size M · Excellent",
    img: "/shop-blazer.png",
  };

  const product = heldItem || fallbackProduct;

  const secondsRemaining = heldItem ? getRemainingSeconds(heldItem.id) : 0;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Form states
  const [recipientName, setRecipientName] = useState(user?.name || "Đặng Tuấn");
  const [phoneNumber, setPhoneNumber] = useState("0988 123 456");
  const [address, setAddress] = useState("Số 18, Ngõ 92 Phố Tràng Tiền");
  const [city, setCity] = useState("Hà Nội");
  const [district, setDistrict] = useState("Hoàn Kiếm");
  const [shippingNote, setShippingNote] = useState("Giao giờ hành chính, gọi trước khi đến giúp mình.");
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "cod" | "card">("vietqr");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    earnedScore: number;
    newTotalScore: number;
  } | null>(null);

  const shippingFee = paymentMethod === "vietqr" ? 0 : 30; // Miễn phí ship nếu thanh toán qua VietQR
  const totalAmount = product.price + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phoneNumber.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ thông tin người nhận và địa chỉ giao hàng!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderCode = `RW-${Math.floor(100000 + Math.random() * 900000)}`;
      const result = confirmSold(product.id, orderCode);

      setIsSubmitting(false);
      setOrderSuccess({
        orderId: orderCode,
        earnedScore: 5,
        newTotalScore: result.newScore,
      });
    }, 1000);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#f7f4f0] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-[680px] w-full mx-auto px-5 py-16 flex items-center justify-center">
          <div className="w-full bg-white rounded-[24px] p-8 md:p-12 shadow-[0_15px_50px_-10px_rgba(43,33,24,0.1)] border border-[#dbc1b9]/50 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-[#dae9b5] text-[#151f01] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[42px]">check_circle</span>
            </div>

            <span className="px-3.5 py-1 bg-[#dae9b5] text-[#151f01] rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Giao dịch thành công
            </span>

            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#231a11] mb-2">
              Đơn Hàng Đã Được Xác Nhận!
            </h1>
            <p className="text-sm text-[#88726c] mb-6">
              Mã đơn hàng: <strong className="text-[#231a11]">{orderSuccess.orderId}</strong> · Shop{" "}
              <strong>{product.shop}</strong> đang chuẩn bị đóng gói món đồ cho bạn.
            </p>

            {/* Reputation Bonus Box */}
            <div className="bg-[#feeadc] border border-[#ffb59e] rounded-2xl p-5 mb-8 text-left flex items-center gap-4">
              <div className="w-12 h-12 bg-[#974226] text-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#231a11]">Cộng điểm uy tín thành công!</h4>
                  <span className="px-2 py-0.5 bg-[#974226] text-white text-[11px] font-bold rounded-full">
                    +{orderSuccess.earnedScore} điểm
                  </span>
                </div>
                <p className="text-xs text-[#55433d] mt-0.5">
                  Bạn đã hoàn thành giao dịch giữ hàng đúng hẹn. Điểm uy tín của bạn hiện đạt{" "}
                  <strong>{orderSuccess.newTotalScore} điểm</strong> (Hạng Trusted Buyer).
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/profile"
                className="w-full sm:w-auto px-7 py-3 bg-[#974226] hover:bg-[#b65a3c] text-white rounded-full text-sm font-semibold transition-all shadow-sm"
              >
                Xem trong Trang cá nhân
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-[#f7f4f0] text-[#231a11] border border-[#dbc1b9] rounded-full text-sm font-semibold transition-all"
              >
                Tiếp tục khám phá đồ si
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4f0] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-8 py-8">
        {/* Header navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#786a60]">
            <Link href="/shop" className="hover:text-[#974226] transition-colors">
              Cửa hàng
            </Link>
            <span>/</span>
            <Link
              href={`/messages?shop=${encodeURIComponent(product.shop)}`}
              className="hover:text-[#974226] transition-colors"
            >
              Nhắn tin với shop
            </Link>
            <span>/</span>
            <span className="text-[#231a11] font-semibold">Chốt đơn & Thanh toán</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#88726c]">
            <span className="material-symbols-outlined text-[16px] text-[#556138]">lock</span>
            Thanh toán an toàn với kiểm duyệt REWORE
          </div>
        </div>

        {/* Checkout Grid */}
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN (7/12) ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Thông tin người nhận */}
            <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm border border-[#dbc1b9]/40">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#ede1d2] text-[#974226] flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11]">
                  Địa Chỉ Nhận Hàng
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#55433d] mb-1.5">
                      Họ và tên người nhận *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f4f0] border border-[#dbc1b9]/60 rounded-xl text-sm text-[#231a11] focus:outline-none focus:border-[#974226]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#55433d] mb-1.5">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f4f0] border border-[#dbc1b9]/60 rounded-xl text-sm text-[#231a11] focus:outline-none focus:border-[#974226]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#55433d] mb-1.5">
                      Tỉnh / Thành phố *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f4f0] border border-[#dbc1b9]/60 rounded-xl text-sm text-[#231a11] focus:outline-none focus:border-[#974226]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#55433d] mb-1.5">
                      Quận / Huyện *
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f4f0] border border-[#dbc1b9]/60 rounded-xl text-sm text-[#231a11] focus:outline-none focus:border-[#974226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#55433d] mb-1.5">
                    Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f7f4f0] border border-[#dbc1b9]/60 rounded-xl text-sm text-[#231a11] focus:outline-none focus:border-[#974226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#55433d] mb-1.5">
                    Ghi chú cho shop & shipper (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    value={shippingNote}
                    onChange={(e) => setShippingNote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f7f4f0] border border-[#dbc1b9]/60 rounded-xl text-sm text-[#231a11] focus:outline-none focus:border-[#974226]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm border border-[#dbc1b9]/40">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#ede1d2] text-[#974226] flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11]">
                  Phương Thức Thanh Toán
                </h2>
              </div>

              <div className="space-y-3">
                {/* VietQR */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "vietqr"
                      ? "border-[#974226] bg-[#feeadc]/30 ring-1 ring-[#974226]"
                      : "border-[#dbc1b9]/50 hover:bg-[#f7f4f0]/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "vietqr"}
                    onChange={() => setPaymentMethod("vietqr")}
                    className="mt-1 text-[#974226] focus:ring-[#974226]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#231a11] flex items-center gap-2">
                        Chuyển khoản VietQR tự động
                        <span className="px-2 py-0.5 bg-[#dae9b5] text-[#151f01] rounded text-[10px] font-bold">
                          Freeship
                        </span>
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-[#974226]">
                        qr_code_scanner
                      </span>
                    </div>
                    <p className="text-xs text-[#88726c] mt-1">
                      Quét mã QR từ bất kỳ ứng dụng ngân hàng nào (MB, VCB, Techcombank...). Tiền vào ví tạm giữ bảo đảm.
                    </p>

                    {paymentMethod === "vietqr" && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-[#dbc1b9]/70 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-28 h-28 bg-[#f2dfd1] rounded-lg p-2 flex flex-col items-center justify-center border border-[#dbc1b9]">
                          <span className="material-symbols-outlined text-[48px] text-[#974226]">
                            qr_code_2
                          </span>
                          <span className="text-[9px] font-bold text-[#7b2e14]">VIETQR SECURE</span>
                        </div>
                        <div className="text-xs text-[#55433d] space-y-1">
                          <p><strong>Ngân hàng:</strong> MB Bank (Quân Đội)</p>
                          <p><strong>Chủ tài khoản:</strong> REWORE ESCROW - {product.shop}</p>
                          <p><strong>Số tài khoản:</strong> 0988 288 9999</p>
                          <p><strong>Số tiền:</strong> ${totalAmount} (~ {(totalAmount * 25000).toLocaleString("vi-VN")} đ)</p>
                          <p><strong>Nội dung:</strong> REWORE {product.id} {recipientName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* COD */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#974226] bg-[#feeadc]/30 ring-1 ring-[#974226]"
                      : "border-[#dbc1b9]/50 hover:bg-[#f7f4f0]/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-[#974226] focus:ring-[#974226]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#231a11]">
                        Thanh toán khi nhận hàng (Ship COD)
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-[#88726c]">
                        local_shipping
                      </span>
                    </div>
                    <p className="text-xs text-[#88726c] mt-1">
                      Thanh toán tiền mặt cho nhân viên giao hàng khi nhận và kiểm tra món đồ si. Phí ship: $30.
                    </p>
                  </div>
                </label>

                {/* Credit Card */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-[#974226] bg-[#feeadc]/30 ring-1 ring-[#974226]"
                      : "border-[#dbc1b9]/50 hover:bg-[#f7f4f0]/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1 text-[#974226] focus:ring-[#974226]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#231a11]">
                        Thẻ tín dụng / Ghi nợ quốc tế (Visa / Mastercard)
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-[#88726c]">
                        credit_card
                      </span>
                    </div>
                    <p className="text-xs text-[#88726c] mt-1">
                      Cổng thanh toán bảo mật 256-bit SSL trực tuyến.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ── CỘT PHẢI: TÓM TẮT ĐƠN HÀNG & NÚT XÁC NHẬN (5/12) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm border border-[#dbc1b9]/40 sticky top-24">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#231a11] mb-4">
                Tóm Tắt Đơn Hàng
              </h2>

              {/* Countdown banner nếu đang giữ */}
              {heldItem && (
                <div className="mb-5 p-3.5 bg-[#fff1e8] rounded-xl border border-[#ffb59e] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#974226] animate-pulse">
                      timer
                    </span>
                    <span className="text-xs font-semibold text-[#7b2e14]">
                      Thời gian giữ độc quyền:
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#ba1a1a] bg-white px-2.5 py-1 rounded-md border border-[#ffdad6]">
                    ⏳ {timeFormatted}
                  </span>
                </div>
              )}

              {/* Product preview */}
              <div className="flex gap-4 pb-5 border-b border-[#dbc1b9]/30">
                <div className="w-20 h-24 relative rounded-xl overflow-hidden flex-shrink-0 border border-[#dbc1b9]/50">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[#88726c] uppercase">
                    Shop: {product.shop}
                  </span>
                  <h3 className="text-sm font-bold text-[#231a11] truncate mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#88726c] mt-0.5">{product.meta}</p>
                  <p className="text-sm font-extrabold text-[#974226] mt-2">
                    ${product.price}
                  </p>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="py-4 space-y-2.5 text-xs text-[#55433d] border-b border-[#dbc1b9]/30">
                <div className="flex justify-between">
                  <span>Tiền sản phẩm:</span>
                  <span className="font-semibold">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-[#556138]">Miễn phí (VietQR)</span>
                  ) : (
                    <span className="font-semibold">${shippingFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Bảo hiểm secondhand độc bản:</span>
                  <span className="font-semibold text-[#556138]">Miễn phí</span>
                </div>
              </div>

              {/* Total */}
              <div className="py-4 flex justify-between items-baseline mb-4">
                <span className="text-sm font-bold text-[#231a11]">Tổng thanh toán:</span>
                <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#974226]">
                  ${totalAmount}
                </span>
              </div>

              {/* Trust Badge */}
              <div className="bg-[#f7f4f0] p-3.5 rounded-xl border border-[#dbc1b9]/40 mb-6 text-xs text-[#655d52] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#231a11]">
                  <span className="material-symbols-outlined text-[16px] text-[#974226]">
                    verified_user
                  </span>
                  Chính sách Uy tín & Hoàn tiền REWORE
                </div>
                <p className="text-[11px] leading-relaxed">
                  Đơn hàng được giữ tiền qua Escrow. Shop chỉ nhận tiền khi bạn đã nhận hàng và xác nhận đúng mô tả. Hoàn thành đơn hàng sẽ cộng <strong>+5 điểm uy tín</strong> cho tài khoản của bạn.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#974226] hover:bg-[#b65a3c] text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang xử lý đơn hàng...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Xác Nhận Đặt Hàng & Thanh Toán
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link
                  href={`/messages?shop=${encodeURIComponent(product.shop)}`}
                  className="text-xs text-[#88726c] hover:text-[#974226] transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                  Quay lại nhắn tin với shop
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4f0] flex items-center justify-center">Đang tải trang thanh toán...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
