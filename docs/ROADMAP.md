# 範圍與路線圖

這份文件記錄**目前上線範圍**、**刻意凍結的功能**，以及每一項復工前必須先
處理的事。協作者會流動，所以邊界寫在這裡，而不是靠口頭交接。

最後更新：2026-08-10

---

## Phase 1（目前）：純形象站 + LINE 預約

目標是驗證「病患真的會用 LINE 預約」，並累積 LINE 好友池——那是後續所有
功能的基礎資產。範圍刻意壓到能 100% 完成的大小。

2026-08-10 再次收斂：**會員系統與健康 App 整批下線。** 決策理由見下方
「凍結項目 → 會員系統與健康 App」。

**範圍內**

- 首頁形象站（健檢、基因檢測、專項檢驗、衛教、預約）
  - 商品區塊（保健食品、寵物零嘴）已完全移除，見「凍結項目 → 商品線導流」
- 衛教知識頁 `/health-education`
- 預約諮詢：表單內容組成訊息 → 帶進 LINE 官方帳號對話框 → 訪客自行送出
  → 門市在 LINE 人工跟進。**免登入、不寫資料庫、不儲存個資。**

**不在範圍內**：見下方「凍結項目」。

> ⚠️ 預約表單只是把文字帶進訪客的 LINE 輸入框，**訪客仍須自己按傳送**。
> 送出後的成功畫面必須明確提示這一步，否則會有人以為已經預約成功。改動
> `BookingSection.tsx` 時請保留該提示。

---

## 凍結項目

原則：**留 schema，不留可被呼叫的端點。** 資料表保留在
`db/schema_extension.sql` 作為未來的資料模型開口，但沒有任何 server function
能寫入它們。前端隱藏頁面**不算**凍結——TanStack Start 的 server function 編譯
後是獨立的 RPC 端點，不 render 頁面不代表端點關閉。

### 會員系統與健康 App（2026-08-10 下線）

移除的路由：`/member`、`/reports`、`/tests`、`/daily-log`、`/reminders`、
`/health`、`/auth/line/callback`
移除的伺服器端邏輯：LINE LIFF 登入、session token、Supabase 讀寫、
`/api/line/webhook`（含手機號碼綁定）

**理由**：報告查詢是這整套系統存在的唯一理由，而它當時顯示的是寫死的假
資料（見原「已知問題」第 1、6 項）。真資料尚未接上，卻已經為它扛著兩條
病歷外洩路徑與一整套登入基礎建設。既然 Phase 1 不做報告查詢，這些程式碼
就是純負債。

**附帶效果**：本站現在不讀取任何環境變數、不連資料庫、不儲存個資。原「已知
問題」第 1、2、3、4、5、6 項全數隨程式碼消失。

**復工前必修**（Phase 2 恢復報告查詢時）：

- **不要直接還原舊程式碼。** 舊實作的兩個漏洞同源於「以為前端傳來的身分
  可信」：`getMemberData` 只檢查 profileId 是不是非空字串就回傳全部病歷；
  webhook 不驗簽章、收到 10 位數字就覆寫 `line_user_id`。重做時身分一律
  從伺服器端驗證過的 session 取得，綁定一律雙因子。
- 身分不可放在 query string（會流進瀏覽器歷史、Referer 與 access log）。
- server function 的 `validator` 必須真的驗證。`zod` 在 dependencies 裡，
  舊程式碼全專案零使用，只寫了 `data as XxxInput` 這種執行期無效的轉型。

### 商城 / 訂單 / 金流

保留的表：`products`、`orders`、`order_items`

**復工前必修**：

- `createOrder` 原本直接採信前端送來的 `unitPrice`，可一元下單。復工時
  伺服器只能接受 `productId` + `quantity`，價格一律從 `products` 表重查。
- 金流、物流、電子發票、七天鑑賞期、食品標示都不是寫程式的問題，是營運
  合規的問題。建議直接用現成電商 SaaS，不要自建。

