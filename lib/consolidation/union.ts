/**
 * Union Engine
 *
 * Merges collections of canonical records from multiple BU fetchers into a
 * single consolidated collection, applies deduplication, and produces a
 * ConsolidatedResult with full provenance metadata.
 *
 * Union ≠ simple concat.
 * Union = concat + dedup + metadata assembly + quality flagging.
 */

import type {
  BUDataResult,
  CanonicalFinancialRecord,
  CanonicalCustomerRecord,
  CanonicalBudgetRecord,
  CanonicalUnitEconomicsRecord,
  CanonicalPortfolioCompany,
  ConsolidatedResult,
  ConsolidationMeta,
  SourceLoadResult,
  ConsolidationStats,
} from "@/lib/types/canonical";

import {
  deduplicateFinancials,
  deduplicateCustomers,
  deduplicateBudgets,
} from "./dedup";

const ENGINE_VERSION = "1.0.0";

// ─── Meta Assembly ─────────────────────────────────────────────────────────────

function buildMeta(
  sources: SourceLoadResult[],
  stats: ConsolidationStats,
  warnings: string[] = []
): ConsolidationMeta {
  return {
    consolidatedAt: new Date().toISOString(),
    consolidationVersion: ENGINE_VERSION,
    sources,
    stats,
    partialData: sources.some((s) => s.status !== "success"),
    warnings,
  };
}

function buResultToSourceMeta<T>(result: BUDataResult<T>): SourceLoadResult {
  return {
    buId: result.buId,
    sourceSystem: result.sourceSystem,
    recordCount: result.recordCount,
    status: result.status,
    error: result.error,
    loadedAt: result.loadedAt,
  };
}

// ─── Financial Union ───────────────────────────────────────────────────────────

export function unionFinancials(
  buResults: BUDataResult<CanonicalFinancialRecord>[]
): ConsolidatedResult<CanonicalFinancialRecord> {
  const sources = buResults.map(buResultToSourceMeta);
  const warnings: string[] = [];

  // Collect all records from successful/partial sources
  const allRecords: CanonicalFinancialRecord[] = [];
  for (const result of buResults) {
    if (result.status === "failed") {
      warnings.push(`Source '${result.buId}' failed to load. Financial data for this BU is absent.`);
      continue;
    }
    allRecords.push(...result.data);
  }

  const totalInput = allRecords.length;

  // Dedup
  const dedupResult = deduplicateFinancials(allRecords);

  const stats: ConsolidationStats = {
    totalInputRecords: totalInput,
    totalOutputRecords: dedupResult.unique.length,
    dedupedCount: dedupResult.removed.length,
    mergedCount: dedupResult.mergedCount,
    reconciledCount: 0,
    conflictCount: 0,
    missingFieldsCount: dedupResult.unique.filter((r) => r.dataQualityFlag === "missing").length,
    failedSourceCount: buResults.filter((r) => r.status === "failed").length,
  };

  return {
    data: dedupResult.unique,
    meta: buildMeta(sources, stats, warnings),
  };
}

// ─── Customer Union ────────────────────────────────────────────────────────────

export function unionCustomers(
  buResults: BUDataResult<CanonicalCustomerRecord>[]
): ConsolidatedResult<CanonicalCustomerRecord> {
  const sources = buResults.map(buResultToSourceMeta);
  const warnings: string[] = [];

  const allRecords: CanonicalCustomerRecord[] = [];
  for (const result of buResults) {
    if (result.status === "failed") {
      warnings.push(`Source '${result.buId}' failed to load. Customer data for this BU is absent.`);
      continue;
    }
    allRecords.push(...result.data);
  }

  const totalInput = allRecords.length;
  const dedupResult = deduplicateCustomers(allRecords);

  // Log cross-BU clients as informational
  let crossBUCount = 0;
  for (const [, bus] of Array.from(dedupResult.crossBULinks)) {
    if (bus.length > 1) crossBUCount++;
  }
  if (crossBUCount > 0) {
    warnings.push(`${crossBUCount} client(s) detected across multiple BUs — linkedBUs populated.`);
  }

  const stats: ConsolidationStats = {
    totalInputRecords: totalInput,
    totalOutputRecords: dedupResult.unique.length,
    dedupedCount: dedupResult.removed.length,
    mergedCount: dedupResult.mergedCount,
    reconciledCount: 0,
    conflictCount: 0,
    missingFieldsCount: dedupResult.unique.filter((r) => r.dataQualityFlag === "missing").length,
    failedSourceCount: buResults.filter((r) => r.status === "failed").length,
  };

  return {
    data: dedupResult.unique,
    meta: buildMeta(sources, stats, warnings),
  };
}

// ─── Budget Union ──────────────────────────────────────────────────────────────

