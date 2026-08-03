import { createFileRoute, Link } from '@tanstack/react-router'
import { Activity, Footprints, HeartPulse, Moon, Scale, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { LineOaCard } from '@/components/LineOaCard'
import { StatusBadge } from '@/components/StatusBadge'
import { StepsChart } from '@/components/StepsChart'
import { dailyMetrics, labResults } from '@/lib/health-data'

const metricIcons = {
  steps: Footprints,
  sleep: Moon,
  hr: HeartPulse,
  weight: Scale,
}

export const Route = createFileRoute('/health')({
  head: () => ({
    meta: [
      { title: '健康首頁｜健康好夥伴' },
      { name: 'description', content: '查看每日步數、睡眠、心率、體重與健康檢查提醒。' },
      { property: 'og:title', content: '健康首頁｜健康好夥伴' },
      { property: 'og:description', content: '每日健康數據與健檢趨勢，一頁掌握。' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: HealthPage,
})

function HealthPage() {
  const alert = labResults.find((item) => item.status === 'high')

  return (
    <AppShell title="早安，陳小綠" subtitle="今天也一起照顧好自己的健康">
      <div className="grid gap-5 pb-8">
        <section className="surface-card p-5 md:p-8">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">今日健康分數</p>
              <p className="mt-1 text-4xl font-bold tabular-nums">86<span className="ml-1 text-sm text-muted-foreground">/ 100</span></p>
              <p className="mt-2 text-xs text-muted-foreground">睡眠與活動狀況良好，持續保持</p>
            </div>
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <ShieldCheck className="h-10 w-10" />
            </span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {dailyMetrics.map((metric) => {
            const Icon = metricIcons[metric.id as keyof typeof metricIcons] ?? Activity
            return (
              <article key={metric.id} className="surface-card min-w-0 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <StatusBadge status={metric.status} />
                </div>
                <p className="mt-4 text-xs text-muted-foreground">{metric.label}</p>
                <p className="mt-1 truncate text-xl font-bold tabular-nums">{metric.value}<span className="ml-1 text-xs font-medium text-muted-foreground">{metric.unit}</span></p>
                <p className="mt-2 truncate text-[11px] text-muted-foreground">{metric.hint}</p>
              </article>
            )
          })}
        </section>

        <StepsChart />

        {alert && (
          <Link to="/reports" className="surface-card flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-destructive">健檢數值提醒</p>
              <p className="mt-1 truncate font-bold">{alert.name} {alert.value} {alert.unit}</p>
              <p className="mt-1 text-xs text-muted-foreground">查看完整報告與歷次趨勢</p>
            </div>
            <StatusBadge status={alert.status} />
          </Link>
        )}

        <LineOaCard />
      </div>
    </AppShell>
  )
}
