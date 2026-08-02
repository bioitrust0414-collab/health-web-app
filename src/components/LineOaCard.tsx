import { MessageCircle, BellRing, FileHeart, CalendarCheck } from "lucide-react";
import { LINE_OA_ID, LINE_OA_ADD_FRIEND_URL } from "@/lib/line-oa";
import { useLiffEnvironment } from "@/lib/use-liff";

const perks = [
  { icon: BellRing, text: "報告完成即時推播通知" },
  { icon: FileHeart, text: "手機直接查看健檢報告與趨勢" },
  { icon: CalendarCheck, text: "線上預約檢驗套組與專人諮詢" },
];

export function LineOaCard({ compact = false }: { compact?: boolean }) {
  const { isInClient } = useLiffEnvironment();

  return (
    <section className="surface-card overflow-hidden">
      <div className="brand-gradient p-5 text-primary-foreground md:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="truncate text-base font-bold">加入 LINE 官方帳號</p>
            <p className="mt-1 text-xs opacity-85">帳號 ID：{LINE_OA_ID}</p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-foreground/20">
            <MessageCircle className="h-6 w-6" />
          </span>
        </div>
      </div>

      <div className="p-5 md:p-8">
        {!compact && (
          <ul className="grid gap-2.5">
            {perks.map((p) => (
              <li key={p.text} className="flex min-w-0 items-center gap-2.5 text-sm">
                <p.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0">{p.text}</span>
              </li>
            ))}
          </ul>
        )}

        <a
          href={LINE_OA_ADD_FRIEND_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition active:scale-[0.99]"
        >
          <MessageCircle className="h-4 w-4" />
          {isInClient ? "加入好友並開啟通知" : "點我加入 LINE 好友"}
        </a>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isInClient
            ? "已在 LINE 內開啟，加入後即可直接收到報告通知。"
            : "手機用戶點擊後會開啟 LINE App；也可搜尋 ID 手動加入。"}
        </p>
      </div>
    </section>
  );
}
