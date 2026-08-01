import { SectionHeader } from "./SectionHeader";

const products = [
  {
    icon: "🦴",
    name: "專業家庭發育與複合鈣系統",
    desc: "以臨床骨代謝數據為基準，引進大西洋無污染天然紅藻海藻鈣，融合多元優質複合鈣源 × 關鍵導航因子 D3+K2。確保每一份營養都能精準引導鈣質沉積，全方位支援兒童發育與全家人骨骼健康。",
    features: [
      "天然紅藻海藻鈣高吸收配方",
      "水果風味優良依從性咀嚼錠",
      "兒童發育與長輩骨骼強力支持",
    ],
    link: "/mal1688",
    cta: "查看科學實證與完整系列 ➔",
  },
  {
    icon: "🐾",
    name: "Paludo & Mila 天然手作寵物零嘴",
    desc: "在地天然、純粹手作。使用 100% 低溫烘焙鮮純雞胸肉（頂級雞肉薄片），無任何化學添加物或人工防腐劑。以溫暖工藝封存天然蛋白營養，守護家中毛孩的每一口純粹滋味。",
    features: ["100% 國產新鮮雞胸肉製作", "無鹽無添加、低溫烘焙熟化", "口腔清潔、挑嘴毛孩健康零嘴"],
    link: "heychew1688/index.html",
    cta: "查看毛孩手工零嘴目錄 ➔",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="products-section">
      <div className="container">
        <SectionHeader
          badge="Health Products"
          title="健康保健產品"
          desc="精選高品質的營養補充與寵物手作食品，為您與全家（包含毛孩）的健康加分。"
        />
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.name} className="product-card">
              <div>
                <div className="product-icon">{p.icon}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-desc">{p.desc}</div>
                <div className="product-features">
                  {p.features.map((f) => (
                    <div key={f} className="product-feature">
                      <span className="product-feature-check">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <a href={p.link} className="product-action-btn">
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
