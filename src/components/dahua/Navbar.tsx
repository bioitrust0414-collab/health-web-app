import { useState, useEffect } from "react";
import { getStoredSessionToken } from "@/lib/useSessionToken";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const close = () => setOpen(false);

  // 檢查登入狀態
  useEffect(() => {
    setIsLoggedIn(!!getStoredSessionToken());
  }, []);

  const links = [
    { href: "#checkups", label: "健康檢查" },
    { href: "#gene", label: "基因檢測" },
    { href: "#specialized", label: "專項檢驗" },
    { href: "#products", label: "保健產品" },
    { href: "/education", label: "衛教知識" },
    // ❌ mal1688 已移除
    // ❌ 寵物零嘴已移除
    // ✅ 新增：BB 神采速纖飲
    { href: "/bb-drink", label: "BB 神采速纖飲" },
    // ✅ 新增：健康 App
    { href: "/health", label: "健康 App" },
    // ✅ 動態：未登入顯示「會員登入」，已登入顯示「會員中心」
    {
      href: "/member",
      label: isLoggedIn ? "會員中心" : "會員登入",
    },
  ];

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
