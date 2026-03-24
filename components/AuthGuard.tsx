"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PeriodProvider } from "@/contexts/PeriodContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/Sidebar";
import OpenClaw from "@/components/OpenClaw";

const PUBLIC_PATHS = ["/login"];

// Rotas acessíveis a todos os usuários autenticados (não apenas admin)
const ALL_USER_PATHS = ["/", "/group", "/m4e", "/cazavision"];

function AuthGuardInner({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { open: sidebarOpen, close: closeSidebar } = useSidebar();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) { setReady(true); return; }
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? "/")}`);
    } else if (
      user.role === "user" &&
      !ALL_USER_PATHS.some((p) => pathname === p || pathname?.startsWith(p + "/"))
    ) {
      router.replace("/");
    } else {
      setReady(true);
    }
  }, [pathname, router, user, isLoading]);

  // Close sidebar on route change (mobile)
  useEffect(() => { closeSidebar(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) return <>{children}</>;

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <OpenClaw />
    </div>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PeriodProvider>
        <SidebarProvider>
          <AuthGuardInner>{children}</AuthGuardInner>
        </SidebarProvider>
      </PeriodProvider>
    </AuthProvider>
  );
}
