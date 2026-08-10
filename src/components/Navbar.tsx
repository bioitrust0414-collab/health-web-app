import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Stethoscope } from "lucide-react";

// ← 請換成你的 LINE OA 真實網址
const LINE_OA_URL = "https://line.me/R/ti/p/@你的LINEOA帳號";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "首頁", href: "/" },
    { label: "衛教知識", href: "/health-education" },
    { label: "健檢預約", href: "/booking" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>大華醫檢</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" asChild>
            <a href={LINE_OA_URL} target="_blank" rel="noopener noreferrer">
              會員登錄
            </a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <div className="flex flex-col gap-6 mt-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium"
                >
                  {item.label}
                </a>
              ))}
              <hr />
              <a
                href={LINE_OA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-primary"
              >
                會員登錄 →
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
