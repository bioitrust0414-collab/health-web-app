import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ... 你原有的 import

function App() {
  const { user, loading, signInWithLIFF } = useAuth();

  useEffect(() => {
    // 如果還沒登入，嘗試 LIFF 自動登入
    if (!user && !loading) {
      const tryLIFF = async () => {
        // 只在 LINE 環境中嘗試（檢查是否在 LIFF 中）
        if (window.location.href.includes('liff') || (window as any).liff) {
          try {
            await signInWithLIFF();
          } catch (err) {
            console.log('LIFF 自動登入失敗，顯示登入頁面');
          }
        }
      };
      tryLIFF();
    }
  }, [user, loading, signInWithLIFF]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 你原有的路由 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
