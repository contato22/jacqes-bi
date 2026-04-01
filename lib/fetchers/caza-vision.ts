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
  getQuarter,
  periodToDate,
  calcGrossMargin,
  calcEbitdaMargin,
  calcVariance,
} from "@/lib/fetchers/base";

import { resolveClientCanonicalId, normalizeToSlug } from "@/lib/consolidation/canonical-identity";

const BU_ID = "caza-vision" as const;
const SOURCE_PRIORITY = 75;
const SOURCE_DB = "cazavision-notion-prod";

// ─── Financial Records ─────────────────────────────────────────────────────────

async function loadCazaFinancials(): Promise<CanonicalFinancialRecord[]> {
  // Caza Vision has lower revenue than JACQES but strong gross margins on licensing
  const raw = [
    { year: 2025, month: 1,  grossRevenue:   780_000, cogs: 273_000,  opex: 117_000 },
    { year: 2025, month: 2,  grossRevenue:   840_000, cogs: 294_000,  opex: 126_000 },
    { year: 2025, month: 3,  grossRevenue:   920_000, cogs: 322_000,  opex: 138_000 },
    { year: 2025, month: 4,  grossRevenue:   870_000, cogs: 304_500,  opex: 130_500 },
    { year: 2025, month: 5,  grossRevenue: 1_050_000, cogs: 367_500,  opex: 157_500 },
    { year: 2025, month: 6,  grossRevenue: 1_120_000, cogs: 392_000,  opex: 168_000 },
    { year: 2025, month: 7,  grossRevenue: 1_080_000, cogs: 378_000,  opex: 162_000 },
    { year: 2025, month: 8,  grossRevenue: 1_150_000, cogs: 402_500,  opex: 172_500 },
    { year: 2025, month: 9,  grossRevenue: 1_210_000, cogs: 423_500,  opex: 181_500 },
    { year: 2025, month: 10, grossRevenue: 1_180_000, cogs: 413_000,  opex: 177_000 },
    { year: 2025, month: 11, grossRevenue: 1_260_000, cogs: 441_000,  opex: 189_000 },
    { year: 2025, month: 12, grossRevenue: 1_340_000, cogs: 469_000,  opex: 201_000 },
    { year: 2026, month: 1,  grossRevenue: 1_380_000, cogs: 483_000,  opex: 207_000 },
    { year: 2026, month: 2,  grossRevenue: 1_450_000, cogs: 507_500,  opex: 217_500 },
    { year: 2026, month: 3,  grossRevenue: 1_520_000, cogs: 532_000,  opex: 228_000 },
  ];

  return raw.map((r) => {
    const grossProfit = r.grossRevenue - r.cogs;
    const ebitda = grossProfit - r.opex;
    const netProfit = ebitda * 0.70;
    const netRevenue = r.grossRevenue * 0.98;

    return {
      id: makeCanonicalId(BU_ID, r.year, r.month),
      sourceRecordId: `cv-fin-${r.year}-${String(r.month).padStart(2, "0")}`,
      ownerBU: BU_ID,
      entityType: "bu" as const,
      date: periodToDate(r.year, r.month),
      month: r.month,
      quarter: getQuarter(r.month),
      year: r.year,
      grossRevenue: r.grossRevenue,
      netRevenue,
      recurringRevenue: r.grossRevenue * 0.45, // mix of recurring licenses + project work
      nonRecurringRevenue: r.grossRevenue * 0.55,
      cogs: r.cogs,
      grossProfit,
      grossMargin: calcGrossMargin(grossProfit, r.grossRevenue),
      opex: r.opex,
      ebitda,
      ebitdaMargin: calcEbitdaMargin(ebitda, r.grossRevenue),
      netProfit,
      cashFlow: ebitda * 0.80,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion" as const,
      dataQualityFlag: "verified" as const,
      reconciliationStatus: "clean" as const,
      sourcePriority: SOURCE_PRIORITY,
      tags: ["caza-vision", "audiovisual", "production", "media"],
    };
  });
}

