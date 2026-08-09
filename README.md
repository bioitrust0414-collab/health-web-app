# 大華醫事檢驗所 — Web + LIFF 會員站

大華醫事檢驗所（Dahua Medical Laboratory）的官方網站與 LINE LIFF 會員應用。

**目前上線範圍：形象站 + LINE 登入 + 健檢預約。**
商城、點數、集點卡與檢驗報告串接為刻意凍結的項目 —— 範圍邊界與復工條件
請先讀 [`docs/ROADMAP.md`](docs/ROADMAP.md)，那份文件是這個 repo 的權威範圍說明。

## 技術堆疊

| 層 | 使用 |
| --- | --- |
| 框架 | TanStack Start（React 19 + Vite） |
| 樣式 | Tailwind CSS 4 + shadcn/ui |
| 資料 | Supabase（PostgREST，經 `src/lib/supabaseAdmin.ts` 以 REST 直呼） |
| 登入 | LINE LIFF / LINE Login |
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
> 問題，**不要隨手跑 `--fix`**（會重寫整個 repo）。細節見 ROADMAP 項目 9。

## 環境變數

複製 `.env.example` 為 `.env` 並填入。所有變數的用途都寫在該檔案的註解中。
`SUPABASE_SERVICE_ROLE_KEY` 會繞過 RLS，**只能存在於伺服器端**，絕不可加上
`VITE_` 前綴。

## 目錄結構

```
src/
  routes/          檔案式路由（見 src/routes/README.md 的命名慣例）
  components/
    dahua/         公開形象站的區塊元件
    ui/            shadcn/ui 元件
  lib/
    *.server.ts    伺服器端專用，含 Supabase 與 LINE 整合
  data/
    externalLinks.ts  站外導流連結的單一設定來源
db/                Supabase schema
docs/
  ROADMAP.md       範圍邊界、凍結項目、已知問題 ← 先讀這份
  lis-prototype/   LIS 檢驗中台串接草稿（未啟用）
```

## 安全須知

`docs/ROADMAP.md` 的「已知問題」列有兩項**尚未修復的病歷外洩路徑**（項目 1
與 2）。在那兩項修復之前，不應將本站以正式病歷查詢用途對外開放。

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
