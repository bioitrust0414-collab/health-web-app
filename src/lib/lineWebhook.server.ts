// src/lib/lineWebhook.server.ts
// SERVER-ONLY. LINE Messaging API webhook: replies with a welcome message +
// LIFF link on follow, and auto-binds a LINE account to an existing
// `profiles` row by phone number when the user texts their phone number.
//
// This is invoked directly from src/server.ts (see the pathname check
// there) rather than through a TanStack Start file route, because this
// version of @tanstack/react-start doesn't yet export "./api" for
// createAPIFileRoute-style raw HTTP routes.

interface LineEvent {
  type: string;
  replyToken?: string;
  source?: { userId?: string };
  message?: { type: string; text?: string };
}

export async function handleLineWebhook(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return new Response("Webhook is active", { status: 200 });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const SUPABASE_URL = process.env["SUPABASE_URL"];
  const SUPABASE_SERVICE_ROLE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const LINE_CHANNEL_ACCESS_TOKEN = process.env["LINE_CHANNEL_ACCESS_TOKEN"];
  const LIFF_ID = process.env["VITE_LIFF_ID"];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("[Webhook] Missing environment variables");
    return new Response("Configuration error", { status: 500 });
  }

  const body = (await request.json()) as { events: LineEvent[] };

  const replyMessage = async (replyToken: string, messages: unknown[]) => {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ replyToken, messages }),
    });
  };

  const { restGetOne, restPatch } = await import("./supabaseAdmin");

  for (const event of body.events ?? []) {
    // 用戶加入好友 (Follow)
    if (event.type === "follow" && event.replyToken) {
      const lineUserId = event.source?.userId;
      console.log(`[Webhook] New follower: ${lineUserId}`);

      await replyMessage(event.replyToken, [
        {
          type: "template",
          altText: "歡迎使用大華健康服務",
          template: {
            type: "buttons",
            text: "歡迎使用大華健康服務！請輸入您的手機號碼以綁定帳號，查看檢驗報告。",
            actions: [
              {
                type: "uri",
                label: "查看健康檔案",
                uri: `https://liff.line.me/${LIFF_ID}`,
              },
            ],
          },
        },
      ]);
    }

    // 用戶輸入手機號碼 (Message)
    if (event.type === "message" && event.message?.type === "text" && event.replyToken) {
      const text = event.message.text?.trim() ?? "";
      const lineUserId = event.source?.userId;

      // 簡單判斷是否為手機號碼 (10位數字)
      if (/^\d{10}$/.test(text) && lineUserId) {
        const profile = await restGetOne<{ id: string; full_name: string | null }>(
          "profiles",
          `phone=eq.${text}`,
        );

        if (profile) {
          await restPatch("profiles", `id=eq.${profile.id}`, { line_user_id: lineUserId });

          await replyMessage(event.replyToken, [
            {
              type: "text",
              text: `✅ 綁定成功！${profile.full_name || ""} 您好，您現在可以點擊下方選單查看您的檢驗報告。`,
            },
          ]);
        } else {
          await replyMessage(event.replyToken, [
            {
              type: "text",
              text: "查無此手機號碼對應的病歷資料。請確認您在診所留下的電話，或聯繫客服人員。",
            },
          ]);
        }
      }
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
