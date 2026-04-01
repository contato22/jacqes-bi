/**
 * GET /api/caza-vision
 * Returns Caza Vision BU data in canonical form (isolated).
 */

import { NextRequest, NextResponse } from "next/server";
import { getCazaVisionData } from "@/lib/fetchers/awq-consolidated";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
  const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;

  try {
    const data = await getCazaVisionData({ year, month });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
