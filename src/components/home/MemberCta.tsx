import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MessageCircle, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

export function MemberCta() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免 SSR 與 Client 狀態不一致導致閃爍
  if (!mounted || isLoading) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />;
  }

  if (isAuthenticated) {
    return (
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            歡迎回來，會員專區已為您開啟
          </h2>
          <p className="text-gray-600 mb-6">
            立即前往查看您的健康數據與檢驗報告
          </p>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full"
            asChild
          >
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              進入會員中心
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          查看您的個人檢驗報告
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          加入 LINE 會員，隨時掌握健康數據，檢驗報告即時查詢
        </p>
        <Button
          className="bg-[#06C755] hover:bg-[#05b34d] text-white px-8 py-6 text-lg rounded-full"
          asChild
        >
          <Link to="/liff/entry">
            <MessageCircle className="mr-2 h-5 w-5" />
            透過 LINE 加入會員
          </Link>
        </Button>
        <p className="text-xs text-gray-400 mt-4">
          將開啟 LINE 應用程式進行綁定
        </p>
      </div>
    </section>
  );
}
