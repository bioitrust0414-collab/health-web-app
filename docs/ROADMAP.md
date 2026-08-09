# 範圍與路線圖

這份文件記錄**目前上線範圍**、**刻意凍結的功能**，以及每一項復工前必須先
處理的事。協作者會流動，所以邊界寫在這裡，而不是靠口頭交接。

最後更新：2026-08-09

---

## Phase 1（目前）：形象站 + LINE 預約

目標是驗證「病患真的會用 LINE 預約」，並累積 LINE 好友池——那是後續所有
功能的基礎資產。範圍刻意壓到能 100% 完成的大小。

**範圍內**

- 首頁形象站（健檢、基因檢測、專項檢驗、衛教、預約）
  - 商品區塊（保健食品、寵物零嘴）已完全移除，見「凍結項目 → 商品線導流」
- LINE LIFF 登入 + session token
- 健檢／諮詢預約（`createBooking`）
- 會員專區的預約紀錄查詢
- 健康日誌、提醒管理

**不在範圍內**：見下方「凍結項目」。

---

## 凍結項目

原則：**留 schema，不留可被呼叫的端點。** 資料表保留在
`db/schema_extension.sql` 作為未來的資料模型開口，但沒有任何 server function
能寫入它們。前端隱藏頁面**不算**凍結——TanStack Start 的 server function 編譯
後是獨立的 RPC 端點，不 render 頁面不代表端點關閉。

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

介面草稿見 `docs/lis-prototype/`。

**復工前必修**：

- `/reports`、`/health`、`/tests` 目前顯示的是 `src/lib/health-data.ts` 裡的
  **寫死假資料**（步數 8,420、體重 63.4kg、假檢驗值）。DB 裡的 `reports`
  表存在但沒有接上 UI。在醫療情境下，這些假資料必須在報告功能上線前清除。
- 綁定流程的驗證強度，見下方「已知問題」第 2 項。

---

## 已知問題（尚未修復）

按嚴重度排序。這些都是既有問題，不是本次收斂造成的。

### 1. 🔴 `/member` 可用任意 profileId 讀取他人病歷

`src/routes/member.tsx` 的 `getMemberData` server function 只檢查傳入的
profileId「是不是非空字串」，**沒有驗證 session token**，就回傳該會員的
姓名／電話／生日／地址與全部檢驗報告。

而同檔案的 `useMemberAuth` 只要 URL 同時帶 `profileId` 與 `token` 就視為
已登入，token 從未被驗證。`src/routes/auth.line.callback.tsx` 更是主動把
兩者放進網址（`redirect({ to: "/member", search: { profileId, token } })`），
於是 profileId 會流進瀏覽器歷史、`Referer` 標頭與伺服器 access log。

**修法**：`getMemberData` 改為接收 sessionToken 並呼叫 `verifySessionToken`
取得 profileId；callback 改用 POST 或一次性交換碼，不要把身分放在 query string。

### 2. 🔴 LINE webhook 無簽章驗證，且手機號碼即綁定

`src/lib/lineWebhook.server.ts` 完全沒有驗證 `x-line-signature`，任何人都能
對 `/api/line/webhook` POST 偽造事件。加上綁定邏輯是「傳 10 位數字 → 查
profiles → 直接覆寫 line_user_id」，沒有 OTP、沒有二次驗證、沒有次數限制，
等於任何人輸入他人手機號碼即可接管該病患檔案。

**修法**：① 加 `x-line-signature` HMAC-SHA256 驗證（需要 Messaging API 的
channel secret，目前 `.env.example` 裡還沒有這個變數，需一併補上），使用
常數時間比較；② 綁定改為雙因子（手機 + 生日，對照 `patient_mappings`）或
發送 OTP；③ 加失敗次數限制。

> 註：Phase 1 不提供報告查詢，因此**手機綁定功能本身在目前範圍內並不需要**。
> 最省成本的做法是先移除該分支，只保留 follow 歡迎訊息，等 Phase 2 再連同
> 雙因子一起做對。

### 3. 🟡 server function 的 validator 只做型別轉型

