import { fetchBBDrinkData } from 'src/server/bb-drink'

export const Route = createFileRoute('/bb-drink/')({
  loader: async () => {
    // 透過 Server Function 呼叫後端 API
    const data = await fetchBBDrinkData()
    return data
  },
  component: BBDrinkPage,
})
