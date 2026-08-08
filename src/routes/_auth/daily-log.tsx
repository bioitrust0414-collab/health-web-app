import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/_auth/daily-log")({
  component: DailyLogPage,
});

function DailyLogPage() {
  const [weight, setWeight] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 串接 Supabase 寫入 daily_logs
    console.log({ weight, systolic, diastolic, notes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">健康日誌</h1>
        <p className="text-gray-500">記錄每日健康數據，追蹤長期趨勢</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>今日記錄</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">體重 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例如：65.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systolic">收縮壓 (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="例如：120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">舒張壓 (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="例如：80"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">備註</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例如：今天感覺精神不錯..."
              />
            </div>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              儲存記錄
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>歷史記錄</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">尚無日誌記錄</p>
        </CardContent>
      </Card>
    </div>
  );
}
