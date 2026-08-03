// src/server/health.ts
import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from './supabase-admin';
import { getSession } from './auth'; // 您的 session 驗證

export const getHealthReports = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const { data: reports, error: reportsError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false });

    if (reportsError) throw new Error(reportsError.message);

    const { data: dailyLogs, error: logsError } = await supabaseAdmin
      .from('daily_logs')
      .select('*')
      .eq('user_id', session.userId)
      .order('date', { ascending: false })
      .limit(30);

    if (logsError) throw new Error(logsError.message);

    return { reports: reports ?? [], dailyLogs: dailyLogs ?? [] };
  }
);
