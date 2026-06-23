// 주문 상태를 created_at(주문 시각) 기준 경과 시간으로 계산한다.
// DB에는 '접수'로만 저장하고, 화면에서는 시간에 따라 접수→배달중→완료로 보여준다.
// (데모용으로 짧게 설정. 영상에서 상태가 바뀌는 걸 보여줄 수 있게.)

export const ACCEPT_SEC = 15; // 접수 단계 지속 시간(초)
export const TOTAL_SEC = 90; // 주문 후 완료까지 총 소요(초)

// createdAt(Date|string), nowMs(현재시각 ms) → { status, remainingSec }
export function getDeliveryState(createdAt, nowMs) {
  const elapsed = (nowMs - new Date(createdAt).getTime()) / 1000;

  if (elapsed < ACCEPT_SEC) {
    return { status: "접수", remainingSec: Math.ceil(TOTAL_SEC - elapsed) };
  }
  if (elapsed < TOTAL_SEC) {
    return { status: "배달중", remainingSec: Math.ceil(TOTAL_SEC - elapsed) };
  }
  return { status: "완료", remainingSec: 0 };
}

// 남은 초 → "M:SS" 형식
export function formatRemaining(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
