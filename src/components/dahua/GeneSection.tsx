import { geneTests } from "@/data/dahua";
import { SectionHeader } from "./SectionHeader";

export function GeneSection() {
  return (
    <section id="gene" className="gene-section">
      <div className="container">
        <SectionHeader
          badge="Gene Testing"
          title="基因檢測系列"
          desc="基因檢測可提供了解自身之各項特質，分析您罹患疾病的風險與對藥物之特別反應，進而針對自己先天體質不足之處加以保健。"
        />
        <div className="gene-grid">
          {geneTests.map((t) => (
            <div key={t.name} className={`gene-card${t.highlight ? " highlight" : ""}`}>
              <div className="gene-icon">🧬</div>
              <div className="gene-name">{t.name}</div>
              <div className="gene-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}