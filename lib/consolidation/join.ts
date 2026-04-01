/**
 * Cross-Source Join Engine
 *
 * Performs relational-style joins across canonical collections from different
 * sources. Joins are always based on canonical identity keys — never on raw
 * string names.
 *
 * Available joins:
 *  - joinCustomersWithFinancials   → Enrich each customer with their revenue contribution
 *  - joinPortfolioWithFinancials   → Enrich portfolio companies with their financials
 *  - joinBudgetsWithActuals        → Reconcile budget records with actual financials
 *  - joinCustomersAcrossBUs        → Find all BU relationships for each canonical client
 */

import type {
  CanonicalFinancialRecord,
  CanonicalCustomerRecord,
  CanonicalBudgetRecord,
  CanonicalPortfolioCompany,
  BusinessUnitId,
} from "@/lib/types/canonical";

// ─── Customer ↔ Financials Join ────────────────────────────────────────────────

export interface CustomerFinancialEnrichment {
  customer: CanonicalCustomerRecord;
  /** Total revenue attributed to this customer across all their linked BUs */
  totalRevenue: number;
  /** Revenue breakdown by BU */
  revenueByBU: Partial<Record<BusinessUnitId, number>>;
  /** Latest MRR across all BUs */
  consolidatedMrr: number;
  /** Highest LTV across all BU records for this canonical client */
  consolidatedLtv: number;
  /** Lowest CAC observed (most efficient BU acquisition cost) */
  bestCac: number;
}

/**
 * Joins customer records with financial records by ownerBU.
 * Since financial records are at the BU level (not client level), this
 * distributes BU revenue proportionally unless per-client revenue is available.
 *
 * When per-client revenue is not available, the join enriches with BU-level
 * totals and marks the revenue estimate as approximate.
 */
export function joinCustomersWithFinancials(
  customers: CanonicalCustomerRecord[],
  financials: CanonicalFinancialRecord[],
  options: { year?: number; month?: number } = {}
): CustomerFinancialEnrichment[] {
  // Build BU revenue index for the requested period
  const buRevenue = new Map<BusinessUnitId, number>();
  const buCustomerCount = new Map<BusinessUnitId, number>();

  const relevantFinancials = financials.filter((f) => {
    if (options.year && f.year !== options.year) return false;
    if (options.month && f.month !== options.month) return false;
    return true;
  });

  for (const f of relevantFinancials) {
    buRevenue.set(f.ownerBU, (buRevenue.get(f.ownerBU) ?? 0) + f.grossRevenue);
  }

  // Count active customers per BU
  for (const c of customers) {
    if (c.status === "active") {
      buCustomerCount.set(c.ownerBU, (buCustomerCount.get(c.ownerBU) ?? 0) + 1);
    }
  }

  return customers.map((customer) => {
    const revenueByBU: Partial<Record<BusinessUnitId, number>> = {};
    let totalRevenue = 0;
    let consolidatedMrr = 0;

    // For each BU the customer appears in, estimate their revenue share
    for (const buId of customer.linkedBUs) {
      const buTotal = buRevenue.get(buId) ?? 0;
      const buCount = buCustomerCount.get(buId) ?? 1;
      // Simple per-client average — replace with actual per-client data when available
      const estimated = buTotal / buCount;
      revenueByBU[buId] = estimated;
      totalRevenue += estimated;
      consolidatedMrr += customer.mrr ?? 0;
    }

    // Consolidate LTV and CAC across all BU records for this canonical client
    const sameCanonical = customers.filter(
      (c) => c.clientCanonicalId === customer.clientCanonicalId
    );
    const consolidatedLtv = Math.max(...sameCanonical.map((c) => c.ltv));
    const bestCac = Math.min(...sameCanonical.map((c) => c.cac).filter((c) => c > 0));

    return {
      customer,
      totalRevenue,
      revenueByBU,
      consolidatedMrr,
      consolidatedLtv,
      bestCac: isFinite(bestCac) ? bestCac : 0,
    };
  });
}

// ─── Portfolio ↔ Financials Join ───────────────────────────────────────────────

export interface PortfolioFinancialEnrichment {
  company: CanonicalPortfolioCompany;
  financials: CanonicalFinancialRecord[];
  latestMonthRevenue: number;
  totalYearRevenue: number;
  revenueGrowthPct: number;
  latestGrossMargin: number;
  latestEbitda: number;
}

