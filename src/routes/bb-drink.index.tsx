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
})

function BBDrinkPage() {
  const { products } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProductGrid products={products} />
    </div>
  )
}
