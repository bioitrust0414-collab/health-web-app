import { weeklySteps } from "@/lib/health-data";

export function StepsChart() {
  const max = Math.max(...weeklySteps.map((d) => d.steps));

  return (
    <section className="surface-card p-5 md:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">本週步數</h2>
          <p className="mt-1 text-xs text-muted-foreground">平均 9,046 步 · 達標 3 天</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          目標 10,000
        </span>
      </div>

      <div className="mt-6 flex h-40 items-end gap-2">
        {weeklySteps.map((d) => (
          <div key={d.day} className="flex h-full min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
              {(d.steps / 1000).toFixed(1)}k
            </span>
            <div className="relative min-h-0 w-full flex-1">
              <div
                className={
                  d.steps >= 10000
                    ? "absolute inset-x-0 bottom-0 rounded-t-lg bg-primary"
                    : "absolute inset-x-0 bottom-0 rounded-t-lg bg-primary/35"
                }
                style={{ height: `${(d.steps / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
