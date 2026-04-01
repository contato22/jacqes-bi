/**
 * Group Metrics Engine
 *
 * Aggregates canonical records into holding-level consolidated metrics.
 * Produces ConsolidatedMetricRecord objects that power the AWQ dashboard.
 *
 * Key aggregations:
 *  - P&L consolidation (sum revenue/costs/margins across BUs)
 *  - Per-BU breakdown with revenue share
 *  - Budget vs actual consolidation
 *  - Period-based grouping (monthly, quarterly, annual)
 *  - Portfolio revenue attribution
 */

import type {
  CanonicalFinancialRecord,
  CanonicalBudgetRecord,
  BusinessUnitId,
  ConsolidatedMetricRecord,
  PeriodGranularity,
} from "@/lib/types/canonical";

// ─── Period Key Helpers ────────────────────────────────────────────────────────

function monthlyKey(r: CanonicalFinancialRecord): string {
  return `${r.year}-${String(r.month).padStart(2, "0")}`;
}

function quarterlyKey(r: CanonicalFinancialRecord): string {
  const q = Math.ceil(r.month / 3);
  return `${r.year}-Q${q}`;
}

function annualKey(r: CanonicalFinancialRecord): string {
  return `${r.year}`;
}

function periodKeyFor(
  r: CanonicalFinancialRecord,
  granularity: PeriodGranularity
): string {
  switch (granularity) {
    case "monthly":
      return monthlyKey(r);
    case "quarterly":
      return quarterlyKey(r);
    case "annual":
      return annualKey(r);
  }
}

// ─── Core Aggregation ──────────────────────────────────────────────────────────

const BUSINESS_UNITS: BusinessUnitId[] = [
  "jacqes",
  "caza-vision",
  "awq-venture",
  "awq-holding",
];

/**
 * Aggregates a flat list of financial records into ConsolidatedMetricRecord
 * entries grouped by the requested period granularity.
 */
export function aggregateByPeriod(
  financials: CanonicalFinancialRecord[],
  budgets: CanonicalBudgetRecord[],
  granularity: PeriodGranularity = "monthly"
): ConsolidatedMetricRecord[] {
  // Group financials by period
  const periodMap = new Map<string, CanonicalFinancialRecord[]>();
  for (const record of financials) {
    const key = periodKeyFor(record, granularity);
    const group = periodMap.get(key) ?? [];
    group.push(record);
    periodMap.set(key, group);
  }

  // Group budgets by period
  const budgetPeriodMap = new Map<string, CanonicalBudgetRecord[]>();
  for (const b of budgets) {
    const key =
      granularity === "monthly"
        ? `${b.year}-${String(b.month).padStart(2, "0")}`
        : granularity === "quarterly"
        ? `${b.year}-Q${Math.ceil(b.month / 3)}`
        : `${b.year}`;
    const group = budgetPeriodMap.get(key) ?? [];
    group.push(b);
    budgetPeriodMap.set(key, group);
  }

  const results: ConsolidatedMetricRecord[] = [];

  for (const [period, records] of Array.from(periodMap.entries())) {
    const metric = buildSingleMetric(period, granularity, records);

    // Inject budget vs actual
    const periodBudgets = budgetPeriodMap.get(period) ?? [];
    const totalBudget = periodBudgets
      .filter((b) => b.category === "Revenue")
      .reduce((s, b) => s + b.budget, 0);
    const totalActual = periodBudgets
      .filter((b) => b.category === "Revenue")
      .reduce((s, b) => s + b.actual, 0);
    const totalVariance = totalActual - totalBudget;
    const totalVariancePercent =
      totalBudget !== 0
        ? parseFloat(((totalVariance / totalBudget) * 100).toFixed(2))
        : 0;

    metric.totalBudget = totalBudget;
    metric.totalActual = totalActual;
    metric.totalVariance = totalVariance;
    metric.totalVariancePercent = totalVariancePercent;

    results.push(metric);
  }

  // Sort chronologically
  return results.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.quarter !== undefined && b.quarter !== undefined) {
      return a.quarter - b.quarter;
    }
    if (a.month !== undefined && b.month !== undefined) {
      return a.month - b.month;
    }
    return 0;
  });
}

