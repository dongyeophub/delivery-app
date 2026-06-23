"use server";
// 현재 사용 가능한(유효기간이 지나지 않은) 쿠폰 목록을 반환한다.
import { sql } from "@/lib/db";

export async function getAvailableCoupons() {
  const rows = await sql`
    SELECT code, title, discount_type, discount_value, min_order_price, valid_until
    FROM coupons
    WHERE valid_until IS NULL OR valid_until >= CURRENT_DATE
    ORDER BY id
  `;
  return rows;
}
