import { NextResponse } from "next/server";
import { getHoldingPortfolioOverview } from "@/lib/awq/selectors/holding";

export async function GET() {
  const portfolio = getHoldingPortfolioOverview();
  return NextResponse.json(
    { portfolio, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
