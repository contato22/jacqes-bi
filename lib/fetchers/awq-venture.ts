/**
 * AWQ Venture Fetcher
 *
 * AWQ Venture is the portfolio/investments layer. It tracks:
 *  - Portfolio companies (Enerdy, FintechX, GreenTech, …)
 *  - Media for Equity deals
 *  - Investment metrics
 *
 * This fetcher aggregates portfolio company data and normalises it.
 * Individual portfolio company financials come from their own fetchers
 * (e.g. enerdy.ts) and are merged here at the venture layer.
 *
 * Source priority: 72
 */

import type {
  CanonicalFinancialRecord,
  CanonicalPortfolioCompany,
  BUDataResult,
} from "@/lib/types/canonical";

import {
  safeFetch,
  makeCanonicalId,
  getQuarter,
  periodToDate,
  calcGrossMargin,
  calcEbitdaMargin,
} from "@/lib/fetchers/base";

import { resolvePortfolioCanonicalId, normalizeToSlug } from "@/lib/consolidation/canonical-identity";
import { getEnerdyFinancials, getEnerdyCompanyRecord } from "@/lib/fetchers/enerdy";

const BU_ID = "awq-venture" as const;
const SOURCE_PRIORITY = 72;
const SOURCE_DB = "awq-venture-notion";

// ─── Portfolio Company Registry ────────────────────────────────────────────────

function buildPortfolioRegistry(): CanonicalPortfolioCompany[] {
  return [
    // Enerdy — detailed fetcher exists
    getEnerdyCompanyRecord(),

    // FintechX — early-stage, media-for-equity deal
    {
      id: "portfolio::fintechx",
      companyCanonicalId: "portfolio::fintechx",
      companyName: "FintechX",
      companySlug: "fintechx",
      cnpj: "88.777.666/0001-44",
      aliases: ["FintechX", "Fintech X", "fintech-x"],
      ownerPortfolio: "awq-venture" as const,
      sector: "Financial Services",
      subSector: "Payments",
      stage: "seed" as const,
      investmentDate: "2024-02-15",
      investmentAmount: 0, // media-for-equity: no cash investment
      equityPercent: 8.0,
      dealType: "media-for-equity" as const,
      currentValuation: 12_000_000,
      linkedBUs: ["jacqes", "caza-vision"],
      latestRevenue: 380_000,
      latestMrr: 130_000,
      latestHeadcount: 22,
      latestMonth: 3,
      latestYear: 2026,
      sourceDatabase: SOURCE_DB,
      dataQualityFlag: "verified" as const,
    },

    // GreenTech — growth stage, mixed deal
    {
      id: "portfolio::greentech",
      companyCanonicalId: "portfolio::greentech",
      companyName: "GreenTech Startup",
      companySlug: "greentech",
      cnpj: "77.666.555/0001-33",
      aliases: ["GreenTech Startup", "GreenTech", "Greentech"],
      ownerPortfolio: "awq-venture" as const,
      sector: "CleanTech",
      subSector: "Carbon Credits",
      stage: "pre-seed" as const,
      investmentDate: "2024-09-01",
      investmentAmount: 1_500_000,
      equityPercent: 12.0,
      dealType: "mixed" as const,
      currentValuation: 9_000_000,
      linkedBUs: [],
      latestRevenue: 210_000,
      latestMrr: 52_500,
      latestHeadcount: 14,
      latestMonth: 3,
      latestYear: 2026,
      sourceDatabase: SOURCE_DB,
      dataQualityFlag: "estimated" as const,
    },
  ];
}

// ─── AWQ Venture own-level P&L (management fees, advisory, fund returns) ────────

