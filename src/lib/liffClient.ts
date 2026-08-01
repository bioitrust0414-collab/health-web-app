// src/lib/liffClient.ts
// BROWSER-ONLY. LIFF (LINE Front-end Framework) runs inside LINE's in-app
// browser (and also works in a regular browser for testing). This wraps
// the @line/liff SDK so the rest of the app doesn't touch `liff` directly.
//
// Requires VITE_LIFF_ID to be set once the LIFF app is created in the
// LINE Developers Console (see /areas note: waiting on official-account
// access to be coordinated before that ID exists). Until then, isLiffConfigured()
// returns false and callers should fall back to the existing demo flow.

import liff from "@line/liff";

let initPromise: Promise<void> | null = null;

export function isLiffConfigured(): boolean {
  return Boolean(import.meta.env["VITE_LIFF_ID"]);
}

export async function initLiff(): Promise<void> {
  if (!isLiffConfigured()) {
    throw new Error("VITE_LIFF_ID not set — LIFF app hasn't been created yet.");
  }
  if (!initPromise) {
    initPromise = liff.init({ liffId: import.meta.env["VITE_LIFF_ID"] });
  }
  return initPromise;
}

/**
 * Ensures the user is logged in via LINE Login (redirects to LINE if not,
 * which means this function may never resolve on first call — the page
 * reloads after redirect back with a logged-in session).
 */
export async function ensureLiffLogin(): Promise<void> {
  await initLiff();
  if (!liff.isLoggedIn()) {
    liff.login();
    // liff.login() redirects the browser; execution stops here on first visit.
    return new Promise(() => {});
  }
}

/**
 * The ID token is a JWT signed by LINE. We send it to the server, which
 * verifies it against LINE's own verification endpoint — the client is
 * never trusted to just hand over a LINE user id directly.
 */
export function getLiffIdToken(): string {
  const token = liff.getIDToken();
  if (!token) throw new Error("No LIFF ID token available — not logged in?");
  return token;
}

export function isInLineApp(): boolean {
  return isLiffConfigured() && liff.isInClient();
}
