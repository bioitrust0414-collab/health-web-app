import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Check, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSessionToken } from "@/lib/useSessionToken";
import { getStoredSessionToken } from "@/lib/memberSession";
import { getReminders, createReminder, markReminderDone } from "@/lib/memberActions.server";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "提醒管理｜大華健康 App" },
      {
        name: "description",
        content: "設定回診、健康習慣與預約提醒，不錯過重要的健康事項。",
      },
    ],
  }),
  component: RemindersPage,
});

const typeLabels = {
  FOLLOW_UP: "回診提醒",
  HABIT: "習慣養成",
  BOOKING: "預約提醒",
} as const;

function ReminderForm({ onCreated }: { onCreated: () => void }) {
  const { getSessionToken } = useSessionToken();
  const [type, setType] = useState<keyof typeof typeLabels>("HABIT");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [triggerTime, setTriggerTime] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");

  async function handleSubmit() {
    if (!title || !triggerTime) return;
    setState("saving");
    try {
      const sessionToken = await getSessionToken();
      await createReminder({
        data: {
          sessionToken,
          type,
          title,
          message: message || title,
          triggerTime: new Date(triggerTime).toISOString(),
        },
      });
      setTitle("");
      setMessage("");
      setTriggerTime("");
      setState("idle");
      onCreated();
    } catch {
      setState("error");
    }
  }

  return (
    <section className="surface-card p-5 md:p-8">
      <h2 className="text-base font-bold">新增提醒</h2>
      <div className="mt-4 grid gap-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeLabels) as (keyof typeof typeLabels)[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={
                type === t
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground"
              }
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">標題</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：回診拿藥"
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">備註（選填）</span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="要提醒自己的內容"
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">提醒時間</span>
          <input
            type="datetime-local"
            value={triggerTime}
            onChange={(e) => setTriggerTime(e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
          />
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={state === "saving" || !title || !triggerTime}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition active:scale-[0.98] disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {state === "saving" ? "新增中…" : "新增提醒"}
        </button>
        {state === "error" && (
          <p className="text-xs text-destructive">新增失敗，請確認已完成 LINE 登入後再試一次。</p>
        )}
      </div>
    </section>
  );
}

function RemindersPage() {
  const sessionToken = getStoredSessionToken();
  const { data: reminders, refetch } = useQuery({
    queryKey: ["reminders", sessionToken],
    queryFn: () => getReminders({ data: sessionToken as string }),
    enabled: Boolean(sessionToken),
  });

  const { getSessionToken } = useSessionToken();
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  async function handleDone(reminderId: string) {
    setDoneIds((prev) => new Set(prev).add(reminderId));
    try {
      const sessionToken = await getSessionToken();
      await markReminderDone({ data: { sessionToken, reminderId } });
      refetch();
    } catch {
      setDoneIds((prev) => {
        const next = new Set(prev);
        next.delete(reminderId);
        return next;
      });
    }
  }

  const upcoming = (reminders ?? []).filter((r) => !r.is_sent && !doneIds.has(r.id));

  return (
    <AppShell title="提醒管理" subtitle="回診、健康習慣與預約，不錯過重要事項">
      <div className="grid gap-5 pb-8">
        <section className="surface-card p-5 md:p-8">
          <h2 className="text-base font-bold">待辦提醒</h2>
          {!sessionToken ? (
            <p className="mt-3 text-sm text-muted-foreground">登入後即可設定與查看你的提醒。</p>
          ) : upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">目前沒有待處理的提醒。</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {upcoming.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-3 rounded-2xl bg-secondary p-4"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card text-primary">
                    <Bell className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{typeLabels[r.type]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.trigger_time).toLocaleString("zh-TW", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDone(r.id)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    <Check className="h-3.5 w-3.5" />
                    完成
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[11px] text-muted-foreground">
            此提醒僅供個人健康管理參考，非醫療建議，如有不適請洽專業醫療人員。
          </p>
        </section>

        <ReminderForm onCreated={refetch} />
      </div>
    </AppShell>
  );
}
