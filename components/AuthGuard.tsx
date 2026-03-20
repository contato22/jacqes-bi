"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const SESSION_KEY = "jacqes_session";
const SESSION_TOKEN = "jacqes-bi-danilo-awq";
const PUBLIC_PATHS = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "authed" | "public">("checking");

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
      setStatus("public");
      return;
    }
    const token = localStorage.getItem(SESSION_KEY);
    if (token !== SESSION_TOKEN) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? "/")}`);
    } else {
      setStatus("authed");
    }
  }, [pathname, router]);

  // Login page: no sidebar, no auth check
  if (status === "public") {
    return <>{children}</>;
  }

  // Still checking
  if (status === "checking") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated: render with Sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
