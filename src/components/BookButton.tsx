import { useState } from "react";
import { Check } from "lucide-react";
import { useSessionToken } from "@/lib/useSessionToken";
import { createBooking } from "@/lib/memberActions.server";
import { LINE_OA_ADD_FRIEND_URL } from "@/lib/line-oa";

export function BookButton({
  packageName,
  bookingType,
}: {
  packageName: string;
  bookingType: "checkup" | "gene_test" | "allergy_test";
}) {
  const { getSessionToken } = useSessionToken();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    setState("loading");
    try {
      const sessionToken = await getSessionToken();
      await createBooking({ data: { sessionToken, bookingType, packageName } });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-bold text-muted-foreground">
        <Check className="h-4 w-4" /> 已加入預約，會員專區可查看
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "loading"}
        className="flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition active:scale-[0.99] disabled:opacity-60"
      >
        {state === "loading" ? "送出中..." : "線上預約"}
      </button>
      {state === "error" && (
        <p className="text-center text-xs text-destructive">預約失敗，請改用 LINE 聯繫我們。</p>
      )}
      <a
        href={LINE_OA_ADD_FRIEND_URL}
        target="_blank"
        rel="noreferrer"
        className="text-center text-xs font-medium text-muted-foreground underline underline-offset-2"
      >
        或透過 LINE 官方帳號聯繫
      </a>
    </div>
  );
}
