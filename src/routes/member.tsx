import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, Pill, Salad, Scale } from "lucide-react";

const rewardIcons = {
  scale: Scale,
  salad: Salad,
  pill: Pill,
  hospital: HeartPulse,
} as const;
import { AppShell } from "@/components/AppShell";
import { MemberCard } from "@/components/MemberCard";
import { StampCard } from "@/components/StampCard";
import { activities, member, rewards } from "@/lib/member-data";

export const Route = createFileRoute("/member")({
  head: () => ({
    meta: [
      { title: "會員卡與健康點數｜康活健康" },
      {
        name: "description",
        content: "出示會員條碼累積健康點數，完成運動與健檢任務集點，並兌換諮詢折扣與保健品好禮。",
      },
      { property: "og:title", content: "會員卡與健康點數｜康活健康" },
      {
        property: "og:description",
        content: "健康點數餘額、集點任務進度與兌換好禮，全部集中在會員卡頁。",
      },
    ],
  }),
  component: MemberPage,
});

function MemberPage() {
  return (
    <AppShell
      title="我的會員卡"
      subtitle={`健康點數 ${member.points.toLocaleString()} 點 · 門市與線上皆可使用`}
    >
      <div className="grid gap-5 pb-8 lg:grid-cols-2">
        <div className="grid gap-5">
          <MemberCard />
          <section className="surface-card overflow-hidden">
            <h2 className="px-5 pt-5 text-base font-bold md:px-8">點數紀錄</h2>
            <div className="mt-2 divide-y divide-border">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 md:px-8"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{item.date}</p>
                  </div>
                  <span
                    className={
                      item.delta > 0
                        ? "shrink-0 text-sm font-bold text-primary tabular-nums"
                        : "shrink-0 text-sm font-bold text-muted-foreground tabular-nums"
                    }
                  >
                    {item.delta > 0 ? `+${item.delta}` : item.delta}
                  </span>
                </div>
              ))}
            </div>
            <p className="px-5 py-4 text-xs text-muted-foreground md:px-8">
              僅顯示近 90 天紀錄，點數有效期為當年 12/31
            </p>
          </section>
        </div>

        <div className="grid gap-5">
          <StampCard />
          <section className="surface-card p-5 md:p-8">
            <h2 className="text-base font-bold">兌換好禮</h2>
            <ul className="mt-4 grid gap-3">
              {rewards.map((reward) => {
                const affordable = member.points >= reward.cost;
                return (
                  <li key={reward.id} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-primary">
                      {(() => {
                        const Icon = rewardIcons[reward.icon];
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{reward.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{reward.detail}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!affordable}
                      className={
                        affordable
                          ? "shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition active:scale-[0.97]"
                          : "shrink-0 rounded-full bg-card px-4 py-2 text-xs font-semibold text-muted-foreground"
                      }
                    >
                      {affordable ? `${reward.cost} 點兌換` : "點數不足"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
