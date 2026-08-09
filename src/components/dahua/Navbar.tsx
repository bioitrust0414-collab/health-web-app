import { useState } from "react";
import { educationLink, linkAttrs, type ExternalLink } from "@/data/externalLinks";

// 保健食品與寵物零嘴的入口已自本站移除：大華是醫事檢驗所（醫療機構），
// 在醫療機構網域上推薦食品商品的法規風險偏高，商品線改為完全獨立經營。
const links: ExternalLink[] = [
  { href: "#checkups", label: "健康檢查", isExternal: false },
  { href: "#gene", label: "基因檢測", isExternal: false },
  { href: "#specialized", label: "專項檢驗", isExternal: false },
  educationLink,
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
