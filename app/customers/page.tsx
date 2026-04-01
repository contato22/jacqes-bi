"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy route — client-side redirect to JACQES scoped customers page.
 * Server-side redirect() is incompatible with static export.
 */
export default function CustomersPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/jacqes/customers"); }, [router]);
  return <div className="min-h-screen bg-gray-950" />;
}
