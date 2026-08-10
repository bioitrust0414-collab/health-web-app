import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  User,
  Smartphone,
  Calendar,
  FileText,
  MessageCircle,
} from "lucide-react";

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
      icon: <User className="w-6 h-6" />,
      href: LINE_OA_URL,
      variant: "default" as const,
      external: true,
    },
    {
      title: "健康 App",
      desc: "開啟 LINE 會員應用，追蹤每日健康數據",
      icon: <Smartphone className="w-6 h-6" />,
      href: LINE_PWA_URL,
      variant: "default" as const,
      external: true,
    },
    {
      title: "健檢預約",
      desc: "線上預約健檢項目，選擇方便時段",
      icon: <Calendar className="w-6 h-6" />,
      href: "/booking",
      variant: "outline" as const,
      external: false,
    },
    {
      title: "衛教知識",
      desc: "瀏覽營養科普與健康資訊",
      icon: <FileText className="w-6 h-6" />,
      href: "/health-education",
      variant: "outline" as const,
      external: false,
    },
    {
      title: "聯繫我們",
      desc: "透過 LINE 官方帳號諮詢",
      icon: <MessageCircle className="w-6 h-6" />,
      href: LINE_OA_URL,
      variant: "outline" as const,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-muted py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">健康服務中心</h1>
          <p className="text-muted-foreground">
            大華醫事檢驗所 — 您的健康管理夥伴
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {action.desc}
                    </p>
                    <Button variant={action.variant} size="sm" asChild>
                      {action.external ? (
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          開啟
                        </a>
                      ) : (
                        <a href={action.href}>進入</a>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
