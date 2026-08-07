// src/lib/lineAuth.server.ts
// SERVER-ONLY. Verifies LINE tokens (from LIFF's ID token, or from a
// standalone web LINE Login OAuth code exchange) and maps the LINE user
// onto a `profiles` row via `line_user_id`. Uses raw REST calls to
// Supabase (see supabaseAdmin.ts) rather than the supabase-js client —
// see that file's comment for why.

import { restGetOne, restGetList, restPatch } from "./supabaseAdmin";

interface LineVerifyResponse {
  iss: string;
  sub: string; // LINE user id — stable, unique per user per channel
  aud: string;
  exp: number;
  iat: number;
  name?: string;
  picture?: string;
  email?: string;
}

export interface LineProfile {
  profileId: string;
  lineUserId: string;
  displayName: string | null;
  needsVerification?: false;
}

/** Returned when this LINE user has never been bound to a profile yet. */
export interface LineNeedsVerification {
  needsVerification: true;
  lineUserId: string;
  displayName: string | null;
}

export type LineLoginResult = LineProfile | LineNeedsVerification;


async function verifyLineIdToken(idToken: string): Promise<LineVerifyResponse> {
  const channelId = process.env["LINE_LOGIN_CHANNEL_ID"];
  if (!channelId) {
    throw new Error("LINE_LOGIN_CHANNEL_ID not set in the server environment.");
  }

  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LINE ID token verification failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as LineVerifyResponse;

  if (payload.aud !== channelId) {
    throw new Error("LINE ID token audience mismatch — token was issued for a different channel.");
  }
  if (payload.exp * 1000 < Date.now()) {
    throw new Error("LINE ID token has expired.");
  }

  return payload;
}

/** LIFF path: browser already has an ID token from the LIFF SDK. */
export async function upsertProfileForLineUser(idToken: string): Promise<LineProfile> {
  const claims = await verifyLineIdToken(idToken);
  return upsertProfileForClaims(claims);
}

/** Standalone web LINE Login path: exchange an OAuth authorization code for tokens. */
export async function exchangeCodeForProfile(code: string, redirectUri: string): Promise<LineProfile> {
  const channelId = process.env["LINE_LOGIN_CHANNEL_ID"];
  const channelSecret = process.env["LINE_LOGIN_CHANNEL_SECRET"];
  if (!channelId || !channelSecret) {
    throw new Error("LINE_LOGIN_CHANNEL_ID / LINE_LOGIN_CHANNEL_SECRET not set in the server environment.");
  }

  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`LINE token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`);
  }

  const { id_token: idToken } = (await tokenRes.json()) as { id_token: string };
  const claims = await verifyLineIdToken(idToken);
  return upsertProfileForClaims(claims);
}

async function upsertProfileForClaims(claims: LineVerifyResponse): Promise<LineProfile> {
  const existing = await restGetOne<{ id: string; full_name: string | null }>(
    "profiles",
    `line_user_id=eq.${claims.sub}`,
  );

  if (existing) {
    return {
      profileId: existing.id,
      lineUserId: claims.sub,
      displayName: existing.full_name ?? claims.name ?? null,
    };
  }

  // New LINE user: create an auth user first (profiles.id has a FK to
  // auth.users). handle_new_user trigger creates the bare profile row;
  // we then enrich it with LINE data below.
  const created = await adminCreateUser({
    email: `line-${claims.sub}@liff.dahua-health-app.local`,
    email_confirm: true,
    user_metadata: { line_user_id: claims.sub, source: "line_login" },
  });

  await restPatch("profiles", `id=eq.${created.id}`, {
    line_user_id: claims.sub,
    full_name: claims.name ?? null,
  });

  return { profileId: created.id, lineUserId: claims.sub, displayName: claims.name ?? null };
}
