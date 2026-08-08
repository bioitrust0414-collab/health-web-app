import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/member")({
  component: MemberPage,
});

function MemberPage() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">會員登入</CardTitle>
          <p className="text-gray-500">登入以查看您的檢驗報告與健康數據</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-[#06C755] hover:bg-[#05b34d] text-white h-14 text-lg"
            asChild
          >
            <Link to="/liff/entry">
              <MessageCircle className="mr-2 h-5 w-5" />
              透過 LINE 登入
            </Link>
          </Button>

          <Button variant="ghost" className="w-full" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首頁
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
