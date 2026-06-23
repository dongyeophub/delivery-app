"use client";
// 장바구니 페이지의 "주문하기" 버튼.
// 서버 액션(placeOrder)을 호출하고, 성공하면 장바구니를 비운 뒤 주문내역으로 이동한다.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { placeOrder } from "@/app/actions/order";

export default function OrderButton({ couponCode }) {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleOrder() {
    setLoading(true);
    setError(null);

    const result = await placeOrder(items, couponCode);

    if (result?.needLogin) {
      router.push("/login");
      return;
    }
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    clearCart(); // 주문 완료 → 장바구니 비우기
    router.push("/orders"); // 주문내역으로 이동
  }

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-orange-500 text-white font-medium py-3 rounded-md hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? "주문 중..." : "주문하기"}
      </button>
    </div>
  );
}
