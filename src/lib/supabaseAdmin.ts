// src/lib/supabaseAdmin.ts
// SERVER-ONLY. Direct REST calls to Supabase (PostgREST + Auth Admin API)
// instead of the @supabase/supabase-js client. We hit a persistent
// "JWT issued at future" error from the JS client's internal handling of
// the service role key (reproduced identically with both the new sb_secret_
// key and the legacy service_role JWT — so it wasn't a key-format issue,
// it was the client library itself). Raw fetch() calls sidestep whatever
// internal decode logic was misfiring, and are just as correct: Supabase's
// REST APIs are the same APIs the JS client calls under the hood.

function getConfig() {
  const url = process.env["SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in the server environment.");
  }
  return { url, serviceRoleKey };
}

function authHeaders(serviceRoleKey: string, extra?: Record<string, string>) {
  // IMPORTANT: send the key on the `apikey` header ONLY. Supabase's new
  // publishable/secret key system is not JWT-based — if the same value is
  // also sent on `Authorization: Bearer`, the platform tries to parse it
  // as a JWT and rejects the request (this was the actual cause of the
  // "JWT issued at future" error, not a client-library or key-format bug).
  return {
    apikey: serviceRoleKey,
    ...extra,
  };
}

/** GET a single row via PostgREST, e.g. table="profiles", filter="id=eq.<uuid>" */
export async function restGetOne<T>(table: string, filter: string): Promise<T | null> {
  const { url, serviceRoleKey } = getConfig();
  const res = await fetch(`${url}/rest/v1/${table}?${filter}&select=*&limit=1`, {
    headers: authHeaders(serviceRoleKey, { Accept: "application/vnd.pgrst.object+json" }),
  });
  if (res.status === 406) return null; // PGRST116: no rows for object+json
  if (!res.ok) throw new Error(`Supabase REST GET ${table} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

/** GET a list of rows via PostgREST */
export async function restGetList<T>(table: string, query: string): Promise<T[]> {
  const { url, serviceRoleKey } = getConfig();
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: authHeaders(serviceRoleKey),
  });
  if (!res.ok) throw new Error(`Supabase REST GET ${table} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T[];
}

/** PATCH rows via PostgREST */
export async function restPatch(table: string, filter: string, body: unknown): Promise<void> {
  const { url, serviceRoleKey } = getConfig();
  const res = await fetch(`${url}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: authHeaders(serviceRoleKey, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase REST PATCH ${table} failed: ${res.status} ${await res.text()}`);
}

/** INSERT one or more rows via PostgREST, returning the inserted row(s). */
export async function restInsert<T>(table: string, body: unknown): Promise<T[]> {
  const { url, serviceRoleKey } = getConfig();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: authHeaders(serviceRoleKey, {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase REST INSERT ${table} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T[];
}

/** Create an auth user via the Admin REST API (auth.admin.createUser equivalent) */
export async function adminCreateUser(input: {
  email: string;
  email_confirm?: boolean;
  user_metadata?: Record<string, unknown>;
}): Promise<{ id: string }> {
  const { url, serviceRoleKey } = getConfig();
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: authHeaders(serviceRoleKey, { "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Supabase admin createUser failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string };
  return data;
}
