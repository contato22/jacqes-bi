// ─── Business Unit Keys ───────────────────────────────────────────────────────

export type BUKey = "jacqes" | "cazaVision" | "awqVenture";

// Portfolio companies live under a parent BU (AWQ Venture).
// They are NOT top-level BUs — they are sub-entities.
export type PortfolioCompanyKey = "enerdy";

// ─── Data Domains ─────────────────────────────────────────────────────────────

export type DataDomain =
  | "financial"
  | "customer"
  | "budget"
  | "unitEconomics"
  | "portfolio";

// ─── Validation / Normalization result wrapper ────────────────────────────────

export interface ParseWarning {
  bu: BUKey | string;
  databaseId: string;
  recordId: string;
  field: string;
  reason: string;
}

export interface NormalizationResult<T> {
  records: T[];
  discarded: number;
  warnings: ParseWarning[];
  source: {
    bu: BUKey | string;
    databaseId: string;
    fetchedAt: string;
    totalRaw: number;
  };
}

// ─── Canonical: FinancialRecord ───────────────────────────────────────────────
// Covers DRE, cash flow, P&L, monthly revenue/expense rows.

export interface FinancialRecord {
  id: string;
  ownerBU: BUKey;
  /** ISO date string: YYYY-MM-DD */
  date: string | null;
  /** "Jan", "Feb" ... "Dec" or "2025-01" */
  month: string | null;
  year: number | null;

  grossRevenue: number | null;
  netRevenue: number | null;
  /** Cost of Goods Sold */
  cogs: number | null;
  grossProfit: number | null;
  /** Operating Expenses */
  opex: number | null;
  ebitda: number | null;
  /** Net income / bottom line */
  netIncome: number | null;
  cashFlow: number | null;

  /** Free-form status (e.g. "Actual", "Budget", "Forecast") */
  status: string | null;

  /** Raw source for debugging */
  _raw?: Record<string, unknown>;
}

// ─── Canonical: CustomerRecord ────────────────────────────────────────────────

export interface CustomerRecord {
  id: string;
  ownerBU: BUKey;
  clientName: string | null;
  company: string | null;
  email: string | null;
  plan: string | null;
  segment: string | null;
  /** Monthly Recurring Revenue */
  mrr: number | null;
  ltv: number | null;
  cac: number | null;
  payback: number | null;
  churnRisk: string | null;
  status: "active" | "at-risk" | "churned" | "unknown";
  country: string | null;
  lastActivityDate: string | null;

  _raw?: Record<string, unknown>;
}

// ─── Canonical: BudgetRecord ──────────────────────────────────────────────────

export interface BudgetRecord {
  id: string;
  ownerBU: BUKey;
  month: string | null;
  year: number | null;
  category: string | null;
  budgetAmount: number | null;
  actualAmount: number | null;
  variance: number | null;
  variancePercent: number | null;
  status: string | null;

  _raw?: Record<string, unknown>;
}

// ─── Canonical: UnitEconomicsRecord ──────────────────────────────────────────

export interface UnitEconomicsRecord {
  id: string;
  ownerBU: BUKey;
  /** Could reference a portfolio company */
  portfolioCompany: string | null;
  month: string | null;
  year: number | null;
  mrr: number | null;
  arr: number | null;
  churnRate: number | null;
  ltv: number | null;
  cac: number | null;
  ltvCacRatio: number | null;
  paybackMonths: number | null;
  nrr: number | null;
  /** Net Promoter Score */
  nps: number | null;

  _raw?: Record<string, unknown>;
}

// ─── Canonical: PortfolioCompanyRecord ───────────────────────────────────────

export interface PortfolioCompanyRecord {
  id: string;
  /** Always "awqVenture" — portfolio is owned by AWQ Venture */
  ownerBU: "awqVenture";
  companyName: string | null;
  companyKey: PortfolioCompanyKey | string | null;
  sector: string | null;
  investmentStage: string | null;
  investmentDate: string | null;
  ownership: number | null;
  currentValuation: number | null;
  investedAmount: number | null;
  status: string | null;
  website: string | null;
  description: string | null;

  _raw?: Record<string, unknown>;
}
