import { createFileRoute } from '@tanstack/react-router'
import { fetchBBDrinkData } from '@/api/bb-drink'

export const Route = createFileRoute('/bb-drink/')({
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
  const data = Route.useLoaderData()

  if (!data.configured) {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-xl font-bold">BB Drink</h1>
        <p className="text-sm text-muted-foreground">
          資料庫尚未設定（缺少伺服器金鑰），目前沒有商品可顯示。
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">BB Drink</h1>
      <pre className="text-xs">{JSON.stringify(data.products, null, 2)}</pre>
    </div>
  )
}
