import { useState } from "react";
import { SectionHeader } from "./SectionHeader";

const allergyItems = [
  "急性過敏原檢測 66 項（IgE）",
  "急慢性過敏原檢測 110 項（IgE + IgG）",
  "慢性過敏原檢測 101 項（IgG）",
  "急慢性過敏原檢測 224 項（最完整）",
];

const nutritionItems = [
  { emoji: "🧬", name: "維生素 B12", full: false },
  { emoji: "🌿", name: "葉酸", full: false },
  { emoji: "☀️", name: "維生素 D", full: false },
  { emoji: "🔴", name: "Ferritin", full: false },
  { emoji: "⚡", name: "鋅（Zinc）", full: true },
];

function AllergyItem({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <div
      className="allergy-item"
      onClick={() => setOn((v) => !v)}
      style={
        on
          ? { backgroundColor: "#14b8a6", color: "white" }
          : { backgroundColor: "white", color: "#0f172a" }
      }
    >
      {label}
    </div>
  );
}

export function SpecializedSection() {
  return (
    <section id="specialized" className="specialized-section">
      <div className="container">
        <SectionHeader
          badge="Specialized Tests"
          title="專項檢驗服務"
          desc="針對特定健康需求提供精準的專項檢驗，從過敏原追蹤到營養素評估。"
        />
        <div className="specialized-grid">
          <div className="specialized-card allergy-card">
            <div className="card-header">
              <div className="card-icon">⚠️</div>
              <div>
                <div className="card-title">過敏原檢測</div>
                <div className="card-subtitle">
                  沒生病 ≠ 真健康！身體說不出的不適，就從抓出過敏原開始。
                </div>
              </div>
            </div>
            <div className="allergy-items">
              {allergyItems.map((a) => (
                <AllergyItem key={a} label={a} />
              ))}
            </div>
          </div>
          <div>
            <div className="specialized-card nutrition-card">
              <div className="card-header">
                <div className="card-icon">💊</div>
                <div>
                  <div className="card-title">五大營養素檢測</div>
                  <div className="card-subtitle">精準評估體內關鍵營養素含量。</div>
                </div>
              </div>
              <div className="nutrition-grid">
                {nutritionItems.map((n) => (
                  <div key={n.name} className={`nutrition-item${n.full ? " full" : ""}`}>
                    <div className="nutrition-emoji">{n.emoji}</div>
                    <div className="nutrition-name">{n.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="consultation-box">
              <div className="consultation-title">不確定選哪個套組？</div>
              <div className="consultation-desc">
                我們的專業醫事人員將根據您的年齡、家族病史與健康需求，為您量身推薦最適合的檢驗方案。
              </div>
              <a href="#booking" className="consultation-link">預約免費諮詢 →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}