// src/api/bb-drink.ts
// Server Function 邊界：Client 端只會拿到 RPC stub，Supabase Admin 金鑰不會進 client bundle。
import { createServerFn } from '@tanstack/react-start';
import { hasSupabaseAdminConfig, restGetList, restGetOne } from '@/lib/supabaseAdmin';
import type { BBDrinkProduct } from '@/types/bb-drink';

export const fetchBBDrinkData = createServerFn({ method: 'GET' }).handler(
  async () => {
    // 尚未設定 Supabase 伺服器金鑰時，回傳空清單而不是讓整頁 500（白畫面）。
    if (!hasSupabaseAdminConfig()) {
      return { products: [] as BBDrinkProduct[], configured: false };
    }
    const products = await restGetList<BBDrinkProduct>(
      'bb_drink_products',
      'is_active=eq.true&select=*&order=sort_order.asc',
    );
    return { products, configured: true };
  },
);

export const getBBDrinkProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!hasSupabaseAdminConfig()) {
      throw new Error('資料庫尚未設定，暫時無法載入商品。');
    }
    const product = await restGetOne<BBDrinkProduct>(
      'bb_drink_products',
      `id=eq.${encodeURIComponent(id)}`,
    );
    if (!product) throw new Error('找不到此商品');
    return product;
  });
