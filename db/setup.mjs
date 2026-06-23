// DB 셋업 스크립트
// 사용법: node --env-file=.env.local db/setup.mjs db/schema.sql db/seed.sql
// .sql 파일을 읽어 문장 단위로 Neon DB에 실행한다.

import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL이 없습니다. .env.local 파일을 확인하세요.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('실행할 .sql 파일을 인자로 넘겨주세요.');
  process.exit(1);
}

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  // 세미콜론 기준으로 문장을 나눈다 (이 프로젝트의 단순 스키마에 한해 안전).
  const statements = text
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`\n▶ ${file} 실행 (${statements.length}개 문장)`);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`✅ ${file} 완료`);
}

console.log('\n🎉 DB 셋업이 모두 끝났습니다.');