// ─── Customer Records ──────────────────────────────────────────────────────────
//
// IMPORTANT: "Nexus Corporation" here is the same company as "Nexus Corp" in JACQES.
// The canonical-identity engine will resolve both to "client::nexus-corp".
// Similarly, "Stellar Labs" appears identically in both BUs.

async function loadCazaCustomers(): Promise<CanonicalCustomerRecord[]> {
  const raw = [
    // Cross-BU clients (also in JACQES — identity engine will link them)
    { id: "CV001", name: "Nexus Corporation",   email: "media@nexuscorp.com",        cnpj: "12.345.678/0001-01", segment: "Enterprise" as const, ltv: 180_000, cac:  9_000, mrr: 15_000, nrr: 108, status: "active" as const,   country: "US" },
    { id: "CV002", name: "Stellar Labs",         email: "creative@stellarlabs.co",   cnpj: "34.567.890/0001-03", segment: "Startup" as const,    ltv:  28_500, cac:  2_000, mrr:  2_375, nrr:  90, status: "at-risk" as const,  country: "CA" },
    // Caza-only clients
    { id: "CV003", name: "Produtora XYZ",        email: "contato@produtoraXYZ.com.br", cnpj: "91.234.567/0001-09", segment: "SMB" as const,      ltv:  95_000, cac:  5_200, mrr:  7_917, nrr: 105, status: "active" as const,   country: "BR" },
    { id: "CV004", name: "Media Group BR",       email: "financeiro@mediagroupbr.com", cnpj: "82.345.678/0001-10", segment: "Enterprise" as const, ltv: 240_000, cac: 11_000, mrr: 20_000, nrr: 112, status: "active" as const,   country: "BR" },
    { id: "CV005", name: "Agência Creative",     email: "hello@agenciacreative.com.br",cnpj: "73.456.789/0001-11", segment: "SMB" as const,      ltv:  65_000, cac:  4_000, mrr:  5_417, nrr: 102, status: "active" as const,   country: "BR" },
    { id: "CV006", name: "StreamHub LATAM",      email: "ops@streamhublatam.io",       cnpj: "64.567.890/0001-12", segment: "Startup" as const,  ltv:  41_000, cac:  3_100, mrr:  3_417, nrr:  98, status: "active" as const,   country: "BR" },
  ];

  const now = new Date().toISOString();
  return raw.map((r) => {
    const clientCanonicalId = resolveClientCanonicalId({
      name: r.name,
      email: r.email,
      cnpj: r.cnpj,
      ownerBU: BU_ID,
      sourceRecordId: r.id,
    });
    return {
      id: makeCanonicalId(BU_ID, r.id),
      sourceRecordId: r.id,
      clientCanonicalId,
      ownerBU: BU_ID,
      clientName: r.name,
      clientSlug: normalizeToSlug(r.name),
      email: r.email,
      cnpj: r.cnpj,
      segment: r.segment,
      country: r.country,
      status: r.status,
      relationshipType: "client",
      linkedBUs: [BU_ID],
      ltv: r.ltv,
      cac: r.cac,
      mrr: r.mrr,
      nrr: r.nrr,
      payback: r.cac > 0 && r.mrr > 0 ? Math.round(r.cac / (r.mrr * 0.65)) : undefined,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion" as const,
      dataQualityFlag: "verified" as const,
      reconciliationStatus: "clean" as const,
      lastUpdated: now,
    };
  });
}

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
  return safeFetch(BU_ID, "notion", async () => {
    const all = await loadCazaFinancials();
    return all.filter((r) => {
      if (options?.year && r.year !== options.year) return false;
      if (options?.month && r.month !== options.month) return false;
      return true;
    });
  });
}

export async function getCazaVisionCustomers(): Promise<BUDataResult<CanonicalCustomerRecord>> {
  return safeFetch(BU_ID, "notion", loadCazaCustomers);
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
