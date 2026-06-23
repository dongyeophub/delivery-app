"use client";
// 헤더에 들어가는 장바구니 버튼. 담은 개수를 빨간 뱃지로 표시한다.
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartButton() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-gray-700 hover:text-orange-600"
      aria-label="장바구니"
    >
      🛒
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
