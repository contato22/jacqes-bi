/**
 * Funções de normalização para converter respostas cruas do Notion SDK
 * em tipos primitivos TypeScript limpos.
 *
 * Encapsulam toda a complexidade de acesso às propriedades do Notion
 * (type guards, optional chaining, casos edge).
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// ─── Property Accessors ────────────────────────────────────────────────────────

type NotionPage = PageObjectResponse;

export function getTitle(page: NotionPage, prop = "title"): string {
  const p = page.properties[prop];
  if (!p) {
    // Fallback: try the page's title property directly
    for (const [, v] of Object.entries(page.properties)) {
      if (v.type === "title" && v.title.length > 0) {
        return v.title.map((t) => t.plain_text).join("").trim();
      }
    }
    return "";
  }
  if (p.type === "title") return p.title.map((t) => t.plain_text).join("").trim();
  return "";
}

export function getNumber(page: NotionPage, prop: string): number {
  const p = page.properties[prop];
  if (!p || p.type !== "number") return 0;
  return p.number ?? 0;
}

export function getText(page: NotionPage, prop: string): string {
  const p = page.properties[prop];
  if (!p) return "";
  if (p.type === "rich_text") return p.rich_text.map((t) => t.plain_text).join("").trim();
  if (p.type === "email") return p.email ?? "";
  if (p.type === "phone_number") return p.phone_number ?? "";
  if (p.type === "url") return p.url ?? "";
  return "";
}

export function getSelect(page: NotionPage, prop: string): string {
  const p = page.properties[prop];
  if (!p || p.type !== "select") return "";
  return p.select?.name ?? "";
}

export function getDate(page: NotionPage, prop: string): string | undefined {
  const p = page.properties[prop];
  if (!p || p.type !== "date") return undefined;
  return p.date?.start ?? undefined;
}

export function getEmail(page: NotionPage, prop: string): string {
  const p = page.properties[prop];
  if (!p || p.type !== "email") return "";
  return p.email ?? "";
}

export function getPhone(page: NotionPage, prop: string): string {
  const p = page.properties[prop];
  if (!p || p.type !== "phone_number") return "";
  return p.phone_number ?? "";
}

// ─── Notion Page ID ────────────────────────────────────────────────────────────

/** Extrai o ID limpo de uma page Notion (sem hifens) */
export function getPageId(page: NotionPage): string {
  return page.id.replace(/-/g, "");
}

// ─── Mês Brasileiro → { month, year } ─────────────────────────────────────────

const MES_MAP: Record<string, number> = {
  jan: 1, fev: 2, mar: 3, abr: 4,
  mai: 5, jun: 6, jul: 7, ago: 8,
  set: 9, out: 10, nov: 11, dez: 12,
};

/**
 * Converte "Mar/26" ou "mar/26" em { month: 3, year: 2026 }.
 * Retorna null se o formato não for reconhecido.
 */
export function parseMesBR(raw: string): { month: number; year: number } | null {
  const normalized = raw.trim().toLowerCase();
  const match = normalized.match(/^([a-zç]{3})\/(\d{2,4})$/);
  if (!match) return null;

  const [, mesStr, anoStr] = match;
  const month = MES_MAP[mesStr];
  if (!month) return null;

  const anoNum = parseInt(anoStr);
  const year = anoNum < 100 ? 2000 + anoNum : anoNum;

  return { month, year };
}

// ─── Status Notion → Canonical Status ─────────────────────────────────────────

export function mapSaudeToStatus(
  saude: string
): "active" | "at-risk" | "churned" | "prospect" {
  switch (saude) {
    case "Saudável":
      return "active";
    case "Estável com Atenção":
      return "active";
    case "Sensível":
      return "at-risk";
    case "Em Risco":
      return "at-risk";
    default:
      return "active";
  }
}

export function mapCazaStatusToCanonical(
  status: string
): "active" | "at-risk" | "churned" | "prospect" {
  switch (status) {
    case "Ativo":
      return "active";
    case "Em Proposta":
      return "prospect";
    case "Convertido":
      return "active";
    case "Perdido":
      return "churned";
    default:
      return "prospect";
  }
}

export function mapCazaTipoToSegment(
  tipo: string
): "Enterprise" | "SMB" | "Startup" | "Individual" {
  switch (tipo) {
    case "Marca":
      return "Enterprise";
    case "Agência":
      return "SMB";
    case "Empresa":
      return "SMB";
    case "Startup":
      return "Startup";
    default:
      return "SMB";
  }
}
