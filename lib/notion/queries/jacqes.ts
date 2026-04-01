/**
 * Queries Notion para os databases da JACQES.
 *
 * Databases mapeados:
 *   - JACQES — Contas & Carteira  (Nome da Conta, Saúde, Risco, Segmento,
 *                                   MRR, Budget, Pendências Abertas, Próxima Visita)
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion, NOTION_DB } from "@/lib/notion/client";
import {
  getTitle,
  getNumber,
  getText,
  getSelect,
  getEmail,
  getPhone,
  getPageId,
  mapSaudeToStatus,
} from "@/lib/notion/normalizers";

import type { CanonicalCustomerRecord } from "@/lib/types/canonical";
import { makeCanonicalId } from "@/lib/fetchers/base";
import { resolveClientCanonicalId, normalizeToSlug } from "@/lib/consolidation/canonical-identity";

const BU_ID = "jacqes" as const;
const SOURCE_DB = "jacqes-notion-main";
const SOURCE_PRIORITY = 80;

// ─── Contas & Carteira ─────────────────────────────────────────────────────────

/** Lê todos os registros da carteira de clientes JACQES */
export async function queryJacqesCarteira(): Promise<CanonicalCustomerRecord[]> {
  const response = await notion.dataSources.query({
    data_source_id: NOTION_DB.JACQES_CARTEIRA,
    page_size: 100,
  });

  const now = new Date().toISOString();
  const records: CanonicalCustomerRecord[] = [];

  for (const page of response.results) {
    if (page.object !== "page") continue;
    const p = page as PageObjectResponse;

    const name = getTitle(p, "Nome da Conta") || getTitle(p, "Nome") || getTitle(p);
    if (!name) continue;

    const saude       = getSelect(p, "Saúde") || getSelect(p, "Saude");
    const risco       = getSelect(p, "Risco");
    const segmento    = getSelect(p, "Segmento") || getText(p, "Segmento");
    const email       = getEmail(p, "Email") || getText(p, "Email");
    const phone       = getPhone(p, "Telefone") || getText(p, "Telefone");
    // pendencias and proximaVisita available for future use / observability
    // const pendencias  = getNumber(p, "Pendências Abertas") || getNumber(p, "Pendências");
    // const proximaVisita = getDate(p, "Próxima Visita");

    // MRR / Valor — try several field name variants used in JACQES
    const mrr = getNumber(p, "MRR")
      || getNumber(p, "Receita Mensal")
      || getNumber(p, "Valor Mensal")
      || getNumber(p, "Ticket Mensal");

    // Budget anual — derive or read directly
    const budgetAnual = getNumber(p, "Budget Anual")
      || getNumber(p, "Budget")
      || getNumber(p, "Receita Anual")
      || (mrr > 0 ? mrr * 12 : 0);

    const canonicalStatus = mapSaudeToStatus(saude);

    // Segment mapping from JACQES carteira
    const segment = mapJacqesSegmentoToCanonical(segmento);

    const clientCanonicalId = resolveClientCanonicalId({
      name,
      email: email || undefined,
      ownerBU: BU_ID,
      sourceRecordId: getPageId(p),
    });

    const ltv = budgetAnual > 0 ? budgetAnual : mrr * 12;

    records.push({
      id: makeCanonicalId(BU_ID, getPageId(p)),
      sourceRecordId: getPageId(p),
      clientCanonicalId,
      ownerBU: BU_ID,
      clientName: name,
      clientSlug: normalizeToSlug(name),
      email:  email  || undefined,
      phone:  phone  || undefined,
      segment,
      status: canonicalStatus,
      relationshipType: "client",
      linkedBUs: [BU_ID],
      ltv,
      cac: 0, // não registrado na carteira
      mrr,
      lastUpdated: p.last_edited_time ?? now,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion",
      dataQualityFlag: saude ? "verified" : "partial",
      reconciliationStatus: "clean",
    });
  }

  return records;
}

// ─── Segment mapping ───────────────────────────────────────────────────────────

function mapJacqesSegmentoToCanonical(
  segmento: string
): "Enterprise" | "SMB" | "Startup" | "Individual" {
  const s = segmento.toLowerCase();
  if (s.includes("enterprise") || s.includes("grande") || s.includes("corporat")) {
    return "Enterprise";
  }
  if (s.includes("startup") || s.includes("scale")) {
    return "Startup";
  }
  if (s.includes("individual") || s.includes("pessoa física") || s.includes("pf")) {
    return "Individual";
  }
  // Default: SMB covers "média empresa", "PME", blank, etc.
  return "SMB";
}
