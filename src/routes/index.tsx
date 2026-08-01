import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { StepsChart } from "@/components/StepsChart";
import { dailyMetrics, labResults, products } from "@/lib/health-data";
import { member } from "@/lib/member-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "康活健康｜每日數據與健檢報告一次看" },
      {
        name: "description",
        content:
          "康活健康 App 整合每日步數、睡眠、心率與健檢報告數值，並可線上購買保健品與預約健檢方案。",
      },
      { property: "og:title", content: "康活健康｜每日數據與健檢報告一次看" },
      {
        property: "og:description",
        content: "追蹤每日活動數據、檢視健檢報告趨勢，並在健康商城選購保健品與健檢方案。",
      },
    ],
  }),
  component: HealthHome,
});

function HealthHome() {
  const attention = labResults.filter((r) => r.status !== "normal");

  return (
    <AppShell title={`早安，${member.name}`} subtitle="今日健康分數 82 分 · 比上週進步 4 分">
      <div className="grid gap-5 pb-8">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dailyMetrics.map((metric) => (
            <article key={metric.id} className="surface-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-xs font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <StatusBadge status={metric.status} />
              </div>
              <p className="mt-3 text-2xl font-bold tabular-nums">
                {metric.value}
                <span className="ml-1 text-xs font-medium text-muted-foreground">{metric.unit}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <StepsChart />

          <section className="surface-card p-5 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-bold">需要留意的指標</h2>
              <Link
                to="/reports"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                看報告
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-4 grid gap-3">
              {attention.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">參考值 {item.reference}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums">
                    {item.value}
                    <span className="ml-1 text-xs font-medium text-muted-foreground">
                      {item.unit}
                    </span>
                  </span>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              最近一次健檢：2026/07/18 康悅健檢中心
            </p>
          </section>
        </div>

        <section className="surface-card p-5 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-bold">為你推薦</h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              逛商城
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">依據你的血脂與血壓數值挑選</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-xl">
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs font-bold text-primary tabular-nums">
                    NT$ {p.price.toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
