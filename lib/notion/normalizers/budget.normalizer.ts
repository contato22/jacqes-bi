import type { PageObjectResponse } from "@notionhq/client";
import type { BUKey, BudgetRecord, NormalizationResult, ParseWarning } from "../types";
import {
  resolveProp,
  parseRichText,
  parseTitle,
  parseNumber,
  parseSelect,
  parseStatus,
  parseDate,
  parseFormulaNumber,
  parseRollupNumber,
} from "../utils/property-parsers";
import { logger } from "../utils/logger";

type BudgetFieldMap = Record<string, readonly string[]>;

function resolveNumber(
  props: Record<string, unknown>,
  candidates: readonly string[]
): number | null {
  const prop = resolveProp(props, candidates as string[]) as Record<string, unknown> | null;
  if (!prop) return null;
  return parseNumber(prop) ?? parseFormulaNumber(prop) ?? parseRollupNumber(prop) ?? null;
}

function extractYear(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

export function normalizeBudgetPages(
  pages: PageObjectResponse[],
  bu: BUKey,
  databaseId: string,
  fieldMap: BudgetFieldMap
): NormalizationResult<BudgetRecord> {
  const records: BudgetRecord[] = [];
  const warnings: ParseWarning[] = [];
  let discarded = 0;

  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;
    const id = page.id;

    try {
      const monthProp    = resolveProp(props, fieldMap.month    as string[]) as Record<string, unknown> | null;
      const categoryProp = resolveProp(props, fieldMap.category as string[]) as Record<string, unknown> | null;
      const statusProp   = resolveProp(props, fieldMap.status   as string[]) as Record<string, unknown> | null;

      const month =
        parseDate(monthProp) ??
        parseSelect(monthProp) ??
        parseRichText(monthProp) ??
        parseTitle(monthProp as Record<string, unknown>);

      const budgetAmount   = resolveNumber(props, fieldMap.budgetAmount);
      const actualAmount   = resolveNumber(props, fieldMap.actualAmount);

      // Compute variance if not explicitly stored
      let variance        = resolveNumber(props, fieldMap.variance);
      let variancePercent = resolveNumber(props, fieldMap.variancePercent);

      if (variance === null && budgetAmount !== null && actualAmount !== null) {
        variance = actualAmount - budgetAmount;
      }
      if (variancePercent === null && budgetAmount && budgetAmount !== 0) {
        variancePercent = ((actualAmount ?? 0) - budgetAmount) / budgetAmount * 100;
      }

      // Require at minimum a category
      const category =
        parseSelect(categoryProp) ??
        parseRichText(categoryProp) ??
        parseTitle(categoryProp as Record<string, unknown>);

      if (!category) {
        warnings.push({ bu, databaseId, recordId: id, field: "category", reason: "Missing category — discarded" });
        discarded++;
        logger.invalidRecord(bu, databaseId, id, "Missing budget category");
        continue;
      }

      records.push({
        id,
        ownerBU: bu,
        month,
        year:            extractYear(month),
        category,
        budgetAmount,
        actualAmount,
        variance,
        variancePercent: variancePercent !== null ? parseFloat(variancePercent.toFixed(2)) : null,
        status:          parseSelect(statusProp) ?? parseStatus(statusProp) ?? parseRichText(statusProp),
        _raw: process.env.NODE_ENV === "development" ? props : undefined,
      });
    } catch (err) {
      warnings.push({ bu, databaseId, recordId: id, field: "unknown", reason: String(err) });
      discarded++;
      logger.invalidRecord(bu, databaseId, id, `Unexpected error: ${err}`);
    }
  }

  logger.normalizationComplete(bu, "budget", records.length, discarded);

  return {
    records,
    discarded,
    warnings,
    source: { bu, databaseId, fetchedAt: new Date().toISOString(), totalRaw: pages.length },
  };
}
