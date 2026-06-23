"use client";
// 주문 상태 뱃지 + 배달 남은시간 카운트다운. 1초마다 갱신된다.
import { useState, useEffect } from "react";
import { getDeliveryState, formatRemaining } from "@/lib/orderStatus";

const STYLE = {
  접수: "bg-gray-100 text-gray-600",
  배달중: "bg-blue-100 text-blue-700",
  완료: "bg-green-100 text-green-700",
};

export default function OrderStatus({ createdAt }) {
  // now가 null인 동안(서버렌더/첫 렌더)은 '…'로 표시해 hydration 불일치를 피한다.
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (now === null) {
    return (
      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
        …
      </span>
    );
  }

  const { status, remainingSec } = getDeliveryState(createdAt, now);

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${STYLE[status]}`}>
      {status === "배달중"
        ? `🛵 배달중 · ${formatRemaining(remainingSec)} 남음`
        : status === "완료"
        ? "✅ 배달 완료"
        : "📝 주문 접수"}
    </span>
  );
}
