import type { PageObjectResponse } from "@notionhq/client";
import type { BUKey, UnitEconomicsRecord, NormalizationResult, ParseWarning } from "../types";
import {
  resolveProp,
  parseRichText,
  parseTitle,
  parseNumber,
  parseSelect,
  parseDate,
  parseFormulaNumber,
  parseRollupNumber,
} from "../utils/property-parsers";
import { logger } from "../utils/logger";

type UnitEconFieldMap = Record<string, readonly string[]>;

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

export function normalizeUnitEconomicsPages(
  pages: PageObjectResponse[],
  bu: BUKey,
  databaseId: string,
  fieldMap: UnitEconFieldMap,
  portfolioCompany?: string
): NormalizationResult<UnitEconomicsRecord> {
  const records: UnitEconomicsRecord[] = [];
  const warnings: ParseWarning[] = [];
  let discarded = 0;

  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;
    const id = page.id;

    try {
      const monthProp = resolveProp(props, fieldMap.month as string[]) as Record<string, unknown> | null;
      const month =
        parseDate(monthProp) ??
        parseSelect(monthProp) ??
        parseRichText(monthProp) ??
        parseTitle(monthProp as Record<string, unknown>);

      const mrr            = resolveNumber(props, fieldMap.mrr);
      const arr            = resolveNumber(props, fieldMap.arr) ?? (mrr !== null ? mrr * 12 : null);
      const churnRate      = resolveNumber(props, fieldMap.churnRate);
      const ltv            = resolveNumber(props, fieldMap.ltv);
      const cac            = resolveNumber(props, fieldMap.cac);
      const paybackMonths  = resolveNumber(props, fieldMap.paybackMonths);
      const nrr            = resolveNumber(props, fieldMap.nrr);
      const nps            = resolveNumber(props, fieldMap.nps);

      // Compute LTV/CAC ratio if not stored
      let ltvCacRatio = resolveNumber(props, fieldMap.ltvCacRatio);
      if (ltvCacRatio === null && ltv !== null && cac !== null && cac !== 0) {
        ltvCacRatio = parseFloat((ltv / cac).toFixed(2));
      }

      // Require at minimum MRR or ARR
      if (mrr === null && arr === null) {
        warnings.push({ bu, databaseId, recordId: id, field: "mrr|arr", reason: "No MRR/ARR — discarded" });
        discarded++;
        logger.invalidRecord(bu, databaseId, id, "Missing MRR and ARR");
        continue;
      }

      records.push({
        id,
        ownerBU: bu,
        portfolioCompany: portfolioCompany ?? null,
        month,
        year:           extractYear(month),
        mrr,
        arr,
        churnRate,
        ltv,
        cac,
        ltvCacRatio,
        paybackMonths,
        nrr,
        nps,
        _raw: process.env.NODE_ENV === "development" ? props : undefined,
      });
    } catch (err) {
      warnings.push({ bu, databaseId, recordId: id, field: "unknown", reason: String(err) });
      discarded++;
      logger.invalidRecord(bu, databaseId, id, `Unexpected error: ${err}`);
    }
  }

  logger.normalizationComplete(bu, "unitEconomics", records.length, discarded);

  return {
    records,
    discarded,
    warnings,
    source: { bu, databaseId, fetchedAt: new Date().toISOString(), totalRaw: pages.length },
  };
}
