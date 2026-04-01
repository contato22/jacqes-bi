import { NextResponse } from "next/server";
import { getHoldingConsolidatedKPIs, getHoldingRiskOverview } from "@/lib/awq/selectors/holding";

export async function GET() {
  const kpis = getHoldingConsolidatedKPIs();
  const risk = getHoldingRiskOverview();
  return NextResponse.json(
    { kpis, risk, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
