"use client";
// 로그인/회원가입이 똑같이 생겨서 하나의 컴포넌트로 공용 사용.
// useActionState: 서버 액션의 반환값(에러 메시지)과 제출 중 상태(pending)를 받는다.
import { useActionState } from "react";
import Link from "next/link";

export default function AuthForm({
  action,
  title,
  submitLabel,
  altText,
  altHref,
  altLabel,
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="6자 이상"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 서버 액션이 에러를 반환하면 여기에 표시 */}
        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-orange-500 text-white font-medium py-2 rounded-md hover:bg-orange-600 disabled:opacity-60"
        >
          {pending ? "처리 중..." : submitLabel}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-4">
        {altText}{" "}
        <Link href={altHref} className="text-orange-600 hover:underline">
          {altLabel}
        </Link>
      </p>
    </div>
  );
}
