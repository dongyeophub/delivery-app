import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="text-center mt-16">
        <p className="text-5xl mb-4">🍔</p>
        <h1 className="text-2xl font-bold mb-2">한입배달에 오신 걸 환영합니다</h1>
        <p className="text-gray-500 mb-6">로그인하고 맛있는 메뉴를 주문해보세요.</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="border border-orange-500 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-50"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            회원가입
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">환영합니다, {user.email}님 👋</h1>
      <p className="text-gray-500">식당 목록은 다음 단계에서 추가됩니다.</p>
    </div>
  );
}
