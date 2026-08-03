import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, CheckCircle, Truck, Shield, Leaf } from "lucide-react";

export const Route = createFileRoute("/mal1688")({
  head: () => ({
    meta: [
      { title: "MitoActiveLife 活「粒」生活｜專業全家與兒童複合鈣矩陣" },
      {
        name: "description",
        content: "MitoActiveLife 提供高品質營養保健產品，專注於全家健康與兒童成長所需的複合鈣矩陣配方。",
      },
    ],
  }),
  component: Mal1688Page,
});

const products = [
  {
    id: "cal-mag-k2",
    name: "複合鈣鎂 K2 錠",
    subtitle: "全家適用｜60 錠",
    price: 1280,
    originalPrice: 1580,
    tags: ["熱銷", "回購第一"],
    features: ["鈣 + 鎂 + 維生素 D3 + K2", "吸收率提升 3 倍", "無添加人工色素"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
  },
  {
    id: "kids-calcium",
    name: "兒童成長鈣粉",
    subtitle: "3 歲以上｜30 包",
    price: 980,
    originalPrice: 1280,
    tags: ["兒童專屬"],
    features: ["天然草莓風味", "益生菌 + 鈣雙效", "獨立包裝好攜帶"],
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
  },
  {
    id: "prenatal-calcium",
    name: "孕哺期專用鈣",
    subtitle: "孕婦 / 哺乳期｜90 錠",
    price: 1680,
    originalPrice: 1980,
    tags: ["醫師推薦"],
    features: ["葉酸 + 鐵 + 鈣三合一", "低便秘配方", "通過 SGS 檢驗"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop",
  },
  {
    id: "elder-bone",
    name: "銀髮護骨配方",
    subtitle: "50 歲以上｜90 錠",
    price: 1480,
    originalPrice: 1780,
    tags: ["高齡友善"],
    features: ["維生素 D3 2000 IU", "添加玻尿酸潤滑", "小錠劑易吞服"],
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop",
  },
];

const testimonials = [
  {
    name: "陳小姐",
    role: "兩寶媽",
    content: "孩子以前都不愛吃鈣片，換成 mal1688 的兒童鈣粉後每天都主動要喝！草莓口味真的很天然。",
    rating: 5,
  },
  {
    name: "林先生",
    role: "45 歲上班族",
    content: "長期久坐腰痠，吃了複合鈣鎂 K2 三個月後，明顯感覺骨頭沒那麼容易喀喀響。",
    rating: 5,
  },
  {
    name: "王太太",
    role: "退休教師",
    content: "銀髮配方的小錠劑設計很貼心，我媽媽吞起來不會卡喉嚨，她現在每天都記得吃。",
    rating: 4,
  },
];

function Mal1688Page() {
  return (
    <AppShell title="MitoActiveLife" subtitle="活「粒」生活">
      <div className="pb-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-emerald-600 text-white hover:bg-emerald-700">
              大華醫事檢驗所 推薦品牌
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              MitoActiveLife
              <span className="block mt-2 text-emerald-600">活「粒」生活</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
              專業全家與兒童複合鈣矩陣配方，從骨骼根基打造全家人的健康底蘊
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                asChild
              >
                <Link to="/shop">前往健康商城 →</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600">
                了解更多
              </Button>
            </div>
            <div className="mt-10 flex justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span>SGS 檢驗合格</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span>天然萃取</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                <span>滿千免運</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">熱銷商品</h2>
              <p className="mt-2 text-slate-500">根據不同年齡與需求，找到最適合的鈣質補充方案</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <div className="relative aspect-square bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      {product.tags.map((tag) => (
                        <Badge key={tag} className="bg-emerald-600 text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <button className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-slate-400 hover:text-red-500 transition">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500">{product.subtitle}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{product.name}</h3>
                    <ul className="mt-2 space-y-1">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-emerald-600">
                          NT$ {product.price.toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-slate-400 line-through">
                          NT$ {product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        asChild
                      >
                        <Link to="/shop">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          選購
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Science Section */}
        <section className="bg-slate-50 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">為什麼選擇複合鈣矩陣？</h2>
              <p className="mt-2 text-slate-500">鈣質吸收不是單打獨鬥，關鍵在於協同配方</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "🦴",
                  title: "鈣 + 鎂黃金比例",
                  desc: "2:1 鈣鎂比例，模擬天然骨骼礦物組成，吸收率提升 40%",
                },
                {
                  icon: "☀️",
                  title: "維生素 D3 + K2",
                  desc: "D3 促進腸道吸收，K2 引導鈣質進入骨骼而非血管",
                },
                {
                  icon: "🌱",
                  title: "天然發酵來源",
                  desc: "採用紅藻鈣與檸檬酸鈣雙來源，溫和不刺激胃部",
                },
              ].map((item) => (
                <Card key={item.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">用戶真實回饋</h2>
              <p className="mt-2 text-slate-500">超過 10,000 個家庭的信賴選擇</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name}>
                  <CardContent className="p-5">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">「{t.content}」</p>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 px-4 py-16">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-2xl font-bold">開始為家人打造健康基礎</h2>
            <p className="mt-3 text-emerald-100">
              加入會員享首購 9 折，累積點數可兌換健檢服務
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
                asChild
              >
                <Link to="/shop">立即選購</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/member">加入會員</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
