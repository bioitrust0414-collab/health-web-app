import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Bell, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isVerified } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">歡迎回來</h1>
        <p className="text-gray-500">這是您的個人健康儀表板</p>
        {!isVerified && (
          <p className="text-amber-600 text-sm mt-1">
            ⚠️ 您尚未完成手機+生日驗證，部分功能可能受限
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              檢驗報告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <Button
              variant="link"
              className="p-0 h-auto text-emerald-600"
              asChild
            >
              <Link to="/reports">查看全部</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              健康日誌
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <Button
              variant="link"
              className="p-0 h-auto text-emerald-600"
              asChild
            >
              <Link to="/daily-log">記錄今日</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              提醒事項
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <Button
              variant="link"
              className="p-0 h-auto text-emerald-600"
              asChild
            >
              <Link to="/reminders">管理提醒</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              健康趨勢
            </CardTitle>
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
            <p className="text-gray-500 text-center py-8">
              您尚未有檢驗報告，完成首次檢查後將顯示於此。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/reports">
                <FileText className="mr-2 h-4 w-4" />
                查看檢驗報告
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/daily-log">
                <Calendar className="mr-2 h-4 w-4" />
                記錄健康日誌
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/reminders">
                <Bell className="mr-2 h-4 w-4" />
                設定提醒
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