export function unionBudgets(
  buResults: BUDataResult<CanonicalBudgetRecord>[]
): ConsolidatedResult<CanonicalBudgetRecord> {
  const sources = buResults.map(buResultToSourceMeta);
  const warnings: string[] = [];

  const allRecords: CanonicalBudgetRecord[] = [];
  for (const result of buResults) {
    if (result.status === "failed") {
      warnings.push(`Source '${result.buId}' failed to load. Budget data for this BU is absent.`);
      continue;
    }
    allRecords.push(...result.data);
  }

  const totalInput = allRecords.length;
  const dedupResult = deduplicateBudgets(allRecords);

  const stats: ConsolidationStats = {
    totalInputRecords: totalInput,
    totalOutputRecords: dedupResult.unique.length,
    dedupedCount: dedupResult.removed.length,
    mergedCount: 0,
    reconciledCount: 0,
    conflictCount: 0,
    missingFieldsCount: 0,
    failedSourceCount: buResults.filter((r) => r.status === "failed").length,
  };

  return {
    data: dedupResult.unique,
    meta: buildMeta(sources, stats, warnings),
  };
}

// ─── Unit Economics Union (no dedup — one record per BU per period) ────────────

export function unionUnitEconomics(
  buResults: BUDataResult<CanonicalUnitEconomicsRecord>[]
): ConsolidatedResult<CanonicalUnitEconomicsRecord> {
  const sources = buResults.map(buResultToSourceMeta);
  const warnings: string[] = [];

  const allRecords: CanonicalUnitEconomicsRecord[] = [];
  for (const result of buResults) {
    if (result.status === "failed") {
      warnings.push(`Source '${result.buId}' failed. Unit economics absent.`);
      continue;
    }
    allRecords.push(...result.data);
  }

  const stats: ConsolidationStats = {
    totalInputRecords: allRecords.length,
    totalOutputRecords: allRecords.length,
    dedupedCount: 0,
    mergedCount: 0,
    reconciledCount: 0,
    conflictCount: 0,
    missingFieldsCount: 0,
    failedSourceCount: buResults.filter((r) => r.status === "failed").length,
  };

  return {
    data: allRecords,
    meta: buildMeta(sources, stats, warnings),
  };
}

// ─── Portfolio Company Union (no dedup — each company is unique) ───────────────

export function unionPortfolio(
  buResults: BUDataResult<CanonicalPortfolioCompany>[]
): ConsolidatedResult<CanonicalPortfolioCompany> {
  const sources = buResults.map(buResultToSourceMeta);
  const warnings: string[] = [];

  // Dedup portfolio companies by companyCanonicalId (alias-resolved)
  const seen = new Map<string, CanonicalPortfolioCompany>();
  let dedupedCount = 0;
  let totalInput = 0;

  for (const result of buResults) {
    if (result.status === "failed") {
      warnings.push(`Source '${result.buId}' failed. Portfolio data may be incomplete.`);
      continue;
    }
    for (const company of result.data) {
      totalInput++;
      if (seen.has(company.companyCanonicalId)) {
        dedupedCount++;
      } else {
        seen.set(company.companyCanonicalId, company);
      }
    }
  }

  const stats: ConsolidationStats = {
    totalInputRecords: totalInput,
    totalOutputRecords: seen.size,
    dedupedCount,
    mergedCount: 0,
    reconciledCount: 0,
    conflictCount: 0,
    missingFieldsCount: 0,
    failedSourceCount: buResults.filter((r) => r.status === "failed").length,
  };

  return {
    data: Array.from(seen.values()),
    meta: buildMeta(sources, stats, warnings),
  };
}

// ─── Meta Union (merge multiple ConsolidationMeta into one) ───────────────────

export function mergeConsolidationMetas(metas: ConsolidationMeta[]): ConsolidationMeta {
  const allSources = metas.flatMap((m) => m.sources);
  const allWarnings = metas.flatMap((m) => m.warnings);

  const stats: ConsolidationStats = {
    totalInputRecords: metas.reduce((s, m) => s + m.stats.totalInputRecords, 0),
    totalOutputRecords: metas.reduce((s, m) => s + m.stats.totalOutputRecords, 0),
    dedupedCount: metas.reduce((s, m) => s + m.stats.dedupedCount, 0),
    mergedCount: metas.reduce((s, m) => s + m.stats.mergedCount, 0),
    reconciledCount: metas.reduce((s, m) => s + m.stats.reconciledCount, 0),
    conflictCount: metas.reduce((s, m) => s + m.stats.conflictCount, 0),
    missingFieldsCount: metas.reduce((s, m) => s + m.stats.missingFieldsCount, 0),
    failedSourceCount: metas.reduce((s, m) => s + m.stats.failedSourceCount, 0),
  };

  return {
    consolidatedAt: new Date().toISOString(),
    consolidationVersion: ENGINE_VERSION,
    sources: allSources,
    stats,
    partialData: metas.some((m) => m.partialData),
    warnings: allWarnings,
  };
}
