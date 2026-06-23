// 모든 페이지 상단에 보이는 헤더.
// 서버 컴포넌트라서 로그인 상태(getCurrentUser)를 직접 확인할 수 있다.
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import CartButton from "@/components/CartButton";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-orange-600 tracking-tight">
          🍔 한입배달
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <CartButton />
          {user ? (
            <>
              <Link href="/orders" className="text-gray-700 hover:text-orange-600">
                주문내역
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 hidden sm:inline">{user.email}</span>
              {/* 로그아웃은 서버 액션을 호출하는 폼 버튼 */}
              <form action={logout}>
                <button className="text-gray-700 hover:text-orange-600">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-orange-600">
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-orange-500 text-white px-3 py-1.5 rounded-md hover:bg-orange-600"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
