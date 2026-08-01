import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { labResults, reportFiles } from "@/lib/health-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "健檢報告與趨勢｜康活健康" },
      {
        name: "description",
        content: "檢視血糖、血脂、血壓等健檢數值與近五次趨勢變化，並下載歷年健檢報告檔案。",
      },
      { property: "og:title", content: "健檢報告與趨勢｜康活健康" },
      {
        property: "og:description",
        content: "健檢數值一目了然，附參考範圍、狀態標示與歷年報告下載。",
      },
    ],
  }),
  component: ReportsPage,
});

function Sparkline({ trend, status }: { trend: number[]; status: string }) {
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = max - min || 1;
  const points = trend
    .map((v, i) => `${(i / (trend.length - 1)) * 100},${28 - ((v - min) / span) * 24}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-24 shrink-0">
      <polyline
        points={points}
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={status === "normal" ? "stroke-primary" : "stroke-chart-1"}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ReportsPage() {
  return (
    <AppShell title="健檢報告" subtitle="2026/07/18 康悅健檢中心 · 共 62 項檢查">
      <div className="grid gap-5 pb-8">
        <section className="surface-card overflow-hidden">
          <h2 className="px-5 pt-5 text-base font-bold md:px-8 md:pt-6">主要數值與趨勢</h2>
          <ul className="mt-3 divide-y divide-border">
            {labResults.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-8"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">參考值 {item.reference}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <Sparkline trend={item.trend} status={item.status} />
                  <p className="w-20 text-right text-base font-bold tabular-nums">
                    {item.value}
                    <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                      {item.unit}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-5 md:p-8">
          <h2 className="text-base font-bold">報告檔案</h2>
          <ul className="mt-4 grid gap-3">
            {reportFiles.map((file) => (
              <li key={file.id} className="flex items-center gap-3 rounded-xl bg-secondary p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{file.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {file.clinic} · {file.date} · {file.itemCount} 項
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition active:scale-[0.97]"
                >
                  <Download className="h-4 w-4" />
                  下載
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
