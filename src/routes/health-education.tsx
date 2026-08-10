import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/health-education")({
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gray-100 py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">衛教知識</h1>
        <p className="text-gray-600">大華醫事檢驗所整理的健康資訊與營養知識</p>
      </div>

      {/* Filter */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((topic) => (
            <Card key={topic.id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <p className="text-sm text-gray-500 mb-1">{topic.category}</p>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm leading-relaxed">{topic.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button className="w-full" asChild>
                  <a href={`/health-topics/${topic.id}`}>閱讀完整內容</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
