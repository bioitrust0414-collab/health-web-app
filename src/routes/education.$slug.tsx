import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/dahua/Navbar";
import { Footer } from "@/components/dahua/Footer";
import { assetUrl, getEpisode } from "@/lib/education";

export const Route = createFileRoute("/education/$slug")({
  head: ({ params }) => {
    const found = getEpisode(params.slug);
    if (!found) {
      return {
        meta: [
          { title: "找不到這篇內容 - 大華醫事檢驗所" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { meta } = found;
    const title = `第 ${meta.episode_number} 期 · ${meta.title} - 衛教知識`;
    return {
      meta: [
        { title },
        { name: "description", content: meta.hook },
        { property: "og:title", content: title },
        { property: "og:description", content: meta.hook },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EducationDetail,
});

function EducationDetail() {
  const { slug } = Route.useParams();
  const found = getEpisode(slug);

  if (!found) {
    return (
      <>
        <Navbar />
        <section className="products-section" style={{ paddingTop: "120px" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: "16px" }}>找不到這篇內容</h1>
            <p style={{ marginBottom: "24px", color: "#64748b" }}>
              這期衛教內容可能尚未發布或連結有誤。
            </p>
            <Link
              to="/education"
              className="product-action-btn"
              style={{ display: "inline-block", width: "auto", padding: "12px 36px" }}
            >
              ← 返回衛教知識
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const { meta, article } = found;
  const cards = article
    ? ([
        { img: article.cards.cover, text: article.fb_long.cover, sub: article.web_copy.cover },
        { img: article.cards.card2, text: article.fb_long.card2, sub: article.web_copy.card2 },
        { img: article.cards.card3, text: article.fb_long.card3, sub: article.web_copy.card3 },
      ] as const)
    : [{ img: "images/card1_cover.jpg", text: meta.hook, sub: "" }];

  return (
    <>
      <Navbar />
      <article className="products-section" style={{ paddingTop: "120px" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <Link to="/education" style={{ color: "#0369a1", fontWeight: 600 }}>
            ← 返回衛教知識
          </Link>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#0369a1",
              fontWeight: 600,
              margin: "24px 0 8px",
            }}
          >
            {meta.category} · {meta.content_type} · 第 {meta.episode_number} 期
          </div>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.3, marginBottom: "12px" }}>
            {meta.title}
          </h1>
          <p style={{ color: "#475569", marginBottom: "32px" }}>{meta.hook}</p>

          {cards.map((card, i) => (
            <section key={i} style={{ marginBottom: "40px" }}>
              <img
                src={assetUrl(meta.folder, card.img)}
                alt={`${meta.title} 圖 ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  marginBottom: "16px",
                  objectFit: "cover",
                }}
              />
              {card.sub ? (
                <h2 style={{ fontSize: "1.15rem", marginBottom: "10px" }}>{card.sub}</h2>
              ) : null}
              <p style={{ lineHeight: 1.9, color: "#334155" }}>{card.text}</p>
            </section>
          ))}

          {article?.ig_short ? (
            <aside
              style={{
                background: "#f0f9ff",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "40px",
              }}
            >
              <h2 style={{ fontSize: "1.05rem", marginBottom: "12px" }}>重點速覽</h2>
              <ul style={{ paddingLeft: "20px", lineHeight: 1.9, color: "#334155" }}>
                <li>{article.ig_short.cover}</li>
                <li>{article.ig_short.card2}</li>
                <li>{article.ig_short.card3}</li>
              </ul>
            </aside>
          ) : null}

          <Link
            to="/education"
            className="product-action-btn"
            style={{ display: "inline-block", width: "auto", padding: "12px 36px" }}
          >
            瀏覽其他衛教內容 ➔
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
