// "지금 로그인한 사용자가 누구인지" 알아내는 함수.
// 페이지나 서버 액션에서 호출해 로그인 여부/사용자 정보를 확인한다.
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { sql } from '@/lib/db';

// 로그인했으면 { id, email } 반환, 아니면 null
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = await decrypt(token);
  if (!session?.userId) return null;

  const rows = await sql`SELECT id, email FROM users WHERE id = ${session.userId}`;
  return rows[0] ?? null;
}
