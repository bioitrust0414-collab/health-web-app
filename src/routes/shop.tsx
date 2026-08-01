import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { products } from "@/lib/health-data";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "健康商城｜保健品與健檢方案線上購買" },
      {
        name: "description",
        content: "線上選購魚油、益生菌、藍牙血壓計等保健商品，並預約全身健檢、營養師諮詢與控糖課程。",
      },
      { property: "og:title", content: "健康商城｜保健品與健檢方案線上購買" },
      {
        property: "og:description",
        content: "實體保健商品與健康服務方案一站購足，加入購物車即可結帳。",
      },
    ],
  }),
  component: ShopPage,
});

const filters = [
  { id: "all", label: "全部" },
  { id: "physical", label: "保健商品" },
  { id: "service", label: "服務方案" },
] as const;

function ShopPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [cart, setCart] = useState<Record<string, number>>({});

  const list = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.kind === filter)),
    [filter],
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = products.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="surface-card flex flex-col p-5">
              <div className="overflow-hidden rounded-xl bg-accent">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={768}
                  height={576}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <h2 className="min-w-0 text-sm font-bold">{p.name}</h2>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {p.tag}
                </span>
              </div>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">{p.detail}</p>
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
                  {p.kind === "service" ? "預約" : "加入購物車"}
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
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">
              {cartCount} 件商品 · NT$ {cartTotal.toLocaleString()}
            </p>
            <button
              type="button"
              className="shrink-0 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-bold"
            >
              前往結帳
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
