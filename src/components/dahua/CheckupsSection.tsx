import { useState } from "react";
import { packages, type Package } from "@/data/dahua";
import { SectionHeader } from "./SectionHeader";

type Group = keyof typeof packages;

function PackageCard({ pkg }: { pkg: Package }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="package-card" onClick={() => setOpen((v) => !v)}>
      <div className="package-header">
        <div className="package-icon">{pkg.icon}</div>
        <div className="package-badge">查看詳情</div>
      </div>
      <div className="package-name">{pkg.name}</div>
      <div className="package-desc">{pkg.desc}</div>
      <div className="package-link">查看檢驗項目 ▼</div>
      <div className={`package-details${open ? " show" : ""}`}>
        <div className="package-details-title">包含以下主要檢驗項目：</div>
        <ul className="package-details-list">
          {pkg.items.map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CheckupsSection() {
  const [group, setGroup] = useState<Group>("general");
  const list = packages[group];

  return (
    <section id="checkups" className="checkups-section">
      <div className="container">
        <SectionHeader
          badge="Health Checkup Packages"
          title="全身健康檢查套組"
          desc="從基礎篩檢到高階全方位健康評估，依據您的需求與年齡層，選擇最適合的健康檢查方案。"
        />
        <div className="checkups-toggle">
          <div className="toggle-group">
            <button
              className={`toggle-btn${group === "general" ? " active" : ""}`}
              onClick={() => setGroup("general")}
            >
              基礎與進階
            </button>
            <button
              className={`toggle-btn${group === "special" ? " active" : ""}`}
              onClick={() => setGroup("special")}
            >
              特定族群
            </button>
          </div>
        </div>
        <div className="packages-grid">
          {list.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}