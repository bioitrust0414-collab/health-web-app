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
    const { profileId } = await exchangeCodeForProfile(
      data["code"],
      `${process.env["PUBLIC_SITE_URL"] ?? "https://dahua-health-app.vercel.app"}/auth/line/callback`,
    );
    return { profileId };
  });

export const Route = createFileRoute("/auth/line/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search["code"] === "string" ? search["code"] : undefined,
    error: typeof search["error"] === "string" ? search["error"] : undefined,
  }),
  loaderDeps: ({ search }) => ({ code: search.code, error: search.error }),
  loader: async ({ deps }) => {
    const { profileId } = await handleLineCallback({ data: deps });
    throw redirect({ to: "/member", search: { profileId } });
  },
  component: () => null,
});
