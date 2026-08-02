-- ============================================================
-- health-web-app 資料庫擴充：預約 / 商城 / 訂單 / 點數 / 集點卡
-- 適用 Supabase 專案 dahua-lab
-- ============================================================
-- 存取模型說明：
-- 這個 App 的登入是「LINE Login → 後端用 service role 建立
-- auth.users/profiles → 前端只存 profileId + 簽章過的 session token」，
-- 瀏覽器端從來沒有真正登入過 Supabase Auth，所以 auth.uid() 在這裡
-- 永遠是 null。以下這幾張表除了 products 開放公開讀取以外，
-- 一律不開放 anon/authenticated 角色的 RLS 政策——所有讀寫都只能
-- 透過後端的 Server Function（用 service role key，繞過 RLS）進行。
-- 這樣即使前端程式碼有漏洞誤用了 anon key 直接打 Supabase，也會被
-- RLS 擋下來，而不是誤以為「auth.uid() = profile_id」這種其實永遠
-- 不會成立的政策有在保護資料。
-- ============================================================

-- 1. 商品資料表
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,              -- 'supplement' | 'device' | 'service' | 'checkup'
    sub_category VARCHAR(50),
    brand VARCHAR(50),                          -- 'dahua' | 'itrust'（mal1688 暫不收）
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    image_url TEXT,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    health_tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 預約資料表
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_type VARCHAR(30) NOT NULL,          -- 'checkup' | 'gene_test' | 'allergy_test' | 'consultation'
    package_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 訂單資料表
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'refunded')),
    total_amount NUMERIC(10,2) NOT NULL,
    points_used INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    final_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(20),                 -- 尚未接金流，先固定 'pending_gateway'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 訂單明細
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name VARCHAR(200) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 會員點數
CREATE TABLE IF NOT EXISTS public.member_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL
        CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'adjust')),
    points INT NOT NULL,                        -- 正數 = 獲得，負數 = 使用
    source VARCHAR(50),                         -- 'purchase' | 'booking' | 'referral'
    source_id UUID,
    description VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.member_points_balance AS
SELECT profile_id, COALESCE(SUM(points), 0) AS total_points
FROM public.member_points
GROUP BY profile_id;

-- 6. 集點卡
CREATE TABLE IF NOT EXISTS public.stamp_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_type VARCHAR(50) DEFAULT 'default',
    current_stamps INT DEFAULT 0,
    total_stamps INT DEFAULT 10,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS stamp_cards_profile_card_type_key
    ON public.stamp_cards (profile_id, card_type);

-- ============================================
-- RLS：products 公開只讀；其餘一律不開放 anon/authenticated，
-- 只能透過 service role（Server Function）存取
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products are viewable by everyone" ON public.products;
CREATE POLICY "products are viewable by everyone"
ON public.products FOR SELECT USING (true);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_cards ENABLE ROW LEVEL SECURITY;
-- 這五張表刻意不建立任何 anon/authenticated 政策：
-- RLS 開啟 + 無政策 = 預設拒絕所有非 service-role 的存取。

-- ============================================
-- 商品初始資料（沿用原本商城頁面的假資料當作真實商品）
-- ============================================
INSERT INTO public.products (sku, name, category, brand, description, price, image_url, stock_quantity, health_tags)
VALUES
    ('fish-oil-90', '魚油 Omega-3 90 粒', 'supplement', 'itrust', '高濃度 EPA/DHA，血脂偏高首選', 980, NULL, 200, ARRAY['血脂']),
    ('probiotic-fiber-30d', '膳食纖維益生菌', 'supplement', 'itrust', '30 日份，餐前沖泡', 760, NULL, 200, ARRAY['腸胃']),
    ('bp-monitor-bluetooth', '藍牙血壓計', 'device', 'itrust', '自動同步 App 紀錄', 2280, NULL, 50, ARRAY['血壓']),
    ('checkup-full-body', '全身健檢方案', 'service', 'dahua', '含 62 項檢查與醫師解說', 12800, NULL, 999, ARRAY['健檢']),
    ('dietitian-1on1', '營養師 1 對 1 諮詢', 'service', 'dahua', '50 分鐘線上諮詢，含飲食計畫', 1500, NULL, 999, ARRAY['營養']),
    ('glucose-coaching-12wk', '12 週控糖課程', 'service', 'dahua', '每週任務＋教練追蹤', 5600, NULL, 999, ARRAY['血糖'])
ON CONFLICT (sku) DO NOTHING;

-- ============================================
-- 觸發器：自動更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
