"use client";
// 장바구니 전역 상태. 브라우저 localStorage에 저장해서 새로고침해도 유지된다.
// DB에는 저장하지 않고, "주문하기"를 누를 때만 서버로 전송한다.
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 처음 마운트될 때 localStorage에서 장바구니 복원
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
    setLoaded(true);
  }, []);

  // 장바구니가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  // 메뉴 담기 (이미 있으면 수량 +1)
  function addItem(menu) {
    setItems((prev) => {
      const found = prev.find((i) => i.menuId === menu.id);
      if (found) {
        return prev.map((i) =>
          i.menuId === menu.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { menuId: menu.id, name: menu.name, price: menu.price, quantity: 1 },
      ];
    });
  }

  // 수량 증감 (0 이하가 되면 목록에서 제거)
  function changeQty(menuId, delta) {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.menuId !== menuId) return [i];
        const q = i.quantity + delta;
        return q <= 0 ? [] : [{ ...i, quantity: q }];
      })
    );
  }

  function removeItem(menuId) {
    setItems((prev) => prev.filter((i) => i.menuId !== menuId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        changeQty,
        removeItem,
        clearCart,
        totalCount,
        totalPrice,
        loaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart는 CartProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}
