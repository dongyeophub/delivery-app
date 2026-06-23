-- ============================================================
-- 시드 데이터: 시연용 식당 + 메뉴
-- (스키마 생성 후 한 번만 실행하면 식당/메뉴가 채워진다)
-- ============================================================

-- 중복 삽입 방지를 위해 기존 식당/메뉴를 비우고 다시 넣는다.
TRUNCATE TABLE order_items, orders, menus, restaurants RESTART IDENTITY CASCADE;

-- 식당 3곳
INSERT INTO restaurants (name, category, image_url) VALUES
  ('바삭치킨',   '치킨', '🍗'),
  ('한입분식',   '분식', '🍢'),
  ('나폴리피자', '피자', '🍕');

-- 바삭치킨(1)
INSERT INTO menus (restaurant_id, name, price) VALUES
  (1, '후라이드 치킨',   18000),
  (1, '양념 치킨',       19000),
  (1, '반반 치킨',       19000),
  (1, '치킨 무',          1000),
  (1, '콜라 1.25L',       2500);

-- 한입분식(2)
INSERT INTO menus (restaurant_id, name, price) VALUES
  (2, '떡볶이',           4000),
  (2, '순대',             4500),
  (2, '튀김 모둠',        5000),
  (2, '김밥',             3500),
  (2, '라면',             4000);

-- 나폴리피자(3)
INSERT INTO menus (restaurant_id, name, price) VALUES
  (3, '마르게리타 피자', 15000),
  (3, '페퍼로니 피자',   17000),
  (3, '고르곤졸라 피자', 18000),
  (3, '갈릭 브레드',      6000),
  (3, '콜라 500ml',       2000);
