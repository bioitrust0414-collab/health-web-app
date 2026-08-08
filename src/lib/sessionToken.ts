// src/lib/sessionToken.ts
// SERVER-ONLY. Issues and verifies short-lived signed session tokens.
//
// Why this exists: bookings/orders/points are written with the Supabase
// service role (see supabaseAdmin.ts), which bypasses RLS entirely. That
// means whatever profileId a Server Function is handed gets trusted
// completely — so we can't let the browser just pass a bare profileId
// string (anyone could guess/copy someone else's and act as them). This
// token is signed by the server at login time (LIFF verify or the web
// LINE Login callback) and re-checked on every booking/order/dashboard
// call, so a caller can only act as the profileId they actually logged
// in as.
//
// Token shape: `<profileId>.<expiresAtMs>.<hex hmac signature>`

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env["SESSION_TOKEN_SECRET"];
  if (!secret) {
    throw new Error("SESSION_TOKEN_SECRET not set in the server environment.");
  }
  return secret;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function issueSessionToken(profileId: string): Promise<string> {
  const secret = getSecret();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${profileId}.${expiresAt}`;
  const signature = await hmacHex(secret, payload);
  return `${payload}.${signature}`;
}

/** Verifies signature + expiry and returns the profileId, or throws. */
export async function verifySessionToken(token: string): Promise<string> {
  const secret = getSecret();
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed session token.");

  const [profileId, expiresAtStr, signature] = parts as [string, string, string];
  const expiresAt = Number(expiresAtStr);
  if (!profileId || !Number.isFinite(expiresAt)) {
    throw new Error("Malformed session token.");
  }
  if (Date.now() > expiresAt) {
    throw new Error("登入已過期，請重新登入。");
  }

  const expected = await hmacHex(secret, `${profileId}.${expiresAtStr}`);
  if (expected !== signature) {
    throw new Error("Invalid session token signature.");
  }
  return profileId;
}
