import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { activities, member } from "@/lib/member-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "點數紀錄｜綠豆咖啡會員" },
      {
        name: "description",
        content: "查看每一筆點數累積與兌換紀錄，包含消費門市、生日禮金與好友推薦獎勵。",
      },
      { property: "og:title", content: "點數紀錄｜綠豆咖啡會員" },
      {
        property: "og:description",
        content: "完整的點數收支明細，掌握每一筆累積與兌換。",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <AppShell title="點數紀錄" subtitle={`累積結餘 ${member.points.toLocaleString()} 點`}>
      <section className="surface-card divide-y divide-border overflow-hidden">
        {activities.map((item) => (
          <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 md:px-6">
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
      </section>
      <p className="py-6 text-center text-xs text-muted-foreground">
        僅顯示近 90 天紀錄，點數有效期為當年 12/31
      </p>
    </AppShell>
  );
}
