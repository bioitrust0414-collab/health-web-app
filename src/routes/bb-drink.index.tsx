import { createFileRoute } from '@tanstack/react-router'
import { fetchBBDrinkData } from 'src/api/bb-drink'

export const Route = createFileRoute('/bb-drink/')({
  loader: async () => {
    return await fetchBBDrinkData()
  },
  component: BBDrinkPage,
})

function BBDrinkPage() {
  const data = Route.useLoaderData()
  return (
    <div>
      <h1>BB Drink</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
