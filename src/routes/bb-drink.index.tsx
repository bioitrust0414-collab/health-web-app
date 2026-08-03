import { createFileRoute } from '@tanstack/react-router'
import { fetchBBDrinkData } from '@/api/bb-drink'
import { HeroSection } from '@/components/bb-drink/HeroSection'
import { ProductGrid } from '@/components/bb-drink/ProductGrid'

export const Route = createFileRoute('/bb-drink/')({
  head: () => ({
    meta: [
      { title: 'bioid × 好家庭｜日常活力保健嚴選商店' },
      {
        name: 'description',
        content:
          'bioid BB神采速纖飲、DHA魚油、晶亮納豆Q10；好家庭成長鈣、活力代謝、夜酵素複方、蔓越莓益生菌——一站式選購，日常活力全家守護。',
      },
    ],
  }),
  loader: async () => {
    return await fetchBBDrinkData()
  },
  component: BBDrinkPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-muted-foreground">
      載入失敗：{error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-6">找不到頁面</div>,
})

function BBDrinkPage() {
  const { products, configured } = Route.useLoaderData()

  if (!configured) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-xl font-bold">bioid × 好家庭</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          資料庫尚未設定（缺少伺服器金鑰），目前沒有商品可顯示。
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProductGrid products={products} />
    </div>
  )
}
