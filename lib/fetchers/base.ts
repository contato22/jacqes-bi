/**
 * Base fetcher interfaces and error-handling utilities.
 *
 * Every BU fetcher must:
 *  1. Return a BUDataResult<T> so the consolidation engine knows source status.
 *  2. Never throw — errors are captured inside the result.
 *  3. Never leak raw source schemas beyond the normalizer function.
 */

import type { BUDataResult, BusinessUnitId, SourceSystem } from "@/lib/types/canonical";

// ─── Fetcher Contract ──────────────────────────────────────────────────────────

export interface BUFetcherOptions {
  /** ISO date range start — inclusive */
  from?: string;
  /** ISO date range end — inclusive */
  to?: string;
  /** Override the year filter (shorthand) */
  year?: number;
  /** Override the month filter (1–12) */
  month?: number;
  /** Force bypass cache and re-fetch */
  bustCache?: boolean;
}

/**
 * Each BU fetcher is a function that takes options and returns a typed result.
 * The function MUST NOT throw; errors are encoded in status/error fields.
 */
export type BUFetcher<T> = (options?: BUFetcherOptions) => Promise<BUDataResult<T>>;

// ─── Safe Fetch Wrapper ────────────────────────────────────────────────────────

/**
 * Wraps any async data-loading function in a catch so that a failed source
 * is recorded in meta instead of crashing the consolidation pipeline.
 */
export async function safeFetch<T>(
  buId: BusinessUnitId,
  sourceSystem: SourceSystem,
  fn: () => Promise<T[]>
): Promise<BUDataResult<T>> {
  const loadedAt = new Date().toISOString();
  try {
    const data = await fn();
    return {
      data,
      buId,
      sourceSystem,
      loadedAt,
      recordCount: data.length,
      status: "success",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[BU Fetcher] ${buId} failed:`, message);
    return {
      data: [],
      buId,
      sourceSystem,
      loadedAt,
      recordCount: 0,
      status: "failed",
      error: message,
    };
  }
}

// ─── Canonical ID Generation ───────────────────────────────────────────────────

/**
 * Generates a deterministic canonical record ID from its natural key parts.
 * Avoids relying on auto-increment or UUID from individual source systems.
 */
export function makeCanonicalId(...parts: (string | number)[]): string {
  return parts
    .map((p) => String(p).toLowerCase().replace(/\s+/g, "-"))
    .join("::");
}

// ─── Period Helpers ────────────────────────────────────────────────────────────

export function getQuarter(month: number): number {
  return Math.ceil(month / 3);
}

/** Returns ISO date string for the first day of a given month/year */
export function periodToDate(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

/** Derive gross margin % safely (handles zero-revenue case) */
export function calcGrossMargin(grossProfit: number, grossRevenue: number): number {
  if (grossRevenue === 0) return 0;
  return parseFloat(((grossProfit / grossRevenue) * 100).toFixed(2));
}

/** Derive EBITDA margin % safely */
export function calcEbitdaMargin(ebitda: number, grossRevenue: number): number {
  if (grossRevenue === 0) return 0;
  return parseFloat(((ebitda / grossRevenue) * 100).toFixed(2));
}

/** Compute variance and its percentage for budget vs actual */
export function calcVariance(
  actual: number,
  budget: number
): { variance: number; variancePercent: number; status: "on-track" | "over-budget" | "under-budget" } {
  const variance = actual - budget;
  const variancePercent = budget !== 0 ? parseFloat(((variance / budget) * 100).toFixed(2)) : 0;
  const status =
    Math.abs(variancePercent) <= 5
      ? "on-track"
      : variance > 0
      ? "over-budget"
      : "under-budget";
  return { variance, variancePercent, status };
}
