import { Check, Footprints } from "lucide-react";
import { member } from "@/lib/member-data";

export function StampCard({
  stamps,
  stampGoal,
}: { stamps?: number | undefined; stampGoal?: number | undefined } = {}) {
  const displayStamps = stamps ?? member.stamps;
  const displayGoal = stampGoal ?? member.stampGoal;
  const slots = Array.from({ length: displayGoal }, (_, i) => i < displayStamps);

  return (
    <section className="surface-card p-5 md:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">健康集點卡</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            每完成一次預約集一點，集滿 {displayGoal} 點可兌換獎勵，還差 {Math.max(displayGoal - displayStamps, 0)} 點
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground tabular-nums">
          {displayStamps}/{displayGoal}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-3">
        {slots.map((filled, i) => (
          <div
            key={i}
            className={
              filled
                ? "stamp-pop grid aspect-square place-items-center rounded-2xl bg-primary text-primary-foreground"
                : "grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-border bg-secondary text-muted-foreground"
            }
            style={filled ? { animationDelay: `${i * 45}ms` } : undefined}
          >
            {filled ? <Check className="h-5 w-5" /> : <Footprints className="h-5 w-5 opacity-50" />}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-primary-soft p-4">
        <div className="flex items-center justify-between text-xs font-medium text-accent-foreground">
          <span>升級白金健康會員</span>
          <span className="tabular-nums">還需 {member.pointsToNextTier} 點</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-card">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.round((member.points / 1500) * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
