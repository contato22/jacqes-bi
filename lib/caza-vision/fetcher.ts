// ─── CAZA VISION — Fetchers + Overview Metrics ─────────────────────────────────
// Server-side only. process.env is safe here (Next.js Server Components).

import { CAZA_VISION_CONFIG, hasCredentials, missingCredentials } from './config'
import { adaptProjetos, adaptFinanceiros, adaptClientes } from './adapter'
import type {
  ProjetoRecord, FinanceiroRecord, ClienteRecord,
  FetchResult, OverviewMetrics, PipelineGroup, ProjetoStatus,
} from './types'

// ── Internal: raw Notion page shape ───────────────────────────────────────────

type NotionPage = { id: string; properties: Record<string, unknown> }
type NotionQueryResponse = {
  results:     NotionPage[]
  has_more:    boolean
  next_cursor: string | null
}

// ── Internal: paginated query ──────────────────────────────────────────────────

async function queryDatabase(dbId: string, cursor?: string): Promise<NotionQueryResponse> {
  const { notionToken, notionVersion, baseUrl } = CAZA_VISION_CONFIG
  const body: Record<string, unknown> = { page_size: 100 }
  if (cursor) body.start_cursor = cursor

  const res = await fetch(`${baseUrl}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization:    `Bearer ${notionToken}`,
      'Notion-Version': notionVersion,
      'Content-Type':   'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '(sem corpo)')
    throw new Error(`Notion API ${res.status} para database ${dbId}: ${text}`)
  }

  return res.json() as Promise<NotionQueryResponse>
}

async function fetchAll(dbId: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const result = await queryDatabase(dbId, cursor)
    pages.push(...result.results)
    cursor = result.has_more && result.next_cursor ? result.next_cursor : undefined
  } while (cursor)

  return pages
}

// ── No-credentials guard helper ────────────────────────────────────────────────

function noCredsResult<T>(fetchedAt: string): FetchResult<T> {
  const missing = missingCredentials()
  return {
    status: 'no_credentials',
    data: [],
    total: 0,
    errorMessage: `Configure no .env.local: ${missing.join(', ')}`,
    fetchedAt,
  }
}

// ── Public fetchers ────────────────────────────────────────────────────────────

export async function fetchProjetos(): Promise<FetchResult<ProjetoRecord>> {
  const fetchedAt = new Date().toISOString()
  if (!hasCredentials()) return noCredsResult(fetchedAt)

  try {
    const raw = await fetchAll(CAZA_VISION_CONFIG.databases.projetos)
    const data = adaptProjetos(raw)
    console.log(`[CAZA VISION] Projetos: ${data.length} registros`)
    return { status: data.length ? 'ok' : 'empty', data, total: data.length, errorMessage: null, fetchedAt }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[CAZA VISION] Erro ao buscar Projetos:', msg)
    return { status: 'api_error', data: [], total: 0, errorMessage: msg, fetchedAt }
  }
}

export async function fetchFinanceiro(): Promise<FetchResult<FinanceiroRecord>> {
  const fetchedAt = new Date().toISOString()
  if (!hasCredentials()) return noCredsResult(fetchedAt)

  try {
    const raw = await fetchAll(CAZA_VISION_CONFIG.databases.financeiro)
    const data = adaptFinanceiros(raw)  // already sorted by mesOrder
    console.log(`[CAZA VISION] Financeiro: ${data.length} meses`)
    return { status: data.length ? 'ok' : 'empty', data, total: data.length, errorMessage: null, fetchedAt }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[CAZA VISION] Erro ao buscar Financeiro:', msg)
    return { status: 'api_error', data: [], total: 0, errorMessage: msg, fetchedAt }
  }
}

export async function fetchClientes(): Promise<FetchResult<ClienteRecord>> {
  const fetchedAt = new Date().toISOString()
  if (!hasCredentials()) return noCredsResult(fetchedAt)

  try {
    const raw = await fetchAll(CAZA_VISION_CONFIG.databases.clientes)
    const data = adaptClientes(raw)
    console.log(`[CAZA VISION] Clientes: ${data.length} registros`)
    return { status: data.length ? 'ok' : 'empty', data, total: data.length, errorMessage: null, fetchedAt }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[CAZA VISION] Erro ao buscar Clientes:', msg)
    return { status: 'api_error', data: [], total: 0, errorMessage: msg, fetchedAt }
  }
}

// ── Fetch all three in parallel ────────────────────────────────────────────────

export async function fetchAll3() {
  const [projetos, financeiro, clientes] = await Promise.all([
    fetchProjetos(),
    fetchFinanceiro(),
    fetchClientes(),
  ])
  return { projetos, financeiro, clientes }
}

// ── Overview metrics (cross-database) ─────────────────────────────────────────

export function deriveOverviewMetrics(
  projetos:   ProjetoRecord[],
  financeiro: FinanceiroRecord[],
  clientes:   ClienteRecord[]
): OverviewMetrics {
  // Projetos
  const statusAtivo: ProjetoStatus[] = ['Em Produção', 'Em Edição', 'Aguardando Aprovação']
  const projetosAtivos    = projetos.filter((p) => p.status && statusAtivo.includes(p.status))
  const projetosEntregues = projetos.filter((p) => p.status === 'Entregue')

  const comValor = projetos.filter((p) => p.valor !== null)
  const ticketMedio = comValor.length > 0
    ? comValor.reduce((s, p) => s + p.valor!, 0) / comValor.length
    : null

  // Financeiro — meses com receita > 0 ordenados
  const mesesComReceita = financeiro.filter((m) => m.receita > 0)
  const maisRecente     = mesesComReceita.at(-1) ?? null

  // YTD: year of most recent month
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

  // Clientes
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

// ── Pipeline grouping ──────────────────────────────────────────────────────────

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
  ticketMedioPorTipo: { tipo: string; count: number; mediaValor: number; totalValor: number }[]
  ticketMedioPorCliente: { cliente: string; count: number; totalValor: number }[]
  margemMediaMeses:   number | null
  orcamentoVsReceita: { mes: string; orcamento: number; receita: number; diff: number }[]
}

export function deriveUnitEconomics(
  projetos:   ProjetoRecord[],
  financeiro: FinanceiroRecord[]
): UnitEconMetrics {
  // Por tipo de projeto
  const tipoMap = new Map<string, { count: number; total: number }>()
  for (const p of projetos) {
    if (p.valor === null) continue
    const key = p.tipo ?? '(sem tipo)'
    const cur = tipoMap.get(key) ?? { count: 0, total: 0 }
    tipoMap.set(key, { count: cur.count + 1, total: cur.total + p.valor })
  }
  const ticketMedioPorTipo = Array.from(tipoMap.entries())
    .map(([tipo, { count, total }]) => ({
      tipo,
      count,
      totalValor: total,
      mediaValor: count > 0 ? total / count : 0,
    }))
    .sort((a, b) => b.totalValor - a.totalValor)

  // Por cliente
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

  // Margem média dos meses com receita
  const mesesComReceita = financeiro.filter((m) => m.receita > 0 && m.margem !== null)
  const margemMediaMeses = mesesComReceita.length > 0
    ? mesesComReceita.reduce((s, m) => s + m.margem!, 0) / mesesComReceita.length
    : null

  // Orçamento vs Receita (meses com qualquer valor)
  const orcamentoVsReceita = financeiro
    .filter((m) => m.receita > 0 || m.orcamento > 0)
    .map((m) => ({
      mes:       m.mes,
      orcamento: m.orcamento,
      receita:   m.receita,
      diff:      m.receita - m.orcamento,
    }))

  return { ticketMedioPorTipo, ticketMedioPorCliente, margemMediaMeses, orcamentoVsReceita }
}
