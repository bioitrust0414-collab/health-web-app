import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getProducts, createOrder, getMemberDashboard } from "@/lib/memberActions.server";
import { useSessionToken } from "@/lib/useSessionToken";
import { getStoredSessionToken } from "@/lib/memberSession";
import { productImage } from "@/lib/productImages";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "健康商城｜保健食品與健康周邊線上購買" },
      {
        name: "description",
        content: "線上選購健康好夥伴系列保健食品，加入購物車即可結帳。",
      },
      { property: "og:title", content: "健康商城｜保健食品與健康周邊線上購買" },
      {
        property: "og:description",
        content: "健康好夥伴系列保健食品一站購足，健檢與諮詢服務請至檢驗套組頁面預約。",
      },
    ],
  }),
  component: ShopPage,
});


function ShopPage() {
  const { getSessionToken } = useSessionToken();
  const [filter, setFilter] = useState<string>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">("idle");
  const [checkoutResult, setCheckoutResult] = useState<{ orderNo: string; pointsEarned: number } | null>(
    null,
  );

  const { data: products } = useQuery({
    queryKey: ["shop-products"],
    queryFn: () => getProducts(),
  });

  const sessionToken = getStoredSessionToken();
  const { data: dashboard } = useQuery({
    queryKey: ["member-dashboard", sessionToken],
    queryFn: () => getMemberDashboard({ data: sessionToken as string }),
    enabled: Boolean(sessionToken),
  });

  // 分類 tab 直接依商品的 sub_category（沒有 sub_category 時退回 category）動態產生。
  const filters = useMemo(() => {
    const groups = Array.from(
      new Set((products ?? []).map((p) => p.sub_category ?? p.category)),
    );
    return [{ id: "all", label: "全部" }, ...groups.map((g) => ({ id: g, label: g }))];
  }, [products]);

  const list = useMemo(
    () =>
      (products ?? []).filter(
        (p) => filter === "all" || (p.sub_category ?? p.category) === filter,
      ),
    [products, filter],
  );


  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = (products ?? []).reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);
  const availablePoints = dashboard?.points ?? 0;

  async function handleCheckout() {
    if (!products) return;
    setCheckoutState("loading");
    try {
      const sessionToken = await getSessionToken();
      const items = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => {
          const product = products.find((p) => p.id === productId);
          if (!product) throw new Error("商品資料異常");
          return { productId, name: product.name, unitPrice: product.price, quantity };
        });

      const result = await createOrder({
        data: { sessionToken, items, pointsToUse: Math.min(availablePoints, cartTotal) },
      });
      setCheckoutResult({ orderNo: result.orderNo, pointsEarned: result.pointsEarned });
      setCart({});
      setCheckoutState("idle");
    } catch {
      setCheckoutState("error");
    }
  }

  return (
    <AppShell title="健康商城" subtitle="依你的健檢數值推薦，滿 NT$1,000 免運">
      <div className="grid gap-5 pb-8">
        <div className="surface-card flex flex-wrap items-center gap-2 p-3">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                filter === f.id
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {checkoutResult && (
          <div className="surface-card p-5 text-sm">
            <p className="font-bold text-primary">訂單 {checkoutResult.orderNo} 已建立</p>
            <p className="mt-1 text-muted-foreground">
              本次消費獲得 {checkoutResult.pointsEarned} 點，可在會員專區查看訂單狀態。
              付款方式尚未串接金流，門市會另行通知付款方式。
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="surface-card flex flex-col p-5">
              <div className="overflow-hidden rounded-xl bg-accent">
                <img
                  src={productImage(p.sku, p.image_url)}
                  alt={p.name}
                  loading="lazy"
                  width={768}
                  height={576}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-2">
                <h2 className="min-w-0 text-sm font-bold">{p.name}</h2>
                <div className="flex shrink-0 gap-1.5">
                  {p.is_best_seller ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                      熱銷
                    </span>
                  ) : null}
                  {p.is_new ? (
                    <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-bold text-primary">
                      新品
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              <dl className="mt-2 flex-1 grid gap-1 text-[11px] text-muted-foreground">
                {p.flavor ? (
                  <div className="flex gap-1">
                    <dt className="font-semibold">口味</dt>
                    <dd className="min-w-0">{p.flavor}</dd>
                  </div>
                ) : null}
                {p.net_weight ? (
                  <div className="flex gap-1">
                    <dt className="font-semibold">規格</dt>
                    <dd className="min-w-0">{p.net_weight}</dd>
                  </div>
                ) : null}
                {p.ingredients?.length ? (
                  <div className="flex gap-1">
                    <dt className="font-semibold">成分</dt>
                    <dd className="min-w-0">{p.ingredients.join("、")}</dd>
                  </div>
                ) : null}
                {p.benefits?.length ? (
                  <div className="flex gap-1">
                    <dt className="font-semibold">特色</dt>
                    <dd className="min-w-0">{p.benefits.join("／")}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-base font-bold text-primary tabular-nums">
                  NT$ {p.price.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition active:scale-[0.97]"
                >
                  <Plus className="h-4 w-4" />
                  加入購物車
                </button>
              </div>
              {cart[p.id] ? (
                <p className="mt-2 text-xs font-medium text-primary">已加入 {cart[p.id]} 件</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {cartCount > 0 ? (
        <div className="fixed inset-x-0 bottom-16 z-30 px-5 md:bottom-6 md:px-8">
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-brand">
            <ShoppingCart className="h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {cartCount} 件商品 · NT$ {cartTotal.toLocaleString()}
              </p>
              {availablePoints > 0 && (
                <p className="truncate text-xs opacity-85">
                  可折抵 {Math.min(availablePoints, cartTotal)} 點
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutState === "loading"}
              className="shrink-0 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-bold disabled:opacity-60"
            >
              {checkoutState === "loading" ? "建立訂單中..." : "前往結帳"}
            </button>
          </div>
          {checkoutState === "error" && (
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-destructive">
              結帳失敗，請稍後再試。
            </p>
          )}
        </div>
      ) : null}
    </AppShell>
  );
}
