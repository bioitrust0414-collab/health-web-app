// src/server/bb-drink.ts
import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from './supabase-admin';

export const getBBDrinkProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from('bb_drink_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }
);

export const getBBDrinkProductById = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { data, error } = await supabaseAdmin
      .from('bb_drink_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  });
