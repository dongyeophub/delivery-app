"use client";
// 메뉴 옆 "담기" 버튼. 클릭하면 장바구니에 추가하고 잠깐 "담김!" 표시.
import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCartButton({ menu }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(menu);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  return (
    <button
      onClick={handleClick}
      className="bg-orange-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-orange-600 whitespace-nowrap"
    >
      {added ? "담김 ✓" : "담기"}
    </button>
  );
}
