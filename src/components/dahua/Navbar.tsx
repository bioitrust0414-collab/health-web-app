import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { educationLink, linkAttrs, type ExternalLink } from "@/data/externalLinks";

// 導覽項目分三種，因為它們的導航方式不同：
//
//  - hash   同頁錨點，用原生 <a>
//  - route  站內路由，必須用 TanStack 的 <Link>，不能用 <a href="/xxx">
//  - link   外部（或尚無路由的）連結，用 <a>，外部會自動帶 rel="noopener"
//
// 為什麼站內路由要用 <Link> 而不是 <a href="/health">：
// 原生 <a> 會讓瀏覽器整頁重新載入 —— 重新下載並執行整包 JS、重跑
// hydration、閃一下白畫面，而且 TanStack 的 history 索引（__TSR_index）
// 會被重設為 0。改用 <Link> 之後是 client-side 轉場，速度快很多，也和
// AppShell（App 端的分頁導覽）本來就使用 <Link> 的做法一致。
//
// 註：捲動位置的還原本身沒有問題 —— TanStack 的 scrollRestoration 在
// client-side 轉場與整頁載入兩種情況下都能正確還原（已實測）。
//
// 保健食品與寵物零嘴的入口已自本站移除：大華是醫事檢驗所（醫療機構），
// 在醫療機構網域上推薦食品商品的法規風險偏高，商品線改為完全獨立經營。
type NavItem =
  | { kind: "hash"; href: string; label: string }
  | { kind: "route"; to: "/health" | "/member"; label: string }
  | { kind: "link"; link: ExternalLink };

const navItems: NavItem[] = [
  { kind: "hash", href: "#checkups", label: "健康檢查" },
  { kind: "hash", href: "#gene", label: "基因檢測" },
  { kind: "hash", href: "#specialized", label: "專項檢驗" },
  // /education 路由尚不存在，暫時維持一般連結（見 docs/ROADMAP.md 項目 8）
  { kind: "link", link: educationLink },
  { kind: "route", to: "/health", label: "健康 App" },
  { kind: "route", to: "/member", label: "會員登入" },
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
          {navItems.map((item) => {
            if (item.kind === "route") {
              return (
                <Link key={item.to} to={item.to} onClick={close}>
                  {item.label}
                </Link>
              );
            }
            if (item.kind === "link") {
              return (
                <a key={item.link.href} {...linkAttrs(item.link)} onClick={close}>
                  {item.link.label}
                </a>
              );
            }
            return (
              <a key={item.href} href={item.href} onClick={close}>
                {item.label}
              </a>
            );
          })}
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
