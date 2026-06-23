-- ============================================================
-- 시드 데이터: 실제 프랜차이즈 4곳 + 대표 메뉴
-- 가격은 매장 정가 기준 참고값(시점/지역에 따라 다를 수 있음).
-- (스키마 생성 후 실행하면 식당/메뉴가 채워진다. users는 건드리지 않음)
-- ============================================================

-- 식당/메뉴/주문/쿠폰만 비우고 다시 넣는다. (회원 계정은 유지)
TRUNCATE TABLE order_items, orders, menus, restaurants, coupons RESTART IDENTITY CASCADE;

-- 시즌성 쿠폰 (가산 기능)
INSERT INTO coupons (code, title, discount_type, discount_value, min_order_price, valid_until) VALUES
  ('WELCOME3000', '첫 주문 3,000원 할인',  'fixed',   3000, 10000, NULL),
  ('SUMMER10',    '여름맞이 10% 할인',     'percent', 10,   15000, '2026-08-31'),
  ('CHICKEN5000', '치킨 데이 5,000원 할인', 'fixed',   5000, 20000, '2026-07-31');

-- 식당 4곳 (카테고리 다양)
INSERT INTO restaurants (name, category, image_url) VALUES
  ('교촌치킨',   '치킨', '🍗'),
  ('도미노피자', '피자', '🍕'),
  ('맘스터치',   '버거', '🍔'),
  ('김밥천국',   '분식', '🍢');

-- 교촌치킨(1)
INSERT INTO menus (restaurant_id, name, price) VALUES
  (1, '허니콤보',       23000),
  (1, '레드콤보',       23000),
  (1, '교촌오리지날',   20000),
  (1, '허니순살',       24000),
  (1, '레드순살',       24000),
  (1, '콜라 1.25L',      2000);

-- 도미노피자(2) — 라지(L) 기준
INSERT INTO menus (restaurant_id, name, price) VALUES
  (2, '포테이토 피자(L)',     27900),
  (2, '슈퍼슈프림(L)',        27900),
  (2, '페퍼로니(L)',          25900),
  (2, '불고기 피자(L)',       25900),
  (2, '베이컨 체다치즈(L)',   27900),
  (2, '갈릭 브레드',           6900);

-- 맘스터치(3) — 단품 기준
INSERT INTO menus (restaurant_id, name, price) VALUES
  (3, '싸이버거',         4900),
  (3, '불싸이버거',       4900),
  (3, '딥치즈버거',       5400),
  (3, '새우불고기버거',   5400),
  (3, '휠렛버거',         4500),
  (3, '양념감자',         2500);

-- 김밥천국(4)
INSERT INTO menus (restaurant_id, name, price) VALUES
  (4, '김밥',         3500),
  (4, '참치김밥',     4500),
  (4, '라면',         4000),
  (4, '치즈돈까스',   8000),
  (4, '떡볶이',       4500),
  (4, '제육덮밥',     7500);
