import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/dahua/Navbar";
import { Footer } from "@/components/dahua/Footer";

const LINE_OA_URL = "https://lin.ee/NCshL6k";
const LINE_PWA_URL = "https://liff.line.me/2010848952-VfGV0qlc";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [{ title: "健康服務中心 - 大華醫事檢驗所" }],
  }),
  component: HealthPage,
});

function HealthPage() {
  const actions = [
    { title: "會員登錄", desc: "使用 LINE 帳號快速登入", href: LINE_OA_URL, external: true },
    { title: "健康 App", desc: "開啟 LINE 會員應用", href: LINE_PWA_URL, external: true },
    { title: "健檢預約", desc: "線上預約健檢項目", href: "/booking", external: false },
    { title: "衛教知識", desc: "瀏覽營養科普與健康資訊", href: "/health-education", external: false },
    { title: "聯繫我們", desc: "透過 LINE 官方帳號諮詢", href: LINE_OA_URL, external: true },
  ];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px", minHeight: "100vh", background: "#f8fafc" }}>
        <section style={{ textAlign: "center", padding: "48px 16px" }}>
          <div className="section-badge">Health Center</div>
          <h2 className="section-title">健康服務中心</h2>
          <p className="section-desc">大華醫事檢驗所 — 您的健康管理夥伴</p>
        </section>

        <div className="container" style={{ maxWidth: "640px", margin: "0 auto", padding: "0 16px 48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {actions.map((action) => (
              <div key={action.title} className="product-card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "8px" }}>{action.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "16px" }}>{action.desc}</p>
                {action.external ? (
                  <a href={action.href} target="_blank" rel="noopener noreferrer" className="btn-primary">開啟 →</a>
                ) : (
                  <a href={action.href} className="btn-primary">進入 →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
