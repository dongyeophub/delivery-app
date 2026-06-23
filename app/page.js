import Link from "next/link";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const CATEGORIES = [
  { name: "전체", emoji: "🍽️" },
  { name: "치킨", emoji: "🍗" },
  { name: "피자", emoji: "🍕" },
  { name: "버거", emoji: "🍔" },
  { name: "분식", emoji: "🍢" },
];

// 카테고리별 뱃지 색상
const CATEGORY_COLOR = {
  치킨: "bg-amber-100 text-amber-700",
  피자: "bg-red-100 text-red-700",
  버거: "bg-yellow-100 text-yellow-700",
  분식: "bg-rose-100 text-rose-700",
};

export default async function HomePage({ searchParams }) {
  const user = await getCurrentUser();

  const { category } = await searchParams;
  const active = category || "전체";

  const restaurants =
    active === "전체"
      ? await sql`
          SELECT r.id, r.name, r.category, r.image_url, COUNT(m.id) AS menu_count
          FROM restaurants r
          LEFT JOIN menus m ON m.restaurant_id = r.id
          GROUP BY r.id ORDER BY r.id
        `
      : await sql`
          SELECT r.id, r.name, r.category, r.image_url, COUNT(m.id) AS menu_count
          FROM restaurants r
          LEFT JOIN menus m ON m.restaurant_id = r.id
          WHERE r.category = ${active}
          GROUP BY r.id ORDER BY r.id
        `;

  return (
    <div>
      {/* 인사 배너 */}
      {user ? (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl px-5 py-4 mb-5 shadow-sm">
          <p className="text-sm opacity-90">안녕하세요 👋</p>
          <p className="text-lg font-bold">
            {user.email.split("@")[0]}님, 오늘은 뭐 드실래요?
          </p>
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm rounded-xl px-4 py-3 mb-5">
          메뉴를 구경한 뒤 주문하려면{" "}
          <Link href="/login" className="font-semibold underline">
            로그인
          </Link>
          이 필요해요.
        </div>
      )}

      <h1 className="text-xl font-bold mb-3">식당</h1>

      {/* 카테고리 필터 칩 */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.name;
          const href = cat.name === "전체" ? "/" : `/?category=${cat.name}`;
          return (
            <Link
              key={cat.name}
              href={href}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border transition-colors ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {cat.emoji} {cat.name}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-14 h-14 flex items-center justify-center text-3xl bg-orange-50 rounded-2xl mb-3 group-hover:scale-105 transition-transform">
              {r.image_url}
            </div>
            <div className="font-semibold">{r.name}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  CATEGORY_COLOR[r.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                {r.category}
              </span>
              <span className="text-xs text-gray-400">
                메뉴 {Number(r.menu_count)}개
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
