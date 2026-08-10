# 大華醫事檢驗所 — 官方形象站

大華醫事檢驗所（Dahua Medical Laboratory）的官方網站。

**目前上線範圍：形象站 + 衛教知識 + 透過 LINE 官方帳號預約諮詢。**

本站**沒有會員系統，也不提供檢驗報告查詢**。會員登入、健康追蹤、報告查詢
（原稱「健康 App」）已整批下線；預約諮詢改為前端把表單內容帶進 LINE 官方
帳號的對話框，由訪客自行送出、門市在 LINE 人工跟進。

因此本站是一個純靜態渲染的網站：**沒有資料庫、沒有登入、不儲存任何個人
資料，也不需要任何環境變數。** 範圍邊界與凍結項目請讀
[`docs/ROADMAP.md`](docs/ROADMAP.md)，那份文件是這個 repo 的權威範圍說明。

## 技術堆疊

| 層 | 使用 |
| --- | --- |
| 框架 | TanStack Start（React 19 + Vite） |
| 樣式 | Tailwind CSS 4 + shadcn/ui |
| 資料 | 無（頁面內容為靜態資料，見 `src/data/`） |
| 溝通管道 | LINE 官方帳號（連結集中在 `src/data/externalLinks.ts`） |
| 部署 | Vercel |
| 套件管理 | bun（`bun.lock`；請勿混入 npm/yarn/pnpm 的 lockfile） |

## 開發

```sh
bun install
bun run dev
```

沒有 bun 也可以用 npm，但**不要提交產生的 `package-lock.json`**（已列入
`.gitignore`）。

| 指令 | 說明 |
| --- | --- |
| `bun run dev` | 本機開發伺服器 |
| `bun run build` | 建置（同時重新產生 `src/routeTree.gen.ts`） |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |

> ⚠️ `bun run lint` 目前會報約 8,500 個 CRLF 換行錯誤，是既有的換行符設定
> 問題，**不要隨手跑 `--fix`**（會重寫整個 repo）。細節見 ROADMAP 項目 10。

## 環境變數

**本站不需要任何環境變數。** 詳見 `.env.example` 的說明 —— 該檔案目前只列出
應該從 Vercel 專案設定中「刪掉」的舊變數。

## 目錄結構

```
src/
  routes/          檔案式路由（見 src/routes/README.md 的命名慣例）
    index.tsx        首頁形象站
    health-education.tsx  衛教知識
  components/
    dahua/         形象站的區塊元件
    ui/            shadcn/ui 元件
  data/
    dahua.ts          健檢套組、基因檢測、比較表等頁面內容
    externalLinks.ts  LINE 官方帳號與站外連結的單一設定來源
db/                Supabase schema（保留作為未來的資料模型開口，目前無程式使用）
docs/
  ROADMAP.md       範圍邊界、凍結項目、已知問題 ← 先讀這份
  lis-prototype/   LIS 檢驗中台串接草稿（未啟用）
```

## 安全須知

本站**不儲存任何個人資料**：沒有資料庫連線、沒有登入、沒有 session，預約
表單的內容只會被帶進訪客自己的 LINE 對話框，不經過伺服器。

先前 ROADMAP 列的兩項病歷外洩路徑（`/member` 可用任意 profileId 讀取他人
病歷、LINE webhook 無簽章驗證且手機號碼即綁定）已隨相關程式碼一併移除。

⚠️ 日後 Phase 2 若恢復檢驗報告查詢，**必須連同雙因子驗證一起設計**，不可
只把舊程式碼還原 —— 舊實作的兩個漏洞都源自「以為前端傳來的身分可信」。

## 與 Lovable 的關係

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

[Lovable 編輯器](https://lovable.dev/projects/83f27cfb-f976-420c-9cfc-1a54fcb7d168)
