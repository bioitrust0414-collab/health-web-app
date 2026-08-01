import { useEffect, useState } from "react";
import { clinicImages } from "./assets";

export function HeroSection() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % clinicImages.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">彰化市崙平南路 532 號 · 04-7616801</div>
            <h1 className="hero-title">
              精準醫學，
              <br />
              <span className="highlight">數據實證。</span>
            </h1>
            <p className="hero-desc">
              大華醫事檢驗所深耕預防醫學領域，通過國家級實驗室標準審核，以嚴謹的臨床生化數據，為您與家人的健康管理提供最可靠的科學依據。
            </p>
            <div className="hero-buttons">
              <a href="#checkups" className="btn btn-primary">瀏覽檢查套組</a>
              <a href="#booking" className="btn btn-secondary">預約諮詢</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">12+</div>
                <div className="stat-label">健康檢查套組</div>
              </div>
              <div className="stat">
                <div className="stat-number">224</div>
                <div className="stat-label">過敏原檢測項目</div>
              </div>
              <div className="stat">
                <div className="stat-number">9</div>
                <div className="stat-label">基因檢測方案</div>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-slideshow">
              {clinicImages.map((img, i) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className={i === idx ? "active" : ""}
                />
              ))}
              <div className="slide-dots">
                {clinicImages.map((_, i) => (
                  <div
                    key={i}
                    className={`slide-dot${i === idx ? " active" : ""}`}
                    onClick={() => setIdx(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}