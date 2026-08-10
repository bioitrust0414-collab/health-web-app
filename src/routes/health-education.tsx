import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bone, Heart, Stethoscope, Pill, Brain } from "lucide-react";

export const Route = createFileRoute("/health-education")({
  component: HealthEducationPage,
});

const healthTopics = [
  {
    id: "active-calcium",
    category: "營養補充",
    icon: <Bone className="w-5 h-5" />,
    title: "活性鈣 — 吸收率更高的鈣質選擇",
    summary:
      "活性鈣採用離子化技術，吸收率較傳統碳酸鈣提升約 40%。適合骨質疏鬆高風險群、孕期與哺乳期女性補充。",
    tags: ["鈣質", "骨質疏鬆", "孕期營養"],
  },
  {
    id: "pet-health",
    category: "寵物保健",
    icon: <Heart className="w-5 h-5" />,
    title: "寵物營養與關節保健",
    summary:
      "毛孩的關節健康與日常營養補充建議。了解葡萄糖胺、軟骨素與適合的飲食搭配。",
    tags: ["寵物", "關節保健", "營養"],
  },
  {
    id: "iron-deficiency",
    category: "血液檢驗",
    icon: <Stethoscope className="w-5 h-5" />,
    title: "缺鐵性貧血 — 檢驗指標與飲食建議",
    summary:
      "鐵蛋白（Ferritin）是評估體內鐵質儲存的重要指標。了解如何透過飲食與檢驗追蹤改善。",
    tags: ["貧血", "鐵蛋白", "血液檢查"],
  },
  {
    id: "vitamin-d",
    category: "營養補充",
    icon: <Pill className="w-5 h-5" />,
    title: "維生素 D — 免疫調節與情緒健康",
    summary:
      "維生素 D 不僅影響鈣質吸收，更與免疫功能和情緒調節密切相關。建議定期檢測 25-OH-D 濃度。",
    tags: ["維生素D", "免疫", "情緒"],
  },
  {
    id: "gut-health",
    category: "腸道健康",
    icon: <Brain className="w-5 h-5" />,
    title: "腸道菌相與全身健康",
    summary:
      "腸道被稱為「第二大腦」。了解益生菌、膳食纖維與腸道屏障功能的關聯。",
    tags: ["腸道", "益生菌", "免疫力"],
  },
  {
    id: "sleep-quality",
    category: "睡眠與神經",
    icon: <Brain className="w-5 h-5" />,
    title: "鎂與睡眠品質",
    summary:
      "鎂離子參與神經傳導與肌肉放鬆，適量補充有助於改善入睡困難與夜間醒來。",
    tags: ["鎂", "睡眠", "神經"],
  },
];

function HealthEducationPage() {
  const [filter, setFilter] = useState<string>("全部");
  const categories = ["全部", ...new Set(healthTopics.map((t) => t.category))];

  const filtered =
    filter === "全部"
      ? healthTopics
      : healthTopics.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-muted py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            衛教知識
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            大華醫事檢驗所整理的健康資訊與營養知識，供會員參考。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-lg transition-shadow border-border/60"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  {topic.icon}
                  <span className="text-sm font-medium">{topic.category}</span>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {topic.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full" asChild>
                  <a href={`/health-topics/${topic.id}`}>閱讀完整內容</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
