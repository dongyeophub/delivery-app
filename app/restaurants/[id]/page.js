import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";

// 식당 상세 페이지. URL의 [id]는 params로 들어오며 Next.js 16에서는 비동기다.
export default async function RestaurantPage({ params }) {
  const { id } = await params;

  const restaurants = await sql`SELECT * FROM restaurants WHERE id = ${id}`;
  const restaurant = restaurants[0];
  if (!restaurant) notFound(); // 없는 식당이면 404

  const menus = await sql`
    SELECT id, name, price FROM menus
    WHERE restaurant_id = ${id}
    ORDER BY id
  `;

  return (
    <div>
      <Link href="/" className="text-sm text-gray-500 hover:text-orange-600">
        ← 식당 목록
      </Link>

      <div className="bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl p-5 mt-3 mb-5 text-white flex items-center gap-4 shadow-sm">
        <div className="w-16 h-16 flex items-center justify-center text-4xl bg-white/25 rounded-2xl">
          {restaurant.image_url}
        </div>
        <div>
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
          <p className="text-sm opacity-90">{restaurant.category}</p>
        </div>
      </div>

      <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
        {menus.map((menu) => (
          <li key={menu.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-medium">{menu.name}</div>
              <div className="text-sm font-semibold text-gray-700">
                {menu.price.toLocaleString()}원
              </div>
            </div>
            <AddToCartButton menu={menu} />
          </li>
        ))}
      </ul>
    </div>
  );
}
