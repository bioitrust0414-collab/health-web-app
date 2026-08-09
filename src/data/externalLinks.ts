// src/data/externalLinks.ts
// 站外導流連結的單一設定來源。
//
// 大華站（醫事檢驗所）本身不販售商品：保健食品與寵物零嘴改由獨立的購物
// 平台承接，本站只負責導流。把網址集中在這裡，是為了讓「商品線換平台、
// 換網域、換活動頁」時只需要改一個檔案，不必翻遍元件。
//
// ⚠️ 待補：以下三個目標目前都還沒有實際落點（在本 repo 的任何分支上都
// 找不到對應的路由或靜態檔案，線上站點會回 404）。歷史上曾存在
// src/routes/mal1688.tsx 與 src/routes/education.*.tsx，但已不在任何
// 分支中。請確認各條產品線的最終網址後回填：
//
//   - 若改為外部購物平台 → 填完整網址（https://...），isExternal 設 true
//   - 若仍留在本站 → 填絕對路徑（/xxx），isExternal 設 false，並補回對應路由
//
// 詳見 docs/ROADMAP.md。

export interface ExternalLink {
  /** 導航與按鈕上顯示的文字 */
  label: string;
  /** 目標網址。外部平台請填完整 https 網址 */
  href: string;
  /** true 時會加上 target="_blank" 與 rel="noopener noreferrer" */
  isExternal: boolean;
}

/** 保健食品線（MAL 好家庭 / bio+id） */
export const supplementsLink: ExternalLink = {
  label: "專業複合鈣",
  href: "/mal1688", // TODO: 換成購物平台網址
  isExternal: false,
};

/** 寵物零嘴線（Paludo & Mila） */
export const petTreatsLink: ExternalLink = {
  label: "寵物零嘴",
  // 原本寫成相對路徑 "heychew1688/index.html"，在子路徑底下會解析錯誤，
  // 這裡統一為絕對路徑。
  href: "/heychew1688/index.html", // TODO: 換成購物平台網址
  isExternal: false,
};

/** 衛教內容 */
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
