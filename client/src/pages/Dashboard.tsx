import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isLoggedIn) setLocation('/liff/entry');
  }, [auth.isLoading, auth.isLoggedIn, setLocation]);

  useEffect(() => {
    if (!auth.isLoading && auth.isLoggedIn && !auth.isMapped) setLocation('/liff/verify');
  }, [auth.isLoading, auth.isLoggedIn, auth.isMapped, setLocation]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth.isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {auth.user?.pictureUrl ? (
              <img src={auth.user.pictureUrl} alt="avatar" className="h-10 w-10 rounded-full" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">{auth.user?.displayName?.[0] || '?'}</span>
              </div>
            )}
            <div>
              <p className="font-medium">{auth.user?.displayName || '會員'}</p>
              <p className="text-xs text-muted-foreground">大華醫事檢驗所</p>
            </div>
          </div>
          <button onClick={auth.logout} className="text-sm text-muted-foreground hover:text-foreground">登出</button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h2 className="text-xl font-bold">歡迎回來，{auth.user?.displayName || '會員'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '檢驗報告', path: '/reports' },
            { label: '預約掛號', path: '/booking' },
            { label: '我的訂單', path: '/orders' },
            { label: '健康紀錄', path: '/daily-log' },
          ].map((item) => (
            <div key={item.path} className="bg-card border rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setLocation(item.path)}>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-2">最新報告</h3>
          <p className="text-sm text-muted-foreground">尚無檢驗報告</p>
        </div>
      </main>

      <footer className="border-t bg-card py-6 text-center text-sm text-muted-foreground">
        <p>大華醫事檢驗所 &copy; 2026</p>
      </footer>
    </div>
  );
}
