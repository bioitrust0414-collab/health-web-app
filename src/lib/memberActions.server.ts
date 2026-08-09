// src/lib/memberActions.server.ts
// SERVER-ONLY. Booking / daily-log / reminder writes and reads.
//
// Every call here takes a `sessionToken` (see sessionToken.ts), never a bare
// profileId — the token is verified first, and the profileId used for every
// Supabase write comes from the verified token, not from anything else the
// caller passed in. Combined with supabaseAdmin (service role, bypasses
// RLS), this means the only way to act as a member is to actually be
// carrying a token that member's login issued.
//
// 商城／訂單／點數／集點卡已於本次收斂中移除（保健品銷售改由外部購物平台
// 承接）。orders / order_items / member_points / stamp_cards / products 五張表
// 仍保留在 db/schema_extension.sql 中作為未來的資料模型開口，但沒有任何
// server function 可以寫入它們 —— 這是刻意的：留 schema，不留可被呼叫的端點。
// 若日後要復工，復工前必須先修的項目見 docs/ROADMAP.md。

import { createServerFn } from "@tanstack/react-start";

interface BookingRow {
  id: string;
  booking_type: string;
  package_name: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

// ------------------------------------------------------------------
// 登入
// ------------------------------------------------------------------
// 把 LINE ID token 換成 profileId + session token：伺服器端會呼叫 LINE
// 驗證這個 token 是真的、沒有過期、發給我們自己的 channel，而不是相信
// 前端隨便傳一個 LINE user id 上來。
export const verifyLiffLogin = createServerFn({ method: "POST" })
  .validator((idToken: unknown) => {
    if (typeof idToken !== "string" || idToken.length === 0) {
      throw new Error("idToken is required");
    }
    return idToken;
  })
  .handler(async ({ data: idToken }) => {
    const { upsertProfileForLineUser } = await import("./lineAuth.server");
    const { issueSessionToken } = await import("./sessionToken");
    const profile = await upsertProfileForLineUser(idToken);
    const token = await issueSessionToken(profile.profileId);
    return { ...profile, token };
  });

// ------------------------------------------------------------------
// 預約
// ------------------------------------------------------------------
interface BookingInput {
  sessionToken: string;
  bookingType: "checkup" | "gene_test" | "allergy_test" | "consultation";
  packageName: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
}

export const createBooking = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as BookingInput)
  .handler(async ({ data }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restInsert } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(data.sessionToken);

    const [booking] = await restInsert<BookingRow>("bookings", {
      profile_id: profileId,
      booking_type: data.bookingType,
      package_name: data.packageName,
      contact_name: data.contactName ?? null,
      contact_phone: data.contactPhone ?? null,
      notes: data.notes ?? null,
      status: "pending",
    });
    if (!booking) throw new Error("建立預約失敗");

    return { bookingId: booking.id };
  });

// ------------------------------------------------------------------
// 會員儀表板：預約紀錄
// ------------------------------------------------------------------
export const getMemberDashboard = createServerFn({ method: "GET" })
  .validator((sessionToken: unknown) => {
    if (typeof sessionToken !== "string" || sessionToken.length === 0) {
      throw new Error("sessionToken is required");
    }
    return sessionToken;
  })
  .handler(async ({ data: sessionToken }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restGetList } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(sessionToken);

    const bookings = await restGetList<BookingRow>(
      "bookings",
      `profile_id=eq.${profileId}&order=created_at.desc&limit=10`,
    );

    return { bookings };
  });

// ------------------------------------------------------------------
// 健康日誌（daily_logs）
// ------------------------------------------------------------------
interface DailyLogRow {
  id: string;
  log_date: string;
  water_ml: number;
  sleep_hours: number | null;
  notes: string | null;
  created_at: string;
}

interface DailyLogInput {
  sessionToken: string;
  logDate: string; // YYYY-MM-DD
  waterMl: number;
  sleepHours?: number;
  notes?: string;
}

export const getDailyLogs = createServerFn({ method: "GET" })
  .validator((sessionToken: unknown) => {
    if (typeof sessionToken !== "string" || sessionToken.length === 0) {
      throw new Error("sessionToken is required");
    }
    return sessionToken;
  })
  .handler(async ({ data: sessionToken }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restGetList } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(sessionToken);

    return restGetList<DailyLogRow>(
      "daily_logs",
      `profile_id=eq.${profileId}&order=log_date.desc&limit=14`,
    );
  });

export const upsertDailyLog = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as DailyLogInput)
  .handler(async ({ data }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restGetOne, restInsert, restPatch } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(data.sessionToken);

    // 一天一筆：若當天已有紀錄則更新，否則新增
    const existing = await restGetOne<{ id: string }>(
      "daily_logs",
      `profile_id=eq.${profileId}&log_date=eq.${data.logDate}`,
    );

    const payload = {
      water_ml: data.waterMl,
      sleep_hours: data.sleepHours ?? null,
      notes: data.notes ?? null,
    };

    if (existing) {
      await restPatch("daily_logs", `id=eq.${existing.id}`, payload);
      return { id: existing.id, updated: true };
    }

    const [row] = await restInsert<DailyLogRow>("daily_logs", {
      profile_id: profileId,
      log_date: data.logDate,
      ...payload,
    });
    return { id: row?.id, updated: false };
  });

// ------------------------------------------------------------------
// 提醒事項（reminders）
// ------------------------------------------------------------------
interface ReminderRow {
  id: string;
  type: "FOLLOW_UP" | "HABIT" | "BOOKING";
  title: string;
  message: string;
  trigger_time: string;
  is_sent: boolean;
  disclaimer_text: string;
}

interface ReminderInput {
  sessionToken: string;
  type: "FOLLOW_UP" | "HABIT" | "BOOKING";
  title: string;
  message: string;
  triggerTime: string; // ISO datetime
}

const REMINDER_DISCLAIMER = "此提醒僅供個人健康管理參考，非醫療建議，如有不適請洽專業醫療人員。";

export const getReminders = createServerFn({ method: "GET" })
  .validator((sessionToken: unknown) => {
    if (typeof sessionToken !== "string" || sessionToken.length === 0) {
      throw new Error("sessionToken is required");
    }
    return sessionToken;
  })
  .handler(async ({ data: sessionToken }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restGetList } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(sessionToken);

    return restGetList<ReminderRow>(
      "reminders",
      `profile_id=eq.${profileId}&order=trigger_time.asc&limit=50`,
    );
  });

export const createReminder = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as ReminderInput)
  .handler(async ({ data }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restInsert } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(data.sessionToken);

    const [row] = await restInsert<ReminderRow>("reminders", {
      profile_id: profileId,
      type: data.type,
      title: data.title,
      message: data.message,
      trigger_time: data.triggerTime,
      is_sent: false,
      disclaimer_text: REMINDER_DISCLAIMER,
    });
    return { id: row?.id };
  });

export const markReminderDone = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { sessionToken: string; reminderId: string })
  .handler(async ({ data }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restPatch } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(data.sessionToken);
    // 帶上 profile_id 條件，避免用他人的 reminderId 誤改到別人的資料
    await restPatch("reminders", `id=eq.${data.reminderId}&profile_id=eq.${profileId}`, { is_sent: true });
    return { ok: true };
  });
