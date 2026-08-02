// src/lib/useSessionToken.ts
// BROWSER-ONLY. Any component that needs to write on a member's behalf
// (booking, checkout, ...) calls getSessionToken() first. It returns the
// already-stored token if there is one, otherwise transparently logs the
// visitor in (via LIFF if configured, or the demo profile otherwise) and
// stores the token it gets back.

import { useCallback } from "react";
import { ensureLiffLogin, getLiffIdToken, isLiffConfigured } from "./liffClient";
import { getStoredSessionToken, setStoredProfileId, setStoredSessionToken } from "./memberSession";
import { verifyLiffLogin, issueDemoToken } from "./memberActions.server";

export function useSessionToken() {
  const getSessionToken = useCallback(async (): Promise<string> => {
    const existing = getStoredSessionToken();
    if (existing) return existing;

    if (isLiffConfigured()) {
      await ensureLiffLogin(); // may redirect to LINE and never resolve on first visit
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
