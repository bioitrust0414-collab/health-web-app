import { Check, Coffee } from "lucide-react";
import { member } from "@/lib/member-data";

export function StampCard() {
  const slots = Array.from({ length: member.stampGoal }, (_, i) => i < member.stamps);

  return (
    <section className="surface-card p-5 md:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">本月集點卡</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            集滿 {member.stampGoal} 杯送一杯手沖，還差 {member.stampGoal - member.stamps} 杯
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground tabular-nums">
          {member.stamps}/{member.stampGoal}
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
            {filled ? <Check className="h-5 w-5" /> : <Coffee className="h-5 w-5 opacity-50" />}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-primary-soft p-4">
        <div className="flex items-center justify-between text-xs font-medium text-accent-foreground">
          <span>升級白金會員</span>
          <span className="tabular-nums">還需 {member.pointsToNextTier} 點</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-card">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.round((1280 / 1500) * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
