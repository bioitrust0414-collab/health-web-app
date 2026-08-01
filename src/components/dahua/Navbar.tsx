import { useState } from "react";

const links = [
  { href: "#checkups", label: "健康檢查" },
  { href: "#gene", label: "基因檢測" },
  { href: "#specialized", label: "專項檢驗" },
  { href: "#products", label: "保健產品" },
  { href: "/education", label: "衛教知識" },
  { href: "/mal1688", label: "專業複合鈣" },
  { href: "/heychew1688/index.html", label: "寵物零嘴" },
  { href: "/member", label: "會員登入" },
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
            <a key={l.href} href={l.href} onClick={close}>
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
