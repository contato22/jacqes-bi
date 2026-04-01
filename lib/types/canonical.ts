/**
 * Canonical data model for AWQ Group consolidation layer.
 *
 * All Business Units normalize their raw source data into these shapes BEFORE
 * any cross-BU union, join, or reconciliation. This prevents schema drift from
 * contaminating the holding layer.
 */

// ─── Identity Types ────────────────────────────────────────────────────────────

export type BusinessUnitId =
  | "jacqes"
  | "caza-vision"
  | "awq-venture"
  | "awq-holding";

export type EntityType = "bu" | "portfolio-company" | "holding";

export type SourceSystem =
  | "notion"
  | "stripe"
  | "salesforce"
  | "hubspot"
  | "sheets"
  | "manual"
  | "mock";

/**
 * Data quality classification for every canonical record.
 * verified  → confirmed from primary/authoritative source
 * estimated → calculated or approximated (e.g. YTD extrapolation)
 * conflict  → two or more sources disagree on the same field
 * missing   → expected field absent in source
 * partial   → record present but multiple fields absent
 */
export type DataQualityFlag =
  | "verified"
  | "estimated"
  | "conflict"
  | "missing"
  | "partial";

/**
 * Lifecycle stage of a record through the consolidation pipeline.
 * clean             → passed all checks, no issues
 * deduped           → was a duplicate; canonical counterpart retained
 * merged            → multiple partial records merged into one
 * reconciled        → conflicting values resolved by priority rule
 * conflict-pending  → conflict detected but not yet resolved
 */
export type ReconciliationStatus =
  | "clean"
  | "deduped"
  | "merged"
  | "reconciled"
  | "conflict-pending";

export type PeriodGranularity = "monthly" | "quarterly" | "annual";

export type CustomerStatus = "active" | "at-risk" | "churned" | "prospect";
export type CustomerSegment = "Enterprise" | "SMB" | "Startup" | "Individual";
export type PortfolioDealType = "equity" | "media-for-equity" | "debt" | "mixed";
export type PortfolioStage =
  | "pre-seed"
  | "seed"
  | "series-a"
  | "series-b"
  | "growth"
  | "mature";

// ─── Canonical Financial Record ────────────────────────────────────────────────

export interface CanonicalFinancialRecord {
  /** Canonical record ID — deterministic hash of (ownerBU + sourceRecordId + period) */
  id: string;
  /** ID as it exists in the originating source system */
  sourceRecordId: string;
  ownerBU: BusinessUnitId;
  /** Filled only when ownerBU is 'awq-venture' and record belongs to a portfolio company */
  portfolioCompany?: string;
  entityType: EntityType;

  // ── Period
  /** ISO date representing the first day of the reporting month */
  date: string;
  month: number; // 1–12
  quarter: number; // 1–4
  year: number;

  // ── Revenue
  grossRevenue: number;
  netRevenue: number;
  recurringRevenue: number;
  nonRecurringRevenue: number;

  // ── P&L
  cogs: number;
  grossProfit: number;
  /** Gross margin as percentage (0–100) */
  grossMargin: number;
  opex: number;
  ebitda: number;
  /** EBITDA margin as percentage (0–100) */
  ebitdaMargin: number;
  netProfit: number;

  // ── Cash
  cashFlow?: number;
  cashPosition?: number;

  // ── Source traceability
  sourceDatabase: string;
  sourceSystem: SourceSystem;
  dataQualityFlag: DataQualityFlag;
  reconciliationStatus: ReconciliationStatus;
  /** IDs of records that conflict with this one */
  conflictWith?: string[];
  /** Higher number = more authoritative source (used for reconciliation priority) */
  sourcePriority: number;
  tags: string[];
}

// ─── Canonical Customer Record ─────────────────────────────────────────────────

export interface CanonicalCustomerRecord {
  id: string;
  sourceRecordId: string;
  /** Cross-BU stable identifier resolved by canonical-identity engine */
  clientCanonicalId: string;
  ownerBU: BusinessUnitId;

  // ── Identity
  clientName: string;
  /** Normalized slug used for cross-source matching */
  clientSlug: string;
  email?: string;
  cnpj?: string;
  phone?: string;

  // ── Classification
  segment?: CustomerSegment;
  country?: string;
  status: CustomerStatus;
  /** e.g. "client", "partner", "portfolio-investee" */
  relationshipType?: string;

  // ── Cross-BU links
  /** All BUs where this canonical client appears */
  linkedBUs: BusinessUnitId[];

  // ── Unit economics (latest snapshot)
  ltv: number;
  cac: number;
  payback?: number;
  mrr?: number;
  nrr?: number;

  // ── Source traceability
  sourceDatabase: string;
  sourceSystem: SourceSystem;
  dataQualityFlag: DataQualityFlag;
  reconciliationStatus: ReconciliationStatus;
  lastUpdated: string;
}

// ─── Canonical Budget Record ───────────────────────────────────────────────────

export interface CanonicalBudgetRecord {
  id: string;
  sourceRecordId: string;
  ownerBU: BusinessUnitId;
  portfolioCompany?: string;

  month: number;
  year: number;
  /** e.g. "Revenue", "COGS", "OPEX", "Marketing", "Headcount" */
  category: string;

  budget: number;
  actual: number;
  /** actual − budget (positive = over budget) */
  variance: number;
  variancePercent: number;
  status: "on-track" | "over-budget" | "under-budget";

