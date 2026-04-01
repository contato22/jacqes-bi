"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root route — client-side redirect to AWQ Control Tower.
 * Server-side redirect() is incompatible with static export.
 * Migration note: in contato22/awq repo this page can be replaced
 * by the AWQ Control Tower content directly (no redirect needed).
 */
export default function RootPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/awq"); }, [router]);
  return <div className="min-h-screen bg-gray-950" />;
}
