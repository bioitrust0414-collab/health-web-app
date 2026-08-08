/**
 * App.tsx
 * Wouter 路由配置
 * 公開路由 + 受保護路由（需 LINE 登入）
 */

import { Route, Switch } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { Toaster } from '@/components/ui/sonner.js';
import { TooltipProvider } from '@/components/ui/tooltip.js';

// 公開頁面
import Home from './pages/Home.js';
import LiffEntry from './pages/LiffEntry.js';
import LiffVerify from './pages/LiffVerify.js';

// 受保護頁面（需登入）
import Dashboard from './pages/Dashboard.js';

// 受保護路由包裝器
function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!auth.isLoggedIn) {
    // 未登入 → 導向 LIFF 入口
    window.location.href = '/liff/entry';
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* 公開路由 */}
      <Route path="/" component={Home} />
      <Route path="/liff/entry" component={LiffEntry} />
      <Route path="/liff/verify" component={LiffVerify} />

      {/* 受保護路由（需 LINE 登入） */}
      <Route path="/dashboard">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>

      {/* 預留路由（未來擴充） */}
      <Route path="/reports">
        <RequireAuth>
          <div className="p-8 text-center">檢驗報告頁面（開發中）</div>
        </RequireAuth>
      </Route>
      <Route path="/booking">
        <RequireAuth>
          <div className="p-8 text-center">預約掛號頁面（開發中）</div>
        </RequireAuth>
      </Route>
      <Route path="/orders">
        <RequireAuth>
          <div className="p-8 text-center">我的訂單頁面（開發中）</div>
        </RequireAuth>
      </Route>
      <Route path="/daily-log">
        <RequireAuth>
          <div className="p-8 text-center">每日健康紀錄（開發中）</div>
        </RequireAuth>
      </Route>
      <Route path="/reminders">
        <RequireAuth>
          <div className="p-8 text-center">提醒通知（開發中）</div>
        </RequireAuth>
      </Route>

      {/* 404 */}
      <Route>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-6">找不到頁面</p>
          <a href="/" className="text-primary hover:underline">
            返回首頁
          </a>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
