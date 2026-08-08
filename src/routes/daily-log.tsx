import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Droplet, Moon, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSessionToken } from "@/lib/useSessionToken";
import { getStoredSessionToken } from "@/lib/memberSession";
import { getDailyLogs, upsertDailyLog } from "@/lib/memberActions.server";

export const Route = createFileRoute("/daily-log")({
  head: () => ({
    meta: [
      { title: "健康日誌｜大華健康 App" },
      {
        name: "description",
        content: "每日記錄飲水量、睡眠時數與備註，累積個人健康趨勢資料。",
      },
    ],
  }),
  component: DailyLogPage,
});

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function DailyLogPage() {
  const { getSessionToken } = useSessionToken();
  const sessionToken = getStoredSessionToken();

  const { data: logs, refetch } = useQuery({
    queryKey: ["daily-logs", sessionToken],
    queryFn: () => getDailyLogs({ data: sessionToken as string }),
    enabled: Boolean(sessionToken),
  });

  const [waterMl, setWaterMl] = useState(1000);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const todayLog = (logs ?? []).find((l) => l.log_date === todayStr());

  async function handleSave() {
    setState("saving");
    try {
      const token = await getSessionToken();
      await upsertDailyLog({
        data: { sessionToken: token, logDate: todayStr(), waterMl, sleepHours, notes },
      });
      setState("saved");
      refetch();
    } catch {
      setState("error");
    }
  }

  return (
    <AppShell title="健康日誌" subtitle="每天花 10 秒記錄，養成追蹤健康的習慣">
      <div className="grid gap-5 pb-8">
        <section className="surface-card p-5 md:p-8">
          <h2 className="text-base font-bold">
            {todayLog ? "更新今天的紀錄" : "記錄今天"}（{todayStr()}）
          </h2>

          <div className="mt-4 grid gap-4">
            <label className="grid gap-1.5">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Droplet className="h-4 w-4 text-primary" /> 飲水量（ml）
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={waterMl}
                onChange={(e) => setWaterMl(Number(e.target.value))}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Moon className="h-4 w-4 text-primary" /> 睡眠時數
              </span>
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <NotebookPen className="h-4 w-4 text-primary" /> 備註（選填）
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="今天的身體狀況、運動或飲食備註…"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
              />
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={state === "saving"}
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition active:scale-[0.98] disabled:opacity-60"
            >
              {state === "saving" ? "儲存中…" : todayLog ? "更新紀錄" : "儲存紀錄"}
            </button>
            {state === "saved" && <p className="text-xs text-primary">已儲存 ✓</p>}
            {state === "error" && (
              <p className="text-xs text-destructive">
                儲存失敗，請確認已完成 LINE 登入後再試一次。
              </p>
            )}
          </div>
        </section>

        <section className="surface-card p-5 md:p-8">
          <h2 className="text-base font-bold">歷史紀錄</h2>
          {!sessionToken ? (
            <p className="mt-3 text-sm text-muted-foreground">登入後即可查看你的健康日誌歷史。</p>
          ) : (logs ?? []).length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">尚無紀錄，寫下第一筆吧。</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {(logs ?? []).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="font-semibold">{l.log_date}</span>
                  <span className="text-muted-foreground">
                    {l.water_ml} ml
                    {l.sleep_hours != null ? ` · 睡眠 ${l.sleep_hours} 小時` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