function buildSingleMetric(
  period: string,
  granularity: PeriodGranularity,
  records: CanonicalFinancialRecord[]
): ConsolidatedMetricRecord {
  // Parse period back to year/month/quarter
  let year = 0;
  let month: number | undefined;
  let quarter: number | undefined;

  if (granularity === "monthly") {
    const [y, m] = period.split("-").map(Number);
    year = y;
    month = m;
    quarter = Math.ceil(m / 3);
  } else if (granularity === "quarterly") {
    const [y, q] = period.split("-Q");
    year = parseInt(y);
    quarter = parseInt(q);
  } else {
    year = parseInt(period);
  }

  // Total P&L
  const totalGrossRevenue = records.reduce((s, r) => s + r.grossRevenue, 0);
  const totalNetRevenue = records.reduce((s, r) => s + r.netRevenue, 0);
  const totalCogs = records.reduce((s, r) => s + r.cogs, 0);
  const totalGrossProfit = records.reduce((s, r) => s + r.grossProfit, 0);
  const totalOpex = records.reduce((s, r) => s + r.opex, 0);
  const totalEbitda = records.reduce((s, r) => s + r.ebitda, 0);
  const totalCashFlow = records.reduce((s, r) => s + (r.cashFlow ?? 0), 0);
  const totalNetProfit = records.reduce((s, r) => s + r.netProfit, 0);

  const blendedGrossMargin =
    totalGrossRevenue > 0
      ? parseFloat(((totalGrossProfit / totalGrossRevenue) * 100).toFixed(2))
      : 0;
  const blendedEbitdaMargin =
    totalGrossRevenue > 0
      ? parseFloat(((totalEbitda / totalGrossRevenue) * 100).toFixed(2))
      : 0;

  // Per-BU breakdown
  const byBU: ConsolidatedMetricRecord["byBU"] = {};
  for (const buId of BUSINESS_UNITS) {
    const buRecords = records.filter((r) => r.ownerBU === buId);
    if (buRecords.length === 0) continue;

    const grossRevenue = buRecords.reduce((s, r) => s + r.grossRevenue, 0);
    const netRevenue = buRecords.reduce((s, r) => s + r.netRevenue, 0);
    const grossProfit = buRecords.reduce((s, r) => s + r.grossProfit, 0);
    const opex = buRecords.reduce((s, r) => s + r.opex, 0);
    const ebitda = buRecords.reduce((s, r) => s + r.ebitda, 0);
    const grossMargin =
      grossRevenue > 0
        ? parseFloat(((grossProfit / grossRevenue) * 100).toFixed(2))
        : 0;
    const revenueShare =
      totalGrossRevenue > 0
        ? parseFloat(((grossRevenue / totalGrossRevenue) * 100).toFixed(2))
        : 0;

    byBU[buId] = {
      grossRevenue,
      netRevenue,
      grossProfit,
      grossMargin,
      opex,
      ebitda,
      revenueShare,
    };
  }

  // Portfolio metrics
  const ventureRecords = records.filter((r) => r.ownerBU === "awq-venture");
  const portfolioCompanies = new Set(
    ventureRecords.map((r) => r.portfolioCompany).filter(Boolean)
  );

  return {
    id: `consolidated::${period}`,
    period,
    granularity,
    year,
    month,
    quarter,
    totalGrossRevenue,
    totalNetRevenue,
    totalCogs,
    totalGrossProfit,
    blendedGrossMargin,
    totalOpex,
    totalEbitda,
    blendedEbitdaMargin,
    totalCashFlow,
    byBU,
    totalBudget: 0, // filled by caller
    totalActual: 0,
    totalVariance: 0,
    totalVariancePercent: 0,
    portfolioRevenue: ventureRecords.reduce((s, r) => s + r.grossRevenue, 0),
    portfolioCount: portfolioCompanies.size,
  };
}

// ─── Convenience: Latest Month Snapshot ───────────────────────────────────────

/**
 * Returns the most recent ConsolidatedMetricRecord from a set of monthly metrics.
 */
export function getLatestMetric(
  metrics: ConsolidatedMetricRecord[]
): ConsolidatedMetricRecord | undefined {
  const monthly = metrics.filter((m) => m.granularity === "monthly" && m.month !== undefined);
  if (monthly.length === 0) return undefined;
  return monthly.reduce((latest, m) => {
    const lv = latest.year * 100 + (latest.month ?? 0);
    const mv = m.year * 100 + (m.month ?? 0);
    return mv > lv ? m : latest;
  });
}

// ─── YoY / MoM Growth ─────────────────────────────────────────────────────────

export interface GrowthComparison {
  current: number;
  previous: number;
  delta: number;
  deltaPercent: number;
}

