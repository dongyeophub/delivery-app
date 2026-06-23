// 로그인 세션 관리: 사용자 ID를 JWT(서명된 토큰)로 만들어 httpOnly 쿠키에 저장한다.
// httpOnly = 브라우저 JavaScript가 쿠키를 못 읽음 → 탈취 위험 감소.
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

// userId 등을 받아 7일짜리 서명 토큰(JWT)으로 암호화
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

// 토큰을 검증·복호화. 위조되었거나 만료되면 null 반환
export async function decrypt(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

// 로그인 성공 시 호출: 세션 쿠키를 굽는다
export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 뒤
  const token = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies(); // Next.js 16: cookies()는 비동기
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 배포(https)에서만 secure
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

// 로그아웃 시 호출: 세션 쿠키를 지운다
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
