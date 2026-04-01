import { NextResponse } from "next/server";
import { awqBusinessUnits } from "@/lib/data";

export async function GET() {
  // In production, fetch live data from ERP / data warehouse.
  // Here we apply a tiny random variance (±1.5%) to simulate live fluctuations.
  const variance = () => 1 + (Math.random() - 0.5) * 0.03;

  const liveUnits = awqBusinessUnits.map((bu) => ({
    ...bu,
    revenue: Math.round(bu.revenue * variance()),
    lastUpdated: new Date().toISOString(),
  }));

  return NextResponse.json(
    { units: liveUnits, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
