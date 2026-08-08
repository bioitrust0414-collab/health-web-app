import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Bell, TrendingUp, AlertTriangle } from "lucide-react";

const getDashboardData = createServerFn({ method: "GET" })
  .validator((profileId: unknown) => {
    if (typeof profileId !== "string" || profileId.length === 0) {
      throw new Error("profileId is required");
    }
    return profileId;
  })
  .handler(async ({ data: profileId }) => {
    const { restGetList, restGetOne } = await import("@/lib/supabaseAdmin");
    const [reports, latestLog, reminders] = await Promise.all([
      restGetList("reports", `profile_id=eq.${profileId}&order=report_date.desc&limit=5`),
      restGetOne("daily_logs", `profile_id=eq.${profileId}&order=created_at.desc`),
      restGetList("reminders", `profile_id=eq.${profileId}&is_active=eq.true&limit=3`),
    ]);
    return { reports, latestLog, reminders };
  });

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isVerified } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.profileId],
    queryFn: () => getDashboardData({ data: user!.profileId }),
    enabled: !!user?.profileId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  const { reports = [], latestLog, reminders = [] } = data ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">歡迎回來</h1>
        <p className="text-gray-500">這是您的個人健康儀表板</p>
        {!isVerified && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            您尚未完成手機+生日驗證，部分功能可能受限
            <Button variant="link" size="sm" className="text-amber-700 p-0 h-auto" asChild>
              <Link to="/liff/verify">立即驗證</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">檢驗報告</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <Button variant="link" className="p-0 h-auto text-emerald-600" asChild>
              <Link to="/reports">查看全部</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">健康日誌</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestLog ? "已記錄" : "—"}</div>
            <Button variant="link" className="p-0 h-auto text-emerald-600" asChild>
              <Link to="/daily-log">{latestLog ? "查看" : "記錄今日"}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">提醒事項</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders.length}</div>
            <Button variant="link" className="p-0 h-auto text-emerald-600" asChild>
              <Link to="/reminders">管理提醒</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">健康趨勢</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">良好</div>
            <p className="text-xs text-gray-500">持續記錄以追蹤趨勢</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最新報告</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                您尚未有檢驗報告，完成首次檢查後將顯示於此。
              </p>
            ) : (
              <div className="space-y-3">
                {reports.map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{report.summary_json?.package ?? report.lis_report_id}</p>
                      <p className="text-sm text-gray-500">{report.report_date}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/reports">查看</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/reports"><FileText className="mr-2 h-4 w-4" />查看檢驗報告</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/daily-log"><Calendar className="mr-2 h-4 w-4" />記錄健康日誌</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/reminders"><Bell className="mr-2 h-4 w-4" />設定提醒</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
