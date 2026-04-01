import type {
  FinancialRecord,
  CustomerRecord,
  BudgetRecord,
  UnitEconomicsRecord,
  PortfolioCompanyRecord,
  NormalizationResult,
  ParseWarning,
} from "../types";

// ─── Type Guards ──────────────────────────────────────────────────────────────
// Use these to narrow unknown data returned from API routes on the client side.

export function isFinancialRecord(v: unknown): v is FinancialRecord {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.ownerBU === "string";
}

export function isCustomerRecord(v: unknown): v is CustomerRecord {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.ownerBU === "string";
}

export function isBudgetRecord(v: unknown): v is BudgetRecord {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.ownerBU === "string";
}

export function isUnitEconomicsRecord(v: unknown): v is UnitEconomicsRecord {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.ownerBU === "string";
}

export function isPortfolioCompanyRecord(v: unknown): v is PortfolioCompanyRecord {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && r.ownerBU === "awqVenture";
}

// ─── Array guards ─────────────────────────────────────────────────────────────

export function asFinancialRecords(data: unknown): FinancialRecord[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isFinancialRecord);
}

export function asCustomerRecords(data: unknown): CustomerRecord[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isCustomerRecord);
}

export function asPortfolioRecords(data: unknown): PortfolioCompanyRecord[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isPortfolioCompanyRecord);
}

// ─── NormalizationResult type guard ──────────────────────────────────────────

export function isNormalizationResult<T>(
  v: unknown
): v is NormalizationResult<T> {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return (
    Array.isArray(r.records) &&
    typeof r.discarded === "number" &&
    Array.isArray(r.warnings) &&
    typeof r.source === "object"
  );
}

// ─── Semantic validators ──────────────────────────────────────────────────────
// Warn if a record looks suspicious but don't discard it — just flag it.

export function warnSuspiciousFinancial(
  record: FinancialRecord,
  warnings: ParseWarning[]
): void {
  // Revenue can't be negative
  if (record.grossRevenue !== null && record.grossRevenue < 0) {
    warnings.push({
      bu: record.ownerBU,
      databaseId: "(post-normalisation)",
      recordId: record.id,
      field: "grossRevenue",
      reason: `Negative gross revenue: ${record.grossRevenue}`,
    });
  }
  // EBITDA shouldn't exceed gross revenue (data-entry error likely)
  if (
    record.ebitda !== null &&
    record.grossRevenue !== null &&
    record.ebitda > record.grossRevenue
  ) {
    warnings.push({
      bu: record.ownerBU,
      databaseId: "(post-normalisation)",
      recordId: record.id,
      field: "ebitda",
      reason: `EBITDA (${record.ebitda}) exceeds gross revenue (${record.grossRevenue})`,
    });
  }
}

export function warnSuspiciousCustomer(
  record: CustomerRecord,
  warnings: ParseWarning[]
): void {
  if (record.ltv !== null && record.cac !== null && record.cac > record.ltv) {
    warnings.push({
      bu: record.ownerBU,
      databaseId: "(post-normalisation)",
      recordId: record.id,
      field: "ltv/cac",
      reason: `CAC (${record.cac}) exceeds LTV (${record.ltv}) — unit economics inverted`,
    });
  }
}

// ─── Batch validation helper ──────────────────────────────────────────────────
// Run semantic validation over an already-normalised result set.

export function validateFinancialResult(
  result: NormalizationResult<FinancialRecord>
): ParseWarning[] {
  const extra: ParseWarning[] = [];
  for (const r of result.records) {
    warnSuspiciousFinancial(r, extra);
  }
  return extra;
}

export function validateCustomerResult(
  result: NormalizationResult<CustomerRecord>
): ParseWarning[] {
  const extra: ParseWarning[] = [];
  for (const r of result.records) {
    warnSuspiciousCustomer(r, extra);
  }
  return extra;
}
