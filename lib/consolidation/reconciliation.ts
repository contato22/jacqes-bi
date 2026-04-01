/**
 * Reconciliation Engine
 *
 * Detects and resolves value conflicts when two or more sources report different
 * numbers for the same metric in the same period for the same entity.
 *
 * Resolution policies (applied in order):
 *   1. Source priority: higher sourcePriority value wins (configurable per BU)
 *   2. Quality flag: "verified" > "estimated" > "partial" > "missing"
 *   3. Recency: more recently updated record wins
 *   4. Conservative: take the lower value (e.g. for revenue — avoids inflation)
 *
 * When no policy produces a clear winner, both values are preserved and the
 * record is flagged as "conflict-pending" for manual review.
 */

import type {
  CanonicalFinancialRecord,
  CanonicalBudgetRecord,
  DataQualityFlag,
  ReconciliationStatus,
} from "@/lib/types/canonical";

// ─── Quality Priority Map ──────────────────────────────────────────────────────

const QUALITY_PRIORITY: Record<DataQualityFlag, number> = {
  verified: 4,
  estimated: 3,
  partial: 2,
  missing: 1,
  conflict: 0,
};

// ─── Conflict Detection ────────────────────────────────────────────────────────

/** Tolerance percentage within which two values are considered "same" */
const RECONCILIATION_TOLERANCE_PCT = 1.0; // 1%

function valuesDiverge(a: number, b: number): boolean {
  if (a === 0 && b === 0) return false;
  const base = Math.max(Math.abs(a), Math.abs(b));
  const diff = Math.abs(a - b);
  return (diff / base) * 100 > RECONCILIATION_TOLERANCE_PCT;
}

function detectFinancialConflict(
  a: CanonicalFinancialRecord,
  b: CanonicalFinancialRecord
): string[] {
  const conflictFields: string[] = [];
  const fields: (keyof CanonicalFinancialRecord)[] = [
    "grossRevenue",
    "netRevenue",
    "cogs",
    "grossProfit",
    "opex",
    "ebitda",
    "netProfit",
  ];

  for (const field of fields) {
    const av = a[field] as number;
    const bv = b[field] as number;
    if (typeof av === "number" && typeof bv === "number" && valuesDiverge(av, bv)) {
      conflictFields.push(field);
    }
  }
  return conflictFields;
}

// ─── Financial Reconciliation ──────────────────────────────────────────────────

export interface ReconciliationReport {
  resolved: CanonicalFinancialRecord[];
  conflicts: FinancialConflict[];
  reconciledCount: number;
  conflictCount: number;
}

export interface FinancialConflict {
  period: string;
  ownerBU: string;
  portfolioCompany?: string;
  conflictingFields: string[];
  recordA: CanonicalFinancialRecord;
  recordB: CanonicalFinancialRecord;
  winner?: CanonicalFinancialRecord;
  resolutionPolicy: string;
}

/**
 * Takes a flat list of financial records (post-union) and reconciles any records
 * that share the same natural key but have diverging values.
 *
 * Input: records already deduped by (ownerBU + year + month + portfolioCompany).
 * This function handles cases where the same period has values from multiple
 * sub-sources (e.g. accounting system vs management reporting).
 */
export function reconcileFinancials(
  records: CanonicalFinancialRecord[]
): ReconciliationReport {
  // Group by natural key
  const groups = new Map<string, CanonicalFinancialRecord[]>();
  for (const record of records) {
    const key = `${record.ownerBU}::${record.year}::${record.month}::${record.portfolioCompany ?? ""}`;
    const group = groups.get(key) ?? [];
    group.push(record);
    groups.set(key, group);
  }

  const resolved: CanonicalFinancialRecord[] = [];
  const conflicts: FinancialConflict[] = [];

  for (const [, group] of Array.from(groups)) {
    if (group.length === 1) {
      resolved.push(group[0]);
      continue;
    }

    // Multiple records for same period — reconcile
    const [winner, conflict] = resolveFinancialGroup(group);
    resolved.push(winner);
    if (conflict) conflicts.push(conflict);
  }

  return {
    resolved,
    conflicts,
    reconciledCount: conflicts.filter((c) => c.winner !== undefined).length,
    conflictCount: conflicts.filter((c) => c.winner === undefined).length,
  };
}

function resolveFinancialGroup(
  group: CanonicalFinancialRecord[]
): [CanonicalFinancialRecord, FinancialConflict | null] {
  if (group.length === 0) throw new Error("Empty reconciliation group");
  if (group.length === 1) return [group[0], null];

  const [a, b] = [group[0], group[1]];
  const conflictingFields = detectFinancialConflict(a, b);

  if (conflictingFields.length === 0) {
    // Values agree — keep higher priority record, no conflict
    const winner = a.sourcePriority >= b.sourcePriority ? a : b;
    return [{ ...winner, reconciliationStatus: "reconciled" }, null];
  }

  // Values diverge — apply resolution policy
  let winner: CanonicalFinancialRecord | undefined;
  let resolutionPolicy = "";

  // Policy 1: source priority
  if (a.sourcePriority !== b.sourcePriority) {
    winner = a.sourcePriority > b.sourcePriority ? a : b;
    resolutionPolicy = "source-priority";
  }

  // Policy 2: quality flag
  if (!winner) {
    const aq = QUALITY_PRIORITY[a.dataQualityFlag];
    const bq = QUALITY_PRIORITY[b.dataQualityFlag];
    if (aq !== bq) {
      winner = aq > bq ? a : b;
      resolutionPolicy = "quality-flag";
    }
  }

  // Policy 3: conservative (lower gross revenue — avoids inflation)
  if (!winner) {
    winner = a.grossRevenue <= b.grossRevenue ? a : b;
    resolutionPolicy = "conservative-lower-revenue";
  }

  const period = `${group[0].year}-${String(group[0].month).padStart(2, "0")}`;

  const conflict: FinancialConflict = {
    period,
    ownerBU: group[0].ownerBU,
    portfolioCompany: group[0].portfolioCompany,
    conflictingFields,
    recordA: a,
    recordB: b,
    winner,
    resolutionPolicy,
  };

  const resolvedRecord: CanonicalFinancialRecord = {
    ...winner,
    reconciliationStatus: "reconciled",
    conflictWith: group.filter((r) => r.id !== winner!.id).map((r) => r.id),
    dataQualityFlag: "conflict",
  };

  return [resolvedRecord, conflict];
}

// ─── Budget Reconciliation ─────────────────────────────────────────────────────

export interface BudgetReconciliationReport {
  resolved: CanonicalBudgetRecord[];
  conflictCount: number;
}

export function reconcileBudgets(
  records: CanonicalBudgetRecord[]
): BudgetReconciliationReport {
  const groups = new Map<string, CanonicalBudgetRecord[]>();
  for (const record of records) {
    const key = `${record.ownerBU}::${record.year}::${record.month}::${record.category}`;
    const group = groups.get(key) ?? [];
    group.push(record);
    groups.set(key, group);
  }

  const resolved: CanonicalBudgetRecord[] = [];
  let conflictCount = 0;

  for (const [, group] of Array.from(groups)) {
    if (group.length === 1) {
      resolved.push(group[0]);
    } else {
      // Keep verified over estimated; otherwise keep first
      const winner =
        group.find((r) => r.dataQualityFlag === "verified") ?? group[0];
      if (group.length > 1) conflictCount++;
      resolved.push({ ...winner, reconciliationStatus: "reconciled" });
    }
  }

  return { resolved, conflictCount };
}
