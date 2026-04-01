"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy route — client-side redirect to JACQES scoped revenue page.
 * Server-side redirect() is incompatible with static export.
 */
export default function RevenuePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/jacqes/revenue"); }, [router]);
  return <div className="min-h-screen bg-gray-950" />;
}
