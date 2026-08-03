// src/api/bb-drink.ts
// Server Function 邊界：Client 端只會拿到 RPC stub，Supabase Admin 金鑰不會進 client bundle。
import { createServerFn } from '@tanstack/react-start';
import { restGetList, restGetOne } from '@/lib/supabaseAdmin';
import type { BBDrinkProduct } from '@/types/bb-drink';

export const fetchBBDrinkData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const products = await restGetList<BBDrinkProduct>(
      'bb_drink_products',
      'is_active=eq.true&select=*&order=sort_order.asc',
    );
    return { products };
  },
);

export const getBBDrinkProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const product = await restGetOne<BBDrinkProduct>(
      'bb_drink_products',
      `id=eq.${encodeURIComponent(id)}`,
    );
    if (!product) throw new Error('找不到此商品');
    return product;
  });
