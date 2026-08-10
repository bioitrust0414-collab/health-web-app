import { useState } from "react";

const LINE_OA_URL = "https://lin.ee/NCshL6k";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "首頁", href: "/" },
    { label: "衛教知識", href: "/health-education" },
    { label: "健檢預約", href: "/booking" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-bold text-lg text-gray-900">
          大華醫檢
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {item.label}
            </a>
          ))}
          <a
            href={LINE_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            會員登錄
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-gray-700 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={LINE_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 font-medium py-1"
          >
            會員登錄 →
          </a>
        </div>
      )}
    </header>
  );
}
