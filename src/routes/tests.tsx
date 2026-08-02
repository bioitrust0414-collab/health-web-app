import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LineOaCard } from "@/components/LineOaCard";
import { packages, geneTests, type Package } from "@/data/dahua";
import { LINE_OA_ADD_FRIEND_URL } from "@/lib/line-oa";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { title: "檢驗套組｜健康檢查、基因與過敏原檢測線上預約" },
      {
        name: "description",
        content:
          "完整瀏覽基礎與進階健康檢查、特定族群檢查、基因檢測與過敏原檢測套組內容，手機即可線上預約。",
      },
      { property: "og:title", content: "檢驗套組｜健康檢查、基因與過敏原檢測線上預約" },
      {
        property: "og:description",
        content: "DH1 至 DHA 健檢套組、基因圖譜與過敏原檢測，手機一鍵預約諮詢。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestsPage,
});

const allergyTests = [
  { name: "急性過敏原檢測 66 項", desc: "IgE 立即型過敏反應篩檢" },
  { name: "急慢性過敏原檢測 110 項", desc: "IgE + IgG 綜合評估" },
  { name: "慢性過敏原檢測 101 項", desc: "IgG 延遲型食物過敏" },
  { name: "急慢性過敏原檢測 224 項", desc: "最完整的過敏原全項分析" },
];

const tabs = [
  { id: "general", label: "基礎進階" },
  { id: "special", label: "特定族群" },
  { id: "gene", label: "基因檢測" },
  { id: "allergy", label: "過敏原" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function TestsPage() {
  const [tab, setTab] = useState<TabId>("general");

  return (
    <AppShell title="專業檢驗套組" subtitle="從基礎健檢到基因與過敏原檢測，線上瀏覽並預約">
      <div className="grid gap-5 pb-8">
        <div className="surface-card sticky top-2 z-10 flex gap-1.5 overflow-x-auto p-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {(tab === "general" || tab === "special") && (
          <div className="grid gap-3 md:grid-cols-2">
            {packages[tab].map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        )}

        {tab === "gene" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {geneTests.map((g) => (
              <div key={g.name} className="surface-card p-4">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent text-lg">
                    🧬
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{g.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{g.desc}</p>
                  </div>
                </div>
                {g.highlight && (
                  <span className="mt-3 inline-block rounded-full bg-primary/12 px-2.5 py-1 text-xs font-bold text-primary">
                    最完整方案
                  </span>
                )}
                <BookButton />
              </div>
            ))}
          </div>
        )}

        {tab === "allergy" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {allergyTests.map((a) => (
              <div key={a.name} className="surface-card p-4">
                <p className="text-sm font-bold">{a.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                <BookButton />
              </div>
            ))}
          </div>
        )}

        <LineOaCard compact />
      </div>
    </AppShell>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="surface-card p-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-xl">
          {pkg.icon}
        </span>
        <p className="min-w-0 text-sm font-bold">{pkg.name}</p>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{pkg.desc}</p>

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

      <BookButton />
    </div>
  );
}

function BookButton() {
  return (
    <a
      href={LINE_OA_ADD_FRIEND_URL}
      target="_blank"
      rel="noreferrer"
      className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition active:scale-[0.99]"
    >
      LINE 線上預約
    </a>
  );
}
