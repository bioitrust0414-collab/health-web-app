import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, QrCode, Ticket } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MemberCard } from "@/components/MemberCard";
import { StampCard } from "@/components/StampCard";
import { rewards } from "@/lib/member-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "綠豆咖啡會員卡｜集點與點數兌換" },
      {
        name: "description",
        content: "在 LINE 或網頁上開啟綠豆咖啡會員卡，出示條碼累積點數、查看集點進度並兌換好禮。",
      },
      { property: "og:title", content: "綠豆咖啡會員卡｜集點與點數兌換" },
      {
        property: "og:description",
        content: "出示會員條碼累積點數，集滿 10 杯送手沖咖啡，隨時查看點數與兌換好禮。",
      },
    ],
  }),
  component: MemberHome,
});

function MemberHome() {
  return (
    <AppShell title="我的會員卡" subtitle="出示條碼累積點數，集滿 10 杯送手沖一杯">
      <div className="grid gap-5 pb-8 md:grid-cols-2">
        <div className="grid gap-5">
          <MemberCard />
          <div className="grid grid-cols-3 gap-3">
            <QuickAction icon={QrCode} label="掃碼集點" />
            <QuickAction icon={Ticket} label="我的優惠券" />
            <QuickAction icon={MapPin} label="門市查詢" />
          </div>
        </div>

        <div className="grid gap-5">
          <StampCard />
          <section className="surface-card p-5 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-bold">熱門兌換</h2>
              <Link
                to="/rewards"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-4 grid gap-3">
              {rewards.slice(0, 3).map((reward) => (
                <li key={reward.id} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-xl">
                    {reward.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{reward.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{reward.detail}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-primary tabular-nums">
                    {reward.cost}點
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: typeof QrCode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="surface-card flex flex-col items-center gap-2 px-2 py-4 text-xs font-medium transition active:scale-[0.97]"
    >
      <Icon className="h-5 w-5 text-primary" />
      {label}
    </button>
  );
}