### 點數 / 集點卡

保留的表：`member_points`、`stamp_cards`、`member_points_balance`（view）

**復工前必修**：

- 點數必須先有「出口」（可折抵、可兌換）才能開始「入口」。只進不出會累積
  成無法兌換的負債與客訴。
- `member_points_balance` 是 view，PostgreSQL 的 view 預設
  `security_invoker = off`，會**繞過底層表的 RLS**。若 Supabase 預設把
  SELECT 權限 grant 給 `anon`，任何人都能讀到全部會員的點數餘額。復工前
  必須實測確認，或改為 `security_invoker = on`。

### 商品線導流（保健食品 / 寵物零嘴）

首頁的「健康保健產品」區塊（`ProductsSection`）與導覽列的「保健產品」
「專業複合鈣」「寵物零嘴」三個入口已**完全移除**。MAL 好家庭 / bio+id
與 Paludo & Mila 兩條商品線改為完全獨立經營，不從本站導流。

**理由**：大華是醫事檢驗所（醫療機構）。在醫療機構網域上推薦食品商品，
即使只是連結導出，商品敘述仍出現在醫療機構的頁面上，是法規上最敏感的
組合（食安法 §28 禁止食品涉及療效宣稱，醫療機構為商品背書另有界線）。

**若日後要恢復導流**：設定加回 `src/data/externalLinks.ts`，不要把網址
散落在元件裡。恢復前建議先請診所法務／顧問確認呈現方式與文案。

### 檢驗報告串接（LIS）

介面草稿見 `docs/lis-prototype/`（未啟用）。

原本顯示假資料的 `/reports`、`/health`、`/tests` 與 `src/lib/health-data.ts`
已於 2026-08-10 整批刪除，假資料問題隨之消失。DB 裡的 `reports` 表保留。

**復工前必修**：見上方「會員系統與健康 App」的復工條件 —— 報告查詢不可能
脫離身分驗證單獨上線，兩者必須一起重做。

---

## 已修復／已消失的問題（2026-08-10）

原第 1～6 項全部隨會員系統與健康 App 的移除而消失 —— **是程式碼不存在了，
不是漏洞被修好了**。這個區別很重要：Phase 2 若把功能加回來，同樣的錯誤會
原地重現，除非照「凍結項目 → 會員系統與健康 App」列的復工條件重做。

| 原編號 | 問題 | 消失原因 |
| --- | --- | --- |
| 1 🔴 | `/member` 可用任意 profileId 讀取他人病歷 | `member.tsx`、`auth.line.callback.tsx` 已刪除 |
| 2 🔴 | LINE webhook 無簽章驗證，手機號碼即綁定 | `lineWebhook.server.ts` 與 `/api/line/webhook` 路由已刪除 |
| 3 🟡 | server function 的 validator 只做型別轉型 | `memberActions.server.ts` 已刪除，全站已無 server function |
| 4 🟡 | PostgREST filter 字串插值未編碼 | `supabaseAdmin.ts` 已刪除，全站已無資料庫連線 |
| 5 🟡 | session token 存在 localStorage | 已無登入，`sessionToken.ts`／`memberSession.ts` 已刪除 |
| 6 ⚪ | MemberCard 顯示假資料 | `MemberCard.tsx` 已刪除 |

---

## 已知問題（尚未修復）

編號沿用原本的，不重新編號，以免舊 commit 與 PR 裡的交叉引用失效。

### 7. ⚪ ProductsSection 文案需法務複查

大華是**醫事檢驗所（醫療機構）**，在醫療機構網域上的商品敘述會被更嚴格
檢視（食安法 §28 禁止食品涉及療效宣稱）。本次已先把「以臨床骨代謝數據為
基準」「精準引導鈣質沉積」等語句改為中性描述，但正式上線前建議由診所
法務／顧問確認一次。

