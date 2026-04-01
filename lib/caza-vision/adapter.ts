// ─── CAZA VISION — Notion → Domain Adapters ────────────────────────────────────
// Three adapters matching the three real Notion databases.

import { CAZA_VISION_CONFIG } from './config'
import type {
  ProjetoRecord, ProjetoStatus, ProjetoTipo,
  FinanceiroRecord,
  ClienteRecord, ClienteStatus, ClienteTipo,
} from './types'
import {
  extractTitle,
  extractRichText,
  extractNumber,
  extractSelect,
  extractEmail,
  extractPhoneNumber,
  extractDate,
  getProp,
} from './notion-parser'

type NotionPage = { id: string; properties: Record<string, unknown> }

// ── Month label → sort order ───────────────────────────────────────────────────
// "Mar/26" → 202603  |  "Jan/25" → 202501

const PT_MONTH: Record<string, number> = {
  jan: 1, fev: 2, mar: 3, abr: 4,  mai: 5,  jun: 6,
  jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12,
}

function mesLabelToOrder(mes: string): number {
  const [m, y] = mes.toLowerCase().split('/')
  const month   = PT_MONTH[m] ?? 0
  const shortYr = parseInt(y ?? '0', 10)
  const year    = shortYr < 100 ? 2000 + shortYr : shortYr
  return year * 100 + month
}

// ── Projetos adapter ───────────────────────────────────────────────────────────

export function adaptProjeto(page: NotionPage): ProjetoRecord {
  const p = page.properties
  const f = CAZA_VISION_CONFIG.fieldMaps.projetos

  const tituloProp = getProp(p, f.titulo)
  const titulo = extractTitle(tituloProp) ?? `[sem título] ${page.id.slice(0, 8)}`

  return {
    id:      page.id,
    titulo,
    cliente: extractRichText(getProp(p, f.cliente)),
    diretor: extractRichText(getProp(p, f.diretor)),
    inicio:  extractDate(getProp(p, f.inicio)).date,
    prazo:   extractDate(getProp(p, f.prazo)).date,
    status:  extractSelect(getProp(p, f.status)) as ProjetoStatus | null,
    tipo:    extractSelect(getProp(p, f.tipo))   as ProjetoTipo   | null,
    valor:   extractNumber(getProp(p, f.valor)),
    notionPageId: page.id,
  }
}

export function adaptProjetos(pages: NotionPage[]): ProjetoRecord[] {
  return pages.map(adaptProjeto)
}

// ── Financeiro adapter ─────────────────────────────────────────────────────────

export function adaptFinanceiro(page: NotionPage): FinanceiroRecord {
  const p = page.properties
  const f = CAZA_VISION_CONFIG.fieldMaps.financeiro

  const mes       = extractTitle(getProp(p, f.mes)) ?? ''
  const receita   = extractNumber(getProp(p, f.receita))   ?? 0
  const orcamento = extractNumber(getProp(p, f.orcamento)) ?? 0
  const despesas  = extractNumber(getProp(p, f.despesas))  ?? 0
  const lucro     = extractNumber(getProp(p, f.lucro))     ?? 0
  const margem    = receita > 0 ? (lucro / receita) * 100 : null

  return {
    id:      page.id,
    mes,
    mesOrder: mesLabelToOrder(mes),
    receita,
    orcamento,
    despesas,
    lucro,
    margem,
    notionPageId: page.id,
  }
}

export function adaptFinanceiros(pages: NotionPage[]): FinanceiroRecord[] {
  return pages
    .map(adaptFinanceiro)
    .sort((a, b) => a.mesOrder - b.mesOrder)
}

// ── Clientes adapter ───────────────────────────────────────────────────────────

export function adaptCliente(page: NotionPage): ClienteRecord {
  const p = page.properties
  const f = CAZA_VISION_CONFIG.fieldMaps.clientes

  const nomeProp = getProp(p, f.nome)
  const nome = extractTitle(nomeProp) ?? `[sem nome] ${page.id.slice(0, 8)}`

  return {
    id:          page.id,
    nome,
    email:       extractEmail(getProp(p, f.email)),
    segmento:    extractRichText(getProp(p, f.segmento)),
    status:      extractSelect(getProp(p, f.status)) as ClienteStatus | null,
    desde:       extractDate(getProp(p, f.desde)).date,
    telefone:    extractPhoneNumber(getProp(p, f.telefone)),
    budgetAnual: extractNumber(getProp(p, f.budgetAnual)),
    tipo:        extractSelect(getProp(p, f.tipo)) as ClienteTipo | null,
    notionPageId: page.id,
  }
}

export function adaptClientes(pages: NotionPage[]): ClienteRecord[] {
  return pages.map(adaptCliente)
}
