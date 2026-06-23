"use client";
// 장바구니 페이지. 장바구니 상태는 브라우저(localStorage)에 있으므로 클라이언트 컴포넌트.
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import OrderButton from "@/components/OrderButton";

export default function CartPage() {
  const { items, changeQty, removeItem, totalPrice, loaded } = useCart();

  // localStorage 복원 전에는 잠깐 비워둠 (화면 깜빡임 방지)
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

            {/* 수량 조절 */}
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

            {/* 품목 소계 */}
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

      {/* 총액 + 주문 버튼 */}
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">총 결제금액</span>
          <span className="text-xl font-bold text-orange-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
        <OrderButton />
      </div>
    </div>
  );
}
