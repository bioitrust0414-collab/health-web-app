import { createRootRoute, Outlet } from "@tanstack/react-router";
import "@/styles/dahua.css";   // ← 全局樣式，所有路由自動繼承

export const Route = createRootRoute({
  component: () => <Outlet />,
});
