// src/lib/memberActions.server.ts
// SERVER-ONLY. Booking / shop / points / stamp-card writes and reads.
//
// Every call here takes a `sessionToken` (see sessionToken.ts), never a bare
// profileId — the token is verified first, and the profileId used for every
// Supabase write comes from the verified token, not from anything else the
// caller passed in. Combined with supabaseAdmin (service role, bypasses
// RLS), this means the only way to act as a member is to actually be
// carrying a token that member's login issued.

import { createServerFn } from "@tanstack/react-start";

// 固定的測試 profile id：LIFF 還沒設定時（或本機開發時），讓預約/商城/會員
// 儀表板都能示範真實的資料流程，而不是完全沒東西可看。
const DEMO_PROFILE_ID = "30a85010-9893-4811-8bfc-f7e5d48a3401";

const STAMP_GOAL = 10;
const POINTS_PER_BOOKING = 50;
const POINTS_PER_100_SPENT = 1; // 1 point per NT$100 spent (after point redemption), rounded down

interface BookingRow {
  id: string;
  booking_type: string;
  package_name: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

interface OrderRow {
  id: string;
  order_no: string;
  status: string;
  final_amount: number;
  points_earned: number;
  created_at: string;
}

interface StampCardRow {
  id: string;
  current_stamps: number;
  total_stamps: number;
  is_completed: boolean;
}

interface PointsBalanceRow {
  total_points: number;
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

// Demo 模式（LIFF 還沒設定時）也要能示範預約/商城/會員儀表板，所以幫固定的
// 測試 profile 也發一組正常的簽章 token，用法跟真的登入完全一樣。
export const issueDemoToken = createServerFn({ method: "GET" }).handler(async () => {
  const { issueSessionToken } = await import("./sessionToken");
  return issueSessionToken(DEMO_PROFILE_ID);
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

    await awardPoints(profileId, POINTS_PER_BOOKING, "booking", booking.id, "預約健檢/諮詢");
    await bumpStampCard(profileId);

    return { bookingId: booking.id };
  });

// ------------------------------------------------------------------
// 商城 / 訂單
// ------------------------------------------------------------------
interface CartItemInput {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface OrderInput {
  sessionToken: string;
  items: CartItemInput[];
  pointsToUse: number;
}

export const createOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as OrderInput)
  .handler(async ({ data }) => {
    const { verifySessionToken } = await import("./sessionToken");
    const { restInsert, restGetOne } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(data.sessionToken);

    if (!data.items.length) throw new Error("購物車是空的");

    const totalAmount = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const balance = await restGetOne<PointsBalanceRow>(
      "member_points_balance",
      `profile_id=eq.${profileId}`,
    );
    const availablePoints = balance?.total_points ?? 0;
    const pointsUsed = Math.max(0, Math.min(data.pointsToUse, availablePoints, Math.floor(totalAmount)));
    const finalAmount = totalAmount - pointsUsed;
    const pointsEarned = Math.floor(finalAmount / 100) * POINTS_PER_100_SPENT;
    const orderNo = `DH${Date.now()}`;

    const [order] = await restInsert<{ id: string; order_no: string }>("orders", {
      profile_id: profileId,
      order_no: orderNo,
      status: "pending",
      total_amount: totalAmount,
      points_used: pointsUsed,
      points_earned: pointsEarned,
      final_amount: finalAmount,
      payment_method: "pending_gateway", // 尚未接金流，見 README 待辦事項
    });
    if (!order) throw new Error("建立訂單失敗");

    await restInsert(
      "order_items",
      data.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
      })),
    );

    if (pointsUsed > 0) {
      await awardPoints(profileId, -pointsUsed, "purchase", order.id, `訂單 ${orderNo} 折抵`);
    }
    if (pointsEarned > 0) {
      await awardPoints(profileId, pointsEarned, "purchase", order.id, `訂單 ${orderNo} 消費回饋`);
    }

    return { orderId: order.id, orderNo: order.order_no, finalAmount, pointsEarned, pointsUsed };
  });

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { restGetList } = await import("./supabaseAdmin");
  return restGetList<{
    id: string;
    sku: string;
    name: string;
    category: string;
    sub_category: string | null;
    brand: string | null;
    description: string | null;
    price: number;
    original_price: number | null;
    image_url: string | null;
    stock_quantity: number;
    health_tags: string[] | null;
    ingredients: string[] | null;
    benefits: string[] | null;
    flavor: string | null;
    net_weight: string | null;
    is_best_seller: boolean | null;
    is_new: boolean | null;
  }>("products", "select=*&is_active=eq.true&order=category.asc,created_at.desc");
});

// ------------------------------------------------------------------
// 會員儀表板：預約 / 訂單 / 點數 / 集點卡
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
    const { hasSupabaseAdminConfig, restGetList, restGetOne } = await import("./supabaseAdmin");
    const profileId = await verifySessionToken(sessionToken);

    if (!hasSupabaseAdminConfig()) {
      return {
        bookings: [] as BookingRow[],
        orders: [] as OrderRow[],
        points: 0,
        stamps: 0,
        stampGoal: STAMP_GOAL,
      };
    }

    try {
      const [bookings, orders, pointsBalance, stampCard] = await Promise.all([
        restGetList<BookingRow>("bookings", `profile_id=eq.${profileId}&order=created_at.desc&limit=10`),
        restGetList<OrderRow>("orders", `profile_id=eq.${profileId}&order=created_at.desc&limit=10`),
        restGetOne<PointsBalanceRow>("member_points_balance", `profile_id=eq.${profileId}`),
        restGetOne<StampCardRow>("stamp_cards", `profile_id=eq.${profileId}&card_type=eq.default`),
      ]);

      return {
        bookings,
        orders,
        points: pointsBalance?.total_points ?? 0,
        stamps: stampCard?.current_stamps ?? 0,
        stampGoal: stampCard?.total_stamps ?? STAMP_GOAL,
      };
    } catch (error) {
      console.error("Member dashboard data is unavailable; returning an empty dashboard.", error);
      return {
        bookings: [] as BookingRow[],
        orders: [] as OrderRow[],
        points: 0,
        stamps: 0,
        stampGoal: STAMP_GOAL,
      };
    }
  });

// ------------------------------------------------------------------
// 內部工具
// ------------------------------------------------------------------
async function awardPoints(
  profileId: string,
  points: number,
  source: string,
  sourceId: string,
  description: string,
): Promise<void> {
  const { restInsert } = await import("./supabaseAdmin");
  await restInsert("member_points", {
    profile_id: profileId,
    transaction_type: points >= 0 ? "earn" : "redeem",
    points,
    source,
    source_id: sourceId,
    description,
  });
}

async function bumpStampCard(profileId: string): Promise<void> {
  const { restGetOne, restPatch, restInsert } = await import("./supabaseAdmin");
  const existing = await restGetOne<{ id: string; current_stamps: number; total_stamps: number }>(
    "stamp_cards",
    `profile_id=eq.${profileId}&card_type=eq.default`,
  );

  if (!existing) {
    await restInsert("stamp_cards", {
      profile_id: profileId,
      card_type: "default",
      current_stamps: 1,
      total_stamps: STAMP_GOAL,
    });
    return;
  }

  const nextStamps = Math.min(existing.current_stamps + 1, existing.total_stamps);
  await restPatch("stamp_cards", `id=eq.${existing.id}`, {
    current_stamps: nextStamps,
    is_completed: nextStamps >= existing.total_stamps,
    completed_at: nextStamps >= existing.total_stamps ? new Date().toISOString() : null,
  });
}
