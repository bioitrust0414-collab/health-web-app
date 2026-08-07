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
export async function upsertProfileForLineUser(idToken: string): Promise<LineLoginResult> {
  const claims = await verifyLineIdToken(idToken);
  return upsertProfileForClaims(claims);
}

/** Standalone web LINE Login path: exchange an OAuth authorization code for tokens. */
export async function exchangeCodeForProfile(code: string, redirectUri: string): Promise<LineLoginResult> {
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

async function upsertProfileForClaims(claims: LineVerifyResponse): Promise<LineLoginResult> {
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

  // Brand-new LINE user: do NOT create a profile here. Creating one blind
  // would orphan any existing 健檢 (LIS) records that already sit on a
  // placeholder profile for this person. Ask the frontend to collect
  // name / birthday / last-4-of-phone and call verifyAndLinkProfile.
  return {
    needsVerification: true,
    lineUserId: claims.sub,
    displayName: claims.name ?? null,
  };
}

// ------------------------------------------------------------------
// 身分驗證綁定：把新的 LINE 使用者接到既有的健檢會員資料上
// ------------------------------------------------------------------

/** 姓名正規化：全形→半形（NFKC）、去掉所有空白、統一小寫。 */
function normalizeName(value: string): string {
  return value.normalize("NFKC").replace(/\s+/gu, "").toLowerCase();
}

/** 手機正規化：NFKC（處理全形數字）後只留數字。 */
function normalizeDigits(value: string): string {
  return value.normalize("NFKC").replace(/\D+/gu, "");
}

/** 生日正規化成 YYYY-MM-DD；接受 1990/5/18、1990-05-18、全形數字等寫法。 */
function normalizeBirthday(value: string): string | null {
  const digits = normalizeDigits(value);
  if (digits.length !== 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export interface VerifyAndLinkInput {
  lineUserId: string;
  fullName: string;
  birthday: string;
  phoneLast4: string;
}

export type VerifyAndLinkResult =
  | { success: true; profileId: string; lineUserId: string; displayName: string | null }
  | { success: false; message: string };

const NO_MATCH_MESSAGE =
  "查無符合的健檢會員資料，請確認姓名/生日/手機是否與健檢時填寫的一致，或洽門市協助。";

export async function verifyAndLinkLineProfile(input: VerifyAndLinkInput): Promise<VerifyAndLinkResult> {
  const lineUserId = input.lineUserId.trim();
  const name = normalizeName(input.fullName ?? "");
  const birthday = normalizeBirthday(input.birthday ?? "");
  const last4 = normalizeDigits(input.phoneLast4 ?? "").slice(-4);

  if (!lineUserId) return { success: false, message: "LINE 登入資訊不完整，請重新登入。" };
  if (!name) return { success: false, message: "請填寫姓名。" };
  if (!birthday) return { success: false, message: "請填寫正確的生日（例如 1990-05-18）。" };
  if (last4.length !== 4) return { success: false, message: "請填寫手機號碼末 4 碼。" };

  // 這個 LINE 帳號已經綁過了（例如重複送出表單）→ 直接回傳既有 profile。
  const alreadyBound = await restGetOne<{ id: string; full_name: string | null }>(
    "profiles",
    `line_user_id=eq.${encodeURIComponent(lineUserId)}`,
  );
  if (alreadyBound) {
    return {
      success: true,
      profileId: alreadyBound.id,
      lineUserId,
      displayName: alreadyBound.full_name,
    };
  }

  // 只撈「生日相符 + 還沒被綁定」的候選，姓名與手機末碼在這裡做正規化比對，
  // 避免全形/空白/大小寫差異造成比對失敗。
  const candidates = await restGetList<{ id: string; full_name: string | null; phone: string | null }>(
    "profiles",
    `select=id,full_name,phone&birthday=eq.${birthday}&line_user_id=is.null`,
  );

  const matches = candidates.filter(
    (row) =>
      row.full_name != null &&
      normalizeName(row.full_name) === name &&
      row.phone != null &&
      normalizeDigits(row.phone).slice(-4) === last4,
  );

  if (matches.length !== 1) {
    // 0 筆：查無資料。多筆：資料重複，需人工確認，同樣不自動建立新帳號。
    return { success: false, message: NO_MATCH_MESSAGE };
  }

  const matched = matches[0]!;
  await restPatch("profiles", `id=eq.${matched.id}`, { line_user_id: lineUserId });

  return {
    success: true,
    profileId: matched.id,
    lineUserId,
    displayName: matched.full_name,
  };
}

