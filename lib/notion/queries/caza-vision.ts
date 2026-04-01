/**
 * Queries Notion para os databases da Caza Vision.
 *
 * Databases mapeados:
 *   - Caza Vision — Financeiro  (Mês, Receita, Despesas, Lucro, Orçamento)
 *   - Caza Vision — Clientes    (Nome, Email, Status, Tipo, Segmento, Budget Anual, Desde)
 *   - Caza Vision — Projetos    (Título, Cliente, Valor, Status, Tipo, Início, Prazo)
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion, NOTION_DB } from "@/lib/notion/client";
import {
  getTitle,
  getNumber,
  getText,
  getSelect,
  getDate,
  getEmail,
  getPhone,
  getPageId,
  parseMesBR,
  mapCazaStatusToCanonical,
  mapCazaTipoToSegment,
} from "@/lib/notion/normalizers";

import type {
  CanonicalFinancialRecord,
  CanonicalCustomerRecord,
} from "@/lib/types/canonical";
import { makeCanonicalId, getQuarter, periodToDate, calcGrossMargin } from "@/lib/fetchers/base";
import { resolveClientCanonicalId, normalizeToSlug } from "@/lib/consolidation/canonical-identity";

const BU_ID = "caza-vision" as const;
const SOURCE_DB = "cazavision-notion-prod";
const SOURCE_PRIORITY = 75;

// ─── Financeiro ────────────────────────────────────────────────────────────────

/** Lê todos os registros financeiros mensais da Caza Vision */
export async function queryCazaFinancials(options?: {
  year?: number;
  month?: number;
}): Promise<CanonicalFinancialRecord[]> {
  const response = await notion.dataSources.query({
    data_source_id: NOTION_DB.CAZA_FINANCEIRO,
    page_size: 100,
  });

  const records: CanonicalFinancialRecord[] = [];

  for (const page of response.results) {
    if (page.object !== "page") continue;
    const p = page as PageObjectResponse;

    const mesRaw = getTitle(p, "Mês") || getTitle(p);
    const period = parseMesBR(mesRaw);
    if (!period) continue;

    const { month, year } = period;

    // Filtro por período
    if (options?.year && year !== options.year) continue;
    if (options?.month && month !== options.month) continue;

    const grossRevenue = getNumber(p, "Receita");
    const cogs        = getNumber(p, "Despesas");
    const grossProfit = getNumber(p, "Lucro");
    const budget      = getNumber(p, "Orçamento");

    // Só incluir registros com algum dado
    if (grossRevenue === 0 && cogs === 0 && grossProfit === 0) continue;

    const opex     = 0; // não registrado neste database
    const ebitda   = grossProfit - opex;
    const netProfit = ebitda * 0.72;

    records.push({
      id: makeCanonicalId(BU_ID, year, month),
      sourceRecordId: getPageId(p),
      ownerBU: BU_ID,
      entityType: "bu",
      date: periodToDate(year, month),
      month,
      quarter: getQuarter(month),
      year,
      grossRevenue,
      netRevenue: grossRevenue * 0.98,
      recurringRevenue: grossRevenue * 0.45,
      nonRecurringRevenue: grossRevenue * 0.55,
      cogs,
      grossProfit,
      grossMargin: calcGrossMargin(grossProfit, grossRevenue),
      opex,
      ebitda,
      ebitdaMargin: grossRevenue > 0 ? parseFloat(((ebitda / grossRevenue) * 100).toFixed(2)) : 0,
      netProfit,
      cashFlow: ebitda * 0.80,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion",
      dataQualityFlag: grossRevenue > 0 ? "verified" : "partial",
      reconciliationStatus: "clean",
      sourcePriority: SOURCE_PRIORITY,
      tags: ["caza-vision", "audiovisual", "producao"],
    });
  }

  return records;
}

// ─── Clientes ──────────────────────────────────────────────────────────────────

/** Lê todos os clientes da Caza Vision */
export async function queryCazaClientes(): Promise<CanonicalCustomerRecord[]> {
  const response = await notion.dataSources.query({
    data_source_id: NOTION_DB.CAZA_CLIENTES,
    page_size: 100,
  });

  const now = new Date().toISOString();
  const records: CanonicalCustomerRecord[] = [];

  for (const page of response.results) {
    if (page.object !== "page") continue;
    const p = page as PageObjectResponse;

    const name   = getTitle(p, "Nome") || getTitle(p);
    if (!name) continue;

    const email       = getEmail(p, "Email");
    const telefone    = getPhone(p, "Telefone");
    const status      = getSelect(p, "Status");
    const tipo        = getSelect(p, "Tipo");
    const segmento    = getText(p, "Segmento");
    const budgetAnual = getNumber(p, "Budget Anual");
    const desde       = getDate(p, "Desde");

    const canonicalStatus = mapCazaStatusToCanonical(status);
    const segment         = mapCazaTipoToSegment(tipo);

    const clientCanonicalId = resolveClientCanonicalId({
      name,
      email: email || undefined,
      ownerBU: BU_ID,
      sourceRecordId: getPageId(p),
    });

    // Estimativa de MRR a partir do budget anual
    const mrr = budgetAnual > 0 ? Math.round(budgetAnual / 12) : 0;

    records.push({
      id: makeCanonicalId(BU_ID, getPageId(p)),
      sourceRecordId: getPageId(p),
      clientCanonicalId,
      ownerBU: BU_ID,
      clientName: name,
      clientSlug: normalizeToSlug(name),
      email:   email   || undefined,
      phone:   telefone || undefined,
      segment,
      status: canonicalStatus,
      relationshipType: "client",
      linkedBUs: [BU_ID],
      ltv: budgetAnual,
      cac: 0, // não registrado
      mrr,
      lastUpdated: p.last_edited_time ?? now,
      sourceDatabase: SOURCE_DB,
      sourceSystem: "notion",
      dataQualityFlag: email ? "verified" : "partial",
      reconciliationStatus: "clean",
    });
  }

  return records;
}

// ─── Projetos (para enriquecer receita) ───────────────────────────────────────

export interface CazaProjetoRecord {
  id: string;
  titulo: string;
  cliente: string;
  diretor: string;
  status: string;
  tipo: string;
  valor: number;
  inicio?: string;
  prazo?: string;
}

/** Lê todos os projetos da Caza Vision */
export async function queryCazaProjetos(): Promise<CazaProjetoRecord[]> {
  const response = await notion.dataSources.query({
    data_source_id: NOTION_DB.CAZA_PROJETOS,
    page_size: 100,
  });

  const records: CazaProjetoRecord[] = [];

  for (const page of response.results) {
    if (page.object !== "page") continue;
    const p = page as PageObjectResponse;

    const titulo = getTitle(p, "Título") || getTitle(p);
    if (!titulo) continue;

    records.push({
      id: getPageId(p),
      titulo,
      cliente: getText(p, "Cliente"),
      diretor: getText(p, "Diretor"),
      status:  getSelect(p, "Status"),
      tipo:    getSelect(p, "Tipo"),
      valor:   getNumber(p, "Valor"),
      inicio:  getDate(p, "Início"),
      prazo:   getDate(p, "Prazo"),
    });
  }

  return records;
}
