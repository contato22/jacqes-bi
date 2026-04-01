/**
 * AWQ Consolidated Fetcher — Holding Layer Orchestrator
 *
 * This is the single entry point for the AWQ holding dashboard.
 * It:
 *   1. Fetches all BU data in parallel (with error isolation per source)
 *   2. Runs union → dedup → reconciliation pipeline
 *   3. Builds cross-BU joins and group metrics
 *   4. Returns a fully consolidated AWQConsolidatedPayload
 *
 * Every BU remains autonomous — this layer only READS from them.
 * A BU failure produces partial data + warning, not a crash.
 */

import type {
  AWQConsolidatedPayload,
  ConsolidationMeta,
  ConsolidationStats,
  SourceLoadResult,
} from "@/lib/types/canonical";

import { getJacqesFinancials, getJacqesCustomers, getJacqesBudgets, getJacqesUnitEconomics } from "@/lib/fetchers/jacqes";
import { getCazaVisionFinancials, getCazaVisionCustomers, getCazaVisionBudgets, getCazaVisionUnitEconomics } from "@/lib/fetchers/caza-vision";
import { getAwqVentureFinancials, getAwqVenturePortfolio } from "@/lib/fetchers/awq-venture";

import { unionFinancials, unionCustomers, unionBudgets, unionUnitEconomics, unionPortfolio, mergeConsolidationMetas } from "@/lib/consolidation/union";
import { reconcileFinancials } from "@/lib/consolidation/reconciliation";
import { aggregateByPeriod } from "@/lib/consolidation/group-metrics";

export interface ConsolidatedFetchOptions {
  year?: number;
  month?: number;
  granularity?: "monthly" | "quarterly" | "annual";
}

// ─── Main Orchestrator ─────────────────────────────────────────────────────────

export async function getAwqConsolidatedData(
  options: ConsolidatedFetchOptions = {}
): Promise<AWQConsolidatedPayload> {
  const { year, month, granularity = "monthly" } = options;

  // ── Step 1: Parallel fetch from all BU sources (isolated per source)
  const [
    jacqesFinResult,
    cazaFinResult,
    ventureFinResult,
    jacquesCustResult,
    cazaCustResult,
    jacquesBudgetResult,
    cazaBudgetResult,
    jacquesUEResult,
    cazaUEResult,
    portfolioResult,
  ] = await Promise.all([
    getJacqesFinancials({ year, month }),
    getCazaVisionFinancials({ year, month }),
    getAwqVentureFinancials({ year, month }),
    getJacqesCustomers(),
    getCazaVisionCustomers(),
    getJacqesBudgets({ year }),
    getCazaVisionBudgets({ year }),
    getJacqesUnitEconomics(),
    getCazaVisionUnitEconomics(),
    getAwqVenturePortfolio(),
  ]);

  // ── Step 2: Union all sources per domain
  const financialsUnion = unionFinancials([
    jacqesFinResult,
    cazaFinResult,
    ventureFinResult,
  ]);

  const customersUnion = unionCustomers([
    jacquesCustResult,
    cazaCustResult,
  ]);

  const budgetsUnion = unionBudgets([
    jacquesBudgetResult,
    cazaBudgetResult,
  ]);

  const unitEconomicsUnion = unionUnitEconomics([
    jacquesUEResult,
    cazaUEResult,
  ]);

  const portfolioUnion = unionPortfolio([
    portfolioResult,
  ]);

  // ── Step 3: Reconcile financials (detect and resolve cross-source conflicts)
  const reconciliationReport = reconcileFinancials(financialsUnion.data);

  // Patch financials meta with reconciliation stats
  financialsUnion.meta.stats.reconciledCount = reconciliationReport.reconciledCount;
  financialsUnion.meta.stats.conflictCount = reconciliationReport.conflictCount;

  if (reconciliationReport.conflicts.length > 0) {
    const conflictSummary = reconciliationReport.conflicts
      .slice(0, 5)
      .map((c) => `${c.ownerBU}/${c.period}: fields [${c.conflictingFields.join(", ")}] resolved by ${c.resolutionPolicy}`)
      .join("; ");
    financialsUnion.meta.warnings.push(`Financial conflicts detected: ${conflictSummary}`);
  }

  const reconciledFinancials = {
    ...financialsUnion,
    data: reconciliationReport.resolved,
  };

  // ── Step 4: Build consolidated holding-level metrics
  const consolidatedMetrics = aggregateByPeriod(
    reconciledFinancials.data,
    budgetsUnion.data,
    granularity
  );

  // ── Step 5: Merge all source metas into one top-level meta
  const topLevelMeta = mergeConsolidationMetas([
    reconciledFinancials.meta,
    customersUnion.meta,
    budgetsUnion.meta,
    unitEconomicsUnion.meta,
    portfolioUnion.meta,
  ]);

  return {
    financials: reconciledFinancials,
    customers: customersUnion,
    budgets: budgetsUnion,
    unitEconomics: unitEconomicsUnion,
    portfolio: portfolioUnion,
    consolidatedMetrics,
    meta: topLevelMeta,
  };
}

// ─── Per-BU Isolated Fetchers (for BU-level pages) ────────────────────────────

/**
 * Returns only JACQES data, normalised to canonical shapes.
 * Used by the JACQES-specific dashboard pages.
 */
export async function getJacqesData(options: ConsolidatedFetchOptions = {}) {
  const { year, month } = options;
  const [financials, customers, budgets, unitEconomics] = await Promise.all([
    getJacqesFinancials({ year, month }),
    getJacqesCustomers(),
    getJacqesBudgets({ year }),
    getJacqesUnitEconomics(),
  ]);
  return { financials, customers, budgets, unitEconomics };
}

/**
 * Returns only Caza Vision data.
 */
export async function getCazaVisionData(options: ConsolidatedFetchOptions = {}) {
  const { year, month } = options;
  const [financials, customers, budgets, unitEconomics] = await Promise.all([
    getCazaVisionFinancials({ year, month }),
    getCazaVisionCustomers(),
    getCazaVisionBudgets({ year }),
    getCazaVisionUnitEconomics(),
  ]);
  return { financials, customers, budgets, unitEconomics };
}

/**
 * Returns AWQ Venture portfolio data (companies + financials).
 */
export async function getAwqVentureData(options: ConsolidatedFetchOptions = {}) {
  const { year, month } = options;
  const [financials, portfolio] = await Promise.all([
    getAwqVentureFinancials({ year, month }),
    getAwqVenturePortfolio(),
  ]);
  return { financials, portfolio };
}
