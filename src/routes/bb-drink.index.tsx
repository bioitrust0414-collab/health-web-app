import { createFileRoute } from '@tanstack/react-router'
import { fetchBBDrinkData } from 'src/server/bb-drink'

export const Route = createFileRoute('/bb-drink/')({
  loader: async () => {
    const data = await fetchBBDrinkData()
    return data
  },
  component: BBDrinkPage,
})

function BBDrinkPage() {
  const data = Route.useLoaderData()
  return <div>{JSON.stringify(data)}</div>
}
