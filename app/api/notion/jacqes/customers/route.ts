// ─── API Route: JACQES Customers ─────────────────────────────────────────────
// GET /api/notion/jacqes/customers

import { NextResponse } from "next/server";
import { getJacqesCustomersData } from "@/lib/data-sources";

export const revalidate = parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10);

export async function GET() {
  try {
    const result = await getJacqesCustomersData();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /notion/jacqes/customers]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
