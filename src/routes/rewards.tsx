import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { member, rewards } from "@/lib/member-data";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "點數兌換好禮｜綠豆咖啡會員" },
      {
        name: "description",
        content: "用累積的會員點數兌換手沖咖啡、季節蛋糕、精選咖啡豆與聯名保溫杯等限量好禮。",
      },
      { property: "og:title", content: "點數兌換好禮｜綠豆咖啡會員" },
      {
        property: "og:description",
        content: "查看可兌換的好禮清單與所需點數，點數足夠即可立即兌換。",
      },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <AppShell title="兌換好禮" subtitle={`目前可用 ${member.points.toLocaleString()} 點`}>
      <div className="grid gap-4 pb-8 sm:grid-cols-2">
        {rewards.map((reward) => {
          const affordable = member.points >= reward.cost;
          return (
            <article key={reward.id} className="surface-card flex flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-2xl">
                  {reward.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-bold">{reward.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{reward.detail}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-lg font-bold text-primary tabular-nums">
                  {reward.cost.toLocaleString()}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">點</span>
                </span>
                <button
                  type="button"
                  disabled={!affordable}
                  className={
                    affordable
                      ? "rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition active:scale-[0.97]"
                      : "rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-muted-foreground"
                  }
                >
                  {affordable ? "立即兌換" : "點數不足"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
