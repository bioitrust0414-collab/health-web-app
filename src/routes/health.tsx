import { createFileRoute } from '@tanstack/react-router'
import { fetchHealthData } from 'src/api/health'

export const Route = createFileRoute('/health')({
  loader: async () => {
    return await fetchHealthData()
  },
  component: HealthPage,
})

function HealthPage() {
  const data = Route.useLoaderData()
  return <div>{JSON.stringify(data)}</div>
}
