import type { PageObjectResponse } from "@notionhq/client";
import type { PortfolioCompanyRecord, NormalizationResult, ParseWarning } from "../types";
import {
  resolveProp,
  parseTitle,
  parseRichText,
  parseNumber,
  parseSelect,
  parseStatus,
  parseDate,
  parseUrl,
  parseFormulaNumber,
} from "../utils/property-parsers";
import { logger } from "../utils/logger";

type PortfolioFieldMap = Record<string, readonly string[]>;

export function normalizePortfolioPages(
  pages: PageObjectResponse[],
  databaseId: string,
  fieldMap: PortfolioFieldMap
): NormalizationResult<PortfolioCompanyRecord> {
  const bu = "awqVenture" as const;
  const records: PortfolioCompanyRecord[] = [];
  const warnings: ParseWarning[] = [];
  let discarded = 0;

  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;
    const id = page.id;

    try {
      const nameProp = resolveProp(props, fieldMap.companyName as string[]) as Record<string, unknown> | null;
      const companyName =
        parseTitle(nameProp as Record<string, unknown>) ??
        parseRichText(nameProp);

      if (!companyName) {
        warnings.push({ bu, databaseId, recordId: id, field: "companyName", reason: "Missing company name — discarded" });
        discarded++;
        logger.invalidRecord(bu, databaseId, id, "Missing portfolio company name");
        continue;
      }

      const keyProp         = resolveProp(props, fieldMap.companyKey       as string[]) as Record<string, unknown> | null;
      const sectorProp      = resolveProp(props, fieldMap.sector           as string[]) as Record<string, unknown> | null;
      const stageProp       = resolveProp(props, fieldMap.investmentStage  as string[]) as Record<string, unknown> | null;
      const dateProp        = resolveProp(props, fieldMap.investmentDate   as string[]) as Record<string, unknown> | null;
      const statusProp      = resolveProp(props, fieldMap.status           as string[]) as Record<string, unknown> | null;
      const websiteProp     = resolveProp(props, fieldMap.website          as string[]) as Record<string, unknown> | null;
      const descProp        = resolveProp(props, fieldMap.description      as string[]) as Record<string, unknown> | null;

      const ownershipProp   = resolveProp(props, fieldMap.ownership        as string[]) as Record<string, unknown> | null;
      const valuationProp   = resolveProp(props, fieldMap.currentValuation as string[]) as Record<string, unknown> | null;
      const investedProp    = resolveProp(props, fieldMap.investedAmount   as string[]) as Record<string, unknown> | null;

      records.push({
        id,
        ownerBU: "awqVenture",
        companyName,
        companyKey:        parseRichText(keyProp) ?? parseSelect(keyProp),
        sector:            parseSelect(sectorProp) ?? parseRichText(sectorProp),
        investmentStage:   parseSelect(stageProp)  ?? parseRichText(stageProp),
        investmentDate:    parseDate(dateProp)      ?? parseRichText(dateProp),
        ownership:
          parseNumber(ownershipProp) ??
          parseFormulaNumber(ownershipProp),
        currentValuation:
          parseNumber(valuationProp) ??
          parseFormulaNumber(valuationProp),
        investedAmount:
          parseNumber(investedProp) ??
          parseFormulaNumber(investedProp),
        status:
          parseSelect(statusProp) ??
          parseStatus(statusProp) ??
          parseRichText(statusProp),
        website:     parseUrl(websiteProp)     ?? parseRichText(websiteProp),
        description: parseRichText(descProp)   ?? parseTitle(descProp as Record<string, unknown>),
        _raw: process.env.NODE_ENV === "development" ? props : undefined,
      });
    } catch (err) {
      warnings.push({ bu, databaseId, recordId: id, field: "unknown", reason: String(err) });
      discarded++;
      logger.invalidRecord(bu, databaseId, id, `Unexpected error: ${err}`);
    }
  }

  logger.normalizationComplete(bu, "portfolio", records.length, discarded);

  return {
    records,
    discarded,
    warnings,
    source: { bu, databaseId, fetchedAt: new Date().toISOString(), totalRaw: pages.length },
  };
}
