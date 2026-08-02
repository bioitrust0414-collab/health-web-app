// src/lib/memberSession.ts
// BROWSER-ONLY. Remembers whether this browser has already completed LINE
// login, so the public site can tell "returning member" apart from
// "first-time visitor" without needing a full auth session. Used by the
// LINE entry points on the public site (SocialFab, BookingSection) to skip
// straight to /member instead of showing the add-friend flow again.

const STORAGE_KEY = "dahua_member_profile_id";
const TOKEN_STORAGE_KEY = "dahua_member_session_token";

export function getStoredProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredProfileId(profileId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, profileId);
}

/** Signed token from sessionToken.ts — required by booking/order/dashboard calls. */
export function getStoredSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}
