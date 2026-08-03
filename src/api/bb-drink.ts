// src/api/bb-drink.ts
// Server Function 邊界：Client 端只會拿到 RPC stub，Supabase Admin 金鑰不會進 client bundle。
import { createServerFn } from '@tanstack/react-start';
import { hasSupabaseAdminConfig, restGetList, restGetOne } from '@/lib/supabaseAdmin';
import type { BBDrinkProduct } from '@/types/bb-drink';

// DB 欄位是 snake_case（跟 products 表同慣例），PostgREST 不會自動轉成
// camelCase，這裡手動對應成前端型別要的形狀。
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

export const fetchBBDrinkData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const rows = await restGetList<BBDrinkProductRow>(
      'bb_drink_products',
      'is_active=eq.true&select=*&order=sort_order.asc',
    );
    return { products: rows.map(mapRow) };
  },
);

export const getBBDrinkProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const row = await restGetOne<BBDrinkProductRow>(
      'bb_drink_products',
      `id=eq.${encodeURIComponent(id)}`,
    );
    if (!row) throw new Error('找不到此商品');
    return mapRow(row);
  });
