// src/server/health.ts
// SERVER-ONLY. 透過 @/lib/supabaseAdmin 的共用 Admin REST client 存取資料。
import { createServerFn } from '@tanstack/react-start';
import { restGetList } from '@/lib/supabaseAdmin';
import { verifySessionToken } from '@/lib/sessionToken';

export const getHealthReports = createServerFn({ method: 'GET' })
  .inputValidator((token: string) => token)
  .handler(async ({ data: token }) => {
    const userId = await verifySessionToken(token);
    if (!userId) throw new Error('Unauthorized');

    const [reports, dailyLogs] = await Promise.all([
      restGetList<Record<string, string | number | boolean | null>>(
        'reports',
        `user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc`,
      ),
      restGetList<Record<string, string | number | boolean | null>>(
        'daily_logs',
        `user_id=eq.${encodeURIComponent(userId)}&select=*&order=date.desc&limit=30`,
      ),
    ]);


    return { reports, dailyLogs };
  });
