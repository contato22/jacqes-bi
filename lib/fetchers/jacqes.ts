/**
 * JACQES BU Fetcher
 *
 * Reads JACQES's operational/commercial/growth data and normalises it into
 * canonical shapes. This is the ONLY place JACQES-specific schema knowledge lives.
 *
 * Production implementation: swap the mock generators below for actual
 * Notion/Stripe/HubSpot API calls, then run the same normalisation logic.
 *
 * Source priority: 80 (primary operational data source)
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

const BU_ID = "jacqes" as const;
const SOURCE_PRIORITY = 80;
const SOURCE_DB = "jacqes-notion-main";

// ─── Financial Records ─────────────────────────────────────────────────────────

async function loadJacqesFinancials(): Promise<CanonicalFinancialRecord[]> {
  // Mock — replace with: await notionClient.databases.query({ database_id: JACQES_FINANCE_DB })
  const raw = [
    { year: 2025, month: 1,  grossRevenue: 3_210_000, cogs: 642_000,  opex: 481_500 },
    { year: 2025, month: 2,  grossRevenue: 3_480_000, cogs: 696_000,  opex: 522_000 },
    { year: 2025, month: 3,  grossRevenue: 3_650_000, cogs: 730_000,  opex: 547_500 },
    { year: 2025, month: 4,  grossRevenue: 3_520_000, cogs: 704_000,  opex: 528_000 },
    { year: 2025, month: 5,  grossRevenue: 3_900_000, cogs: 780_000,  opex: 585_000 },
    { year: 2025, month: 6,  grossRevenue: 4_120_000, cogs: 824_000,  opex: 618_000 },
    { year: 2025, month: 7,  grossRevenue: 4_250_000, cogs: 850_000,  opex: 637_500 },
    { year: 2025, month: 8,  grossRevenue: 4_380_000, cogs: 876_000,  opex: 657_000 },
    { year: 2025, month: 9,  grossRevenue: 4_510_000, cogs: 902_000,  opex: 676_500 },
    { year: 2025, month: 10, grossRevenue: 4_620_000, cogs: 924_000,  opex: 693_000 },
    { year: 2025, month: 11, grossRevenue: 4_730_000, cogs: 946_000,  opex: 709_500 },
    { year: 2025, month: 12, grossRevenue: 4_821_500, cogs: 964_300,  opex: 723_225 },
    { year: 2026, month: 1,  grossRevenue: 4_950_000, cogs: 990_000,  opex: 742_500 },
    { year: 2026, month: 2,  grossRevenue: 5_100_000, cogs: 1_020_000, opex: 765_000 },
    { year: 2026, month: 3,  grossRevenue: 5_280_000, cogs: 1_056_000, opex: 792_000 },
  ];

  return raw.map((r) => {
    const grossProfit = r.grossRevenue - r.cogs;
    const ebitda = grossProfit - r.opex;
    const netProfit = ebitda * 0.72; // approx after taxes
    const netRevenue = r.grossRevenue * 0.97; // ~3% returns/discounts

    return {
      id: makeCanonicalId(BU_ID, r.year, r.month),
      sourceRecordId: `jq-fin-${r.year}-${String(r.month).padStart(2, "0")}`,
      ownerBU: BU_ID,
      entityType: "bu" as const,
      date: periodToDate(r.year, r.month),
      month: r.month,
      quarter: getQuarter(r.month),
      year: r.year,
      grossRevenue: r.grossRevenue,
      netRevenue,
      recurringRevenue: r.grossRevenue * 0.78,
      nonRecurringRevenue: r.grossRevenue * 0.22,
      cogs: r.cogs,
      grossProfit,
      grossMargin: calcGrossMargin(grossProfit, r.grossRevenue),
      opex: r.opex,
      ebitda,
      ebitdaMargin: calcEbitdaMargin(ebitda, r.grossRevenue),
      netProfit,
      cashFlow: ebitda * 0.85,
      cashPosition: ebitda * 0.85 * r.month, // cumulative approx
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion" as const,
      dataQualityFlag: "verified" as const,
      reconciliationStatus: "clean" as const,
      sourcePriority: SOURCE_PRIORITY,
      tags: ["jacqes", "saas", "commercial"],
    };
  });
}

// ─── Customer Records ──────────────────────────────────────────────────────────

async function loadJacqesCustomers(): Promise<CanonicalCustomerRecord[]> {
  const raw = [
    { id: "C001", name: "Nexus Corp",         email: "s.mitchell@nexuscorp.com",   cnpj: "12.345.678/0001-01", segment: "Enterprise" as const, ltv: 284_500, cac: 12_000, mrr: 23_700, nrr: 112, status: "active" as const,   country: "US" },
    { id: "C002", name: "Zenith Digital",     email: "james@zenithdigital.io",     cnpj: "23.456.789/0001-02", segment: "SMB" as const,        ltv: 94_200,  cac:  4_200, mrr:  7_850, nrr: 108, status: "active" as const,   country: "UK" },
    { id: "C003", name: "Stellar Labs",       email: "apatel@stellarlabs.co",      cnpj: "34.567.890/0001-03", segment: "Startup" as const,    ltv: 38_700,  cac:  2_100, mrr:  3_225, nrr:  95, status: "at-risk" as const,  country: "CA" },
    { id: "C004", name: "EuroVenture GmbH",   email: "lhoffmann@euroventure.de",   cnpj: "45.678.901/0001-04", segment: "Enterprise" as const, ltv: 312_000, cac: 14_500, mrr: 26_000, nrr: 118, status: "active" as const,   country: "DE" },
    { id: "C005", name: "AfricaTech Hub",     email: "kasante@africatechhub.com",  cnpj: "56.789.012/0001-05", segment: "SMB" as const,        ltv: 67_400,  cac:  3_800, mrr:  5_617, nrr:  92, status: "at-risk" as const,  country: "GH" },
    { id: "C006", name: "Shibuya Solutions",  email: "y.tanaka@shibuya.jp",        cnpj: "67.890.123/0001-06", segment: "Enterprise" as const, ltv: 198_000, cac: 11_200, mrr: 16_500, nrr: 110, status: "active" as const,   country: "JP" },
    { id: "C007", name: "LatamScale",         email: "diego@latamscale.mx",        cnpj: "78.901.234/0001-07", segment: "Startup" as const,    ltv: 22_100,  cac:  1_900, mrr:      0, nrr:   0, status: "churned" as const,  country: "MX" },
    { id: "C008", name: "Baltic Systems",     email: "nvolkov@balticsys.ee",       cnpj: "89.012.345/0001-08", segment: "SMB" as const,        ltv: 81_500,  cac:  4_600, mrr:  6_792, nrr: 104, status: "active" as const,   country: "EE" },
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
      linkedBUs: [BU_ID], // will be enriched post-union
      ltv: r.ltv,
      cac: r.cac,
      mrr: r.mrr,
      nrr: r.nrr,
      payback: r.cac > 0 && r.mrr > 0 ? Math.round(r.cac / (r.mrr * 0.7)) : undefined,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion" as const,
      dataQualityFlag: "verified" as const,
      reconciliationStatus: "clean" as const,
      lastUpdated: now,
    };
  });
}

// ─── Budget Records ────────────────────────────────────────────────────────────

async function loadJacqesBudgets(): Promise<CanonicalBudgetRecord[]> {
  const raw = [
    { year: 2026, month: 1, category: "Revenue",      budget: 4_800_000, actual: 4_950_000 },
    { year: 2026, month: 1, category: "COGS",         budget:   960_000, actual:   990_000 },
    { year: 2026, month: 1, category: "OPEX",         budget:   720_000, actual:   742_500 },
    { year: 2026, month: 2, category: "Revenue",      budget: 5_000_000, actual: 5_100_000 },
    { year: 2026, month: 2, category: "COGS",         budget: 1_000_000, actual: 1_020_000 },
    { year: 2026, month: 2, category: "OPEX",         budget:   750_000, actual:   765_000 },
    { year: 2026, month: 3, category: "Revenue",      budget: 5_200_000, actual: 5_280_000 },
    { year: 2026, month: 3, category: "COGS",         budget: 1_040_000, actual: 1_056_000 },
    { year: 2026, month: 3, category: "OPEX",         budget:   780_000, actual:   792_000 },
  ];

  return raw.map((r) => {
    const v = calcVariance(r.actual, r.budget);
    return {
      id: makeCanonicalId(BU_ID, "budget", r.year, r.month, r.category),
      sourceRecordId: `jq-bgt-${r.year}-${String(r.month).padStart(2, "0")}-${r.category}`,
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

async function loadJacqesUnitEconomics(): Promise<CanonicalUnitEconomicsRecord[]> {
  const raw = [
    { year: 2025, month: 12, mrr: 4_010_000, nrr: 114, cac:  5_800, ltv: 142_000, new: 48, churned: 12 },
    { year: 2026, month:  1, mrr: 4_125_000, nrr: 115, cac:  5_600, ltv: 148_000, new: 52, churned: 10 },
    { year: 2026, month:  2, mrr: 4_250_000, nrr: 116, cac:  5_500, ltv: 153_000, new: 55, churned:  9 },
    { year: 2026, month:  3, mrr: 4_400_000, nrr: 117, cac:  5_300, ltv: 158_000, new: 58, churned:  8 },
  ];

  return raw.map((r) => ({
    id: makeCanonicalId(BU_ID, "ue", r.year, r.month),
    ownerBU: BU_ID,
    month: r.month,
    year: r.year,
    mrr: r.mrr,
    arr: r.mrr * 12,
    nrr: r.nrr,
    grossChurnRate: parseFloat(((r.churned / (r.new * 10)) * 100).toFixed(2)),
    netChurnRate: parseFloat(((r.nrr - 100) * -0.1).toFixed(2)),
    cac: r.cac,
    ltv: r.ltv,
    ltvCacRatio: parseFloat((r.ltv / r.cac).toFixed(2)),
    paybackMonths: Math.round(r.cac / (r.mrr / (r.new * 10) * 0.7)),
    newCustomers: r.new,
    churnedCustomers: r.churned,
    expandedRevenue: r.mrr * 0.08,
    contractedRevenue: r.mrr * 0.02,
    sourceDatabase: SOURCE_DB,
    sourceSystem: "notion" as const,
    dataQualityFlag: "verified" as const,
  }));
}

// ─── Public BU Fetch Functions ─────────────────────────────────────────────────

export async function getJacqesFinancials(options?: { year?: number; month?: number }): Promise<BUDataResult<CanonicalFinancialRecord>> {
  return safeFetch(BU_ID, "notion", async () => {
    const all = await loadJacqesFinancials();
    return all.filter((r) => {
      if (options?.year && r.year !== options.year) return false;
      if (options?.month && r.month !== options.month) return false;
      return true;
    });
  });
}

export async function getJacqesCustomers(): Promise<BUDataResult<CanonicalCustomerRecord>> {
  return safeFetch(BU_ID, "notion", loadJacqesCustomers);
}

export async function getJacqesBudgets(options?: { year?: number }): Promise<BUDataResult<CanonicalBudgetRecord>> {
  return safeFetch(BU_ID, "sheets", async () => {
    const all = await loadJacqesBudgets();
    return options?.year ? all.filter((r) => r.year === options.year) : all;
  });
}

export async function getJacqesUnitEconomics(): Promise<BUDataResult<CanonicalUnitEconomicsRecord>> {
  return safeFetch(BU_ID, "notion", loadJacqesUnitEconomics);
}
