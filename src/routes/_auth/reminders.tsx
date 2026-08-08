import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Pill, Calendar, Droplets } from "lucide-react";

export const Route = createFileRoute("/_auth/reminders")({
  component: RemindersPage,
});

function RemindersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">提醒管理</h1>
        <p className="text-gray-500">
          設定健康相關提醒，透過 LINE 接收通知
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Pill className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-base">用藥提醒</CardTitle>
                <p className="text-sm text-gray-500">每日定時提醒服用藥物</p>
              </div>
            </div>
            <Switch />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-base">回診提醒</CardTitle>
                <p className="text-sm text-gray-500">檢查回診日期前通知</p>
              </div>
            </div>
            <Switch />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <div>
                <CardTitle className="text-base">喝水提醒</CardTitle>
                <p className="text-sm text-gray-500">定時提醒補充水分</p>
              </div>
            </div>
            <Switch />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-amber-600" />
              <div>
                <CardTitle className="text-base">健康日誌提醒</CardTitle>
                <p className="text-sm text-gray-500">每日提醒記錄健康數據</p>
              </div>
            </div>
            <Switch />
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">更多提醒功能開發中</p>
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            新增自定義提醒
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
