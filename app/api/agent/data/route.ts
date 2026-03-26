import { NextRequest } from "next/server";
import { validateAgentKey, unauthorizedResponse } from "@/lib/agent";
import {
  kpis,
  revenueData,
  customerSegments,
  topProducts,
  customers,
  regionData,
  channelData,
  alerts,
} from "@/lib/data";

// GET /api/agent/data — full BI data access for OpenClaw
// Optional ?scope=kpis,revenue,customers,segments,products,regions,channels,alerts
export async function GET(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const scopeParam = searchParams.get("scope");
  const scopes = scopeParam
    ? scopeParam.split(",").map((s) => s.trim())
    : ["all"];

  const include = (key: string) =>
    scopes.includes("all") || scopes.includes(key);

  const payload: Record<string, unknown> = {
    bu: "JACQES",
    generatedAt: new Date().toISOString(),
  };

  if (include("kpis")) payload.kpis = kpis;
  if (include("revenue")) payload.revenue = revenueData;
  if (include("segments")) payload.customerSegments = customerSegments;
  if (include("products")) payload.topProducts = topProducts;
  if (include("customers")) payload.customers = customers;
  if (include("regions")) payload.regions = regionData;
  if (include("channels")) payload.channels = channelData;
  if (include("alerts")) payload.alerts = alerts;

  return Response.json(payload);
}
