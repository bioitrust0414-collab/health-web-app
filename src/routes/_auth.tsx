import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { MemberNavbar } from "@/components/member/MemberNavbar";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: "/" });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavbar />
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
