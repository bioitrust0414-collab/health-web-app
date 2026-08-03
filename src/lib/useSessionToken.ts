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
      const { profileId, token } = await verifyLiffLogin({ data: idToken });
      setStoredProfileId(profileId);
      setStoredSessionToken(token);
      return token;
    }

    const token = await issueDemoToken();
    setStoredSessionToken(token);
    return token;
  }, []);

  return { getSessionToken };
}
