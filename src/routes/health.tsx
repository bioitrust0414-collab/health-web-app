import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/health")({
  component: HealthPage,
});

const LINE_OA_URL = "https://lin.ee/NCshL6k";
const LINE_PWA_URL = "https://liff.line.me/2010848952-VfGV0qlc";

function HealthPage() {
  const actions = [
    {
      title: "會員登錄",
      desc: "使用 LINE 帳號快速登入，查看檢驗報告與預約紀錄",
      href: LINE_OA_URL,
      external: true,
      primary: true,
    },
    {
      title: "健康 App",
      desc: "開啟 LINE 會員應用，追蹤每日健康數據",
      href: LINE_PWA_URL,
      external: true,
      primary: true,
    },
    {
      title: "健檢預約",
      desc: "線上預約健檢項目，選擇方便時段",
      href: "/booking",
      external: false,
      primary: false,
    },
    {
      title: "衛教知識",
      desc: "瀏覽營養科普與健康資訊",
      href: "/health-education",
      external: false,
      primary: false,
    },
    {
      title: "聯繫我們",
      desc: "透過 LINE 官方帳號諮詢",
      href: LINE_OA_URL,
      external: true,
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-100 py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">健康服務中心</h1>
        <p className="text-gray-600 text-sm">大華醫事檢驗所 — 您的健康管理夥伴</p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {actions.map((action) => (
            <Card key={action.title} className="border border-gray-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{action.desc}</p>
                {action.external ? (
                  <Button asChild className={action.primary ? "" : "variant-outline"}>
                    <a href={action.href} target="_blank" rel="noopener noreferrer">
                      開啟 →
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant={action.primary ? "default" : "outline"}>
                    <a href={action.href}>進入</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
