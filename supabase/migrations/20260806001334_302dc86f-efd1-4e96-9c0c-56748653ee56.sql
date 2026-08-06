-- profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    birthday DATE,
    gender TEXT CHECK (gender IN ('male','female','other','prefer_not_to_say')),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX profiles_phone_key ON public.profiles (phone) WHERE phone IS NOT NULL;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles view own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- patient_mappings
CREATE TABLE public.patient_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lis_patient_id VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    linked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (profile_id, lis_patient_id)
);
GRANT SELECT ON public.patient_mappings TO authenticated;
GRANT ALL ON public.patient_mappings TO service_role;
ALTER TABLE public.patient_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mappings view own" ON public.patient_mappings FOR SELECT TO authenticated USING (auth.uid() = profile_id);

-- reports
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lis_report_id VARCHAR(50) NOT NULL,
    report_date DATE NOT NULL,
    pdf_path TEXT,
    summary_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports view own" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = profile_id);

-- daily_logs
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    water_ml INT DEFAULT 0,
    sleep_hours NUMERIC(3,1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs view own" ON public.daily_logs FOR SELECT TO authenticated USING (auth.uid() = profile_id);

-- reminders
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    trigger_time TIMESTAMPTZ NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    disclaimer_text TEXT NOT NULL
);
GRANT SELECT ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reminders view own" ON public.reminders FOR SELECT TO authenticated USING (auth.uid() = profile_id);

-- products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(50),
    brand VARCHAR(50),
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    image_url TEXT,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    health_tags TEXT[],
    ingredients TEXT[],
    benefits TEXT[],
    flavor VARCHAR(50),
    net_weight VARCHAR(50),
    is_best_seller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_type VARCHAR(30) NOT NULL,
    package_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','completed','cancelled','refunded')),
    total_amount NUMERIC(10,2) NOT NULL,
    points_used INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    final_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name VARCHAR(200) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- member points
CREATE TABLE public.member_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earn','redeem','expire','adjust')),
    points INT NOT NULL,
    source VARCHAR(50),
    source_id UUID,
    description VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT now()
);
GRANT ALL ON public.member_points TO service_role;
ALTER TABLE public.member_points ENABLE ROW LEVEL SECURITY;

CREATE VIEW public.member_points_balance
WITH (security_invoker = true) AS
SELECT profile_id, COALESCE(SUM(points), 0)::int AS total_points
FROM public.member_points GROUP BY profile_id;
GRANT SELECT ON public.member_points_balance TO service_role;

-- stamp cards
CREATE TABLE public.stamp_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_type VARCHAR(50) DEFAULT 'default',
    current_stamps INT DEFAULT 0,
    total_stamps INT DEFAULT 10,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX stamp_cards_profile_card_type_key ON public.stamp_cards (profile_id, card_type);
GRANT ALL ON public.stamp_cards TO service_role;
ALTER TABLE public.stamp_cards ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- seed: itrust / dahua
INSERT INTO public.products (sku, name, category, brand, description, price, image_url, stock_quantity, health_tags) VALUES
 ('fish-oil-90', '魚油 Omega-3 90 粒', 'supplement', 'itrust', '高濃度 EPA/DHA，血脂偏高首選', 980, NULL, 200, ARRAY['血脂']),
 ('probiotic-fiber-30d', '膳食纖維益生菌', 'supplement', 'itrust', '30 日份，餐前沖泡', 760, NULL, 200, ARRAY['腸胃']),
 ('bp-monitor-bluetooth', '藍牙血壓計', 'device', 'itrust', '自動同步 App 紀錄', 2280, NULL, 50, ARRAY['血壓']),
 ('checkup-full-body', '全身健檢方案', 'service', 'dahua', '含 62 項檢查與醫師解說', 12800, NULL, 999, ARRAY['健檢']),
 ('dietitian-1on1', '營養師 1 對 1 諮詢', 'service', 'dahua', '50 分鐘線上諮詢，含飲食計畫', 1500, NULL, 999, ARRAY['營養']),
 ('glucose-coaching-12wk', '12 週控糖課程', 'service', 'dahua', '每週任務＋教練追蹤', 5600, NULL, 999, ARRAY['血糖']);

