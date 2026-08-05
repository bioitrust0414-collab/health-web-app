import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/dahua/Navbar";
import { Footer } from "@/components/dahua/Footer";
import { SectionHeader } from "@/components/dahua/SectionHeader";
import { assetUrl, releasedEpisodes } from "@/lib/education";

export const Route = createFileRoute("/education/")({
  head: () => ({
    meta: [
      { title: "衛教知識 - 大華醫事檢驗所" },
      {
        name: "description",
        content:
          "營養與健康科普專欄：礦物質、營養素與日常保健知識，幫你在生活中做出有依據的健康選擇。",
      },
      { property: "og:title", content: "衛教知識 - 大華醫事檢驗所" },
      {
        property: "og:description",
        content: "營養與健康科普專欄，幫你在生活中做出有依據的健康選擇。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EducationList,
});

function EducationList() {
  return (
    <>
      <Navbar />
      <section className="products-section" style={{ paddingTop: "120px" }}>
        <div className="container">
          <SectionHeader
            badge="Health Education"
            title="衛教知識"
            desc="營養與健康的科普內容，幫助你在日常中做出有依據的健康選擇。"
          />
          {releasedEpisodes.length === 0 ? (
            <p style={{ textAlign: "center" }}>內容即將上線，敬請期待。</p>
          ) : (
            <div className="products-grid">
              {releasedEpisodes.map((ep) => (
                <div key={ep.folder} className="product-card">
                  <div>
                    <img
                      src={assetUrl(ep.folder, "images/card1_cover.jpg")}
                      alt={ep.title}
                      loading="lazy"
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
                  <Link
                    to="/education/$slug"
                    params={{ slug: ep.folder }}
                    className="product-action-btn"
                  >
                    閱讀全文 ➔
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