  sourceDatabase: string;
  sourceSystem: SourceSystem;
  dataQualityFlag: DataQualityFlag;
  reconciliationStatus: ReconciliationStatus;
}

// ─── Canonical Unit Economics Record ──────────────────────────────────────────

export interface CanonicalUnitEconomicsRecord {
  id: string;
  ownerBU: BusinessUnitId;
  month: number;
  year: number;

  mrr: number;
  arr: number;
  /** Net Revenue Retention % */
  nrr: number;
  grossChurnRate: number;
  netChurnRate: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  /** Months to recover CAC from gross margin */
  paybackMonths: number;
  newCustomers: number;
  churnedCustomers: number;
  expandedRevenue: number;
  contractedRevenue: number;

  sourceDatabase: string;
  sourceSystem: SourceSystem;
  dataQualityFlag: DataQualityFlag;
}

// ─── Canonical Portfolio Company ───────────────────────────────────────────────

export interface CanonicalPortfolioCompany {
  id: string;
  companyCanonicalId: string;
  companyName: string;
  companySlug: string;
  cnpj?: string;
  /** All known name variations for alias resolution */
  aliases: string[];

  ownerPortfolio: "awq-venture";
  sector: string;
  subSector?: string;
  stage: PortfolioStage;

  investmentDate?: string;
  investmentAmount?: number;
  equityPercent?: number;
  dealType: PortfolioDealType;
  currentValuation?: number;

  /** BUs that have direct commercial relationships with this company */
  linkedBUs?: BusinessUnitId[];

  // ── Latest metrics snapshot
  latestRevenue?: number;
  latestMrr?: number;
  latestHeadcount?: number;
  latestMonth?: number;
  latestYear?: number;

  sourceDatabase: string;
  dataQualityFlag: DataQualityFlag;
}

// ─── Consolidated Metric Record (Holding Layer Output) ────────────────────────

export interface ConsolidatedMetricRecord {
  id: string;
  /** e.g. "2026-03" for monthly, "2026-Q1" for quarterly, "2026" for annual */
  period: string;
  granularity: PeriodGranularity;
  month?: number;
  quarter?: number;
  year: number;

  // ── Group P&L totals
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalCogs: number;
  totalGrossProfit: number;
  /** Blended gross margin across all BUs (%) */
  blendedGrossMargin: number;
  totalOpex: number;
  totalEbitda: number;
  /** Blended EBITDA margin (%) */
  blendedEbitdaMargin: number;
  totalCashFlow: number;

  // ── Per-BU breakdown
  byBU: Partial<
    Record<
      BusinessUnitId,
      {
        grossRevenue: number;
        netRevenue: number;
        grossProfit: number;
        grossMargin: number;
        opex: number;
        ebitda: number;
        /** This BU's share of group gross revenue (%) */
        revenueShare: number;
      }
    >
  >;

  // ── Budget vs Actual (consolidated)
  totalBudget: number;
  totalActual: number;
  totalVariance: number;
  totalVariancePercent: number;

  // ── Portfolio layer
  /** Total revenue attributable to AWQ Venture portfolio companies */
  portfolioRevenue: number;
  portfolioCount: number;
}

// ─── Consolidation Pipeline Metadata ──────────────────────────────────────────

export interface SourceLoadResult {
  buId: string;
  sourceSystem: SourceSystem;
  recordCount: number;
  status: "success" | "partial" | "failed";
  error?: string;
  loadedAt: string;
}

export interface ConsolidationStats {
  totalInputRecords: number;
  totalOutputRecords: number;
  dedupedCount: number;
  mergedCount: number;
  reconciledCount: number;
  conflictCount: number;
  missingFieldsCount: number;
  failedSourceCount: number;
}

export interface ConsolidationMeta {
  consolidatedAt: string;
  /** Semver of the consolidation engine that produced this result */
  consolidationVersion: string;
  sources: SourceLoadResult[];
  stats: ConsolidationStats;
  /** true when at least one source failed but partial data was returned */
  partialData: boolean;
  warnings: string[];
}

// ─── Generic Result Wrappers ───────────────────────────────────────────────────

export interface ConsolidatedResult<T> {
  data: T[];
  meta: ConsolidationMeta;
}

export interface BUDataResult<T> {
  data: T[];
  buId: BusinessUnitId;
  sourceSystem: SourceSystem;
  loadedAt: string;
  recordCount: number;
  error?: string;
  status: "success" | "partial" | "failed";
}

// ─── Full AWQ Consolidated Payload (API response shape) ───────────────────────

export interface AWQConsolidatedPayload {
  /** All financial records across BUs, deduped and reconciled */
  financials: ConsolidatedResult<CanonicalFinancialRecord>;
  /** All customers across BUs, with canonical identity resolved */
  customers: ConsolidatedResult<CanonicalCustomerRecord>;
  /** Budget vs actual across BUs */
  budgets: ConsolidatedResult<CanonicalBudgetRecord>;
  /** Unit economics per BU */
  unitEconomics: ConsolidatedResult<CanonicalUnitEconomicsRecord>;
  /** AWQ Venture portfolio companies */
  portfolio: ConsolidatedResult<CanonicalPortfolioCompany>;
  /** Aggregated holding-level metrics by period */
  consolidatedMetrics: ConsolidatedMetricRecord[];
  /** Top-level consolidation metadata (union of all sub-metas) */
  meta: ConsolidationMeta;
}
