import { NextResponse } from "next/server";
import { getBusinessUnitFinancialView, getBusinessUnitKPIs } from "@/lib/awq/selectors/bu";
import type { BusinessUnitId } from "@/lib/awq/schema";

export async function GET(_req: Request, { params }: { params: { buId: string } }) {
  const businessUnitId = params.buId as BusinessUnitId;
  try {
    const financials = getBusinessUnitFinancialView(businessUnitId);
    const kpis = getBusinessUnitKPIs(businessUnitId);
    return NextResponse.json(
      { businessUnitId, financials, kpis, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Invalid or missing business_unit_id" }, { status: 400 });
  }
}
