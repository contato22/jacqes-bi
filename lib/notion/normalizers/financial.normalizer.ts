import type { PageObjectResponse } from "@notionhq/client";
import type { BUKey, FinancialRecord, NormalizationResult, ParseWarning } from "../types";
import {
  resolveProp,
  parseTitle,
  parseRichText,
  parseNumber,
  parseSelect,
  parseStatus,
  parseDate,
  parseFormulaNumber,
  parseRollupNumber,
  parseCurrencyString,
} from "../utils/property-parsers";
import { logger } from "../utils/logger";

// Adapter type for financial fields — any of the three BU adapters
type FinancialFieldMap = Record<string, readonly string[]>;

// ─── Month extraction helper ──────────────────────────────────────────────────

function extractMonth(dateStr: string | null): string | null {
  if (!dateStr) return null;
  // "2025-01-01" → "Jan 2025" or keep short form for chart labels
  try {
    const d = new Date(dateStr + "T00:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function extractYear(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

// ─── Number resolver: tries number, formula, rollup, then rich_text ──────────

function resolveNumberField(
  props: Record<string, unknown>,
  candidates: readonly string[],
  bu: BUKey | string,
  databaseId: string,
  recordId: string,
  fieldName: string
): number | null {
  const prop = resolveProp(props, candidates as string[]) as Record<string, unknown> | null;

  if (!prop) {
    logger.missingProperty(bu, databaseId, recordId, fieldName);
    return null;
  }

  // Try each numeric type in order of reliability
  const asNumber = parseNumber(prop);
  if (asNumber !== null) return asNumber;

  const asFormula = parseFormulaNumber(prop);
  if (asFormula !== null) return asFormula;

  const asRollup = parseRollupNumber(prop);
  if (asRollup !== null) return asRollup;

  // Last resort: rich_text might be a formatted currency string
  const asText =
    parseRichText(prop) ?? parseTitle(prop as Record<string, unknown>);
  if (asText) {
    const parsed = parseCurrencyString(asText);
    if (parsed !== null) return parsed;
  }

  logger.missingProperty(bu, databaseId, recordId, fieldName);
  return null;
}

// ─── Main Normalizer ──────────────────────────────────────────────────────────

export function normalizeFinancialPages(
  pages: PageObjectResponse[],
  bu: BUKey,
  databaseId: string,
  fieldMap: FinancialFieldMap
): NormalizationResult<FinancialRecord> {
  const records: FinancialRecord[] = [];
  const warnings: ParseWarning[] = [];
  let discarded = 0;

  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;
    const id = page.id;

    try {
      // ── Date ────────────────────────────────────────────────────────────────
      const dateProp = resolveProp(props, fieldMap.date as string[]) as Record<string, unknown> | null;
      const date = parseDate(dateProp) ??
        parseRichText(dateProp) ??
        parseTitle(dateProp as Record<string, unknown>);

      // ── Numeric fields ──────────────────────────────────────────────────────
      const grossRevenue = resolveNumberField(props, fieldMap.grossRevenue, bu, databaseId, id, "grossRevenue");
      const netRevenue   = resolveNumberField(props, fieldMap.netRevenue,   bu, databaseId, id, "netRevenue");
      const cogs         = resolveNumberField(props, fieldMap.cogs,         bu, databaseId, id, "cogs");
      const grossProfit  = resolveNumberField(props, fieldMap.grossProfit,  bu, databaseId, id, "grossProfit");
      const opex         = resolveNumberField(props, fieldMap.opex,         bu, databaseId, id, "opex");
      const ebitda       = resolveNumberField(props, fieldMap.ebitda,       bu, databaseId, id, "ebitda");
      const netIncome    = resolveNumberField(props, fieldMap.netIncome,    bu, databaseId, id, "netIncome");
      const cashFlow     = resolveNumberField(props, fieldMap.cashFlow,     bu, databaseId, id, "cashFlow");

      // ── Status ──────────────────────────────────────────────────────────────
      const statusProp = resolveProp(props, fieldMap.status as string[]) as Record<string, unknown> | null;
      const status = parseSelect(statusProp) ?? parseStatus(statusProp) ?? parseRichText(statusProp);

      // Require at minimum a date OR a net/gross revenue value
      const hasMinData = date !== null || netRevenue !== null || grossRevenue !== null;
      if (!hasMinData) {
        warnings.push({
          bu,
          databaseId,
          recordId: id,
          field: "date|grossRevenue|netRevenue",
          reason: "Record has no date and no revenue fields — discarded",
        });
        discarded++;
        logger.invalidRecord(bu, databaseId, id, "No date and no revenue data");
        continue;
      }

      records.push({
        id,
        ownerBU: bu,
        date,
        month: extractMonth(date),
        year: extractYear(date),
        grossRevenue,
        netRevenue,
        cogs,
        grossProfit,
        opex,
        ebitda,
        netIncome,
        cashFlow,
        status,
        _raw: process.env.NODE_ENV === "development" ? props : undefined,
      });
    } catch (err) {
      warnings.push({
        bu,
        databaseId,
        recordId: id,
        field: "unknown",
        reason: String(err),
      });
      discarded++;
      logger.invalidRecord(bu, databaseId, id, `Unexpected error: ${err}`);
    }
  }

  logger.normalizationComplete(bu, "financial", records.length, discarded);

  return {
    records,
    discarded,
    warnings,
    source: {
      bu,
      databaseId,
      fetchedAt: new Date().toISOString(),
      totalRaw: pages.length,
    },
  };
}
