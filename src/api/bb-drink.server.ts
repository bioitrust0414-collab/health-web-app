// src/api/bb-drink.server.ts
// SERVER-ONLY. bb-drink 頁面的商品資料，一律從 Supabase products 表讀取
// （brand = '健康好夥伴'），不再使用寫死的陣列，也不再讀舊的 bb_drink_products 表。
import type { BBDrinkProduct } from '@/types/bb-drink'

const BB_DRINK_BRAND = '健康好夥伴'

async function queryProducts(extraFilter = ''): Promise<BBDrinkProduct[]> {
  const { hasSupabaseAdminConfig, restGetList } = await import('@/lib/supabaseAdmin')
  if (!hasSupabaseAdminConfig()) return []
  const brand = encodeURIComponent(BB_DRINK_BRAND)
  return restGetList<BBDrinkProduct>(
    'products',
    `select=*&is_active=eq.true&brand=eq.${brand}${extraFilter}&order=created_at.desc`,
  )
}

export async function listBBDrinkProducts(): Promise<{
  products: BBDrinkProduct[]
  configured: boolean
}> {
  const { hasSupabaseAdminConfig } = await import('@/lib/supabaseAdmin')
  const products = await queryProducts()
  return { products, configured: hasSupabaseAdminConfig() }
}

/** sku 就是 bb-drink 頁面的 slug（路由參數）。 */
export async function findBBDrinkProduct(sku: string): Promise<BBDrinkProduct | null> {
  const rows = await queryProducts(`&sku=eq.${encodeURIComponent(sku)}`)
  return rows[0] ?? null
}
