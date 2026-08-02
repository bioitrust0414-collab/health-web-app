import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { LineOaCard } from "@/components/LineOaCard";
import { MemberCard } from "@/components/MemberCard";
import { StampCard } from "@/components/StampCard";

import { ensureLiffLogin, getLiffIdToken, isLiffConfigured } from "@/lib/liffClient";
import { setStoredProfileId, setStoredSessionToken, getStoredSessionToken } from "@/lib/memberSession";
import { getMemberDashboard, verifyLiffLogin } from "@/lib/memberActions.server";

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
    const { restGetOne, restGetList } = await import("@/lib/supabaseAdmin");

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
  component: MemberPage,
});

const genderLabel: Record<string, string> = {
  male: "男",
  female: "女",
  other: "其他",
  prefer_not_to_say: "不願透露",
};

type AuthState =
  | { status: "checking" }
  | { status: "signed_out"; error: string | null }
  | { status: "signed_in"; profileId: string; sessionToken: string; source: "line" | "line_web" };

/** No demo fallback: this only ever resolves to a real, LINE-verified profileId. */
function useMemberAuth(webProfileId: string | undefined, webToken: string | undefined) {
  const [state, setState] = useState<AuthState>(() => {
    if (webProfileId && webToken) {
      return { status: "signed_in", profileId: webProfileId, sessionToken: webToken, source: "line_web" };
    }
    const storedToken = getStoredSessionToken();
    // We don't know the profileId from a bare stored token without asking the
    // server, so on refresh we still re-run the LIFF check below rather than
    // trusting local storage alone.
    return storedToken ? { status: "checking" } : { status: "checking" };
  });

  useEffect(() => {
    if (webProfileId && webToken) {
      setStoredProfileId(webProfileId);
      setStoredSessionToken(webToken);
      return;
    }

    if (!isLiffConfigured()) {
      setState({
        status: "signed_out",
        error: "LINE 登入尚未設定完成，請聯繫網站管理員。",
      });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await ensureLiffLogin(); // redirects to LINE if not logged in; may never resolve on first visit
        const idToken = getLiffIdToken();
        const { profileId, token } = await verifyLiffLogin({ data: idToken });
        if (!cancelled) {
          setStoredProfileId(profileId);
          setStoredSessionToken(token);
          setState({ status: "signed_in", profileId, sessionToken: token, source: "line" });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "signed_out",
            error: error instanceof Error ? error.message : "LINE 登入失敗",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [webProfileId, webToken]);

  return state;
}

const loginSourceLabel: Record<"line" | "line_web", string> = {
  line: "已透過 LINE 登入（LIFF）",
  line_web: "已透過 LINE 登入（網頁）",
};

function MemberPage() {
  const { profileId: webProfileId, token: webToken } = Route.useSearch();
  const auth = useMemberAuth(webProfileId, webToken);

  const { data } = useQuery({
    queryKey: ["member-data", auth.status === "signed_in" ? auth.profileId : null],
    queryFn: () => getMemberData({ data: (auth as Extract<AuthState, { status: "signed_in" }>).profileId }),
    enabled: auth.status === "signed_in",
  });

  const { data: dashboard } = useQuery({
    queryKey: ["member-dashboard", auth.status === "signed_in" ? auth.sessionToken : null],
    queryFn: () =>
      getMemberDashboard({ data: (auth as Extract<AuthState, { status: "signed_in" }>).sessionToken }),
    enabled: auth.status === "signed_in",
  });

  if (auth.status === "checking") {
    return (
      <AppShell title="會員專區" subtitle="正在確認登入狀態…">
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">載入中…</div>
      </AppShell>
    );
  }

  if (auth.status === "signed_out") {
    return (
      <AppShell title="會員專區" subtitle="請先透過 LINE 登入">
        <div className="surface-card grid gap-4 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            會員資料、預約、訂單與健檢報告僅限已登入會員查看。
          </p>
          {auth.error && <p className="text-xs text-destructive">{auth.error}</p>}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mx-auto rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            使用 LINE 登入
          </button>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell title="會員專區" subtitle={loginSourceLabel[auth.source]}>
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">載入會員資料中…</div>
      </AppShell>
    );
  }

  const { profile, reports } = data;

  return (
    <AppShell title={profile.full_name ?? "會員資料"} subtitle={loginSourceLabel[auth.source]}>
      <div className="grid gap-5 pb-8 lg:grid-cols-2">
        <div className="grid gap-5">
          <MemberCard points={dashboard?.points} />
          <section className="surface-card p-5 md:p-8">
            <h2 className="text-base font-bold">會員資料</h2>
            <p className="mt-1 text-xs text-muted-foreground">{profile.email ?? "—"}</p>
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
