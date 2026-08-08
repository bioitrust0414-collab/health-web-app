import { Route, Switch } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import LiffEntry from './pages/LiffEntry';
import LiffVerify from './pages/LiffVerify';
import Dashboard from './pages/Dashboard';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!auth.isLoggedIn) {
    window.location.href = '/liff/entry';
    return null;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/liff/entry" component={LiffEntry} />
      <Route path="/liff/verify" component={LiffVerify} />
      <Route path="/dashboard">
        <RequireAuth><Dashboard /></RequireAuth>
      </Route>
      <Route path="/reports">
        <RequireAuth><div className="p-8 text-center">報告列表（開發中）</div></RequireAuth>
      </Route>
      <Route path="/booking">
        <RequireAuth><div className="p-8 text-center">預約掛號（開發中）</div></RequireAuth>
      </Route>
      <Route path="/orders">
        <RequireAuth><div className="p-8 text-center">訂單查詢（開發中）</div></RequireAuth>
      </Route>
      <Route path="/daily-log">
        <RequireAuth><div className="p-8 text-center">健康日誌（開發中）</div></RequireAuth>
      </Route>
      <Route>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <a href="/" className="text-primary hover:underline">回首頁</a>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
