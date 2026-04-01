import type { BUKey, DataDomain } from "./types";

// ─── BU Database Config ───────────────────────────────────────────────────────

export interface BUDatabaseConfig {
  /** Notion database ID from env var */
  databaseId: string | undefined;
  /** Human-readable label for logs */
  label: string;
  /** The env var key used (for error messages) */
  envKey: string;
}

export interface BUConfig {
  key: BUKey;
  name: string;
  /** Absolute URL of the published dashboard */
  dashboardUrl: string;
  /** Domains this BU has data for */
  domains: DataDomain[];
  databases: Partial<Record<DataDomain, BUDatabaseConfig>>;
}

// ─── Portfolio Company Config ─────────────────────────────────────────────────

export interface PortfolioCompanyConfig {
  key: string;
  name: string;
  parentBU: "awqVenture";
  databases: Partial<Record<DataDomain, BUDatabaseConfig>>;
}

// ─── Central BU Registry ─────────────────────────────────────────────────────
// All database IDs are read exclusively from environment variables.
// Nothing is hardcoded here — add new IDs to .env.local only.

export const BU_REGISTRY: Record<BUKey, BUConfig> = {
  jacqes: {
    key: "jacqes",
    name: "JACQES BI",
    dashboardUrl: "https://contato22.github.io/jacqes-bi/",
    domains: ["financial", "customer", "budget"],
    databases: {
      financial: {
        databaseId: process.env.NOTION_DB_JACQES_FINANCIAL,
        label: "JACQES — Financial",
        envKey: "NOTION_DB_JACQES_FINANCIAL",
      },
      customer: {
        databaseId: process.env.NOTION_DB_JACQES_CUSTOMERS,
        label: "JACQES — Customers",
        envKey: "NOTION_DB_JACQES_CUSTOMERS",
      },
      budget: {
        databaseId: process.env.NOTION_DB_JACQES_BUDGET,
        label: "JACQES — Budget",
        envKey: "NOTION_DB_JACQES_BUDGET",
      },
    },
  },

  cazaVision: {
    key: "cazaVision",
    name: "Caza Vision",
    dashboardUrl: "https://contato22.github.io/awq/caza-vision/",
    domains: ["financial", "customer"],
    databases: {
      financial: {
        databaseId: process.env.NOTION_DB_CAZA_VISION_FINANCIAL,
        label: "Caza Vision — Financial",
        envKey: "NOTION_DB_CAZA_VISION_FINANCIAL",
      },
      customer: {
        databaseId: process.env.NOTION_DB_CAZA_VISION_CUSTOMERS,
        label: "Caza Vision — Customers",
        envKey: "NOTION_DB_CAZA_VISION_CUSTOMERS",
      },
    },
  },

  awqVenture: {
    key: "awqVenture",
    name: "AWQ Venture",
    dashboardUrl: "https://contato22.github.io/awq/awq-venture/",
    domains: ["portfolio", "financial"],
    databases: {
      portfolio: {
        databaseId: process.env.NOTION_DB_AWQ_VENTURE_PORTFOLIO,
        label: "AWQ Venture — Portfolio",
        envKey: "NOTION_DB_AWQ_VENTURE_PORTFOLIO",
      },
      financial: {
        databaseId: process.env.NOTION_DB_AWQ_VENTURE_FINANCIAL,
        label: "AWQ Venture — Financial",
        envKey: "NOTION_DB_AWQ_VENTURE_FINANCIAL",
      },
    },
  },
};

// ─── Portfolio Company Registry ───────────────────────────────────────────────
// Companies invested by AWQ Venture. Add new entries here when a new company
// joins the portfolio — no other file needs to change.

export const PORTFOLIO_REGISTRY: Record<string, PortfolioCompanyConfig> = {
  enerdy: {
    key: "enerdy",
    name: "Enerdy",
    parentBU: "awqVenture",
    databases: {
      financial: {
        // ⚠️  ID pending — will be provided separately
        databaseId: process.env.NOTION_DB_ENERDY_FINANCIAL,
        label: "Enerdy — Financial",
        envKey: "NOTION_DB_ENERDY_FINANCIAL",
      },
      unitEconomics: {
        databaseId: process.env.NOTION_DB_ENERDY_UNIT_ECONOMICS,
        label: "Enerdy — Unit Economics",
        envKey: "NOTION_DB_ENERDY_UNIT_ECONOMICS",
      },
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the BUConfig for a given key, throwing if not found. */
export function getBUConfig(bu: BUKey): BUConfig {
  const config = BU_REGISTRY[bu];
  if (!config) throw new Error(`[Config] Unknown BU key: "${bu}"`);
  return config;
}

/** Returns the database ID for a BU + domain, throwing if env var is missing. */
export function requireDatabaseId(bu: BUKey, domain: DataDomain): string {
  const config = getBUConfig(bu);
  const db = config.databases[domain];
  if (!db) {
    throw new Error(
      `[Config] BU "${bu}" has no database configured for domain "${domain}".`
    );
  }
  if (!db.databaseId || db.databaseId.startsWith("REPLACE_WITH")) {
    throw new Error(
      `[Config] Missing env var ${db.envKey} for ${db.label}. ` +
        `Set it in .env.local to enable this data source.`
    );
  }
  return db.databaseId;
}

/** Returns the database ID for a portfolio company + domain, or null if pending. */
export function getPortfolioDatabaseId(
  companyKey: string,
  domain: DataDomain
): string | null {
  const company = PORTFOLIO_REGISTRY[companyKey];
  if (!company) return null;
  const db = company.databases[domain];
  if (!db?.databaseId || db.databaseId.startsWith("REPLACE_WITH")) return null;
  return db.databaseId;
}
