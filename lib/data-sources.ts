// ─── Central Data Sources Registry ───────────────────────────────────────────
// This is the single public index of all data-fetching functions.
// Pages and API routes import from here — never directly from individual
// fetcher files.  This ensures the import graph is clean and BU separation
// is enforced at one well-known location.

// ─── Re-exports: Types ────────────────────────────────────────────────────────
export type {
  BUKey,
  PortfolioCompanyKey,
  DataDomain,
  FinancialRecord,
  CustomerRecord,
  BudgetRecord,
  UnitEconomicsRecord,
  PortfolioCompanyRecord,
  NormalizationResult,
  ParseWarning,
} from "./notion/types";

// ─── Re-exports: Config ───────────────────────────────────────────────────────
export {
  BU_REGISTRY,
  PORTFOLIO_REGISTRY,
  getBUConfig,
  requireDatabaseId,
  getPortfolioDatabaseId,
} from "./notion/config";

// ─── Re-exports: Validators ───────────────────────────────────────────────────
export {
  isFinancialRecord,
  isCustomerRecord,
  isBudgetRecord,
  isUnitEconomicsRecord,
  isPortfolioCompanyRecord,
  isNormalizationResult,
  asFinancialRecords,
  asCustomerRecords,
  asPortfolioRecords,
} from "./notion/validators";

// ─── JACQES BI — Data Functions ───────────────────────────────────────────────
// Source: NOTION_DB_JACQES_*
// Consumers: /app/* (JACQES BI dashboard only)

export {
  getJacqesFinancialData,
  getJacqesCustomersData,
  getJacqesBudgetData,
} from "./notion/fetchers/jacqes.fetcher";

// ─── Caza Vision — Data Functions ────────────────────────────────────────────
// Source: NOTION_DB_CAZA_VISION_*
// Consumers: /app/caza-vision/* (future routes)

export {
  getCazaVisionFinancialData,
  getCazaVisionCustomersData,
} from "./notion/fetchers/caza-vision.fetcher";

// ─── AWQ Venture — Data Functions ────────────────────────────────────────────
// Source: NOTION_DB_AWQ_VENTURE_* + NOTION_DB_ENERDY_*
// Consumers: /app/awq-venture/* (future routes)

export {
  getAWQVenturePortfolioData,
  getAWQVentureFinancialData,
  // Enerdy: returns null until DB IDs are configured in .env.local
  getEnerdyFinancialData,
  getEnerdyUnitEconomicsData,
} from "./notion/fetchers/awq-venture.fetcher";

// ─── Usage guide ─────────────────────────────────────────────────────────────
//
// In a Server Component or API route (server-side only):
//
//   import { getJacqesFinancialData } from "@/lib/data-sources";
//   const result = await getJacqesFinancialData();
//   // result.records   → FinancialRecord[]
//   // result.discarded → number of records that failed validation
//   // result.warnings  → ParseWarning[] (logs already emitted)
//   // result.source    → { bu, databaseId, fetchedAt, totalRaw }
//
// NEVER import data-fetching functions in "use client" files.
// Only import the exported TYPE helpers (isFinancialRecord, etc.) client-side.