async function loadVentureFinancials(): Promise<CanonicalFinancialRecord[]> {
  const raw = [
    { year: 2025, month: 1,  grossRevenue:  95_000, cogs: 19_000, opex: 28_500 },
    { year: 2025, month: 2,  grossRevenue:  98_000, cogs: 19_600, opex: 29_400 },
    { year: 2025, month: 3,  grossRevenue: 102_000, cogs: 20_400, opex: 30_600 },
    { year: 2025, month: 4,  grossRevenue:  99_000, cogs: 19_800, opex: 29_700 },
    { year: 2025, month: 5,  grossRevenue: 110_000, cogs: 22_000, opex: 33_000 },
    { year: 2025, month: 6,  grossRevenue: 115_000, cogs: 23_000, opex: 34_500 },
    { year: 2025, month: 7,  grossRevenue: 118_000, cogs: 23_600, opex: 35_400 },
    { year: 2025, month: 8,  grossRevenue: 120_000, cogs: 24_000, opex: 36_000 },
    { year: 2025, month: 9,  grossRevenue: 125_000, cogs: 25_000, opex: 37_500 },
    { year: 2025, month: 10, grossRevenue: 128_000, cogs: 25_600, opex: 38_400 },
    { year: 2025, month: 11, grossRevenue: 132_000, cogs: 26_400, opex: 39_600 },
    { year: 2025, month: 12, grossRevenue: 138_000, cogs: 27_600, opex: 41_400 },
    { year: 2026, month: 1,  grossRevenue: 145_000, cogs: 29_000, opex: 43_500 },
    { year: 2026, month: 2,  grossRevenue: 150_000, cogs: 30_000, opex: 45_000 },
    { year: 2026, month: 3,  grossRevenue: 158_000, cogs: 31_600, opex: 47_400 },
  ];

  return raw.map((r) => {
    const grossProfit = r.grossRevenue - r.cogs;
    const ebitda = grossProfit - r.opex;
    const netProfit = ebitda * 0.75;

    return {
      id: makeCanonicalId(BU_ID, "venture-pl", r.year, r.month),
      sourceRecordId: `awqv-fin-${r.year}-${String(r.month).padStart(2, "0")}`,
      ownerBU: BU_ID,
      entityType: "bu" as const,
      date: periodToDate(r.year, r.month),
      month: r.month,
      quarter: getQuarter(r.month),
      year: r.year,
      grossRevenue: r.grossRevenue,
      netRevenue: r.grossRevenue,
      recurringRevenue: r.grossRevenue * 0.60,
      nonRecurringRevenue: r.grossRevenue * 0.40,
      cogs: r.cogs,
      grossProfit,
      grossMargin: calcGrossMargin(grossProfit, r.grossRevenue),
      opex: r.opex,
      ebitda,
      ebitdaMargin: calcEbitdaMargin(ebitda, r.grossRevenue),
      netProfit,
      cashFlow: ebitda * 0.90,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion" as const,
      dataQualityFlag: "verified" as const,
      reconciliationStatus: "clean" as const,
      sourcePriority: SOURCE_PRIORITY,
      tags: ["awq-venture", "holding", "investments", "advisory"],
    };
  });
}

// ─── Public Fetch Functions ────────────────────────────────────────────────────

export async function getAwqVenturePortfolio(): Promise<BUDataResult<CanonicalPortfolioCompany>> {
  return safeFetch(BU_ID, "notion", async () => buildPortfolioRegistry());
}

export async function getAwqVentureFinancials(options?: { year?: number; month?: number }): Promise<BUDataResult<CanonicalFinancialRecord>> {
  return safeFetch(BU_ID, "notion", async () => {
    // Venture own P&L + Enerdy financials merged under awq-venture
    const [venturePL, enerdyResult] = await Promise.all([
      loadVentureFinancials(),
      getEnerdyFinancials(options).then((r) => r.data),
    ]);

    const all = [...venturePL, ...enerdyResult];
    return all.filter((r) => {
      if (options?.year && r.year !== options.year) return false;
      if (options?.month && r.month !== options.month) return false;
      return true;
    });
  });
}
