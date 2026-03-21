"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import OpenClaw from "@/components/OpenClaw";

const PUBLIC_PATHS = ["/login"];

function AuthGuardInner({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
      setReady(true);
      return;
    }

    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? "/")}`);
    } else if (user.role === "user" && pathname !== "/") {
      // Danilo (user role) can only access Visão Geral
      router.replace("/");
    } else {
      setReady(true);
    }
  }, [pathname, router, user, isLoading]);

  // Login page: sem sidebar nem guard
  if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
    return <>{children}</>;
  }

  // Carregando
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
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
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
      <AuthGuardInner>{children}</AuthGuardInner>
    </AuthProvider>
  );
}