`memberActions.server.ts` 多處寫成 `.validator((data: unknown) => data as XxxInput)`，
這是純 TypeScript 轉型，**執行期零驗證**。`zod` 已經在 dependencies 裡但
全專案零使用。`createBooking` 尤其需要補上，因為 Phase 1 它就是主要入口。

同時建議加基本節流（同一 profile 未完成預約數上限），目前沒有任何防洗機制。

### 4. 🟡 PostgREST filter 字串插值未編碼

`supabaseAdmin.ts` 的呼叫端多處直接把使用者輸入插進查詢字串，例如
`log_date=eq.${data.logDate}`、`id=eq.${data.reminderId}`。應統一
`encodeURIComponent`。

### 5. 🟡 session token 存在 localStorage

7 天 TTL、無撤銷機制，XSS 可直接竊取。另外 `sessionToken.ts` 的簽章比對
（`expected !== signature`）不是常數時間。

### 6. ⚪ MemberCard 顯示假資料

`src/components/MemberCard.tsx` 對所有登入者都顯示「陳小綠」與一組固定的
會員條碼。真實姓名已可從 `profiles` 取得，但會員條碼在 schema 中尚無對應
欄位，需先決定編碼規則。

### 7. ⚪ ProductsSection 文案需法務複查

大華是**醫事檢驗所（醫療機構）**，在醫療機構網域上的商品敘述會被更嚴格
檢視（食安法 §28 禁止食品涉及療效宣稱）。本次已先把「以臨床骨代謝數據為
基準」「精準引導鈣質沉積」等語句改為中性描述，但正式上線前建議由診所
法務／顧問確認一次。

### 8. ⚪ 衛教知識 `/education` 路由不存在

首頁 `EducationSection` 的文章卡片連到 `/education/ep01`、底部按鈕連到
`/education`，但**這兩個路由在本 repo 的任何分支上都不存在**（歷史上有過
`src/routes/education.index.tsx` 與 `education.$slug.tsx`，已被刪除），
點下去都是 404。

內容現況：`src/data/itrust/index.json` 規劃 36 篇，**實際只有 1 篇有內容**
（ep01「礦物質科普：鐵與鈣」，圖片在 `public/content/itrust/episodes/ep01/`）。

待決定：補回路由上線這 1 篇，或先移除首頁入口、等內容累積到一定數量再上。
內容檔案不論哪個選項都應保留。

> 保健食品與寵物零嘴的入口已於本次收斂中完全移除（見下方變更紀錄），
> 因此原本的 `/mal1688`、`/heychew1688` 兩個 404 連結已不存在。

### 9. ⚪ Service worker 快取會延長「舊版殘影」

`public/sw.js` 對 `.css`、圖片、字型採 cache-first，而 `CACHE_NAME` 寫死為
`health-app-shell-v1`，`activate` 只會刪掉「名稱不同」的舊快取 —— 也就是說
除非有人手動改版本號，快取永遠不會失效。

正式環境的資源檔名帶 hash，新版本等於新網址，所以通常不會拿到舊檔；但在
裝過 PWA 的裝置上，這仍會讓部署後的舊畫面比預期更久才消失。曾實際造成
困擾：一次部署延遲期間，站上看到的是已從程式碼移除的功能。

**建議**：把 `CACHE_NAME` 綁到建置版本（例如注入 build id），或改為
stale-while-revalidate。排查時請使用者清除網站資料即可立即恢復。

### 10. ⚪ 全 repo 換行符與 prettier 設定衝突

`npx eslint src` 會報約 8,500 個 `Delete ␍`（CRLF）錯誤，全部是既有問題。
**不要隨手跑 `--fix`**，那會重寫每一個檔案、產生無法 review 的巨大 diff。
建議獨立一個 PR 處理：加 `.gitattributes`（`* text=auto eol=lf`）+ 一次性
重新正規化，並在該 PR 中不做任何其他改動。

---

## 建議的後續順序

1. **修 1 與 2**（病歷外洩路徑，上線前必修）
2. 補 zod 驗證與預約節流（項目 3）
3. README 與環境變數說明、最小 CI（lint + build + 一組預約流程測試）
4. 回填外部連結（項目 8）
5. Phase 2：檢驗報告接真實資料，屆時才需要手機綁定與雙因子
6. Phase 3：有真實回診數據後再談商城與金流
