import { createFileRoute } from '@tanstack/react-router'
import { fetchBBDrinkData } from 'src/server/bb-drink'

export const Route = createFileRoute('/bb-drink/')({
  loader: async () => {
    // 透過 Server Function 呼叫後端 API
    const data = await fetchBBDrinkData()
    return data
  },
  component: BBDrinkPage,
})

function BBDrinkPage() {
  const data = Route.useLoaderData()

  return (
    <div>
      <h1>BB Drink</h1>
      {/* 根據你的實際資料結構調整渲染 */}
      <pre>{JSON.stringify(data, null, 
