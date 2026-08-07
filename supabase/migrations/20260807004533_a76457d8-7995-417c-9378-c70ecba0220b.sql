ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS line_user_id text;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_line_user_id_key ON public.profiles (line_user_id) WHERE line_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_birthday_idx ON public.profiles (birthday);