// ─── CAZA VISION — Notion Page → ProjectRecord Adapter ─────────────────────────
//
// Rules enforced here:
//  - Margin is null (indisponível) when expense fields are absent — NEVER 100%
//  - Missing name generates a placeholder — record is not discarded
//  - All quality issues are collected in dataQualityFlags[], not thrown
//  - No mock/default values are injected for missing fields

import { CAZA_VISION_CONFIG } from './config'
import type { ProjectRecord } from './types'
import {
  extractTitle,
  extractRichText,
  extractNumber,
  extractCheckbox,
  extractSelect,
  extractStatus,
  extractPeople,
  extractDate,
  getProp,
} from './notion-parser'

type NotionPage = {
  id: string
  properties: Record<string, unknown>
}

export function adaptNotionPage(page: NotionPage): ProjectRecord {
  const props = page.properties
  const f = CAZA_VISION_CONFIG.fieldMap
  const flags: string[] = []

  // ── Name ───────────────────────────────────────────────────────────────────
  const nameProp = getProp(props, f.name)
  // Notion title fields report type 'title'; rich_text as fallback for variants
  let name =
    extractTitle(nameProp) ??
    extractRichText(nameProp) ??
    null
  if (!name) {
    flags.push(`Campo "${f.name}" ausente ou vazio`)
    name = `[sem nome] ${page.id.slice(0, 8)}`
  }

  // ── Priority ───────────────────────────────────────────────────────────────
  const priorityProp = getProp(props, f.priority)
  const priority =
    extractSelect(priorityProp) ??
    extractStatus(priorityProp) ??
    extractRichText(priorityProp) ??
    null

  // ── Responsible ────────────────────────────────────────────────────────────
  const responsibleProp = getProp(props, f.responsible)
  const responsible =
    extractPeople(responsibleProp) ??
    extractRichText(responsibleProp) ??
    extractSelect(responsibleProp) ??
    null

  // ── Competência (billing period) ───────────────────────────────────────────
  const competenciaProp = getProp(props, f.competencia)
  const competencia = extractDate(competenciaProp)
  if (competencia.dataQualityFlag) flags.push(competencia.dataQualityFlag)

  // ── Recebimento (payment date) ────────────────────────────────────────────
  const recebimentoProp = getProp(props, f.recebimento)
  const recebimento = extractDate(recebimentoProp)
  if (recebimento.dataQualityFlag) flags.push(recebimento.dataQualityFlag)

  // ── Recebido (payment confirmed checkbox) ─────────────────────────────────
  const recebidoProp = getProp(props, f.recebido)
  const recebido = extractCheckbox(recebidoProp)

  // ── Valor (revenue) ────────────────────────────────────────────────────────
  const valorProp = getProp(props, f.valor)
  const valor = extractNumber(valorProp)
  if (valor === null) {
    flags.push(`Campo "${f.valor}" ausente ou não numérico`)
  }

  // ── Alimentação (expense: food/meals) ─────────────────────────────────────
  const alimentacaoProp = getProp(props, f.alimentacao)
  const alimentacao = extractNumber(alimentacaoProp)
  // null = not present; 0 = explicitly zero (valid)

  // ── Gasolina (expense: fuel) ───────────────────────────────────────────────
  const gasolinaProp = getProp(props, f.gasolina)
  const gasolina = extractNumber(gasolinaProp)

  // ── Derived financial metrics ──────────────────────────────────────────────
  //
  // RULE: Only compute totalExpenses when at least one expense field exists.
  //       A record with zero expense fields gets margin = null, NOT 100%.
  //       A record with all expense fields explicitly set to 0 gets margin = 100% (valid).

  const hasExpenses = alimentacao !== null || gasolina !== null

  const totalExpenses = hasExpenses
    ? (alimentacao ?? 0) + (gasolina ?? 0)
    : null

  const profit =
    valor !== null && totalExpenses !== null
      ? valor - totalExpenses
      : null

  const margin =
    valor !== null &&
    valor > 0 &&
    totalExpenses !== null
      ? (profit! / valor) * 100
      : null

  if (!hasExpenses && valor !== null) {
    flags.push('Despesas não informadas — margem indisponível para este projeto')
  }

  return {
    id:            page.id,
    name,
    priority,
    responsible,
    competencia,
    recebimento,
    recebido,
    valor,
    alimentacao,
    gasolina,
    totalExpenses,
    profit,
    margin,
    hasExpenses,
    dataQualityFlags: flags,
    notionPageId:  page.id,
  }
}

export function adaptNotionPages(pages: NotionPage[]): ProjectRecord[] {
  return pages.map(adaptNotionPage)
}
