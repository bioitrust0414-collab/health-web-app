import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Stethoscope, Heart, Bone } from "lucide-react";

// ============================================
// 衛教文章資料 — 之後可以從 Supabase 或 iTrust_Repo 拉取
// ============================================
const healthTopics = [
  {
    id: "active-calcium",
    category: "營養補充",
    icon: <Bone className="w-5 h-5" />,
    title: "活性鈣 — 吸收率更高的鈣質選擇",
    summary:
      "活性鈣採用離子化技術，吸收率較傳統碳酸鈣提升約 40%。適合骨質疏鬆高風險群、孕期與哺乳期女性。",
    tags: ["鈣質", "骨質疏鬆", "孕期營養"],
    externalUrl: "https://你的外部商店.com/active-calcium?ref=dahua",
    status: "熱門推薦",
  },
  {
    id: "pet-snacks",
    category: "寵物保健",
    icon: <Heart className="w-5 h-5" />,
    title: "寵物機能零食 — 關節保健配方",
    summary:
      "添加葡萄糖胺與軟骨素，幫助毛孩維持關節靈活。無穀物配方，適合敏感體質犬貓。",
    tags: ["寵物", "關節保健", "無穀物"],
    externalUrl: "https://你的外部商店.com/pet-snacks?ref=dahua",
    status: "新品上市",
  },
  {
    id: "iron-deficiency",
    category: "血液檢驗",
    icon: <Stethoscope className="w-5 h-5" />,
    title: "缺鐵性貧血 — 檢驗指標與飲食建議",
    summary:
      "鐵蛋白（Ferritin）是評估體內鐵質儲存的重要指標。了解如何透過飲食與檢驗追蹤改善。",
    tags: ["貧血", "鐵蛋白", "血液檢查"],
    externalUrl: null, // 純衛教，無外部連結
    status: "衛教專區",
  },
  {
    id: "vitamin-d",
    category: "營養補充",
    icon: <BookOpen className="w-5 h-5" />,
    title: "維生素 D — 免疫調節與情緒健康",
    summary:
      "維生素 D 不僅影響鈣質吸收，更與免疫功能和情緒調節密切相關。建議定期檢測 25-OH-D 濃度。",
    tags: ["維生素D", "免疫", "情緒"],
    externalUrl: null,
    status: "衛教專區",
  },
];

export default function HealthEducationPage() {
  const [filter, setFilter] = useState<string>("全部");

  const categories = ["全部", ...new Set(healthTopics.map((t) => t.category))];
  const filtered =
    filter === "全部"
      ? healthTopics
      : healthTopics.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            衛教知識
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            大華醫事檢驗所整理的健康資訊與營養知識。
            點擊「前往選購」可至合作商店查看相關產品。
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
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

      {/* Topic Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-lg transition-shadow border-border/60"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {topic.icon}
                    <span className="text-sm font-medium">
                      {topic.category}
                    </span>
                  </div>
                  <Badge variant="secondary">{topic.status}</Badge>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {topic.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button variant="default" className="flex-1" asChild>
                    <a href={`/health-topics/${topic.id}`}>
                      閱讀完整內容
                    </a>
                  </Button>
                  {topic.externalUrl && (
                    <Button variant="outline" asChild>
                      <a
                        href={topic.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        前往選購
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
