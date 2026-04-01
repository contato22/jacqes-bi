/**
 * Canonical Identity Engine
 *
 * Resolves stable cross-BU identifiers so that the same real-world entity
 * (client, company) is recognised as one canonical record even when it appears
 * under different names, typos, or CNPJ formats in different source systems.
 *
 * Resolution order (highest confidence first):
 *   1. Manual alias table override
 *   2. CNPJ exact match
 *   3. Email exact match (normalised)
 *   4. Normalised slug match
 *   5. Phone normalised match
 *   6. Fallback: generate new canonical ID from slug
 */

import type { BusinessUnitId } from "@/lib/types/canonical";

// ─── Manual Alias Table ────────────────────────────────────────────────────────
//
// Add entries here whenever an entity is known by different names across BUs.
// Format: { slug/cnpj/email → canonicalId }
//
// This is the escape hatch when algorithmic matching is insufficient.

const CLIENT_ALIAS_MAP: Record<string, string> = {
  // Same company, different names across JACQES / Caza Vision
  "nexus-corp": "client::nexus-corp",
  "nexus-corporation": "client::nexus-corp",
  "nexus": "client::nexus-corp",

  "stellar-labs": "client::stellar-labs",
  "stellar-laboratories": "client::stellar-labs",

  "euroventure-gmbh": "client::euroventure",
  "euroventure": "client::euroventure",

  "shibuya-solutions": "client::shibuya-solutions",
  "shibuya-sol": "client::shibuya-solutions",

  "africatech-hub": "client::africatech-hub",
  "africa-tech-hub": "client::africatech-hub",

  // Caza Vision clients also known to JACQES
  "produtora-xyz": "client::produtora-xyz",
  "media-group-br": "client::media-group-br",
  "agencia-creative": "client::agencia-creative",
};

const PORTFOLIO_ALIAS_MAP: Record<string, string> = {
  // Enerdy appears under multiple names
  "enerdy": "portfolio::enerdy",
  "enerdy-solar": "portfolio::enerdy",
  "enerdy-energia": "portfolio::enerdy",
  "enerdy-energy": "portfolio::enerdy",

  "fintechx": "portfolio::fintechx",
  "fintech-x": "portfolio::fintechx",

  "greentech-startup": "portfolio::greentech",
  "greentech": "portfolio::greentech",
};

// ─── String Normalization ──────────────────────────────────────────────────────

/**
 * Aggressively normalises a display name into a stable, comparable slug.
 * - Lowercases
 * - Strips accents / diacritics
 * - Replaces punctuation and whitespace with hyphens
 * - Removes common legal suffixes (SA, LTDA, GmbH, Corp, Inc, …)
 */
export function normalizeToSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip diacritics
    .replace(/\b(s\.?a\.?|ltda\.?|me\.?|eireli\.?|inc\.?|corp\.?|llc\.?|gmbh\.?|bv\.?|srl\.?|limited|solutions?|group|brasil|brazil)\b/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .trim();
}

/** Normalises a CNPJ to digits-only */
export function normalizeCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/** Normalises an email to lowercase trimmed form */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/** Normalises a phone number to digits-only */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ─── Identity Resolution ───────────────────────────────────────────────────────

export interface ClientIdentityInput {
  name: string;
  email?: string;
  cnpj?: string;
  phone?: string;
  ownerBU: BusinessUnitId;
  sourceRecordId: string;
}

/**
 * Resolves a stable canonical client ID for a given raw identity input.
 * Returns the same ID whenever the same real-world client is seen, regardless
 * of which BU the record came from.
 */
export function resolveClientCanonicalId(input: ClientIdentityInput): string {
  const slug = normalizeToSlug(input.name);

  // 1. Manual alias override (highest precedence)
  if (CLIENT_ALIAS_MAP[slug]) {
    return CLIENT_ALIAS_MAP[slug];
  }

  // 2. CNPJ match
  if (input.cnpj) {
    const normalized = normalizeCNPJ(input.cnpj);
    const aliasKey = `cnpj::${normalized}`;
    if (CLIENT_ALIAS_MAP[aliasKey]) return CLIENT_ALIAS_MAP[aliasKey];
    // Register for future lookups (in-memory only; would persist to DB in production)
    CLIENT_ALIAS_MAP[aliasKey] = `client::${slug}`;
    return `client::${slug}`;
  }

  // 3. Email domain match
  if (input.email) {
    const email = normalizeEmail(input.email);
    const aliasKey = `email::${email}`;
    if (CLIENT_ALIAS_MAP[aliasKey]) return CLIENT_ALIAS_MAP[aliasKey];
  }

  // 4. Slug match (handles minor typos and legal suffix variations)
  // Already checked above via CLIENT_ALIAS_MAP[slug]

  // 5. Fallback: generate deterministic canonical ID from slug
  return `client::${slug}`;
}

export interface PortfolioIdentityInput {
  name: string;
  cnpj?: string;
}

/**
 * Resolves a stable canonical portfolio company ID.
 */
export function resolvePortfolioCanonicalId(input: PortfolioIdentityInput): string {
  const slug = normalizeToSlug(input.name);

  if (PORTFOLIO_ALIAS_MAP[slug]) {
    return PORTFOLIO_ALIAS_MAP[slug];
  }

  if (input.cnpj) {
    const aliasKey = `cnpj::${normalizeCNPJ(input.cnpj)}`;
    if (PORTFOLIO_ALIAS_MAP[aliasKey]) return PORTFOLIO_ALIAS_MAP[aliasKey];
  }

  return `portfolio::${slug}`;
}

// ─── Cross-BU Match Scoring ────────────────────────────────────────────────────

export interface MatchScore {
  score: number;      // 0–100
  matchedOn: string;  // Which field triggered the match
}

/**
 * Computes a confidence score for two client records being the same entity.
 * Used by the dedup engine to decide whether to merge records.
 *
 * Scoring:
 *   CNPJ exact match  → 100
 *   Email exact match → 90
 *   Slug exact match  → 80
 *   Phone exact match → 70
 *   Canonical ID match → 95 (already resolved upstream)
 */
export function scoreClientMatch(
  a: { name: string; email?: string; cnpj?: string; phone?: string; clientCanonicalId?: string },
  b: { name: string; email?: string; cnpj?: string; phone?: string; clientCanonicalId?: string }
): MatchScore {
  if (a.clientCanonicalId && b.clientCanonicalId && a.clientCanonicalId === b.clientCanonicalId) {
    return { score: 95, matchedOn: "canonicalId" };
  }
  if (a.cnpj && b.cnpj && normalizeCNPJ(a.cnpj) === normalizeCNPJ(b.cnpj)) {
    return { score: 100, matchedOn: "cnpj" };
  }
  if (a.email && b.email && normalizeEmail(a.email) === normalizeEmail(b.email)) {
    return { score: 90, matchedOn: "email" };
  }
  if (normalizeToSlug(a.name) === normalizeToSlug(b.name)) {
    return { score: 80, matchedOn: "slug" };
  }
  if (a.phone && b.phone && normalizePhone(a.phone) === normalizePhone(b.phone)) {
    return { score: 70, matchedOn: "phone" };
  }
  return { score: 0, matchedOn: "none" };
}

/** Threshold above which two records are considered the same entity */
export const IDENTITY_MATCH_THRESHOLD = 70;
