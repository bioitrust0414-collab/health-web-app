import { createRootRoute, Outlet } from "@tanstack/react-router";
import "@/styles.css";        // ← Tailwind + 設計系統
import "@/styles/dahua.css";  // ← dahua layout 樣式

export const Route = createRootRoute({
  component: () => <Outlet />,
});
