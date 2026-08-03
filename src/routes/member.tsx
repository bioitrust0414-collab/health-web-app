import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { LineOaCard } from "@/components/LineOaCard";
import { MemberCard } from "@/components/MemberCard";
import { StampCard } from "@/components/StampCard";
import { Activity } from "lucide-react";

import { ensureLiffLogin, getLiffIdToken, isLiffConfigured } from "@/lib/liffClient";
import { setStoredProfileId, setStoredSessionToken, getStoredSessionToken } from "@/lib/memberSession";
import { getMemberDashboard, verifyLiffLogin, issueDemoToken } from "@/lib/memberActions.server";


// 還沒有 LIFF ID（等大華官方帳號那邊協調好 LINE Developers 權限、建好 LIFF app
// 之後才會有）時，先用固定的測試 profile id 示範「會員資料 + 報告查詢」怎麼串起來。
// 一旦 VITE_LIFF_ID 設定了，畫面會自動改用真實的 LINE 登入使用者。
const DEMO_PROFILE_ID = "30a85010-9893-4811-8bfc-f7e5d48a3401";

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  birthday: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  address: string | null;
}

interface ReportRow {
  id: string;
  lis_report_id: string;
  report_date: string;
  summary_json: {
    package?: string;
    height_cm?: number;
    weight_kg?: number;
    bmi?: number;
    items?: Record<string, string>;
  } | null;
}

const getMemberData = createServerFn({ method: "GET" })
  .validator((profileId: unknown) => {
    if (typeof profileId !== "string" || profileId.length === 0) {
      throw new Error("profileId is required");
    }
    return profileId;
  })
  .handler(async ({ data: profileId }) => {
    const { hasSupabaseAdminConfig, restGetOne, restGetList } = await import("@/lib/supabaseAdmin");

    if (!hasSupabaseAdminConfig()) {
      return {
        profile: {
          id: profileId,
          email: "demo@kanlife.tw",
          full_name: "陳小綠",
          phone: "0912-345-678",
          birthday: "1990-05-18",
          gender: "female" as const,
          address: "彰化市",
        },
        reports: [] as ReportRow[],
      };
    }

    const [profile, reports] = await Promise.all([
      restGetOne<ProfileRow>("profiles", `id=eq.${profileId}`),
      restGetList<ReportRow>("reports", `profile_id=eq.${profileId}&order=report_date.desc`),
    ]);

    if (!profile) throw new Error(`Profile ${profileId} not found`);

    return { profile, reports };
  });

