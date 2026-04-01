// ─── API Route: AWQ Venture Portfolio ────────────────────────────────────────
// GET /api/notion/awq-venture/portfolio
//
// Returns all portfolio companies plus Enerdy financial/unit-economics data
// (null fields if those databases are not yet configured).

import { NextResponse } from "next/server";
import {
  getAWQVenturePortfolioData,
  getEnerdyFinancialData,
  getEnerdyUnitEconomicsData,
} from "@/lib/data-sources";

export const revalidate = parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10);

export async function GET() {
  try {
    // Fetch portfolio + Enerdy data concurrently;
    // Enerdy calls resolve to null if not yet configured.
    const [portfolio, enerdyFinancial, enerdyUnitEconomics] =
      await Promise.all([
        getAWQVenturePortfolioData(),
        getEnerdyFinancialData(),
        getEnerdyUnitEconomicsData(),
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
