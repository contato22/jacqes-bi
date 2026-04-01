// ─── API Route: JACQES Financial ─────────────────────────────────────────────
// GET /api/notion/jacqes/financial
//
// Returns normalised FinancialRecord[] for the JACQES BI dashboard.
// The Notion token never leaves this server-side handler.

import { NextResponse } from "next/server";
import { getJacqesFinancialData } from "@/lib/data-sources";

export const revalidate = parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10);

export async function GET() {
  try {
    const result = await getJacqesFinancialData();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /notion/jacqes/financial]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
