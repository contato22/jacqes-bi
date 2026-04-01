import type { BUKey } from "../types";

// ─── Structured Logger ────────────────────────────────────────────────────────
// All Notion data layer events are funnelled through this logger so they can
// be replaced with a real logging service (Datadog, LogDNA, etc.) later by
// swapping just this file.

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMeta {
  bu?: BUKey | string;
  domain?: string;
  databaseId?: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  const prefix = `[notion:${level.toUpperCase()}]`;
  const buTag = meta?.bu ? ` [${meta.bu}]` : "";
  const domainTag = meta?.domain ? ` [${meta.domain}]` : "";
  const formatted = `${prefix}${buTag}${domainTag} ${message}`;

  if (level === "error") {
    console.error(formatted, meta ?? "");
  } else if (level === "warn") {
    console.warn(formatted, meta ?? "");
  } else {
    // info / debug — suppress debug in production
    if (level === "debug" && process.env.NODE_ENV === "production") return;
    console.log(formatted, meta ?? "");
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const logger = {
  fetchStart(bu: BUKey | string, domain: string, databaseId: string) {
    log("info", `Fetching from Notion database "${databaseId}"`, {
      bu,
      domain,
      databaseId,
    });
  },

  fetchComplete(
    bu: BUKey | string,
    domain: string,
    databaseId: string,
    totalRecords: number
  ) {
    log(
      "info",
      `Fetched ${totalRecords} raw records from database "${databaseId}"`,
      { bu, domain, databaseId, totalRecords }
    );
  },

  normalizationComplete(
    bu: BUKey | string,
    domain: string,
    accepted: number,
    discarded: number
  ) {
    if (discarded > 0) {
      log(
        "warn",
        `Normalization: ${accepted} accepted, ${discarded} discarded (invalid schema)`,
        { bu, domain, accepted, discarded }
      );
    } else {
      log("info", `Normalization: ${accepted} records accepted, 0 discarded`, {
        bu,
        domain,
        accepted,
      });
    }
  },

  missingProperty(
    bu: BUKey | string,
    databaseId: string,
    recordId: string,
    field: string
  ) {
    log(
      "warn",
      `Missing property "${field}" on record "${recordId}" — falling back to null`,
      { bu, databaseId, recordId, field }
    );
  },

  invalidRecord(
    bu: BUKey | string,
    databaseId: string,
    recordId: string,
    reason: string
  ) {
    log("warn", `Record "${recordId}" discarded: ${reason}`, {
      bu,
      databaseId,
      recordId,
      reason,
    });
  },

  configError(message: string, meta?: LogMeta) {
    log("error", message, meta);
  },

  debug(message: string, meta?: LogMeta) {
    log("debug", message, meta);
  },
};
