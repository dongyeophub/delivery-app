"use client";
// 장바구니 페이지. 장바구니 상태는 브라우저(localStorage)에 있으므로 클라이언트 컴포넌트.
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import OrderButton from "@/components/OrderButton";
import { getAvailableCoupons } from "@/app/actions/coupon";
import { calcDiscount } from "@/lib/coupon";

export default function CartPage() {
  const { items, changeQty, removeItem, totalPrice, loaded } = useCart();
  const [coupons, setCoupons] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  // 사용 가능한 쿠폰 목록을 서버에서 불러온다
  useEffect(() => {
    getAvailableCoupons().then(setCoupons);
  }, []);

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div className="text-center mt-16">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500 mb-6">장바구니가 비어 있어요.</p>
        <Link
          href="/"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          식당 보러 가기
        </Link>
      </div>
    );
  }

  const selectedCoupon = coupons.find((c) => c.code === selectedCode) || null;
  const discount = calcDiscount(selectedCoupon, totalPrice);
  const finalPrice = totalPrice - discount;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 mb-4">
        {items.map((item) => (
          <li key={item.menuId} className="flex items-center justify-between px-4 py-3">
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.price.toLocaleString()}원
              </div>
            </div>

            <div className="flex items-center gap-2 mx-3">
              <button
                onClick={() => changeQty(item.menuId, -1)}
                className="w-7 h-7 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => changeQty(item.menuId, 1)}
                className="w-7 h-7 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <div className="w-20 text-right font-medium">
              {(item.price * item.quantity).toLocaleString()}원
            </div>

            <button
              onClick={() => removeItem(item.menuId)}
              className="ml-3 text-gray-400 hover:text-red-500"
              aria-label="삭제"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* 쿠폰 선택 */}
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 mb-4">
        <div className="text-sm font-semibold mb-2">🎟️ 쿠폰</div>
        <div className="space-y-2">
          {coupons.map((coupon) => {
            const usable = totalPrice >= coupon.min_order_price;
            const isSelected = selectedCode === coupon.code;
            return (
              <button
                key={coupon.code}
                disabled={!usable}
                onClick={() => setSelectedCode(isSelected ? "" : coupon.code)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                } ${!usable ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{coupon.title}</span>
                  {isSelected && <span className="text-orange-600">적용됨 ✓</span>}
                </div>
                <div className="text-xs text-gray-500">
                  최소 주문 {coupon.min_order_price.toLocaleString()}원
                  {!usable && " (금액 부족)"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 금액 + 주문 버튼 */}
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>메뉴 합계</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-red-500 mb-1">
            <span>쿠폰 할인</span>
            <span>-{discount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
          <span className="text-gray-600">총 결제금액</span>
          <span className="text-xl font-bold text-orange-600">
            {finalPrice.toLocaleString()}원
          </span>
        </div>
        <OrderButton couponCode={discount > 0 ? selectedCode : ""} />
      </div>
    </div>
  );
}
