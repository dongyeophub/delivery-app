// 쿠폰 할인액 계산 (장바구니 미리보기와 서버 주문처리에서 공용으로 사용)
// coupon: { discount_type: 'percent'|'fixed', discount_value, min_order_price }
// subtotal: 메뉴 합계금액
export function calcDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (subtotal < coupon.min_order_price) return 0; // 최소 주문금액 미달

  const raw =
    coupon.discount_type === "percent"
      ? Math.floor((subtotal * coupon.discount_value) / 100)
      : coupon.discount_value;

  return Math.min(raw, subtotal); // 할인액이 결제금액을 넘지 않도록
}
