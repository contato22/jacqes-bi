// ─── API Route: AWQ Venture Portfolio ────────────────────────────────────────
// GET /api/notion/awq-venture/portfolio
//
// Retorna:
//   - portfolio: empresas da base AWQ Venture (null se DB não configurado)
//   - enerdy.financial: dados financeiros da Enerdy
//   - enerdy.unitEconomics: unit economics da Enerdy
//
// Cada fonte falha independentemente — nenhuma bloqueia as demais.

import { NextResponse } from "next/server";
import {
  getAWQVenturePortfolioData,
  getEnerdyFinancialData,
  getEnerdyUnitEconomicsData,
} from "@/lib/data-sources";

export const revalidate = parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10);

async function safe<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[API awq-venture/portfolio] fonte ignorada:", (err as Error).message);
    return null;
  }
}

export async function GET() {
  try {
    const [portfolio, enerdyFinancial, enerdyUnitEconomics] = await Promise.all([
      safe(getAWQVenturePortfolioData),  // null se NOTION_DB_AWQ_VENTURE_PORTFOLIO não configurado
      safe(getEnerdyFinancialData),
      safe(getEnerdyUnitEconomicsData),
    ]);

    return NextResponse.json(
      {
        portfolio,
        enerdy: {
          financial:     enerdyFinancial,
          unitEconomics: enerdyUnitEconomics,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /notion/awq-venture/portfolio]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
