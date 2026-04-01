/**
 * GET /api/awq/consolidated
 *
 * Returns the full AWQ holding-level consolidated payload.
 * Supports optional query params: year, month, granularity
 *
 * Example: /api/awq/consolidated?year=2026&granularity=monthly
 */

import { NextRequest, NextResponse } from "next/server";
import { getAwqConsolidatedData } from "@/lib/fetchers/awq-consolidated";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
  const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;
  const granularity = (searchParams.get("granularity") as "monthly" | "quarterly" | "annual") ?? "monthly";

  try {
    const payload = await getAwqConsolidatedData({ year, month, granularity });

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal consolidation error";
    console.error("[API /awq/consolidated]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
