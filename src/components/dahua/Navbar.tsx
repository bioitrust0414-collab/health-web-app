import { useState } from "react";
import {
  educationLink,
  linkAttrs,
  petTreatsLink,
  supplementsLink,
  type ExternalLink,
} from "@/data/externalLinks";

const links: ExternalLink[] = [
  { href: "#checkups", label: "健康檢查", isExternal: false },
  { href: "#gene", label: "基因檢測", isExternal: false },
  { href: "#specialized", label: "專項檢驗", isExternal: false },
  { href: "#products", label: "保健產品", isExternal: false },
  educationLink,
  supplementsLink,
  petTreatsLink,
  { href: "/health", label: "健康 App", isExternal: false },
  { href: "/member", label: "會員登入", isExternal: false },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav>
      <div className="container">
        <a href="#hero" className="nav-brand" onClick={close}>
          <div className="nav-brand-icon">🔬</div>
          <div className="nav-brand-text">
            <h1>大華醫事檢驗所</h1>
            <p>Dahua Medical Laboratory</p>
          </div>
        </a>
        <div className={`nav-links${open ? " active" : ""}`}>
          {links.map((l) => (
            <a key={l.href} {...linkAttrs(l)} onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#booking" className="btn-booking" onClick={close}>
            預約諮詢
          </a>
        </div>
        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="開啟選單">
          ☰
        </button>
      </div>
    </nav>
  );
}
