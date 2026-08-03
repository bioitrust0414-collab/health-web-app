// src/routes/health.tsx
import { createFileRoute } from '@tanstack/react-router';
import { getHealthReports } from '@/server/health';

export const Route = createFileRoute('/health')({
  component: HealthPage,
  loader: async () => {
    const data = await getHealthReports();
    return data;
  },
});

function HealthPage() {
  const { reports, dailyLogs } = Route.useLoaderData();
  // ... 渲染邏輯
}
