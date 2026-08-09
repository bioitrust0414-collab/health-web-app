# LIS 檢驗中台串接原型（未啟用）

這三個檔案原本放在 `api/`、`services/`、`mock-lis/`，但**從未被應用程式引用過**
——全 repo 找不到任何 import。它們是「Vercel API 中台 → 診所 LIS」這條線的
介面草稿，寫了但沒接上。

放在這裡是為了**保留介面設計，同時讓它們離開可執行的程式碼樹**。等 Phase 2
真的要接檢驗報告時，這是現成的起點。

| 檔案 | 原路徑 | 用途 |
| --- | --- | --- |
| `verify-patient.cjs` | `api/verify-patient.cjs` | 中台端點：以 phone + dob 向 LIS 查驗病患身分 |
| `mappingService.cjs` | `services/mappingService.cjs` | profiles ↔ LIS 病歷號的對應邏輯 |
| `mock-lis-server.cjs` | `mock-lis/server.cjs` | 本機模擬 LIS 伺服器，供流程驗證用 |

## 復工前必須先確認

1. **傳輸通道**：正式 LIS 在診所內網，需確認是 VPN、專線還是加密通道。
   目前 `verify-patient.cjs` 預設打 `http://localhost:4001`，是明文 HTTP。
2. **身分驗證強度**：`phone + dob` 這組條件的唯一性不足以當作病歷存取的
   唯一憑據。綁定流程需要額外的驗證因子（見 `docs/ROADMAP.md` 的
   「LINE 手機綁定」項目）。
3. **稽核軌跡**：病歷存取需要留存誰、何時、看了哪一份報告。
