// ─── Caza Vision — Fetcher ────────────────────────────────────────────────────
// This is the ONLY entry point for reading Caza Vision Notion data.
// Server-side only.

import type { PageObjectResponse } from "@notionhq/client";
import type { FinancialRecord, CustomerRecord, NormalizationResult } from "../types";
import { getNotionClient } from "../client";
import { requireDatabaseId } from "../config";
import { logger } from "../utils/logger";
import {
  CAZA_VISION_FINANCIAL_FIELDS,
  CAZA_VISION_CUSTOMER_FIELDS,
} from "../adapters/caza-vision.adapter";
import { normalizeFinancialPages } from "../normalizers/financial.normalizer";
import { normalizeCustomerPages }  from "../normalizers/customer.normalizer";
import { validateFinancialResult, validateCustomerResult } from "../validators";

const BU = "cazaVision" as const;

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

/**
 * Fetch and normalise all financial records for Caza Vision.
 */
export async function getCazaVisionFinancialData(): Promise<NormalizationResult<FinancialRecord>> {
  const databaseId = requireDatabaseId(BU, "financial");
  logger.fetchStart(BU, "financial", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "financial", databaseId, pages.length);

  const result = normalizeFinancialPages(pages, BU, databaseId, CAZA_VISION_FINANCIAL_FIELDS);

  const extra = validateFinancialResult(result);
  result.warnings.push(...extra);

  return result;
}

/**
 * Fetch and normalise all customer records for Caza Vision.
 */
export async function getCazaVisionCustomersData(): Promise<NormalizationResult<CustomerRecord>> {
  const databaseId = requireDatabaseId(BU, "customer");
  logger.fetchStart(BU, "customer", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "customer", databaseId, pages.length);

  const result = normalizeCustomerPages(pages, BU, databaseId, CAZA_VISION_CUSTOMER_FIELDS);

  const extra = validateCustomerResult(result);
  result.warnings.push(...extra);

  return result;
}
