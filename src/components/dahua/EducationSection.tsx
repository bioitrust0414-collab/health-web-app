import { SectionHeader } from "./SectionHeader";
import indexData from "@/data/itrust/index.json";
import type { EpisodeIndex } from "@/types/content";

const data = indexData as EpisodeIndex;
const released = data.episodes.filter((ep) => ep.has_content);

export function EducationSection() {
  return (
    <section id="education" className="products-section">
      <div className="container">
        <SectionHeader
          badge="Health Education"
          title="衛教知識"
          desc="營養與健康的科普內容，幫助你在日常中做出有依據的健康選擇。"
        />
        <div className="products-grid">
          {released.map((ep) => (
            <div key={ep.folder} className="product-card">
              <div>
                <img
                  src={`/content/itrust/episodes/${ep.folder}/images/card1_cover.jpg`}
                  alt={ep.title}
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                />
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#0369a1",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {ep.category} · {ep.content_type}
                </div>
                <div className="product-name">
                  第 {ep.episode_number} 期 · {ep.title}
                </div>
                <div className="product-desc">{ep.hook}</div>
              </div>
              <a href={`/education/${ep.folder}`} className="product-action-btn">
                閱讀全文 ➔
              </a>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a
            href="/education"
            className="product-action-btn"
            style={{ display: "inline-block", width: "auto", padding: "12px 36px" }}
          >
            瀏覽全部衛教內容 ➔
          </a>
        </div>
      </div>
    </section>
  );
}
