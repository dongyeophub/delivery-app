import { neon } from '@neondatabase/serverless';

// Neon(클라우드 PostgreSQL)에 접속하는 단 하나의 연결 객체.
// DATABASE_URL(연결 문자열)은 .env.local 에 보관하며 GitHub에는 올리지 않는다.
// 사용 예) const rows = await sql`SELECT * FROM restaurants`;
export const sql = neon(process.env.DATABASE_URL);