-- seed: 健康好夥伴 (bb-drink)
INSERT INTO public.products (sku, name, category, sub_category, brand, description, price, original_price, stock_quantity, health_tags, ingredients, benefits, flavor, net_weight, is_best_seller, is_new) VALUES
 ('bb-drink', 'bioid BB神采速纖飲', 'supplement', '機能飲品', '健康好夥伴', '專為日常代謝設計的機能飲，順口好喝、外出攜帶方便。', 1280, 1580, 120, ARRAY['體態','代謝'], ARRAY['專利乳酸菌','綜合蔬果酵素','左旋肉酸','膳食纖維'], ARRAY['促進代謝','幫助排空','維持體態'], '蔓越莓風味', '10 包／盒', true, true),
 ('dha-fish-oil', 'bioid DHA 魚油', 'supplement', '油脂營養', '健康好夥伴', '高濃度 rTG 魚油，DHA 含量充足，全家都適合。', 1180, 1380, 150, ARRAY['腦部','眼睛'], ARRAY['rTG 魚油','DHA','EPA','天然維生素E'], ARRAY['維持思緒清晰','幫助眼睛健康','維持心血管機能'], '原味', '60 粒／瓶', true, false),
 ('natto-q10', '晶亮納豆Q10', 'supplement', '循環保養', '健康好夥伴', '納豆萃取搭配 Q10 與葉黃素，兼顧循環與晶亮。', 1380, 1680, 100, ARRAY['循環','眼睛'], ARRAY['納豆萃取物','輔酵素Q10','游離型葉黃素','蝦紅素'], ARRAY['維持循環順暢','幫助晶亮有神','提升活力'], '原味', '60 粒／瓶', false, true),
 ('growth-calcium', '好家庭成長鈣', 'supplement', '骨骼保養', '健康好夥伴', '鈣鎂搭配維生素D3與K2，成長期與長輩都需要。', 980, 1180, 180, ARRAY['骨骼','成長'], ARRAY['海藻鈣','檸檬酸鎂','維生素D3','維生素K2'], ARRAY['幫助骨骼生長','維持牙齒健康','促進鈣吸收'], '牛奶風味', '30 包／盒', true, false),
 ('vitality-metabolism', '好家庭活力代謝', 'supplement', '日常機能', '健康好夥伴', 'B群搭配胺基酸，補足忙碌日常需要的能量。', 780, 920, 200, ARRAY['活力','代謝'], ARRAY['綜合維生素B群','牛磺酸','人蔘萃取','鋅'], ARRAY['提振精神','幫助能量代謝','減少疲勞感'], '原味', '60 粒／瓶', false, false),
 ('night-enzyme', '好家庭夜酵素複方', 'supplement', '夜間保養', '健康好夥伴', '睡前一包，隔天順暢有感。', 890, 1080, 160, ARRAY['腸胃','排空'], ARRAY['蔬果酵素','鳳梨酵素','益生菌','水溶性膳食纖維'], ARRAY['幫助排空','調整體質','夜間代謝保養'], '蜂蜜檸檬風味', '30 包／盒', true, false),
 ('cranberry-probiotic', '好家庭蔓越莓益生菌', 'supplement', '私密保養', '健康好夥伴', '蔓越莓萃取搭配專利益生菌，女性私密日常保養。', 880, 1050, 140, ARRAY['私密','女性'], ARRAY['蔓越莓濃縮萃取','洛神花萃取','專利益生菌'], ARRAY['私密處保養','維持菌相平衡','幫助排空'], '蔓越莓風味', '30 包／盒', false, true),
 ('lutein-eye-care', '好家庭金盞花葉黃素', 'supplement', '眼睛保養', '健康好夥伴', '游離型葉黃素搭配玉米黃素，長時間用眼必備。', 1080, 1280, 130, ARRAY['眼睛'], ARRAY['游離型葉黃素','玉米黃素','山桑子萃取','蝦紅素'], ARRAY['幫助晶亮有神','減少藍光疲勞','維持視覺健康'], '原味', '60 粒／瓶', false, false),
 ('collagen-drink', '好家庭膠原蛋白飲', 'supplement', '美顏保養', '健康好夥伴', '小分子胜肽膠原蛋白，搭配維生素C好吸收。', 1480, 1780, 90, ARRAY['美顏','肌膚'], ARRAY['小分子膠原胜肽','神經醯胺','維生素C','玻尿酸'], ARRAY['維持肌膚彈潤','幫助保水','養顏美容'], '綜合莓果風味', '14 瓶／盒', false, true);