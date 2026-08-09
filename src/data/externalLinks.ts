// src/data/externalLinks.ts
// 站外導流連結的單一設定來源。
//
// 把網址集中在這裡，是為了讓「換平台、換網域、換活動頁」時只需要改一個
// 檔案，不必翻遍元件。
//
// 保健食品（MAL 好家庭 / bio+id）與寵物零嘴（Paludo & Mila）的入口已完全
// 自本站移除 —— 大華是醫事檢驗所（醫療機構），在醫療機構網域上推薦食品
// 商品的法規風險偏高，兩條商品線改為完全獨立經營，不從本站導流。
// 若日後決定恢復導流，設定請加回這裡，不要散落在元件中。

export interface ExternalLink {
  /** 導航與按鈕上顯示的文字 */
  label: string;
  /** 目標網址。外部平台請填完整 https 網址 */
  href: string;
  /** true 時會加上 target="_blank" 與 rel="noopener noreferrer" */
  isExternal: boolean;
}

/**
 * 衛教內容
 *
 * ⚠️ /education 路由目前不存在（歷史上曾有 src/routes/education.*.tsx，
 * 已被刪除），首頁 EducationSection 的卡片與「瀏覽全部」按鈕都會 404。
 * 待決定：補回路由上線現有的 1 篇內容，或先移除入口。見 docs/ROADMAP.md。
 */
export const educationLink: ExternalLink = {
  label: "衛教知識",
  href: "/education", // TODO: 補回 /education 路由，或改為外部內容站
  isExternal: false,
};

/** 供 <a> 展開用：外部連結自動帶上安全屬性 */
export function linkAttrs(link: ExternalLink) {
  return link.isExternal
    ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: link.href };
}
