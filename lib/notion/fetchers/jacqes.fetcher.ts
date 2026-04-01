// ─── JACQES BI — Fetcher ──────────────────────────────────────────────────────
// This is the ONLY entry point for reading JACQES Notion data.
// All calls are server-side only — never import this from a "use client" file.

import type { PageObjectResponse } from "@notionhq/client";
import type {
  FinancialRecord,
  CustomerRecord,
  BudgetRecord,
  NormalizationResult,
} from "../types";
import { getNotionClient } from "../client";
import { requireDatabaseId } from "../config";
import { logger } from "../utils/logger";
import { JACQES_FINANCIAL_FIELDS, JACQES_CUSTOMER_FIELDS, JACQES_BUDGET_FIELDS } from "../adapters/jacqes.adapter";
import { normalizeFinancialPages } from "../normalizers/financial.normalizer";
import { normalizeCustomerPages }  from "../normalizers/customer.normalizer";
import { normalizeBudgetPages }    from "../normalizers/budget.normalizer";
import { validateFinancialResult, validateCustomerResult } from "../validators";

const BU = "jacqes" as const;
const CACHE_TTL = parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10);

// ─── Internal: paginate all results from a database ───────────────────────────

async function queryAllPages(
  databaseId: string,
  filter?: object
): Promise<PageObjectResponse[]> {
  const client = getNotionClient();
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const res = await client.dataSources.query({
      data_source_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      filter: filter as never,
    });

    for (const item of res.results) {
      if (item.object === "page" && "properties" in item) {
        results.push(item as PageObjectResponse);
      }
    }

    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch and normalise all financial records for JACQES BI.
 * Runs server-side only. Respects Next.js fetch cache via revalidate.
 */
export async function getJacqesFinancialData(): Promise<NormalizationResult<FinancialRecord>> {
  const databaseId = requireDatabaseId(BU, "financial");
  logger.fetchStart(BU, "financial", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "financial", databaseId, pages.length);

  const result = normalizeFinancialPages(pages, BU, databaseId, JACQES_FINANCIAL_FIELDS);

  // Semantic validation (warnings only — does not discard)
  const extraWarnings = validateFinancialResult(result);
  result.warnings.push(...extraWarnings);

  return result;
}

/**
 * Fetch and normalise all customer records for JACQES BI.
 */
export async function getJacqesCustomersData(): Promise<NormalizationResult<CustomerRecord>> {
  const databaseId = requireDatabaseId(BU, "customer");
  logger.fetchStart(BU, "customer", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "customer", databaseId, pages.length);

  const result = normalizeCustomerPages(pages, BU, databaseId, JACQES_CUSTOMER_FIELDS);

  const extraWarnings = validateCustomerResult(result);
  result.warnings.push(...extraWarnings);

  return result;
}

/**
 * Fetch and normalise all budget vs actual records for JACQES BI.
 */
export async function getJacqesBudgetData(): Promise<NormalizationResult<BudgetRecord>> {
  const databaseId = requireDatabaseId(BU, "budget");
  logger.fetchStart(BU, "budget", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "budget", databaseId, pages.length);

  return normalizeBudgetPages(pages, BU, databaseId, JACQES_BUDGET_FIELDS);
}

// Re-export CACHE_TTL so API routes can use it for revalidation
export { CACHE_TTL };
