# 大華醫事檢驗所官方形象站

大華醫事檢驗所（Dahua Medical Laboratory）的官方網站，提供健康檢查、基因檢測、專項檢驗、衛教資訊與預約諮詢入口。

[線上網站](https://healthapp.veridiangold.com/) · [產品範圍與 Roadmap](docs/ROADMAP.md) · [GitHub Actions CI](.github/workflows/ci.yml)

> **目前產品定位**：本專案是 Phase 1 的形象站，不是會員健康 App。網站目前不提供會員登入、檢驗報告查詢、健康追蹤、商城、訂單、點數或集點功能。

## 目前上線範圍

| 功能 | 路徑／入口 | 現況 |
| --- | --- | --- |
| 官方首頁 | `/` | 形象站首頁，包含健康檢查、基因檢測、專項檢驗、比較資訊、衛教入口與聯絡／預約區塊。 |
| 衛教知識 | [`/health-education`](src/routes/health-education.tsx) | 目前提供六個主題卡片與分類篩選；內容以程式碼中的靜態資料呈現。 |
| 預約諮詢 | 首頁 `#booking` 區塊 | 表單內容會在瀏覽器端組成訊息並帶入 LINE 官方帳號對話框，由訪客自行按下傳送，再由門市人工跟進。 |
| 聯絡方式 | 首頁聯絡區塊 | 提供 LINE 官方帳號、電話 `04-7616801` 與地址「彰化市崙平南路 532 號」等入口。 |

下列功能刻意不在目前範圍內：會員登入與 session、檢驗報告查詢、健康追蹤與每日紀錄、提醒、LINE 登入／Webhook、商城與金流、點數／集點，以及任何需要儲存個人資料的後端流程。完整的凍結項目、復工條件與決策背景，請以 [`docs/ROADMAP.md`](docs/ROADMAP.md) 為準。

### 預約流程

預約流程是「填寫表單 → 開啟 LINE 官方帳號對話框 → 訪客確認內容並按下傳送 → 門市在 LINE 人工跟進」。網站只負責在瀏覽器中產生 LINE 訊息連結；**開啟對話框不等於完成預約，訪客仍然必須在 LINE 中按下傳送**。

## 技術架構

| 層級 | 技術／實作 | 說明 |
| --- | --- | --- |
| UI 框架 | React 19 | 元件化的首頁區塊、表單與衛教列表。 |
| 全端框架 | TanStack Start | 透過 Vite 建置，使用檔案式路由與 SSR／部署所需的 server entry；目前沒有業務 API 或資料庫讀寫。 |
| 路由 | TanStack Router | 路由檔位於 `src/routes/`，`src/routeTree.gen.ts` 是由建置流程產生並納入版本控制的檔案。 |
| 樣式 | Tailwind CSS 4、shadcn/ui、Radix UI | 共用 UI 元件在 `src/components/ui/`；大華形象站專用樣式在 `src/styles/dahua.css`。 |
| 狀態／資料請求 | React Query provider | 根佈局保留 QueryClient provider，但目前產品範圍沒有遠端資料查詢。 |
| 內容資料 | TypeScript 靜態資料 | 首頁資料主要在 `src/data/dahua.ts`；LINE 與站外連結集中於 `src/data/externalLinks.ts`；衛教列表目前定義於 `src/routes/health-education.tsx`。 |
| PWA | Web App Manifest、Service Worker | `public/manifest.json` 與 `public/sw.js` 已保留；Service Worker 目前採靜態資產 cache-first 策略。 |
| 部署 | Vercel | `bun run build` 產生可供 Vercel 使用的建置輸出。 |
| 套件管理 | Bun | [`bun.lock`](bun.lock) 是唯一應維護的 lockfile；請勿提交 npm、Yarn 或 pnpm lockfile。 |

## 本機開發

### 需求

請準備 Git 與 [Bun](https://bun.sh/)。專案的 CI 使用 Bun 並以 `bun.lock` 鎖定依賴版本；本機若暫時沒有 Bun，可以使用 npm 進行開發，但不要把產生的 `package-lock.json` 提交到儲存庫。

### 安裝與啟動

```sh
bun install --frozen-lockfile
bun run dev
```

Vite 開發伺服器啟動後，依終端機顯示的網址開啟網站。若要使用 npm，請以等價的 npm 指令完成本機安裝與啟動，但合併前仍應以 Bun 流程驗證，確保 `bun.lock` 與 `package.json` 同步。

### 常用指令

| 指令 | 用途 |
| --- | --- |
| `bun run dev` | 啟動 Vite 開發伺服器。 |
| `bun run build` | 執行正式建置，並重新產生 `src/routeTree.gen.ts`。 |
| `bun run preview` | 預覽建置結果。 |
| `bunx tsc --noEmit` | 執行 TypeScript 型別檢查。 |
| `bun run lint` | 執行 ESLint；目前會受到既有 CRLF 換行問題影響，見下方說明。 |
| `bun run format` | 使用 Prettier 改寫檔案；請避免在未確認 diff 的情況下對整個 repo 執行。 |

### CI 驗證

GitHub Actions 會在推送至 `main` 或建立／更新 Pull Request 時執行 [`ci.yml`](.github/workflows/ci.yml)。目前的必要檢查是：以 `bun install --frozen-lockfile` 安裝依賴、執行 `bunx tsc --noEmit`、執行 `bun run build`，以及確認建置後的 `src/routeTree.gen.ts` 沒有未提交的變化。

CI **暫時沒有納入 lint**。全 repo 仍有既有的 CRLF／Prettier 換行設定衝突，執行 lint 會產生大量 `Delete ␍` 錯誤；在專門處理換行符的獨立變更完成前，請不要直接執行 `--fix`，以免把整個 repo 重寫成難以審查的巨大 diff。相關背景見 [`docs/ROADMAP.md` 的已知問題 10](docs/ROADMAP.md)。

## 環境變數與部署

目前網站不需要任何環境變數，也沒有資料庫連線、登入 session 或伺服器端個資儲存。部署前若 Vercel 專案仍保留過往會員／LIS 功能的變數，建議依 [`.env.example`](.env.example) 清除，避免誤以為它們仍然生效。

| 已淘汰的變數類型 | 代表變數 |
| --- | --- |
| Supabase | `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY` |
| LINE 登入／LIFF | `VITE_LIFF_ID`、`LINE_LOGIN_CHANNEL_ID`、`LINE_LOGIN_CHANNEL_SECRET`、`LINE_CHANNEL_ACCESS_TOKEN` |
| LIS 與部署舊設定 | `LIS_ENDPOINT`、`MOCK_LIS_PORT`、`PUBLIC_SITE_URL`、`SESSION_TOKEN_SECRET` |

若日後恢復檢驗報告查詢或其他需要後端的功能，必須重新設計身分驗證、授權、資料最小化與個資保存政策，不應直接還原歷史程式碼。具體安全條件請先閱讀 Roadmap 的「會員系統與健康 App」章節。

## 目錄結構

```text
.github/workflows/
  ci.yml                         GitHub Actions：型別檢查、建置與 route tree 同步檢查

src/
  routes/
    __root.tsx                   根佈局、全域 metadata、QueryClient 與 Service Worker 註冊
    index.tsx                    首頁形象站
    health-education.tsx         衛教列表與分類篩選
    README.md                    路由命名與維護慣例
  components/
    dahua/                       大華形象站的首頁、預約與聯絡區塊
    ui/                          shadcn/ui／Radix UI 共用元件
  data/
    dahua.ts                    健檢套組、基因檢測、專項檢驗與比較資料
    externalLinks.ts            LINE 官方帳號與站內／站外連結的單一設定來源
    itrust/                     衛教內容索引與相關媒體資產
  lib/                           共用工具與錯誤處理
  routeTree.gen.ts               TanStack Router 產生檔，建置後需保持同步
  router.tsx                     Router 與 QueryClient 建立處
  server.ts、start.ts            TanStack Start／Nitro 的執行入口
  styles/                        全域與大華形象站樣式

db/
  schema.sql、schema_extension.sql  歷史／未來資料模型；目前沒有程式碼連線或寫入

docs/
  ROADMAP.md                    目前產品範圍、凍結項目、已知問題與後續順序
  lis-prototype/                未啟用的 LIS 串接草稿

public/
  manifest.json                 PWA manifest
  sw.js                         Service Worker
  content/                      衛教媒體與其他靜態資產
```

## 隱私與安全邊界

網站不建立會員帳號、不使用登入 session、不連線 Supabase，也不把預約表單送到本站伺服器。姓名、電話、諮詢套組與備註只會在瀏覽器端組成 LINE 訊息並帶入訪客自己的 LINE 對話框；訪客必須自行確認並傳送，之後由門市在 LINE 中人工處理。

這個設計也代表本站不提供預約紀錄的自動彙整、後台報表或伺服器端追蹤。`db/` 中保留的 schema 只是未來資料模型的開口，**不代表目前已有可呼叫的資料庫端點**。

若日後重新開發會員或報告查詢，請勿相信前端傳入的 `profileId`、手機號碼或其他身分欄位；身分應由伺服器端驗證過的 session 取得，敏感流程需搭配適當的多因素驗證，且不得把身分識別資訊放在 query string。這些要求是復工的前置條件，而不是可選的加強項目。

## 目前已知落差與後續注意事項

| 項目 | 現況與影響 | 建議處理方式 |
| --- | --- | --- |
| 衛教詳細頁 | 衛教列表中的六個「閱讀完整內容」連結會指向 `/health-topics/:id`，但目前正式路由只有 `/` 與 `/health-education`，單篇文章頁尚未實作。 | 實作單篇文章路由與內容來源後，再開放詳細頁連結；在此之前不要把卡片宣傳成已具備完整文章頁。 |
| 舊版 PWA／SEO metadata | `src/routes/__root.tsx` 與 `public/manifest.json` 仍有「會員專區、報告、商城、點數、LINE 登入」及 `/health` 等歷史設定，與目前 Phase 1 範圍不一致。 | 另開小型修正更新 title、description、manifest 的 `start_url` 與描述，並重新檢查安裝與分享預覽。 |
| Service Worker 快取 | `public/sw.js` 的 cache name 是手動版本字串；網站結構變動時若不遞增，使用者可能看到舊版資產。 | 每次移除頁面或調整站上結構時更新 cache version；長期再改為由建置版本注入或採 stale-while-revalidate。 |
| 舊相依套件 | `@supabase/supabase-js`、`@line/liff`、`express` 等相依套件仍列在 `package.json`，但目前產品流程已不使用相關功能。 | 依 Roadmap 逐項確認引用後移除，並同步更新 `bun.lock`；不要只修改 `package.json`。 |
| lint 換行問題 | 目前 repo 的 CRLF／Prettier 設定衝突會造成大量 lint 錯誤。 | 以獨立變更處理 `.gitattributes` 與換行正規化，避免和功能修改混在一起。 |

## 維護規則

本專案與 [Lovable](https://lovable.dev) 連動。請保持 `main` 隨時可建置，不要對已推送的歷史執行 force push、rebase、amend 或 squash，以免改寫 Lovable 端的專案歷史。新增或刪除路由後，請執行 `bun run build` 並提交更新後的 `src/routeTree.gen.ts`；修改依賴時必須一併更新 `bun.lock`。

在進行任何會員、報告查詢、金流或個資流程之前，請先閱讀 [`docs/ROADMAP.md`](docs/ROADMAP.md)，確認工作不會越過目前 Phase 1 的產品邊界。

## 相關文件

| 文件 | 用途 |
| --- | --- |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | 權威的產品範圍、凍結項目、安全復工條件與後續順序。 |
| [`.env.example`](.env.example) | 目前不需要環境變數，以及舊部署變數的清理清單。 |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | CI 觸發條件與必要驗證。 |
| [`src/routes/README.md`](src/routes/README.md) | 路由檔案命名與維護慣例。 |
| [`AGENTS.md`](AGENTS.md) | 儲存庫協作者與自動化工具的工作規範。 |

## 授權

儲存庫目前未提供 `LICENSE` 檔案。如需將程式碼、內容或視覺資產散布到專案外，請先向專案擁有者確認授權範圍。
