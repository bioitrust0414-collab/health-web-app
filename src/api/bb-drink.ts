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

type BBDrinkProductRow = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  description: string | null;
  ingredients: string[] | null;
  benefits: string[] | null;
  flavor: string | null;
  net_weight: string | null;
  stock: number;
  is_new: boolean;
  is_best_seller: boolean;
};

function mapRow(row: BBDrinkProductRow): BBDrinkProduct {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle ?? '',
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    image: row.image ?? '',
    description: row.description ?? '',
    ingredients: row.ingredients ?? [],
    benefits: row.benefits ?? [],
    flavor: row.flavor ?? '',
    netWeight: row.net_weight ?? '',
    stock: row.stock,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
  };
}

// 公開查詢輔助函數（使用 Anon Key）
async function publicGetList<T>(table: string, query: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

async function publicGetOne<T>(table: string, query: string): Promise<T | null> {
  const rows = await publicGetList<T>(table, query);
  return rows[0] ?? null;
}

export const fetchBBDrinkData = createServerFn({ method: 'GET' }).handler(
  async () => {
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

export const getBBDrinkProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('資料庫尚未設定');
    }
    const row = await publicGetOne<BBDrinkProductRow>(
      'bb_drink_products',
      `id=eq.${encodeURIComponent(id)}`,
    );
    if (!row) throw new Error('找不到商品');
    return mapRow(row);
  });
