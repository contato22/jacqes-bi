"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FinancialRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/revenue");
  }, [router]);
  return null;
}
