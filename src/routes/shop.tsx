import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Plus, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BookButton } from "@/components/BookButton";
import { getProducts, createOrder, getMemberDashboard } from "@/lib/memberActions.server";
import { useSessionToken } from "@/lib/useSessionToken";
import { getStoredSessionToken } from "@/lib/memberSession";
import { packages, type Package } from "@/data/dahua";
import { Link } from "@tanstack/react-router";
import fishOilImg from "@/assets/product-fishoil.jpg";
import probioticImg from "@/assets/product-probiotic.jpg";
import bpMonitorImg from "@/assets/product-bpmonitor.jpg";
import bbSlimDrinkImg from "@/assets/product-bb-slim-drink.jpg";
import bioidDhaFishoilImg from "@/assets/product-bioid-dha-fishoil.jpg";
import bioidNattoQ10Img from "@/assets/product-bioid-nattokinase-q10.jpg";
import malGrowthCalciumImg from "@/assets/product-mal-growth-calcium.jpg";
import malNightEnzymeImg from "@/assets/product-mal-night-enzyme.jpg";
import malVitalityMetabolismImg from "@/assets/product-mal-vitality-metabolism.jpg";
import malCranberryProbioticsImg from "@/assets/product-mal-cranberry-probiotics.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "健康商城｜保健品與健檢套組線上預約" },
      {
        name: "description",
        content: "線上選購魚油、益生菌、藍牙血壓計等保健商品，並直接預約 DH 系列健檢套組。",
      },
      { property: "og:title", content: "健康商城｜保健品與健檢套組線上預約" },
      {
        property: "og:description",
        content: "實體保健商品與 DH 健檢套組一站購足，商品加入購物車結帳、健檢套組線上預約。",
      },
    ],
  }),
  component: ShopPage,
});

// 商品圖目前還是用本地素材（跟商品 sku 對應），還沒有導入圖床/CDN 網址。
const PRODUCT_IMAGES: Record<string, string> = {
  "fish-oil-90": fishOilImg,
  "probiotic-fiber-30d": probioticImg,
  "bp-monitor-bluetooth": bpMonitorImg,
  "bb-vitality-drink": bbSlimDrinkImg,
  "dha": bioidDhaFishoilImg,
  "natto-q10": bioidNattoQ10Img,
  "growth-calcium": malGrowthCalciumImg,
  "night-enzyme": malNightEnzymeImg,
  "vitality-metabolism": malVitalityMetabolismImg,
  "cranberry-probiotics": malCranberryProbioticsImg,
};

const filters = [
  { id: "all", label: "全部" },
  { id: "supplement", label: "保健商品" },
  { id: "device", label: "健康裝置" },
  { id: "service", label: "服務方案" },
] as const;

function ShopPage() {
  const { getSessionToken } = useSessionToken();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
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

  const list = useMemo(
    () =>
      (products ?? [])
        .filter((p) => p.category !== "service") // 健檢/服務類一律走「線上預約」而非購物車，跟 /tests 套組保持一致
        .filter((p) => filter === "all" || p.category === filter),
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

        {filter === "service" ? (
          <ServicePackages />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
            <article key={p.id} className="surface-card flex flex-col p-5">
              <div className="overflow-hidden rounded-xl bg-accent">
                <img
                  src={PRODUCT_IMAGES[p.sku] ?? p.image_url ?? undefined}
                  alt={p.name}
                  loading="lazy"
                  width={768}
                  height={576}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <h2 className="min-w-0 text-sm font-bold">{p.name}</h2>
              </div>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">{p.description}</p>
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
                  {p.category === "service" ? "預約" : "加入購物車"}
                </button>
              </div>
              {cart[p.id] ? (
                <p className="mt-2 text-xs font-medium text-primary">已加入 {cart[p.id]} 件</p>
              ) : null}
            </article>
          ))}
        </div>
        )}
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

// 服務方案：直接沿用 /tests 頁面同一份 DH 健檢套組資料（src/data/dahua.ts），
// 確保商城顯示的方案跟官網健檢套組頁完全一致，不再是獨立虛構的服務項目。
function ServicePackages() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {packages.general.map((pkg) => (
        <ServicePackageCard key={pkg.id} pkg={pkg} />
      ))}
      <Link
        to="/tests"
        className="surface-card flex flex-col items-center justify-center gap-2 p-5 text-center text-sm font-bold text-primary"
      >
        查看完整健檢套組與比較表
        <span className="text-xs font-medium text-muted-foreground">
          含特定族群、基因檢測、過敏原檢測
        </span>
      </Link>
    </div>
  );
}

function ServicePackageCard({ pkg }: { pkg: Package }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="surface-card flex flex-col p-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-xl">
          {pkg.icon}
        </span>
        <p className="min-w-0 text-sm font-bold">{pkg.name}</p>
      </div>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">{pkg.desc}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex items-center gap-1 text-xs font-bold text-primary"
      >
        {open ? "收起檢驗項目" : `查看 ${pkg.items.length} 項檢驗內容`}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="mt-3 grid gap-1.5 rounded-2xl bg-secondary p-3">
          {pkg.items.map((item) => (
            <li key={item} className="flex gap-2 text-xs">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      )}

      <BookButton packageName={pkg.name} bookingType="checkup" />
    </article>
  );
}
