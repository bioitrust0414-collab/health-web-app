import { useState } from "react";
import { Link } from "@tanstack/react-router";

// 導覽項目分兩種，因為它們的導航方式不同：
//
//  - hash   同頁錨點，用原生 <a>
//  - route  站內路由，必須用 TanStack 的 <Link>，不能用 <a href="/xxx">
//
// 為什麼站內路由要用 <Link> 而不是 <a href="/health-education">：
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
//
// 「健康 App」與「會員登入」兩個入口已隨會員系統一併移除：本站不再提供
// 檢驗報告查詢與健康追蹤，預約諮詢改由 LINE 官方帳號承接。
type NavItem =
  | { kind: "hash"; href: string; label: string }
  | { kind: "route"; to: "/health-education"; label: string };

const navItems: NavItem[] = [
  { kind: "hash", href: "#checkups", label: "健康檢查" },
  { kind: "hash", href: "#gene", label: "基因檢測" },
  { kind: "hash", href: "#specialized", label: "專項檢驗" },
  { kind: "route", to: "/health-education", label: "衛教知識" },
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
