import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/dahua/Navbar";
import { Footer } from "@/components/dahua/Footer";
import { SectionHeader } from "@/components/dahua/SectionHeader";
import dahuaCss from "@/styles/dahua.css?url";

export const Route = createFileRoute("/health-education")({
  head: () => ({
    meta: [{ title: "衛教知識 - 大華醫事檢驗所" }],
    links: [{ rel: "stylesheet", href: dahuaCss }],
  }),
  component: HealthEducationPage,
});

const healthTopics = [
  {
    id: "active-calcium",
    category: "營養補充",
    title: "活性鈣 — 吸收率更高的鈣質選擇",
    summary: "活性鈣採用離子化技術，吸收率較傳統碳酸鈣提升約 40%。適合骨質疏鬆高風險群、孕期與哺乳期女性補充。",
    tags: ["鈣質", "骨質疏鬆", "孕期營養"],
  },
  {
    id: "pet-health",
    category: "寵物保健",
    title: "寵物營養與關節保健",
    summary: "毛孩的關節健康與日常營養補充建議。了解葡萄糖胺、軟骨素與適合的飲食搭配。",
    tags: ["寵物", "關節保健", "營養"],
  },
  {
    id: "iron-deficiency",
    category: "血液檢驗",
    title: "缺鐵性貧血 — 檢驗指標與飲食建議",
    summary: "鐵蛋白（Ferritin）是評估體內鐵質儲存的重要指標。了解如何透過飲食與檢驗追蹤改善。",
    tags: ["貧血", "鐵蛋白", "血液檢查"],
  },
  {
    id: "vitamin-d",
    category: "營養補充",
    title: "維生素 D — 免疫調節與情緒健康",
    summary: "維生素 D 不僅影響鈣質吸收，更與免疫功能和情緒調節密切相關。建議定期檢測 25-OH-D 濃度。",
    tags: ["維生素D", "免疫", "情緒"],
  },
];

function HealthEducationPage() {
  const [filter, setFilter] = useState<string>("全部");
  const categories = ["全部", ...new Set(healthTopics.map((t) => t.category))];

  const filtered =
    filter === "全部" ? healthTopics : healthTopics.filter((t) => t.category === filter);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px", minHeight: "100vh", background: "#f8fafc" }}>
        <SectionHeader
          badge="Health Education"
          title="衛教知識"
          desc="大華醫事檢驗所整理的健康資訊與營養知識，供會員參考。"
        />

        {/* Filter */}
        <div className="container" style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: filter === cat ? "none" : "1px solid #e2e8f0",
                  background: filter === cat ? "#0f172a" : "#fff",
                  color: filter === cat ? "#fff" : "#334155",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="container" style={{ paddingBottom: "64px" }}>
          <div className="products-grid">
            {filtered.map((topic) => (
              <div key={topic.id} className="product-card">
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#0369a1",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    {topic.category}
                  </div>
                  <div className="product-name" style={{ marginBottom: "12px" }}>
                    {topic.title}
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "12px" }}>
                    {topic.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.75rem",
                          background: "#f1f5f9",
                          color: "#64748b",
                          padding: "4px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a href={`/health-topics/${topic.id}`} className="btn-primary" style={{ width: "100%", textAlign: "center" }}>
                  閱讀完整內容 →
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
