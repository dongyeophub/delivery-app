import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import OrderStatus from "@/components/OrderStatus";

// 항상 최신 주문 내역으로 렌더 (캐싱 끔)
export const dynamic = "force-dynamic";

// 내 주문 내역. 로그인한 사용자의 orders + order_items를 DB에서 불러온다.
export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // 내 주문들(머리)을 최신순으로
  const orders = await sql`
    SELECT id, total_price, coupon_code, discount_amount, status, created_at
    FROM orders
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  // 각 주문의 품목들을 한 번에 조회해 주문별로 묶는다
  const itemsByOrder = {};
  if (orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const items = await sql`
      SELECT order_id, menu_name, price, quantity
      FROM order_items
      WHERE order_id = ANY(${orderIds})
      ORDER BY id
    `;
    for (const it of items) {
      (itemsByOrder[it.order_id] ??= []).push(it);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-16">
        <p className="text-5xl mb-4">🧾</p>
        <p className="text-gray-500 mb-6">아직 주문 내역이 없어요.</p>
        <Link
          href="/"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          주문하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">내 주문 내역</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                주문 #{order.id} ·{" "}
                {new Date(order.created_at).toLocaleString("ko-KR")}
              </span>
              <OrderStatus createdAt={order.created_at} />
            </div>

            <ul className="text-sm text-gray-700 mb-2">
              {(itemsByOrder[order.id] ?? []).map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {it.menu_name} × {it.quantity}
                  </span>
                  <span>{(it.price * it.quantity).toLocaleString()}원</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-2">
              {order.discount_amount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>메뉴 합계</span>
                    <span>{order.total_price.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-500">
                    <span>쿠폰 할인 ({order.coupon_code})</span>
                    <span>-{order.discount_amount.toLocaleString()}원</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-semibold">
                <span>결제금액</span>
                <span className="text-orange-600">
                  {(order.total_price - order.discount_amount).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
