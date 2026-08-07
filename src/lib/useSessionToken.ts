import { useCallback } from "react";
import { ensureLiffLogin, getLiffIdToken, isLiffConfigured } from "./liffClient";
import { getStoredSessionToken, setStoredProfileId, setStoredSessionToken } from "./memberSession";
import { verifyLiffLogin, issueDemoToken } from "./memberActions.server";

// 新增這行：重新導出 getStoredSessionToken
export { getStoredSessionToken } from "./memberSession";

export function useSessionToken() {
  const getSessionToken = useCallback(async (): Promise<string> => {
    const existing = getStoredSessionToken();
    if (existing) return existing;

    if (isLiffConfigured()) {
      await ensureLiffLogin();
      const idToken = getLiffIdToken();
      const result = await verifyLiffLogin({ data: idToken });
      if (result.needsVerification) {
        throw new Error("請先到會員中心完成健檢會員身分驗證（姓名／生日／手機末 4 碼）。");
      }
      setStoredProfileId(result.profileId);
      setStoredSessionToken(result.token);
      return result.token;
    }


    const token = await issueDemoToken();
    setStoredSessionToken(token);
    return token;
  }, []);

  return { getSessionToken };
}
