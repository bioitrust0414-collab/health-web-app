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
 * LINE 官方帳號
 *
 * 會員系統移除後，LINE 官方帳號是本站唯一的雙向溝通管道：訪客加好友後，
 * 預約與諮詢都在 LINE 內由門市人工跟進。換官方帳號時只需改 LINE_OA_ID。
 */
export const LINE_OA_ID = "@932cczax";

/** 加入好友頁 */
export const LINE_OA_ADD_FRIEND_URL = `https://line.me/ti/p/${LINE_OA_ID}`;

/**
 * 開啟與官方帳號的對話框，並把 text 預先填入輸入框。
 *
 * 注意：這只是「把文字帶進訪客的輸入框」，**訪客仍必須自己按傳送**。
 * 因此送出預約表單後畫面上要明確提示這一步，否則訪客會誤以為已經送出。
 */
export function lineOaMessageUrl(text: string): string {
  return `https://line.me/R/oaMessage/${LINE_OA_ID}/?text=${encodeURIComponent(text)}`;
}

/**
 * 衛教內容
 *
 * 站內路由 /health-education。歷史上曾指向不存在的 /education 而長期 404，
 * 已於移除健康 App 時一併修正。
 */
export const educationLink: ExternalLink = {
  label: "衛教知識",
  href: "/health-education",
  isExternal: false,
};

/** 供 <a> 展開用：外部連結自動帶上安全屬性 */
export function linkAttrs(link: ExternalLink) {
  return link.isExternal
    ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: link.href };
}
