import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/dahua/Navbar";
import { Footer } from "@/components/dahua/Footer";
import { SocialFab } from "@/components/dahua/SocialFab";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <SocialFab />
      </div>
    </AuthProvider>
  );
}
