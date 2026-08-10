import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Bone, Heart, Stethoscope, Pill } from "lucide-react";

// ============================================
// 衛教文章資料
// ============================================
const healthTopics = [
  {
    id: "active-calcium",
    category: "營養補充",
    icon: <Bone className="w-5 h-5" />,
    title: "活性鈣 — 吸收率更高的鈣質選擇",
    summary:
      "活性鈣採用離子化技術，吸收率較傳統碳酸鈣提升約 40%。適合骨質疏鬆高風險群、孕期與哺乳期女性補充。",
    tags: ["鈣質", "骨質疏鬆", "孕期營養"],
    externalUrl: "https://你的商店.com/active-calcium?ref=dahua",
    hasProduct: true,
  },
  {
    id: "pet-snacks",
    category: "寵物保健",
    icon: <Heart className="w-5 h-5" />,
    title: "寵物機能零食 — 關節保健配方",
    summary:
      "添加葡萄糖胺與軟骨素，幫助毛孩維持關節靈活。無穀物配方，適合敏感體質犬貓。",
    tags: ["寵物", "關節保健", "無穀物"],
    externalUrl: "https://你的商店.com/pet-snacks?ref=dahua",
    hasProduct: true,
  },
  {
    id: "iron-deficiency",
    category: "血液檢驗",
    icon: <Stethoscope className="w-5 h-5" />,
    title: "缺鐵性貧血 — 檢驗指標與飲食建議",
    summary:
      "鐵蛋白（Ferritin）是評估體內鐵質儲存的重要指標。了解如何透過飲食與檢驗追蹤改善。",
    tags: ["貧血", "鐵蛋白", "血液檢查"],
    externalUrl: null,
    hasProduct: false,
  },
  {
    id: "vitamin-d",
    category: "營養補充",
    icon: <Pill className="w-5 h-5" />,
    title: "維生素 D — 免疫調節與情緒健康",
    summary:
      "維生素 D 不僅影響鈣質吸收，更與免疫功能和情緒調節密切相關。建議定期檢測 25-OH-D 濃度。",
    tags: ["維生素D", "免疫", "情緒"],
    externalUrl: null,
    hasProduct: false,
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
      {/* Hero */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            衛教知識
          </h1>
          <p className="text-muted
