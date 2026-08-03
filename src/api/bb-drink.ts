// src/api/bb-drink.ts
import { createServerFn } from '@tanstack/react-start';
import type { BBDrinkProduct } from '@/types/bb-drink';

// 同時支援 process.env（部署平台）和 import.meta.env（Vite/Lovable）
function getEnv(key: string): string | undefined {
  return (
    process.env[key] ??
    process.env[`VITE_${key}`] ??
    (typeof import.meta.env !== 'undefined' ? import.meta.env[key] : undefined) ??
    (typeof import.meta.env !== 'undefined' ? import.meta.env[`VITE_${key}`] : undefined)
  );
}

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

// ... 以下 mapRow、publicGetList、publicGetOne 完全不用改 ...

export const fetchBBDrinkData = createServerFn({ method: 'GET' }).handler(
  async () => {
    // 加入 debug 日誌，方便在部署平台的 Build Log 中查看
    console.log('[bb-drink] SUPABASE_URL:', SUPABASE_URL ? '已設定' : '未設定');
    console.log('[bb-drink] SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '已設定' : '未設定');

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { products: [] as BBDrinkProduct[], configured: false };
    }
    try {
      const rows = await publicGetList<BBDrinkProductRow>(
        'bb_drink_products',
        'is_active=eq.true&select=*&order=sort_order.asc',
      );
      return { products: rows.map(mapRow), configured: true };
    } catch (err) {
      console.error('fetchBBDrinkData error:', err);
      return { products: [] as BBDrinkProduct[], configured: false };
    }
  },
);

// ... getBBDrinkProductById 也不用改 ...
