import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, loading, signInWithLIFF } = useAuth();

  useEffect(() => {
    // 如果還沒登入，嘗試 LIFF 自動登入
    if (!user && !loading) {
      signInWithLIFF().catch(() => {
        // LIFF 登入失敗 → 顯示登入頁面
      });
    }
  }, [user, loading]);

  if (loading) return <div>載入中...</div>;

  return (
    // 你的原有頁面結構
  );
}
