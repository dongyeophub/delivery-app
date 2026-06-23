// 화면 전체에 깔리는 배경 장식 (콘텐츠 뒤에 고정).
// 부드러운 그라데이션 + 양옆 여백에 흐릿한 음식 이모지.
// pointer-events-none이라 클릭을 방해하지 않고, 넓은 화면(lg)에서만 이모지를 보여준다.

const DECOR = [
  { e: "🍕", c: "top-24 left-8 text-8xl -rotate-12" },
  { e: "🍗", c: "top-44 right-10 text-7xl rotate-12" },
  { e: "🍔", c: "top-1/2 left-12 text-8xl rotate-6" },
  { e: "🍢", c: "top-[58%] right-14 text-7xl -rotate-6" },
  { e: "🥤", c: "bottom-24 left-16 text-6xl rotate-12" },
  { e: "🍟", c: "bottom-32 right-20 text-7xl -rotate-12" },
];

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 부드러운 그라데이션 (위쪽 은은한 주황 → 아래 회색) */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-gray-50 to-gray-50" />

      {/* 양옆 여백의 음식 이모지 (큰 화면에서만) */}
      <div className="hidden lg:block">
        {DECOR.map((d, i) => (
          <span
            key={i}
            className={`absolute ${d.c} opacity-[0.08] blur-[1px] select-none`}
          >
            {d.e}
          </span>
        ))}
      </div>
    </div>
  );
}
