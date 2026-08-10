import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ExternalLink, Stethoscope } from "lucide-react";

const LINE_OA_URL = "https://line.me/R/ti/p/@你的LINEOA帳號"; // ← 換成你的 LINE OA
const LINE_PWA_URL = "https://liff.line.me/你的LIFF_ID";      // ← 換成你的 LIFF URL

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
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>大華醫檢</span>
        </a>

        {/* Desktop Nav */}
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href={LINE_O