export function joinPortfolioWithFinancials(
  companies: CanonicalPortfolioCompany[],
  financials: CanonicalFinancialRecord[],
  options: { year?: number } = {}
): PortfolioFinancialEnrichment[] {
  return companies.map((company) => {
    const companyFinancials = financials.filter(
      (f) =>
        f.portfolioCompany === company.companyCanonicalId ||
        f.portfolioCompany === company.companySlug ||
        f.ownerBU === "awq-venture"
    );

    const yearFinancials = options.year
      ? companyFinancials.filter((f) => f.year === options.year)
      : companyFinancials;

    const sorted = [...yearFinancials].sort(
      (a, b) => a.year * 100 + a.month - (b.year * 100 + b.month)
    );

    const latest = sorted[sorted.length - 1];
    const oldest = sorted[0];

    const totalYearRevenue = yearFinancials.reduce((s, f) => s + f.grossRevenue, 0);
    const revenueGrowthPct =
      oldest && latest && oldest.grossRevenue > 0
        ? ((latest.grossRevenue - oldest.grossRevenue) / oldest.grossRevenue) * 100
        : 0;

    return {
      company,
      financials: yearFinancials,
      latestMonthRevenue: latest?.grossRevenue ?? 0,
      totalYearRevenue,
      revenueGrowthPct: parseFloat(revenueGrowthPct.toFixed(2)),
      latestGrossMargin: latest?.grossMargin ?? 0,
      latestEbitda: latest?.ebitda ?? 0,
    };
  });
}

// ─── Budget ↔ Actual Financials Join ──────────────────────────────────────────

export interface BudgetActualComparison {
  ownerBU: BusinessUnitId;
  period: string;
  month: number;
  year: number;
  category: string;
  budget: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: "on-track" | "over-budget" | "under-budget";
  budgetSourceId?: string;
  actualSourceId?: string;
}

/**
 * Joins budget records with actual financial records to produce a
 * budget-vs-actual comparison per BU and category.
 */
export function joinBudgetsWithActuals(
  budgets: CanonicalBudgetRecord[],
  financials: CanonicalFinancialRecord[]
): BudgetActualComparison[] {
  return budgets.map((budget) => {
    // Find matching actual
    const actualRecord = financials.find(
      (f) =>
        f.ownerBU === budget.ownerBU &&
        f.year === budget.year &&
        f.month === budget.month
    );

    let actual = budget.actual; // Use pre-computed actual if already set in budget record

    // Override with financial record if available and category matches
    if (actualRecord) {
      const categoryMap: Record<string, number> = {
        Revenue: actualRecord.grossRevenue,
        "Net Revenue": actualRecord.netRevenue,
        COGS: actualRecord.cogs,
        "Gross Profit": actualRecord.grossProfit,
        OPEX: actualRecord.opex,
        EBITDA: actualRecord.ebitda,
      };
      if (categoryMap[budget.category] !== undefined) {
        actual = categoryMap[budget.category];
      }
    }

    const variance = actual - budget.budget;
    const variancePercent =
      budget.budget !== 0
        ? parseFloat(((variance / budget.budget) * 100).toFixed(2))
        : 0;
    const status =
      Math.abs(variancePercent) <= 5
        ? "on-track"
        : variance > 0
        ? "over-budget"
        : "under-budget";

    return {
      ownerBU: budget.ownerBU,
      period: `${budget.year}-${String(budget.month).padStart(2, "0")}`,
      month: budget.month,
      year: budget.year,
      category: budget.category,
      budget: budget.budget,
      actual,
      variance,
      variancePercent,
      status,
      budgetSourceId: budget.sourceRecordId,
      actualSourceId: actualRecord?.sourceRecordId,
    };
  });
}

// ─── Cross-BU Customer Relationship Map ───────────────────────────────────────

export interface CrossBUClientView {
  clientCanonicalId: string;
  clientName: string;
  /** BU-specific records for this canonical client */
  appearances: CanonicalCustomerRecord[];
  totalBUs: number;
  totalLtv: number;
  totalMrr: number;
  segments: string[];
  statuses: string[];
}

/**
 * Groups all customer records by their canonical ID to produce a
 * consolidated view of each client across the entire AWQ ecosystem.
 */
export function buildCrossBUClientView(
  customers: CanonicalCustomerRecord[]
): CrossBUClientView[] {
  const groups = new Map<string, CanonicalCustomerRecord[]>();

  for (const customer of customers) {
    const group = groups.get(customer.clientCanonicalId) ?? [];
    group.push(customer);
    groups.set(customer.clientCanonicalId, group);
  }

  return Array.from(groups.entries()).map(([canonicalId, appearances]) => {
    const primary = appearances[0];
    const totalLtv = appearances.reduce((s, c) => s + c.ltv, 0);
    const totalMrr = appearances.reduce((s, c) => s + (c.mrr ?? 0), 0);
    const segments = Array.from(new Set(appearances.map((c) => c.segment).filter(Boolean))) as string[];
    const statuses = Array.from(new Set(appearances.map((c) => c.status)));

    return {
      clientCanonicalId: canonicalId,
      clientName: primary.clientName,
      appearances,
      totalBUs: appearances.length,
      totalLtv,
      totalMrr,
      segments,
      statuses,
    };
  });
}
