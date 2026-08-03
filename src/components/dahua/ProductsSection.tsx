import { SectionHeader } from "./SectionHeader";

const products = [
  {
    icon: "🌿",
    name: "健康好夥伴",
    desc: "bioid × 好家庭嚴選保健系列——BB神采速纖飲、DHA魚油、晶亮納豆Q10，搭配好家庭成長鈣、活力代謝、夜酵素複方、蔓越莓益生菌，一站式滿足全家日常保養需求。",
    features: [
      "衛部健食字認證，安心有保障",
      "全家適用：兒童成長到日常保健一次滿足",
      "線上直接選購，會員點數同步累積",
    ],
    link: "/bb-drink",
    cta: "查看完整商城 ➔",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="products-section">
      <div className="container">
        <SectionHeader
          badge="Health Products"
          title="健康好夥伴"
          desc="精選高品質的營養補充產品，為您與全家的健康加分。"
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
