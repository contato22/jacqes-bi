// ─── AWQ Venture — Fetcher ────────────────────────────────────────────────────
// Covers:
//   - Portfolio company list (all investees, including Enerdy)
//   - AWQ Venture consolidated financials
//   - Per-portfolio-company data (financial, unit economics)
//
// Server-side only. Enerdy-specific functions return null when the database ID
// is not yet configured, so the rest of the dashboard is unaffected.

import type { PageObjectResponse } from "@notionhq/client";
import type {
  FinancialRecord,
  PortfolioCompanyRecord,
  UnitEconomicsRecord,
  NormalizationResult,
} from "../types";
import { getNotionClient } from "../client";
import { requireDatabaseId, getPortfolioDatabaseId } from "../config";
import { logger } from "../utils/logger";
import {
  AWQ_VENTURE_PORTFOLIO_FIELDS,
  AWQ_VENTURE_FINANCIAL_FIELDS,
  ENERDY_FINANCIAL_FIELDS,
  ENERDY_UNIT_ECONOMICS_FIELDS,
} from "../adapters/awq-venture.adapter";
import { normalizeFinancialPages }      from "../normalizers/financial.normalizer";
import { normalizePortfolioPages }      from "../normalizers/portfolio.normalizer";
import { normalizeUnitEconomicsPages }  from "../normalizers/unit-economics.normalizer";
import { validateFinancialResult }      from "../validators";

const BU = "awqVenture" as const;

async function queryAllPages(databaseId: string): Promise<PageObjectResponse[]> {
  const client = getNotionClient();
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const res = await client.dataSources.query({
      data_source_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
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

// ─── Portfolio ────────────────────────────────────────────────────────────────

/**
 * Fetch all portfolio companies tracked in the AWQ Venture portfolio database.
 * Includes Enerdy and any future companies added to the Notion database.
 */
export async function getAWQVenturePortfolioData(): Promise<NormalizationResult<PortfolioCompanyRecord>> {
  const databaseId = requireDatabaseId(BU, "portfolio");
  logger.fetchStart(BU, "portfolio", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "portfolio", databaseId, pages.length);

  return normalizePortfolioPages(pages, databaseId, AWQ_VENTURE_PORTFOLIO_FIELDS);
}

// ─── AWQ Venture consolidated financials ─────────────────────────────────────

/**
 * Fetch AWQ Venture fund-level consolidated financials.
 */
export async function getAWQVentureFinancialData(): Promise<NormalizationResult<FinancialRecord>> {
  const databaseId = requireDatabaseId(BU, "financial");
  logger.fetchStart(BU, "financial", databaseId);

  const pages = await queryAllPages(databaseId);
  logger.fetchComplete(BU, "financial", databaseId, pages.length);

  const result = normalizeFinancialPages(pages, BU, databaseId, AWQ_VENTURE_FINANCIAL_FIELDS);
  const extra = validateFinancialResult(result);
  result.warnings.push(...extra);
  return result;
}

// ─── Enerdy ───────────────────────────────────────────────────────────────────
// Returns null (not throws) when the database ID is not yet configured.
// This allows the rest of the dashboard to render while Enerdy is being set up.

/**
 * Fetch Enerdy financial data.
 * Returns null if NOTION_DB_ENERDY_FINANCIAL is not yet configured.
 */
export async function getEnerdyFinancialData(): Promise<NormalizationResult<FinancialRecord> | null> {
  const databaseId = getPortfolioDatabaseId("enerdy", "financial");
  if (!databaseId) {
    logger.debug(
      "Enerdy financial database not configured — skipping. " +
      "Set NOTION_DB_ENERDY_FINANCIAL in .env.local to enable.",
      { bu: BU, domain: "financial" }
    );
    return null;
  }

  logger.fetchStart("enerdy", "financial", databaseId);
  const pages = await queryAllPages(databaseId);
  logger.fetchComplete("enerdy", "financial", databaseId, pages.length);

  // Normalise as a sub-entity of awqVenture (ownerBU = awqVenture)
  const result = normalizeFinancialPages(pages, BU, databaseId, ENERDY_FINANCIAL_FIELDS);
  const extra = validateFinancialResult(result);
  result.warnings.push(...extra);
  return result;
}

/**
 * Fetch Enerdy unit economics data.
 * Returns null if NOTION_DB_ENERDY_UNIT_ECONOMICS is not yet configured.
 */
export async function getEnerdyUnitEconomicsData(): Promise<NormalizationResult<UnitEconomicsRecord> | null> {
  const databaseId = getPortfolioDatabaseId("enerdy", "unitEconomics");
  if (!databaseId) {
    logger.debug(
      "Enerdy unit economics database not configured — skipping. " +
      "Set NOTION_DB_ENERDY_UNIT_ECONOMICS in .env.local to enable.",
      { bu: BU, domain: "unitEconomics" }
    );
    return null;
  }

  logger.fetchStart("enerdy", "unitEconomics", databaseId);
  const pages = await queryAllPages(databaseId);
  logger.fetchComplete("enerdy", "unitEconomics", databaseId, pages.length);

  return normalizeUnitEconomicsPages(
    pages,
    BU,
    databaseId,
    ENERDY_UNIT_ECONOMICS_FIELDS,
    "enerdy"
  );
}
