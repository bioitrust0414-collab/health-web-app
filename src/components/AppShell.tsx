import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Activity, CreditCard, FlaskConical, ShoppingBag } from "lucide-react";
import { useLiffEnvironment } from "@/lib/use-liff";

const navItems = [
  { to: "/health", label: "健康首頁", icon: Activity },
  { to: "/tests", label: "檢驗套組", icon: FlaskConical },
  { to: "/shop", label: "健康商城", icon: ShoppingBag },
  { to: "/member", label: "會員卡", icon: CreditCard },
] as const;


export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { isInClient } = useLiffEnvironment();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <header className="brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 pt-6 pb-10 md:px-8 md:pt-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-foreground/20 text-lg font-bold">
                康
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-wide opacity-90">
                  康活健康 KanLife
                </p>
                <p className="truncate text-xs opacity-70">
                  {isInClient ? "LINE 內開啟" : "網頁版"}
                </p>
              </div>
            </div>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full px-4 py-2 text-sm font-medium opacity-80 transition hover:bg-primary-foreground/15 hover:opacity-100"
                  activeProps={{ className: "bg-primary-foreground/20 opacity-100" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            <p className="mt-1 text-sm opacity-85">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-5xl px-5 md:px-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground transition"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
