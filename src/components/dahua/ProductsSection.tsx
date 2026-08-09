import { SectionHeader } from "./SectionHeader";
import { linkAttrs, petTreatsLink, supplementsLink, type ExternalLink } from "@/data/externalLinks";

// 本區塊只做導流，不在站內完成交易 —— 大華是醫事檢驗所（醫療機構），
// 站內直接販售商品在法規上風險較高，因此商品線各自獨立於外部平台。
//
// ⚠️ 文案待法務複查：食品不得涉及療效宣稱（食安法 §28），而醫療機構網域
// 上的商品敘述會被更嚴格檢視。原文中「以臨床骨代謝數據為基準」「精準引導
// 鈣質沉積」等語句已先改為敘述成分與劑型的中性描述，正式上線前建議再由
// 診所法務／顧問確認一次。詳見 docs/ROADMAP.md。
interface ProductCard {
  icon: string;
  name: string;
  desc: string;
  features: string[];
  link: ExternalLink;
  cta: string;
}

const products: ProductCard[] = [
  {
    icon: "🦴",
    name: "專業家庭發育與複合鈣系統",
    desc: "採用大西洋天然紅藻海藻鈣，搭配多元複合鈣源與 D3、K2。咀嚼錠劑型、水果風味，適合全家日常補充。",
    features: [
      "天然紅藻海藻鈣配方",
      "水果風味咀嚼錠，方便日常食用",
      "全家適用的日常鈣質補充選擇",
    ],
    link: supplementsLink,
    cta: "查看完整系列 ➔",
  },
  {
    icon: "🐾",
    name: "Paludo & Mila 天然手作寵物零嘴",
    desc: "在地天然、純粹手作。使用 100% 低溫烘焙鮮純雞胸肉（頂級雞肉薄片），無任何化學添加物或人工防腐劑。以溫暖工藝封存天然蛋白營養，守護家中毛孩的每一口純粹滋味。",
    features: ["100% 國產新鮮雞胸肉製作", "無鹽無添加、低溫烘焙熟化", "適合挑嘴毛孩的日常零嘴"],
    link: petTreatsLink,
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
              <a {...linkAttrs(p.link)} className="product-action-btn">
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
