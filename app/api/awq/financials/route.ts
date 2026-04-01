import { NextResponse } from "next/server";
import { getHoldingConsolidatedFinancials, getHoldingConsolidatedKPIs } from "@/lib/awq/selectors/holding";

export async function GET() {
  const financials = getHoldingConsolidatedFinancials();
  const kpis = getHoldingConsolidatedKPIs();
  return NextResponse.json(
    { financials, kpis, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