export const Route = createFileRoute("/member")({
  head: () => ({
    meta: [
      { title: "會員資料與健檢報告｜康活健康" },
      {
        name: "description",
        content: "查看會員基本資料與歷次健檢報告，支援 LINE 登入。",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    profileId: typeof search["profileId"] === "string" ? search["profileId"] : undefined,
    token: typeof search["token"] === "string" ? search["token"] : undefined,
  }),
  loaderDeps: ({ search }) => ({ profileId: search["profileId"] }),
  loader: ({ deps }) => getMemberData({ data: deps["profileId"] ?? DEMO_PROFILE_ID }),
  component: MemberPage,
  errorComponent: () => (
    <AppShell title="會員中心" subtitle="會員資料暫時無法同步">
      <div className="surface-card p-5 text-sm text-muted-foreground">
        請稍後再試；會員卡與點數功能仍可在服務恢復後使用。
      </div>
    </AppShell>
  ),
  notFoundComponent: () => <div className="p-6">找不到會員資料</div>,
});

const genderLabel: Record<string, string> = {
  male: "男",
  female: "女",
  other: "其他",
  prefer_not_to_say: "不願透露",
};

function useLineProfileId(
  webProfileId: string | undefined,
  webToken: string | undefined,
): {
  profileId: string;
  sessionToken: string | null;
  source: "demo" | "line" | "line_web";
  error: string | null;
} {
  const [state, setState] = useState<{
    profileId: string;
    sessionToken: string | null;
    source: "demo" | "line" | "line_web";
    error: string | null;
  }>(
    webProfileId && webToken
      ? { profileId: webProfileId, sessionToken: webToken, source: "line_web", error: null }
      : { profileId: DEMO_PROFILE_ID, sessionToken: getStoredSessionToken(), source: "demo", error: null },
  );

  useEffect(() => {
    if (webProfileId && webToken) {
      // Real profile handed to us by the web LINE Login redirect — remember it
      // so a future visit (e.g. clicking the LINE icon again) skips straight
      // to the member area instead of the add-friend flow.
      setStoredProfileId(webProfileId);
      setStoredSessionToken(webToken);
      return;
    }

    if (!isLiffConfigured()) {
      // Demo profile: mint a real signed token so booking/dashboard calls work
      // the same way they will once LIFF is configured.
      let cancelled = false;
      (async () => {
        try {
          const token = await issueDemoToken();
          if (!cancelled) {
            setStoredSessionToken(token);
            setState((prev) => ({ ...prev, sessionToken: token }));
          }
        } catch {
          // non-fatal — booking/dashboard sections will just stay empty
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    (async () => {
      try {
        await ensureLiffLogin();
        const idToken = getLiffIdToken();
        const { profileId, token } = await verifyLiffLogin({ data: idToken });
        if (!cancelled) {
          setStoredProfileId(profileId);
          setStoredSessionToken(token);
          setState({ profileId, sessionToken: token, source: "line", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            error: error instanceof Error ? error.message : "LINE login failed",
          }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [webProfileId, webToken]);

  return state;
}

const loginSourceLabel: Record<"demo" | "line" | "line_web", string> = {
  line: "已透過 LINE 登入（LIFF）",
  line_web: "已透過 LINE 登入（網頁）",
  demo: "Demo 頁面（尚未設定 LIFF，顯示固定測試帳號）",
};

function MemberPage() {
  const demoData = Route.useLoaderData();
  const { profileId: webProfileId, token: webToken } = Route.useSearch();
  const {
    profileId,
    sessionToken,
    source,
    error: liffError,
  } = useLineProfileId(webProfileId, webToken);

  // Once LIFF or the web login hands us a real profileId, refetch with the
  // real data instead of the SSR-loaded demo data.
  const { data } = useQuery({
    queryKey: ["member-data", profileId],
    queryFn: () => getMemberData({ data: profileId }),
    enabled: source !== "demo",
    initialData: source === "demo" ? demoData : undefined,
  });

  const { data: dashboard } = useQuery({
    queryKey: ["member-dashboard", sessionToken],
    queryFn: () => getMemberDashboard({ data: sessionToken as string }),
    enabled: Boolean(sessionToken),
  });

  const { profile, reports } = data ?? demoData;

  return (
    <AppShell title={profile.full_name ?? "會員資料"} subtitle={loginSourceLabel[source]}>
      <div className="grid gap-5 pb-8 lg:grid-cols-2">
        <div className="grid gap-5">
          <MemberCard points={dashboard?.points} />
          <Link
            to="/health"
            className="flex items-center justify-between rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div>
              <p className="text-lg font-bold">查看健康儀表板</p>
              <p className="text-sm opacity-90">瀏覽步數、睡眠與各項健康指標</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
              <Activity className="h-6 w-6" />
            </div>
          </Link>
          <section className="surface-card p-5 md:p-8">
            <h2 className="text-base font-bold">會員資料</h2>
            <p className="mt-1 text-xs text-muted-foreground">{profile.email ?? "—"}</p>
            {liffError && <p className="mt-2 text-xs text-destructive">LINE 登入失敗：{liffError}</p>}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Field label="姓名" value={profile.full_name} />
              <Field label="電話" value={profile.phone} />
              <Field label="生日" value={profile.birthday} />
              <Field label="性別" value={profile.gender ? genderLabel[profile.gender] : null} />
              <Field label="地址" value={profile.address} className="col-span-2" />
            </div>
          </section>
          <StampCard stamps={dashboard?.stamps} stampGoal={dashboard?.stampGoal} />
          <LineOaCard />
        </div>

        <div className="grid gap-5">
          <section className="surface-card overflow-hidden">
            <h2 className="px-5 pt-5 text-base font-bold md:px-8">我的預約</h2>
            <div className="mt-2 divide-y divide-border">
              {(!dashboard || dashboard.bookings.length === 0) && (
                <p className="px-5 py-4 text-sm text-muted-foreground md:px-8">目前沒有預約紀錄。</p>
              )}
              {dashboard?.bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between gap-3 px-5 py-3 md:px-8">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{booking.package_name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <h2 className="px-5 pt-5 text-base font-bold md:px-8">我的訂單</h2>
            <div className="mt-2 divide-y divide-border">
              {(!dashboard || dashboard.orders.length === 0) && (
                <p className="px-5 py-4 text-sm text-muted-foreground md:px-8">目前沒有訂單紀錄。</p>
              )}
              {dashboard?.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-3 md:px-8">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{order.order_no}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      NT$ {order.final_amount.toLocaleString()} ・獲得 {order.points_earned} 點
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 pt-5 md:px-8">
              <h2 className="min-w-0 truncate text-base font-bold">檢驗報告</h2>
              <Link to="/reports" className="shrink-0 text-xs font-bold text-primary">
                查看趨勢圖
              </Link>
            </div>

            <div className="mt-2 divide-y divide-border">
              {reports.length === 0 && (
                <p className="px-5 py-4 text-sm text-muted-foreground md:px-8">
                  目前沒有報告資料。
                </p>
              )}
              {reports.map((report: ReportRow) => (
                <div key={report.id} className="px-5 py-4 md:px-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-semibold">
                      {report.summary_json?.package ?? report.lis_report_id}
                    </p>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                      {report.report_date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{report.lis_report_id}</p>
                  {(report.summary_json?.height_cm ||
                    report.summary_json?.weight_kg ||
                    report.summary_json?.bmi) && (
                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                      {report.summary_json?.height_cm && <span>身高 {report.summary_json.height_cm} cm</span>}
                      {report.summary_json?.weight_kg && <span>體重 {report.summary_json.weight_kg} kg</span>}
                      {report.summary_json?.bmi && <span>BMI {report.summary_json.bmi}</span>}
                    </div>
                  )}
                  {report.summary_json?.items && (
                    <ul className="mt-3 grid gap-1.5 rounded-xl bg-secondary p-3 text-xs">
                      {Object.entries(report.summary_json.items).map(([key, value]) => (
                        <li key={key} className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="font-medium">{value}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

const bookingStatusLabel: Record<string, string> = {
  pending: "待確認",
  confirmed: "已確認",
  completed: "已完成",
  cancelled: "已取消",
};

function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {bookingStatusLabel[status] ?? status}
    </span>
  );
}

const orderStatusLabel: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  processing: "處理中",
  shipped: "已出貨",
  completed: "已完成",
  cancelled: "已取消",
  refunded: "已退款",
};

function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {orderStatusLabel[status] ?? status}
    </span>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value ?? "—"}</div>
    </div>
  );
}
