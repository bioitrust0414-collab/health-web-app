import { AuthProvider } from "@/contexts/AuthContext";

// ... 保留所有現有 import 與邏輯不變 ...

function RootComponent() {
  return (
    <AuthProvider>
      {/* 你原本的內容，例如 <Navbar />、<Outlet />、<Footer /> 等 */}
      <Outlet />
    </AuthProvider>
  );
}