export function calcGrowth(current: number, previous: number): GrowthComparison {
  const delta = current - previous;
  const deltaPercent =
    previous !== 0 ? parseFloat(((delta / previous) * 100).toFixed(2)) : 0;
  return { current, previous, delta, deltaPercent };
}

/**
 * Given sorted monthly metrics, computes MoM growth for a given metric field.
 */
export function computeMoMGrowth(
  metrics: ConsolidatedMetricRecord[],
  field: keyof ConsolidatedMetricRecord
): GrowthComparison | null {
  const monthly = metrics
    .filter((m) => m.granularity === "monthly")
    .sort((a, b) => a.year * 100 + (a.month ?? 0) - (b.year * 100 + (b.month ?? 0)));

  if (monthly.length < 2) return null;
  const current = monthly[monthly.length - 1][field] as number;
  const previous = monthly[monthly.length - 2][field] as number;
  return calcGrowth(current, previous);
}

// ─── Mini P&L Summary ─────────────────────────────────────────────────────────

export interface MiniPL {
  buId: BusinessUnitId | "consolidated";
  period: string;
  grossRevenue: number;
  netRevenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  opex: number;
  ebitda: number;
  ebitdaMargin: number;
  netProfit: number;
  cashFlow: number;
}

/**
 * Produces a mini P&L per BU and one consolidated row for a given period.
 */
export function buildMiniPL(
  financials: CanonicalFinancialRecord[],
  options: { year?: number; month?: number } = {}
): MiniPL[] {
  const filtered = financials.filter((f) => {
    if (options.year && f.year !== options.year) return false;
    if (options.month && f.month !== options.month) return false;
    return true;
  });

  const period =
    options.year && options.month
      ? `${options.year}-${String(options.month).padStart(2, "0")}`
      : options.year
      ? `${options.year}`
      : "all";

  const byBU = new Map<BusinessUnitId, CanonicalFinancialRecord[]>();
  for (const f of filtered) {
    const group = byBU.get(f.ownerBU) ?? [];
    group.push(f);
    byBU.set(f.ownerBU, group);
  }

  const rows: MiniPL[] = [];

  for (const [buId, records] of Array.from(byBU.entries())) {
    const grossRevenue = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.grossRevenue, 0);
    const netRevenue = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.netRevenue, 0);
    const cogs = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.cogs, 0);
    const grossProfit = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.grossProfit, 0);
    const opex = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.opex, 0);
    const ebitda = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.ebitda, 0);
    const netProfit = records.reduce((s: number, r: CanonicalFinancialRecord) => s + r.netProfit, 0);
    const cashFlow = records.reduce((s: number, r: CanonicalFinancialRecord) => s + (r.cashFlow ?? 0), 0);
    const grossMargin =
      grossRevenue > 0 ? parseFloat(((grossProfit / grossRevenue) * 100).toFixed(2)) : 0;
    const ebitdaMargin =
      grossRevenue > 0 ? parseFloat(((ebitda / grossRevenue) * 100).toFixed(2)) : 0;

    rows.push({
      buId,
      period,
      grossRevenue,
      netRevenue,
      cogs,
      grossProfit,
      grossMargin,
      opex,
      ebitda,
      ebitdaMargin,
      netProfit,
      cashFlow,
    });
  }

  // Add consolidated row
  const consolidated: MiniPL = {
    buId: "consolidated",
    period,
    grossRevenue: rows.reduce((s, r) => s + r.grossRevenue, 0),
    netRevenue: rows.reduce((s, r) => s + r.netRevenue, 0),
    cogs: rows.reduce((s, r) => s + r.cogs, 0),
    grossProfit: rows.reduce((s, r) => s + r.grossProfit, 0),
    grossMargin: 0,
    opex: rows.reduce((s, r) => s + r.opex, 0),
    ebitda: rows.reduce((s, r) => s + r.ebitda, 0),
    ebitdaMargin: 0,
    netProfit: rows.reduce((s, r) => s + r.netProfit, 0),
    cashFlow: rows.reduce((s, r) => s + r.cashFlow, 0),
  };

  if (consolidated.grossRevenue > 0) {
    consolidated.grossMargin = parseFloat(
      ((consolidated.grossProfit / consolidated.grossRevenue) * 100).toFixed(2)
    );
    consolidated.ebitdaMargin = parseFloat(
      ((consolidated.ebitda / consolidated.grossRevenue) * 100).toFixed(2)
    );
  }

  rows.push(consolidated);
  return rows;
}