### 8. ✅ 衛教知識 `/education` 路由不存在（2026-08-10 已修）

首頁 `EducationSection` 的卡片與「瀏覽全部」按鈕原本連到不存在的
`/education`，長期 404。現已一律改為 `<Link to="/health-education">`，
`externalLinks.ts` 的 `educationLink` 也同步更正。

**剩餘待決定**：`src/data/itrust/index.json` 規劃 36 篇，**實際只有 1 篇有
內容**（ep01「礦物質科普：鐵與鈣」，圖片在
`public/content/itrust/episodes/ep01/`）。目前所有卡片都導向同一個列表頁，
尚無單篇文章頁。內容累積後再決定要不要做 `/health-education/$slug`。

另有一份 `src/pages/HealthEducation.tsx`（無人引用的死檔），內容比正式路由
多 2 篇（`gut-health`、`sleep-quality`）。刪除前應先把這 2 篇併回
`src/routes/health-education.tsx`，否則會丟內容。

> 保健食品與寵物零嘴的入口已於先前收斂中完全移除，因此原本的
> `/mal1688`、`/heychew1688` 兩個 404 連結已不存在。

### 9. 🟡 Service worker 快取會延長「舊版殘影」

`public/sw.js` 對 `.css`、圖片、字型採 cache-first，而 `CACHE_NAME` 是寫死的
字串，`activate` 只會刪掉「名稱不同」的舊快取 —— 除非有人手動改版本號，
快取永遠不會失效。曾實際造成困擾：一次部署延遲期間，站上看到的是已從
程式碼移除的功能。

2026-08-10 移除會員系統時已手動遞增為 `dahua-site-shell-v2`，並在檔案開頭
加上「改動站上結構時務必遞增版本號」的提醒。同時移除了針對 `/api` 與
`/_serverFn` 的 network-first 分支 —— 全站已無 server function，該分支是
死碼。

**根本解仍未做**：把 `CACHE_NAME` 綁到建置版本（例如注入 build id），或改為
stale-while-revalidate。在那之前，每次移除頁面都得記得手動改版本號。排查時
請使用者清除網站資料即可立即恢復。

### 10. ⚪ 全 repo 換行符與 prettier 設定衝突

`npx eslint src` 會報約 8,500 個 `Delete ␍`（CRLF）錯誤，全部是既有問題。
**不要隨手跑 `--fix`**，那會重寫每一個檔案、產生無法 review 的巨大 diff。
建議獨立一個 PR 處理：加 `.gitattributes`（`* text=auto eol=lf`）+ 一次性
重新正規化，並在該 PR 中不做任何其他改動。

---

## 建議的後續順序

1. **最小 CI**（`tsc --noEmit` + `vite build`）。本 repo 無 CI、無測試，
   2026-08-10 曾發生「檔案被寫到一半」的 commit 一路推上 `main` 導致無法
   建置，沒有任何機制擋下來。這是目前投報率最高的一項。
2. 移除已無人使用的相依套件：`@supabase/supabase-js`、`@line/liff`、
   `express`（僅 `docs/lis-prototype/` 使用）、`@tanstack/react-query`
   （僅剩 `__root.tsx` 的 provider 空殼）。**需要 bun 才能同步更新
   `bun.lock`**，不要只改 `package.json`。
3. 把 `src/pages/HealthEducation.tsx` 多出的 2 篇內容併回正式路由後刪除
   該死檔（項目 8）。
4. 刪除 Vercel 專案上已失效的環境變數（見 `.env.example`）。
5. 換行符正規化（項目 10），獨立一個 PR，不夾帶其他改動。
6. Phase 2：檢驗報告接真實資料 —— **必須連同身分驗證與雙因子一起重新設計**，
   不可還原舊程式碼（見「凍結項目 → 會員系統與健康 App」）。
7. Phase 3：有真實回診數據後再談商城與金流。
