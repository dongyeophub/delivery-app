import Link from "next/link";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  // 식당 목록 + 각 식당의 메뉴 개수를 DB에서 조회
  const restaurants = await sql`
    SELECT r.id, r.name, r.category, r.image_url, COUNT(m.id) AS menu_count
    FROM restaurants r
    LEFT JOIN menus m ON m.restaurant_id = r.id
    GROUP BY r.id
    ORDER BY r.id
  `;

  return (
    <div>
      {/* 로그인 안 한 경우 안내 배너 */}
      {!user && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm rounded-lg px-4 py-3 mb-5">
          메뉴를 구경한 뒤 주문하려면{" "}
          <Link href="/login" className="font-semibold underline">
            로그인
          </Link>
          이 필요해요.
        </div>
      )}

      <h1 className="text-xl font-bold mb-4">식당</h1>

      <div className="grid grid-cols-2 gap-3">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-2">{r.image_url}</div>
            <div className="font-semibold">{r.name}</div>
            <div className="text-sm text-gray-500">
              {r.category} · 메뉴 {Number(r.menu_count)}개
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
