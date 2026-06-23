'use server';
// 'use server' = 이 파일의 함수들은 서버에서만 실행되는 "Server Action".
// 폼(form)이 제출되면 브라우저가 이 함수를 직접 호출한다.

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/session';

// 회원가입: 이메일 중복 확인 → 비밀번호 해시 → DB 저장 → 자동 로그인
export async function signup(prevState, formData) {
  const email = formData.get('email')?.trim();
  const password = formData.get('password');

  if (!email || !password) return { error: '이메일과 비밀번호를 모두 입력하세요.' };
  if (password.length < 6) return { error: '비밀번호는 6자 이상이어야 합니다.' };

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) return { error: '이미 가입된 이메일입니다.' };

  // 비밀번호는 절대 평문 저장 X. bcrypt로 해시해서 저장한다.
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id
  `;

  await createSession(rows[0].id); // 가입과 동시에 로그인 처리
  redirect('/'); // 홈으로 이동
}

// 로그인: 이메일로 사용자 조회 → 비밀번호 일치 확인 → 세션 생성
export async function login(prevState, formData) {
  const email = formData.get('email')?.trim();
  const password = formData.get('password');

  if (!email || !password) return { error: '이메일과 비밀번호를 모두 입력하세요.' };

  const rows = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
  const user = rows[0];

  // 보안상 "이메일이 없음"과 "비번 틀림"을 구분하지 않고 같은 메시지를 준다.
  if (!user) return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };

  await createSession(user.id);
  redirect('/');
}

// 로그아웃: 세션 쿠키 삭제 후 로그인 페이지로
export async function logout() {
  await deleteSession();
  redirect('/login');
}
