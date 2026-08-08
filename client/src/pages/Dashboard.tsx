/**
 * Dashboard 頁面
 * 登入後的個人儀表板
 * 顯示：歡迎訊息、快捷入口、最新報告、預約、提醒
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Badge } from '@/components/ui/badge.js';
import { Separator } from '@/components/ui/separator.js';
import {
  FileText,
  CalendarDays,
  ShoppingBag,
  Activity,
  Bell,
  User,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

interface QuickReport {
  id: string;
  report_date: string;
  plan_name: string;
  status: string;
}

interface QuickReminder {
  id: string;
  title: string;
  remind_at: string;
  is_read: boolean;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const auth = useAuth();

  const [reports, setReports] = useState<QuickReport[]>([]);
  const [reminders, setReminders] = useState<QuickReminder[]>([]);
  const [loading, setLoading] = useState(true);

  // 如果未登入 → 導向 LIFF 入口
  useEffect(() => {
    if (!auth.isLoading && !auth.isLoggedIn) {
      setLocation('/liff/entry');
    }
  }, [auth.isLoading, auth.isLoggedIn, setLocation]);

  // 如果未勾稽 → 導向驗證頁面
  useEffect(() => {
    if (!auth.isLoading && auth.isLoggedIn && !auth.isMapped) {
      setLocation('/liff/verify');
    }
  }, [auth.isLoading, auth.isLoggedIn, auth.isMapped, setLocation]);

  // 載入資料
  useEffect(() => {
    if (!auth.user?.lineUserId || !auth.isMapped) return;

    const fetchData = async () => {
      try {
        // 這裡未來可以接真實 API
        // 現在先用模擬資料展示畫面結構
        setReports([
          {
            id: 'R001',
            report_date: '2026-07-20',
            plan_name: '成人健檢套組',
            status: 'completed',
          },
          {
            id: 'R002',
            report_date: '2026-01-10',
            plan_name: '肝功能檢查',
            status: 'completed',
          },
        ]);

        setReminders([
          {
            id: 'M001',
            title: '明天 08:00 空腹血糖檢測',
            remind_at: '2026-08-09T08:00:00',
            is_read: false,
          },
        ]);
      } catch (err) {
        console.error('Fetch dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.user, auth.isMapped]);

  if (auth.isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!auth.isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {auth.user?.pictureUrl ? (
              <img
                src={auth.user.pictureUrl}
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <p className="font-medium">{auth.user?.displayName || '會員'}</p>
              <p className="text-xs text-muted-foreground">大華醫事檢驗所</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={auth.logout}>
            <LogOut className="h-4 w-4 mr-1" />
            登出
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* 未勾稽警告 */}
        {!auth.isMapped && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-700">
                尚未完成身分驗證，請先驗證以查看檢驗報告
              </p>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={() => setLocation('/liff/verify')}
              >
                前往驗證
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 快捷入口 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">快速功能</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setLocation('/reports')}
            >
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">檢驗報告</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setLocation('/booking')}
            >
              <CardContent className="p-4 text-center">
                <CalendarDays className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">預約掛號</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setLocation('/orders')}
            >
              <CardContent className="p-4 text-center">
                <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">我的訂單</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setLocation('/daily-log')}
            >
              <CardContent className="p-4 text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-medium">健康紀錄</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 最新報告 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">最新報告</h2>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/reports')}>
              查看全部 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {reports.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  尚無檢驗報告
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setLocation(`/reports/${report.id}`)}
                >
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{report.plan_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.report_date}
                      </p>
                    </div>
                    <Badge variant="secondary">已完成</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* 提醒通知 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">提醒通知</h2>
            <Button variant="ghost" size="sm" onClick
