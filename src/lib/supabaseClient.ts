// src/lib/supabaseClient.ts
// Browser-side Supabase client. Uses the anon/publishable key only —
// safe to expose in the frontend bundle. RLS policies on `reports`,
// `patient_mappings`, `daily_logs`, and `reminders` restrict each row
// to its own profile_id (auth.uid()), so this client can only ever
// read/write the signed-in user's own data.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — " +
      "Supabase calls from the browser will fail until these are configured.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
