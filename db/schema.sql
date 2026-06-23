-- ============================================================
-- 배달앱 데이터베이스 스키마
-- 테이블 5개: users, restaurants, menus, orders, order_items
-- ============================================================

-- 1) users: 회원 정보 (이메일/비밀번호)
--    비밀번호는 절대 평문으로 저장하지 않고 해시(암호화)해서 저장한다.
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,        -- 같은 이메일 중복 가입 방지
  password_hash TEXT NOT NULL,               -- bcrypt로 해시된 비밀번호
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) restaurants: 식당 정보
CREATE TABLE IF NOT EXISTS restaurants (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL,                  -- 예: 치킨, 분식, 피자
  image_url  TEXT,                           -- 식당 대표 이미지(이모지/URL)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) menus: 메뉴 정보 (각 메뉴는 하나의 식당에 속한다 → restaurant_id로 연결)
CREATE TABLE IF NOT EXISTS menus (
  id            SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  price         INTEGER NOT NULL,            -- 원 단위 정수로 저장
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) orders: 주문 1건의 "머리" 정보 (누가/언제/총액/상태)
--    한 번의 주문에 대한 공통 정보만 담는다.
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_price INTEGER NOT NULL,              -- 주문 총액 (계산해서 저장)
  status      TEXT NOT NULL DEFAULT '접수',  -- 접수 / 배달중 / 완료
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) order_items: 주문 1건의 "내용물" (그 주문에 어떤 메뉴를 몇 개)
--    하나의 주문(order)에 여러 품목이 들어가므로 별도 테이블로 분리한다. (1:N 관계)
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id    INTEGER NOT NULL REFERENCES menus(id),
  menu_name  TEXT NOT NULL,                  -- 주문 당시 메뉴 이름 (나중에 메뉴가 바뀌어도 기록 보존)
  price      INTEGER NOT NULL,               -- 주문 당시 가격 (위와 같은 이유로 스냅샷 저장)
  quantity   INTEGER NOT NULL                -- 수량
);

-- 6) coupons: 시즌성 할인 쿠폰 (가산 기능)
CREATE TABLE IF NOT EXISTS coupons (
  id              SERIAL PRIMARY KEY,
  code            TEXT NOT NULL UNIQUE,           -- 사용자가 적용하는 쿠폰 코드
  title           TEXT NOT NULL,                  -- 화면에 보일 설명
  discount_type   TEXT NOT NULL,                  -- 'percent'(정률) | 'fixed'(정액)
  discount_value  INTEGER NOT NULL,               -- percent면 %, fixed면 원
  min_order_price INTEGER NOT NULL DEFAULT 0,     -- 최소 주문금액
  valid_until     DATE,                           -- 시즌 만료일 (NULL이면 상시)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- orders에 쿠폰 적용 결과를 "스냅샷"으로 저장 (쿠폰이 나중에 바뀌어도 과거 주문은 보존)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0;

-- 조회 속도를 위한 인덱스 (외래키로 자주 조회하는 컬럼)
CREATE INDEX IF NOT EXISTS idx_menus_restaurant ON menus(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
