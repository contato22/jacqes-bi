/**
 * Deduplication Engine
 *
 * Removes or merges duplicate canonical records within a consolidated collection.
 *
 * Strategy:
 *  - For financial records: deduplicate by (ownerBU + period + portfolioCompany).
 *    If two records share the same key, keep the one with higher sourcePriority.
 *  - For customer records: deduplicate by clientCanonicalId + ownerBU.
 *    The same canonical client appearing twice in the same BU is a true duplicate.
 *    The same canonical client across different BUs is NOT a duplicate — it is a
 *    cross-BU relationship that should be preserved with linkedBUs populated.
 *  - For budget records: deduplicate by (ownerBU + year + month + category).
 */

import type {
  CanonicalFinancialRecord,
  CanonicalCustomerRecord,
  CanonicalBudgetRecord,
  BusinessUnitId,
} from "@/lib/types/canonical";

// ─── Generic Dedup ─────────────────────────────────────────────────────────────

export interface DedupResult<T> {
  unique: T[];
  /** Records that were discarded as exact duplicates */
  removed: T[];
  /** Count of records merged (where two partials became one) */
  mergedCount: number;
}

/**
 * Generic deduplicator: given a key function, keeps the record selected by
 * `preferFn` when multiple records share the same key.
 *
 * @param records   Input array
 * @param keyFn     Produces the dedup key for each record
 * @param preferFn  When two records share a key, returns the one to keep
 */
function dedupByInternal<T>(
  records: T[],
  keyFn: (r: T) => string,
  preferFn: (existing: T, incoming: T) => T
): DedupResult<T> {
  const map = new Map<string, T>();
  const removed: T[] = [];

  for (const record of records) {
    const key = keyFn(record);
    if (map.has(key)) {
      const existing = map.get(key)!;
      const winner = preferFn(existing, record);
      if (winner !== existing) {
        removed.push(existing);
        map.set(key, record);
      } else {
        removed.push(record);
      }
    } else {
      map.set(key, record);
    }
  }

  return { unique: Array.from(map.values()), removed, mergedCount: 0 };
}

// ─── Financial Dedup ───────────────────────────────────────────────────────────

/**
 * Deduplicates financial records by natural key: ownerBU + year + month + portfolioCompany.
 *
 * When two records share the same key (e.g. two different source systems reported
 * the same BU's March financials), the one with higher sourcePriority wins.
 * The loser is flagged as "deduped" and moved to the removed list.
 */
export function deduplicateFinancials(
  records: CanonicalFinancialRecord[]
): DedupResult<CanonicalFinancialRecord> {
  const preferHigherPriority = (
    a: CanonicalFinancialRecord,
    b: CanonicalFinancialRecord
  ): CanonicalFinancialRecord => (a.sourcePriority >= b.sourcePriority ? a : b);

  const result = dedupByInternal(
    records,
    (r) => `${r.ownerBU}::${r.year}::${r.month}::${r.portfolioCompany ?? ""}`,
    preferHigherPriority
  );

  // Mark removed records
  const removedIds = new Set(result.removed.map((r) => r.id));
  result.unique = result.unique.map((r) => ({
    ...r,
    reconciliationStatus: "clean" as const,
  }));
  result.removed = result.removed.map((r) => ({
    ...r,
    reconciliationStatus: "deduped" as const,
  }));

  return result;
}

// ─── Customer Dedup ────────────────────────────────────────────────────────────

/**
 * Deduplicates customer records with two-level logic:
 *
 * Level 1 — Intra-BU dedup:
 *   Same clientCanonicalId within the same ownerBU → true duplicate. Keep most recent.
 *
 * Level 2 — Cross-BU enrichment (NOT dedup):
 *   Same clientCanonicalId across different BUs → enrich linkedBUs instead of removing.
 *   Both records remain but linkedBUs is updated to reflect cross-BU presence.
 */
export function deduplicateCustomers(
  records: CanonicalCustomerRecord[]
): DedupResult<CanonicalCustomerRecord> & { crossBULinks: Map<string, BusinessUnitId[]> } {
  // Step 1: Intra-BU dedup
  const intraDedupResult = dedupByInternal(
    records,
    (r) => `${r.clientCanonicalId}::${r.ownerBU}`,
    // Prefer most recently updated record
    (a, b) => (a.lastUpdated >= b.lastUpdated ? a : b)
  );

  // Step 2: Build cross-BU link map
  const crossBULinks = new Map<string, BusinessUnitId[]>();

  for (const record of intraDedupResult.unique) {
    const existing = crossBULinks.get(record.clientCanonicalId) ?? [];
    if (!existing.includes(record.ownerBU)) {
      existing.push(record.ownerBU);
    }
    crossBULinks.set(record.clientCanonicalId, existing);
  }

  // Step 3: Enrich unique records with resolved linkedBUs
  const enriched = intraDedupResult.unique.map((r) => ({
    ...r,
    linkedBUs: crossBULinks.get(r.clientCanonicalId) ?? [r.ownerBU],
  }));

  return {
    unique: enriched,
    removed: intraDedupResult.removed.map((r) => ({
      ...r,
      reconciliationStatus: "deduped" as const,
    })),
    mergedCount: 0,
    crossBULinks,
  };
}

// ─── Budget Dedup ──────────────────────────────────────────────────────────────

export function deduplicateBudgets(
  records: CanonicalBudgetRecord[]
): DedupResult<CanonicalBudgetRecord> {
  return dedupByInternal(
    records,
    (r) => `${r.ownerBU}::${r.year}::${r.month}::${r.category}`,
    // Prefer verified records over estimated
    (a, b) =>
      a.dataQualityFlag === "verified" && b.dataQualityFlag !== "verified" ? a : b
  );
}
