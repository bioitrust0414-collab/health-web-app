-- db/schema.sql
-- 適用 Supabase 專案 dahua-lab（project ref bpwtllljnwlgdhfepwtr, ap-southeast-1, 2026-07-25 新建）
-- 這是全新的空專案，跟先前提案中假設「已有 profiles/bookings/orders」的舊 dahua-lab（Tokyo region）不同，
-- 所以這裡從 profiles 開始建，不是只新增 4 張表。

-- 會員資料表：對應 auth.users，新註冊會自動建一筆（見下方 trigger）
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    birthday DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX profiles_phone_key ON public.profiles (phone) WHERE phone IS NOT NULL;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "profiles can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 新使用者註冊時自動建立 profile
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- LIS 患者綁定：一個會員可能對應大華 LIS 系統裡的一筆病患資料
CREATE TABLE public.patient_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lis_patient_id VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, lis_patient_id)
);

-- 檢驗報告（目前是人工/mock 登打，尚無大華 LIS 自動同步）
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lis_report_id VARCHAR(50) NOT NULL,
    report_date DATE NOT NULL,
    pdf_path TEXT,
    summary_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 健康數據追蹤（日常紀錄）
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    water_ml INT DEFAULT 0,
    sleep_hours NUMERIC(3,1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 提醒（回診、習慣養成、預約等）
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- 'FOLLOW_UP' | 'HABIT' | 'BOOKING'
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    trigger_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    disclaimer_text TEXT NOT NULL
);

-- RLS：確保會員只能讀到自己的資料
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles can only view their own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = profile_id);

ALTER TABLE public.patient_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles can only view their own mapping"
ON public.patient_mappings
FOR SELECT
USING (auth.uid() = profile_id);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles can only view their own daily logs"
ON public.daily_logs
FOR SELECT
USING (auth.uid() = profile_id);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles can only view their own reminders"
ON public.reminders
FOR SELECT
USING (auth.uid() = profile_id);
