import fishOilImg from '@/assets/product-fishoil.jpg'
import probioticImg from '@/assets/product-probiotic.jpg'
import type { BBDrinkProduct } from '@/types/bb-drink'

type BBDrinkProductRow = {
  id: string
  name: string
  subtitle: string | null
  price: number
  original_price: number | null
  image: string | null
  description: string | null
  ingredients: string[] | null
  benefits: string[] | null
  flavor: string | null
  net_weight: string | null
  stock: number
  is_new: boolean
  is_best_seller: boolean
}

const fallbackProducts: BBDrinkProduct[] = [
  { id: 'bb-drink', name: 'bioid BB神采速纖飲', subtitle: '日常纖盈補給', price: 1280, originalPrice: 1480, image: probioticImg, description: '高纖配方，方便補充每日所需。', ingredients: ['膳食纖維', '綜合蔬果萃取'], benefits: ['補充膳食纖維', '日常輕盈管理'], flavor: '莓果', netWeight: '15包／盒', stock: 30, isBestSeller: true },
  { id: 'dha-fish-oil', name: 'DHA魚油', subtitle: '高品質 Omega-3', price: 980, image: fishOilImg, description: '適合全家日常保養的魚油配方。', ingredients: ['DHA', 'EPA', '維生素E'], benefits: ['補充 Omega-3', '維持健康活力'], flavor: '膠囊', netWeight: '90粒／瓶', stock: 24, isNew: true },
  { id: 'natto-q10', name: '晶亮納豆Q10', subtitle: '循環活力複方', price: 1180, image: fishOilImg, description: '納豆與 Q10 的日常活力配方。', ingredients: ['納豆萃取', '輔酵素Q10'], benefits: ['日常活力補給', '維持健康循環'], flavor: '膠囊', netWeight: '60粒／瓶', stock: 18 },
  { id: 'growth-calcium', name: '好家庭成長鈣', subtitle: '全家鈣質補充', price: 860, image: probioticImg, description: '成長期與全家人的每日鈣質補給。', ingredients: ['鈣', '維生素D3', '維生素K2'], benefits: ['補充鈣質', '幫助骨骼正常發育'], flavor: '牛奶', netWeight: '30包／盒', stock: 40 },
  { id: 'metabolism', name: '活力代謝', subtitle: '每日精神補給', price: 920, image: probioticImg, description: '為忙碌生活準備的營養複方。', ingredients: ['維生素B群', '礦物質'], benefits: ['維持能量正常代謝', '補充每日營養'], flavor: '膠囊', netWeight: '60粒／瓶', stock: 25 },
  { id: 'night-enzyme', name: '夜酵素複方', subtitle: '夜間順暢保養', price: 890, image: probioticImg, description: '多種蔬果酵素與纖維複方。', ingredients: ['蔬果酵素', '膳食纖維'], benefits: ['補充蔬果營養', '維持消化道機能'], flavor: '果香', netWeight: '30包／盒', stock: 28 },
  { id: 'cranberry-probiotic', name: '蔓越莓益生菌', subtitle: '女性日常私密保養', price: 960, image: probioticImg, description: '蔓越莓與益生菌雙效配方。', ingredients: ['蔓越莓萃取', '複合益生菌'], benefits: ['調整體質', '維持消化道機能'], flavor: '莓果', netWeight: '30包／盒', stock: 32 },
]

function getPublicConfig() {
  const url = process.env['SUPABASE_URL'] ?? process.env['VITE_SUPABASE_URL']
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['SUPABASE_ANON_KEY'] ?? process.env['VITE_SUPABASE_PUBLISHABLE_KEY']
  return { url, key }
}

function mapRow(row: BBDrinkProductRow): BBDrinkProduct {
  return { id: row.id, name: row.name, subtitle: row.subtitle ?? '', price: row.price, originalPrice: row.original_price ?? undefined, image: row.image ?? '', description: row.description ?? '', ingredients: row.ingredients ?? [], benefits: row.benefits ?? [], flavor: row.flavor ?? '', netWeight: row.net_weight ?? '', stock: row.stock, isNew: row.is_new, isBestSeller: row.is_best_seller }
}

async function publicGetList<T>(query: string): Promise<T[]> {
  const { url, key } = getPublicConfig()
  if (!url || !key) return []
  const headers = new Headers({ apikey: key })
  if (!key.startsWith('sb_')) headers.set('Authorization', `Bearer ${key}`)
  const response = await fetch(`${url}/rest/v1/bb_drink_products?${query}`, { headers })
  if (!response.ok) throw new Error(`商品資料讀取失敗：${response.status}`)
  return response.json() as Promise<T[]>
}

export async function listBBDrinkProducts(): Promise<{ products: BBDrinkProduct[]; configured: boolean }> {
  try {
    const rows = await publicGetList<BBDrinkProductRow>('is_active=eq.true&select=*&order=sort_order.asc')
    return rows.length > 0 ? { products: rows.map(mapRow), configured: true } : { products: fallbackProducts, configured: false }
  } catch (error) {
    console.error(error)
    return { products: fallbackProducts, configured: false }
  }
}

export async function findBBDrinkProduct(id: string): Promise<BBDrinkProduct | null> {
  const result = await listBBDrinkProducts()
  return result.products.find((product) => product.id === id) ?? null
}