import type { PageObjectResponse } from "@notionhq/client";
import type { BUKey, CustomerRecord, NormalizationResult, ParseWarning } from "../types";
import {
  resolveProp,
  parseTitle,
  parseRichText,
  parseNumber,
  parseSelect,
  parseStatus,
  parseDate,
  parseEmail,
  parseFormulaNumber,
  parseRollupNumber,
} from "../utils/property-parsers";
import { logger } from "../utils/logger";

type CustomerFieldMap = Record<string, readonly string[]>;

// ─── Status normalisation ─────────────────────────────────────────────────────
// Maps free-form Notion status names → canonical customer status.

const STATUS_MAP: Record<string, CustomerRecord["status"]> = {
  // English
  active:   "active",
  "at-risk":"at-risk",
  "at risk":"at-risk",
  churned:  "churned",
  inactive: "churned",
  lost:     "churned",
  // Portuguese
  ativo:    "active",
  "em risco":"at-risk",
  "risco":  "at-risk",
  cancelado:"churned",
  inativo:  "churned",
  perdido:  "churned",
};

function resolveStatus(raw: string | null): CustomerRecord["status"] {
  if (!raw) return "unknown";
  const key = raw.toLowerCase().trim();
  return STATUS_MAP[key] ?? "unknown";
}

// ─── Number helper ────────────────────────────────────────────────────────────

function resolveNumber(
  props: Record<string, unknown>,
  candidates: readonly string[]
): number | null {
  const prop = resolveProp(props, candidates as string[]) as Record<string, unknown> | null;
  if (!prop) return null;
  return (
    parseNumber(prop) ??
    parseFormulaNumber(prop) ??
    parseRollupNumber(prop) ??
    null
  );
}

// ─── Main Normalizer ──────────────────────────────────────────────────────────

export function normalizeCustomerPages(
  pages: PageObjectResponse[],
  bu: BUKey,
  databaseId: string,
  fieldMap: CustomerFieldMap
): NormalizationResult<CustomerRecord> {
  const records: CustomerRecord[] = [];
  const warnings: ParseWarning[] = [];
  let discarded = 0;

  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;
    const id = page.id;

    try {
      // ── Name (required) ──────────────────────────────────────────────────────
      const nameProp = resolveProp(props, fieldMap.clientName as string[]) as Record<string, unknown> | null;
      const clientName =
        parseTitle(nameProp as Record<string, unknown>) ??
        parseRichText(nameProp);

      if (!clientName) {
        warnings.push({
          bu,
          databaseId,
          recordId: id,
          field: "clientName",
          reason: "Record has no client name — discarded",
        });
        discarded++;
        logger.invalidRecord(bu, databaseId, id, "Missing client name");
        continue;
      }

      // ── Other text fields ────────────────────────────────────────────────────
      const companyProp = resolveProp(props, fieldMap.company as string[]) as Record<string, unknown> | null;
      const emailProp   = resolveProp(props, fieldMap.email   as string[]) as Record<string, unknown> | null;
      const planProp    = resolveProp(props, fieldMap.plan    as string[]) as Record<string, unknown> | null;
      const segmentProp = resolveProp(props, fieldMap.segment as string[]) as Record<string, unknown> | null;
      const churnProp   = resolveProp(props, fieldMap.churnRisk as string[]) as Record<string, unknown> | null;
      const statusProp  = resolveProp(props, fieldMap.status  as string[]) as Record<string, unknown> | null;
      const countryProp = resolveProp(props, fieldMap.country as string[]) as Record<string, unknown> | null;
      const lastActProp = resolveProp(props, fieldMap.lastActivityDate as string[]) as Record<string, unknown> | null;

      records.push({
        id,
        ownerBU: bu,
        clientName,
        company:          parseRichText(companyProp) ?? parseTitle(companyProp as Record<string, unknown>),
        email:            parseEmail(emailProp) ?? parseRichText(emailProp),
        plan:             parseSelect(planProp) ?? parseRichText(planProp),
        segment:          parseSelect(segmentProp) ?? parseRichText(segmentProp),
        mrr:              resolveNumber(props, fieldMap.mrr),
        ltv:              resolveNumber(props, fieldMap.ltv),
        cac:              resolveNumber(props, fieldMap.cac),
        payback:          resolveNumber(props, fieldMap.payback),
        churnRisk:        parseSelect(churnProp) ?? parseStatus(churnProp) ?? parseRichText(churnProp),
        status:           resolveStatus(
          parseSelect(statusProp) ?? parseStatus(statusProp) ?? parseRichText(statusProp)
        ),
        country:          parseSelect(countryProp) ?? parseRichText(countryProp),
        lastActivityDate: parseDate(lastActProp) ?? parseRichText(lastActProp),
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

  logger.normalizationComplete(bu, "customer", records.length, discarded);

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
