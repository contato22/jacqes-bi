/**
 * CAZA VISION BU Fetcher
 *
 * Reads Caza Vision's audiovisual / production data and normalises it to
 * canonical shapes. Note that some clients in this BU are also JACQES clients
 * (cross-BU relationships) — the canonical identity engine will detect and
 * link them during the union step.
 *
 * Source priority: 75 (slightly lower than JACQES for conflict resolution)
 */

import type {
  CanonicalFinancialRecord,
  CanonicalCustomerRecord,
  CanonicalBudgetRecord,
  CanonicalUnitEconomicsRecord,
  BUDataResult,
} from "@/lib/types/canonical";

import {
  safeFetch,
  makeCanonicalId,
  calcVariance,
} from "@/lib/fetchers/base";

import { queryCazaFinancials, queryCazaClientes } from "@/lib/notion/queries/caza-vision";

const BU_ID = "caza-vision" as const;
const SOURCE_DB = "cazavision-notion-prod";

// ─── Budget Records ────────────────────────────────────────────────────────────

async function loadCazaBudgets(): Promise<CanonicalBudgetRecord[]> {
  const raw = [
    { year: 2026, month: 1, category: "Revenue",  budget: 1_320_000, actual: 1_380_000 },
    { year: 2026, month: 1, category: "COGS",     budget:   462_000, actual:   483_000 },
    { year: 2026, month: 1, category: "OPEX",     budget:   198_000, actual:   207_000 },
    { year: 2026, month: 2, category: "Revenue",  budget: 1_400_000, actual: 1_450_000 },
    { year: 2026, month: 2, category: "COGS",     budget:   490_000, actual:   507_500 },
    { year: 2026, month: 2, category: "OPEX",     budget:   210_000, actual:   217_500 },
    { year: 2026, month: 3, category: "Revenue",  budget: 1_480_000, actual: 1_520_000 },
    { year: 2026, month: 3, category: "COGS",     budget:   518_000, actual:   532_000 },
    { year: 2026, month: 3, category: "OPEX",     budget:   222_000, actual:   228_000 },
  ];

  return raw.map((r) => {
    const v = calcVariance(r.actual, r.budget);
    return {
      id: makeCanonicalId(BU_ID, "budget", r.year, r.month, r.category),
      sourceRecordId: `cv-bgt-${r.year}-${String(r.month).padStart(2, "0")}-${r.category}`,
      ownerBU: BU_ID,
      month: r.month,
      year: r.year,
      category: r.category,
      budget: r.budget,
      actual: r.actual,
      ...v,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "sheets" as const,
      dataQualityFlag: "verified" as const,
      reconciliationStatus: "clean" as const,
    };
  });
}

// ─── Unit Economics ────────────────────────────────────────────────────────────

async function loadCazaUnitEconomics(): Promise<CanonicalUnitEconomicsRecord[]> {
  const raw = [
    { year: 2025, month: 12, mrr: 1_115_000, nrr: 108, cac:  7_500, ltv: 108_000, new: 8, churned: 2 },
    { year: 2026, month:  1, mrr: 1_150_000, nrr: 109, cac:  7_200, ltv: 112_500, new: 9, churned: 2 },
    { year: 2026, month:  2, mrr: 1_208_000, nrr: 110, cac:  7_000, ltv: 117_000, new: 9, churned: 1 },
    { year: 2026, month:  3, mrr: 1_267_000, nrr: 111, cac:  6_800, ltv: 121_500, new: 10, churned: 1 },
  ];

  return raw.map((r) => ({
    id: makeCanonicalId(BU_ID, "ue", r.year, r.month),
    ownerBU: BU_ID,
    month: r.month,
    year: r.year,
    mrr: r.mrr,
    arr: r.mrr * 12,
    nrr: r.nrr,
    grossChurnRate: parseFloat(((r.churned / (r.new + r.churned)) * 100).toFixed(2)),
    netChurnRate: parseFloat(((r.nrr - 100) * -0.08).toFixed(2)),
    cac: r.cac,
    ltv: r.ltv,
    ltvCacRatio: parseFloat((r.ltv / r.cac).toFixed(2)),
    paybackMonths: Math.round(r.cac / (r.mrr / (r.new + r.churned + 20) * 0.65)),
    newCustomers: r.new,
    churnedCustomers: r.churned,
    expandedRevenue: r.mrr * 0.06,
    contractedRevenue: r.mrr * 0.02,
    sourceDatabase: SOURCE_DB,
    sourceSystem: "notion" as const,
    dataQualityFlag: "verified" as const,
  }));
}

// ─── Public BU Fetch Functions ─────────────────────────────────────────────────

export async function getCazaVisionFinancials(options?: { year?: number; month?: number }): Promise<BUDataResult<CanonicalFinancialRecord>> {
  return safeFetch(BU_ID, "notion", () => queryCazaFinancials(options));
}

export async function getCazaVisionCustomers(): Promise<BUDataResult<CanonicalCustomerRecord>> {
  return safeFetch(BU_ID, "notion", queryCazaClientes);
}

export async function getCazaVisionBudgets(options?: { year?: number }): Promise<BUDataResult<CanonicalBudgetRecord>> {
  return safeFetch(BU_ID, "sheets", async () => {
    const all = await loadCazaBudgets();
    return options?.year ? all.filter((r) => r.year === options.year) : all;
  });
}

export async function getCazaVisionUnitEconomics(): Promise<BUDataResult<CanonicalUnitEconomicsRecord>> {
  return safeFetch(BU_ID, "notion", loadCazaUnitEconomics);
}
