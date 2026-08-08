import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, FileHeart, FlaskConical, NotebookPen, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { StepsChart } from "@/components/StepsChart";
import { LineOaCard } from "@/components/LineOaCard";
import { dailyMetrics, labResults, products } from "@/lib/health-data";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "健康首頁｜大華健康 App" },
      {
        name: "description",
        content: "手機版健康儀表板：步數、睡眠、心率、體重與健康分數，並可直接前往檢驗套組與健康商城。",
      },
      { property: "og:title", content: "健康首頁｜大華健康 App" },
      {
        property: "og:description",
        content: "一站式檢視個人健康數據、健檢趨勢與健康商城。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HealthPage,
});

const healthScore = 82;

const quickLinks = [
  { to: "/tests", label: "檢驗套組", desc: "瀏覽並預約", icon: FlaskConical },
  { to: "/shop", label: "健康商城", desc: "保健品選購", icon: ShoppingBag },
  { to: "/reports", label: "報告趨勢", desc: "數值變化", icon: FileHeart },
  { to: "/daily-log", label: "健康日誌", desc: "記錄今天", icon: NotebookPen },
  { to: "/reminders", label: "提醒管理", desc: "回診/習慣", icon: Bell },
] as const;

function HealthPage() {
  const watchList = labResults.filter((r) => r.status !== "normal");

  return (
    <AppShell title="今天的健康狀態" subtitle="資料每日自動同步，異常項目會優先提示">
      <div className="grid gap-5 pb-8">
        <section className="surface-card p-5 md:p-8">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5">
            <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-accent">
              <span className="text-3xl font-black text-primary tabular-nums">{healthScore}</span>
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold">健康分數 良好</p>
              <p className="mt-1 text-sm text-muted-foreground">
                較上月 +3 分，主要來自步數達標天數提升。
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${healthScore}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {dailyMetrics.map((m) => (
            <div key={m.id} className="surface-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="min-w-0 truncate text-xs text-muted-foreground">{m.label}</p>
                <StatusBadge status={m.status} />
              </div>
              <p className="mt-2 text-2xl font-black tabular-nums">
                {m.value}
                <span className="ml-1 text-xs font-medium text-muted-foreground">{m.unit}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
            </div>
          ))}
        </section>

        <StepsChart />

        <section className="grid grid-cols-3 gap-3">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} className="surface-card flex flex-col items-center gap-1.5 p-4 text-center">
              <q.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold">{q.label}</span>
              <span className="text-[10px] text-muted-foreground">{q.desc}</span>
            </Link>
          ))}
        </section>

        <section className="surface-card p-5 md:p-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="min-w-0 truncate text-base font-bold">需要留意的檢驗值</h2>
            <Link to="/reports" className="shrink-0 text-xs font-bold text-primary">
              全部報告
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {watchList.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-secondary p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">參考值 {r.reference}</p>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {r.value} {r.unit}
                </span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </section>

        <LineOaCard />

        <section className="surface-card p-5 md:p-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="min-w-0 truncate text-base font-bold">為你推薦</h2>
            <Link to="/shop" className="flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
              健康商城 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {products.slice(0, 2).map((p) => (
              <Link key={p.id} to="/shop" className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.detail}</p>
                  <p className="mt-0.5 text-sm font-bold text-primary tabular-nums">NT$ {p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
