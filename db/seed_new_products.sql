-- 新增/更新商城商品：bio+id 與 MAL 好家庭 兩個品牌
-- 用法：在 Supabase SQL Editor 貼上執行即可（sku 已設 UNIQUE，重複執行不會產生重複資料）
--
-- ⚠️ price 目前是佔位值 0，包裝上沒有標示售價，price 欄位是 NOT NULL 所以不能留空。
--    上架前請務必依實際售價修改，不改的話商城會顯示 NT$0。

INSERT INTO public.products (sku, name, category, sub_category, brand, description, price, image_url, stock_quantity, is_active)
VALUES
  (
    'bioid-bb-slim-drink',
    'BB 神采速纖飲',
    'supplement',
    'drink',
    'bioid',
    '膠原蛋白、牛磺酸、支鏈胺基酸(BCAA)複方飲品，30ml/包，10包/盒，健康食品字號 A00439。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL, -- 圖片走前端本地 import（PRODUCT_IMAGES），這裡可留空或之後改上圖床網址
    100,
    true
  ),
  (
    'bioid-dha-fishoil',
    '菁萃高純度 DHA 魚油軟膠囊',
    'supplement',
    'fish-oil',
    'bioid',
    '高純度 DHA/EPA 魚油軟膠囊，60顆/盒，健康食品認證，有助於降低血液中三酸甘油酯。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL,
    100,
    true
  ),
  (
    'bioid-natto-q10',
    '晶亮納豆 Q10 軟膠囊',
    'supplement',
    'enzyme',
    'bioid',
    '納豆激酶＋輔酵素Q10複方軟膠囊，60顆/盒，含DHA、金盞花萃取物。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL,
    100,
    true
  ),
  (
    'mal-growth-calcium',
    'MAL 好家庭 成長鈣咀嚼片',
    'supplement',
    'calcium',
    'mal',
    '兒童成長鈣咀嚼片＋維生素D3，60錠，台灣製造，香濃牛奶風味。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL,
    100,
    true
  ),
  (
    'mal-night-enzyme',
    'MAL 好家庭 夜酵素複方膠囊',
    'supplement',
    'enzyme',
    'mal',
    '夜間黃金修復期專用複方膠囊，60顆，幫助放鬆舒眠、夜間代謝、消化。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL,
    100,
    true
  ),
  (
    'mal-vitality-metabolism',
    'MAL 好家庭 活力代謝複方膠囊',
    'supplement',
    'metabolism',
    'mal',
    '全方位代謝守護配方，60粒膠囊，天然植萃，全家可用。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL,
    100,
    true
  ),
  (
    'mal-cranberry-probiotics',
    'MAL 好家庭 蔓越莓益生菌',
    'supplement',
    'probiotics',
    'mal',
    '女性專屬配方，含蔓越莓萃取原花青素(PACs)＋150億活菌，60粒膠囊，純素。',
    0, -- TODO: price 為 NOT NULL 欄位，這裡先放 0 佔位，上架前務必改成實際售價
    NULL,
    100,
    true
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  brand = EXCLUDED.brand,
  description = EXCLUDED.description,
  is_active = true,
  updated_at = NOW();
  -- 注意：這裡刻意不覆蓋 price/original_price/stock_quantity，
  -- 避免重複執行這份 SQL 時，把你之後在後台手動改過的售價/庫存又蓋回 NULL。
