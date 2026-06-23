"use server";
// 주문 처리 Server Action.
// 여기서 비로소 DB에 저장된다: orders(주문 머리) 1건 + order_items(품목들) N건.
// 장바구니(localStorage)의 내용을 받아 서버에서 가격을 다시 계산해 저장한다.

import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function placeOrder(cartItems) {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다.", needLogin: true };

  if (!cartItems || cartItems.length === 0) {
    return { error: "장바구니가 비어 있습니다." };
  }

  // 보안: 클라이언트가 보낸 가격을 그대로 믿지 않고, menu_id로 DB에서 실제 가격을 다시 조회한다.
  const menuIds = cartItems.map((i) => i.menuId);
  const menus = await sql`SELECT id, name, price FROM menus WHERE id = ANY(${menuIds})`;
  const menuById = new Map(menus.map((m) => [m.id, m]));

  let totalPrice = 0;
  const lineItems = [];
  for (const item of cartItems) {
    const menu = menuById.get(item.menuId);
    if (!menu) continue; // 존재하지 않는 메뉴는 건너뜀
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    totalPrice += menu.price * quantity;
    lineItems.push({ menuId: menu.id, name: menu.name, price: menu.price, quantity });
  }

  if (lineItems.length === 0) {
    return { error: "주문할 수 있는 메뉴가 없습니다." };
  }

  // 1) 주문 머리를 orders에 저장하고 새 주문 id를 받는다
  const orderRows = await sql`
    INSERT INTO orders (user_id, total_price)
    VALUES (${user.id}, ${totalPrice})
    RETURNING id
  `;
  const orderId = orderRows[0].id;

  // 2) 품목들을 order_items에 저장 (주문 당시 이름/가격을 함께 기록)
  for (const li of lineItems) {
    await sql`
      INSERT INTO order_items (order_id, menu_id, menu_name, price, quantity)
      VALUES (${orderId}, ${li.menuId}, ${li.name}, ${li.price}, ${li.quantity})
    `;
  }

  return { ok: true, orderId };
}
