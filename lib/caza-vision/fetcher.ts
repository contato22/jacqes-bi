// ─── CAZA VISION — Fetchers (static data) ─────────────────────────────────────
// Reads from lib/db/data.ts — static TypeScript constants embedded at build time.
// Compatible with Next.js static export (output: 'export') and GitHub Pages.

import { PROJETOS_DATA, FINANCEIRO_DATA, CLIENTES_DATA } from '@/lib/db/data'
import type {
  ProjetoRecord, FinanceiroRecord, ClienteRecord,
  FetchResult, OverviewMetrics, PipelineGroup, ProjetoStatus,
} from './types'

// ── Row → domain mappers ───────────────────────────────────────────────────────

type ProjetoRow = typeof PROJETOS_DATA[number]
type FinanceiroRow = typeof FINANCEIRO_DATA[number]
type ClienteRow = typeof CLIENTES_DATA[number]

function toProjetoRecord(row: ProjetoRow): ProjetoRecord {
  return {
    id:      row.id,
    titulo:  row.titulo,
    cliente: row.cliente   ?? null,
    diretor: row.diretor   ?? null,
    inicio:  row.inicio    ? new Date(row.inicio) : null,
    prazo:   row.prazo     ? new Date(row.prazo)  : null,
    status:  (row.status   ?? null) as ProjetoRecord['status'],
    tipo:    (row.tipo     ?? null) as ProjetoRecord['tipo'],
    valor:   row.valor     ?? null,
  }
}

function toFinanceiroRecord(row: FinanceiroRow): FinanceiroRecord {
  const margem = row.receita > 0 ? (row.lucro / row.receita) * 100 : null
  return {
    id:        row.id,
    mes:       row.mes,
    mesOrder:  row.mes_order,
    receita:   row.receita,
    orcamento: row.orcamento,
    despesas:  row.despesas,
    lucro:     row.lucro,
    margem,
  }
}

function toClienteRecord(row: ClienteRow): ClienteRecord {
  return {
    id:          row.id,
    nome:        row.nome,
    email:       row.email        ?? null,
    segmento:    row.segmento     ?? null,
    status:      (row.status      ?? null) as ClienteRecord['status'],
    desde:       row.desde        ? new Date(row.desde) : null,
    telefone:    row.telefone     ?? null,
    budgetAnual: row.budget_anual ?? null,
    tipo:        (row.tipo        ?? null) as ClienteRecord['tipo'],
  }
}

// ── Public fetchers ────────────────────────────────────────────────────────────

export async function fetchProjetos(): Promise<FetchResult<ProjetoRecord>> {
  const fetchedAt = new Date().toISOString()
  const data = [...PROJETOS_DATA].map(toProjetoRecord)
  return { status: data.length ? 'ok' : 'empty', data, total: data.length, errorMessage: null, fetchedAt }
}

export async function fetchFinanceiro(): Promise<FetchResult<FinanceiroRecord>> {
  const fetchedAt = new Date().toISOString()
  const data = [...FINANCEIRO_DATA]
    .sort((a, b) => a.mes_order - b.mes_order)
    .map(toFinanceiroRecord)
  return { status: data.length ? 'ok' : 'empty', data, total: data.length, errorMessage: null, fetchedAt }
}

export async function fetchClientes(): Promise<FetchResult<ClienteRecord>> {
  const fetchedAt = new Date().toISOString()
  const data = [...CLIENTES_DATA]
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(toClienteRecord)
  return { status: data.length ? 'ok' : 'empty', data, total: data.length, errorMessage: null, fetchedAt }
}

export async function fetchAll3() {
  const [projetos, financeiro, clientes] = await Promise.all([
    fetchProjetos(),
    fetchFinanceiro(),
    fetchClientes(),
  ])
  return { projetos, financeiro, clientes }
}

// ── Overview metrics ───────────────────────────────────────────────────────────

