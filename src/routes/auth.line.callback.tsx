import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

// Standalone web LINE Login callback (distinct from the LIFF flow in
// /member — this is for people browsing the site in a normal browser,
// not opening it inside the LINE app). LINE redirects here with `?code=`
// after the user approves login at LINE's authorize screen.

const handleLineCallback = createServerFn({ method: "GET" })
  .validator((search: unknown) => {
    const s = search as { code?: string; error?: string };
    return s;
  })
  .handler(async ({ data }) => {
    if (data["error"] || !data["code"]) {
      throw new Error(data["error"] ?? "Missing authorization code from LINE.");
    }
    const { exchangeCodeForProfile } = await import("@/lib/lineAuth.server");
    const { issueSessionToken } = await import("@/lib/sessionToken");
    const result = await exchangeCodeForProfile(
      data["code"],
      `${process.env["PUBLIC_SITE_URL"] ?? "https://dahua-health-app.vercel.app"}/auth/line/callback`,
    );

    // 全新的 LINE 使用者 → 先去會員中心做身分驗證綁定，不發 token。
    if ("needsVerification" in result && result.needsVerification) {
      return { needsVerification: true as const, lineUserId: result.lineUserId };
    }

    const profileId = (result as { profileId: string }).profileId;
    const token = await issueSessionToken(profileId);
    return { needsVerification: false as const, profileId, token };
  });

export const Route = createFileRoute("/auth/line/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search["code"] === "string" ? search["code"] : undefined,
    error: typeof search["error"] === "string" ? search["error"] : undefined,
  }),
  loaderDeps: ({ search }) => ({ code: search.code, error: search.error }),
  loader: async ({ deps }) => {
    const result = await handleLineCallback({ data: deps });
    if (result.needsVerification) {
      throw redirect({ to: "/member", search: { lineUserId: result.lineUserId } });
    }
    throw redirect({ to: "/member", search: { profileId: result.profileId, token: result.token } });
  },
  component: () => null,
});