export function deriveOverviewMetrics(
  projetos:   ProjetoRecord[],
  financeiro: FinanceiroRecord[],
  clientes:   ClienteRecord[]
): OverviewMetrics {
  const statusAtivo: ProjetoStatus[] = ['Em Produção', 'Em Edição', 'Aguardando Aprovação']
  const projetosAtivos    = projetos.filter((p) => p.status && statusAtivo.includes(p.status))
  const projetosEntregues = projetos.filter((p) => p.status === 'Entregue')

  const comValor = projetos.filter((p) => p.valor !== null)
  const ticketMedio = comValor.length > 0
    ? comValor.reduce((s, p) => s + p.valor!, 0) / comValor.length
    : null

  const mesesComReceita = financeiro.filter((m) => m.receita > 0)
  const maisRecente     = mesesComReceita.at(-1) ?? null

  const anoAtual = maisRecente
    ? Math.floor(maisRecente.mesOrder / 100)
    : new Date().getFullYear()

  const ytd = financeiro.filter((m) => Math.floor(m.mesOrder / 100) === anoAtual)
  const receitaYTD  = ytd.reduce((s, m) => s + m.receita,  0)
  const despesasYTD = ytd.reduce((s, m) => s + m.despesas, 0)
  const lucroYTD    = ytd.reduce((s, m) => s + m.lucro,    0)

  const margens = mesesComReceita.filter((m) => m.margem !== null).map((m) => m.margem!)
  const margemMedia = margens.length > 0
    ? margens.reduce((s, m) => s + m, 0) / margens.length
    : null

  const clientesAtivos    = clientes.filter((c) => c.status === 'Ativo')
  const totalBudgetAtivos = clientesAtivos.reduce((s, c) => s + (c.budgetAnual ?? 0), 0)

  return {
    totalProjetos:     projetos.length,
    projetosAtivos:    projetosAtivos.length,
    projetosEntregues: projetosEntregues.length,
    mesMaisRecente:    maisRecente?.mes ?? null,
    receitaMesAtual:   maisRecente?.receita ?? null,
    receitaYTD,
    despesasYTD,
    lucroYTD,
    margemMedia,
    clientesAtivos:    clientesAtivos.length,
    totalBudgetAtivos,
    ticketMedio,
  }
}

// ── Pipeline ───────────────────────────────────────────────────────────────────

const PIPELINE_ORDER: ProjetoStatus[] = [
  'Em Produção',
  'Em Edição',
  'Aguardando Aprovação',
  'Entregue',
]

export function derivePipeline(projetos: ProjetoRecord[]): PipelineGroup[] {
  return PIPELINE_ORDER.map((status) => {
    const group = projetos.filter((p) => p.status === status)
    return {
      status,
      projetos: group,
      total:    group.length,
      valor:    group.reduce((s, p) => s + (p.valor ?? 0), 0),
    }
  })
}

// ── Unit Economics ─────────────────────────────────────────────────────────────

export interface UnitEconMetrics {
  ticketMedioPorTipo:    { tipo: string; count: number; mediaValor: number; totalValor: number }[]
  ticketMedioPorCliente: { cliente: string; count: number; totalValor: number }[]
  margemMediaMeses:      number | null
  orcamentoVsReceita:    { mes: string; orcamento: number; receita: number; diff: number }[]
}

export function deriveUnitEconomics(
  projetos:   ProjetoRecord[],
  financeiro: FinanceiroRecord[]
): UnitEconMetrics {
  const tipoMap = new Map<string, { count: number; total: number }>()
  for (const p of projetos) {
    if (p.valor === null) continue
    const key = p.tipo ?? '(sem tipo)'
    const cur = tipoMap.get(key) ?? { count: 0, total: 0 }
    tipoMap.set(key, { count: cur.count + 1, total: cur.total + p.valor })
  }
  const ticketMedioPorTipo = Array.from(tipoMap.entries())
    .map(([tipo, { count, total }]) => ({ tipo, count, totalValor: total, mediaValor: count > 0 ? total / count : 0 }))
    .sort((a, b) => b.totalValor - a.totalValor)

  const clienteMap = new Map<string, { count: number; total: number }>()
  for (const p of projetos) {
    if (p.valor === null) continue
    const key = p.cliente ?? '(sem cliente)'
    const cur = clienteMap.get(key) ?? { count: 0, total: 0 }
    clienteMap.set(key, { count: cur.count + 1, total: cur.total + p.valor })
  }
  const ticketMedioPorCliente = Array.from(clienteMap.entries())
    .map(([cliente, { count, total }]) => ({ cliente, count, totalValor: total }))
    .sort((a, b) => b.totalValor - a.totalValor)

  const mesesComReceita = financeiro.filter((m) => m.receita > 0 && m.margem !== null)
  const margemMediaMeses = mesesComReceita.length > 0
    ? mesesComReceita.reduce((s, m) => s + m.margem!, 0) / mesesComReceita.length
    : null

  const orcamentoVsReceita = financeiro
    .filter((m) => m.receita > 0 || m.orcamento > 0)
    .map((m) => ({ mes: m.mes, orcamento: m.orcamento, receita: m.receita, diff: m.receita - m.orcamento }))

  return { ticketMedioPorTipo, ticketMedioPorCliente, margemMediaMeses, orcamentoVsReceita }
}
