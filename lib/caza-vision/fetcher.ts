// ─── CAZA VISION — Notion Fetcher + Domain Aggregators ─────────────────────────
//
// fetchCazaVisionRecords()  — full paginated fetch, returns FetchResult<ProjectRecord>
// deriveFinancialMonths()   — aggregates records by competência month
// deriveOverviewMetrics()   — computes Visão Geral KPIs
// deriveUnitEconomics()     — computes Unit Economics metrics
//
// IMPORTANT: This module runs server-side (Next.js Server Components / Route Handlers).
// process.env is safe here. No credentials are exposed to the client.

import { CAZA_VISION_CONFIG, hasCredentials } from './config'
import { adaptNotionPages } from './adapter'
import type {
  ProjectRecord,
  FetchResult,
  FinancialMonth,
  OverviewMetrics,
  UnitEconomicsMetrics,
} from './types'

// ── Notion page shape (minimal) ────────────────────────────────────────────────

type NotionPage = {
  id: string
  properties: Record<string, unknown>
}

type NotionQueryResponse = {
  results:     NotionPage[]
  has_more:    boolean
  next_cursor: string | null
}

// ── Internal: single Notion database query ─────────────────────────────────────

async function queryDatabase(cursor?: string): Promise<NotionQueryResponse> {
  const { databaseId, notionToken, notionVersion, baseUrl } = CAZA_VISION_CONFIG

  const body: Record<string, unknown> = { page_size: 100 }
  if (cursor) body.start_cursor = cursor

  const res = await fetch(`${baseUrl}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization:    `Bearer ${notionToken}`,
      'Notion-Version': notionVersion,
      'Content-Type':   'application/json',
    },
    body: JSON.stringify(body),
    // No cache — always fetch fresh data on each request
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '(sem corpo de resposta)')
    throw new Error(`Notion API respondeu ${res.status}: ${body}`)
  }

  return res.json() as Promise<NotionQueryResponse>
}

// ── Internal: paginate through all records ────────────────────────────────────

async function fetchAllPages(): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const result = await queryDatabase(cursor)
    pages.push(...result.results)
    cursor =
      result.has_more && result.next_cursor
        ? result.next_cursor
        : undefined
  } while (cursor)

  return pages
}

// ── Public: fetch all CAZA VISION records ─────────────────────────────────────

export async function fetchCazaVisionRecords(): Promise<FetchResult<ProjectRecord>> {
  const fetchedAt = new Date().toISOString()

  // Guard: no credentials — return structured empty state, no mock fallback
  if (!hasCredentials()) {
    console.warn(
      '[CAZA VISION] Credenciais ausentes: NOTION_TOKEN e/ou CAZA_VISION_DB_ID não configurados'
    )
    return {
      status:           'no_credentials',
      data:             [],
      recordsTotal:     0,
      recordsValid:     0,
      recordsDiscarded: 0,
      missingFields:    [],
      fallbackActive:   false,
      errorMessage:
        'Configure NOTION_TOKEN e CAZA_VISION_DB_ID no arquivo .env.local para conectar à base real.',
      fetchedAt,
    }
  }

  try {
    console.log(
      `[CAZA VISION] Consultando database: ${CAZA_VISION_CONFIG.databaseId}`
    )

    const rawPages = await fetchAllPages()
    console.log(`[CAZA VISION] ${rawPages.length} registros brutos retornados`)

    const records = adaptNotionPages(rawPages)

    const valid     = records.filter((r) => r.valor !== null)
    const discarded = records.filter((r) => r.valor === null)

    if (discarded.length > 0) {
      console.warn(
        `[CAZA VISION] ${discarded.length} registros sem campo "Valor" — excluídos dos cálculos de receita`
      )
    }

    const allFlags    = records.flatMap((r) => r.dataQualityFlags)
    const missingFields = [...new Set(allFlags)]

    console.log(
      `[CAZA VISION] ${valid.length} válidos, ${discarded.length} descartados`
    )
    if (missingFields.length) {
      console.warn('[CAZA VISION] Problemas de qualidade:', missingFields)
    }

    return {
      status:           records.length === 0 ? 'empty' : 'ok',
      data:             records,
      recordsTotal:     rawPages.length,
      recordsValid:     valid.length,
      recordsDiscarded: discarded.length,
      missingFields,
      fallbackActive:   false,
      errorMessage:     null,
      fetchedAt,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[CAZA VISION] Erro ao buscar dados da Notion API:', msg)
    return {
      status:           'api_error',
      data:             [],
      recordsTotal:     0,
      recordsValid:     0,
      recordsDiscarded: 0,
      missingFields:    [],
      fallbackActive:   false,
      errorMessage:     msg,
      fetchedAt,
    }
  }
}

// ── Aggregation: financial months ──────────────────────────────────────────────

export function deriveFinancialMonths(records: ProjectRecord[]): FinancialMonth[] {
  const monthMap = new Map<string, FinancialMonth>()

  for (const r of records) {
    const date = r.competencia.date
    const key = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : '__sem_competencia__'

    const label = date
      ? date
          .toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
          .replace(/^\w/, (c) => c.toUpperCase())
          .replace('.', '')
      : 'Sem Competência'

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        competencia:      label,
        competenciaRaw:   date,
        receita:          0,
        alimentacao:      0,
        gasolina:         0,
        totalDespesas:    0,
        lucro:            0,
        margem:           null,
        projetosCount:    0,
        dataQualityFlags: [],
      })
    }

    const m = monthMap.get(key)!
    m.projetosCount++
    m.receita       += r.valor        ?? 0
    m.alimentacao   += r.alimentacao  ?? 0
    m.gasolina      += r.gasolina     ?? 0
    m.totalDespesas += r.totalExpenses ?? 0
    m.lucro          = m.receita - m.totalDespesas

    // Month margin: only compute if at least one project in the month has expense data
    const monthHasExpenses = Array.from(monthMap.values())
      .some(() => {
        // Re-check: if this month has any project with expenses
        return r.hasExpenses
      })
    m.margem = m.receita > 0 && monthHasExpenses
      ? (m.lucro / m.receita) * 100
      : null

    if (r.dataQualityFlags.length) {
      m.dataQualityFlags.push(...r.dataQualityFlags)
    }
  }

  // Sort chronologically; unknown competência goes last
  return Array.from(monthMap.entries())
    .sort(([a], [b]) => {
      if (a === '__sem_competencia__') return 1
      if (b === '__sem_competencia__') return -1
      return a.localeCompare(b)
    })
    .map(([, v]) => ({
      ...v,
      dataQualityFlags: [...new Set(v.dataQualityFlags)],
    }))
}

// ── Aggregation: overview metrics ──────────────────────────────────────────────

export function deriveOverviewMetrics(records: ProjectRecord[]): OverviewMetrics {
  if (!records.length) {
    return {
      totalProjetos:     0,
      projetosRecebidos: 0,
      projetosPendentes: 0,
      receitaTotal:      0,
      despesasTotal:     null,
      lucroTotal:        null,
      margemMedia:       null,
      ticketMedio:       null,
      dataQualityFlags:  ['Nenhum registro encontrado na base'],
    }
  }

  const recebidos = records.filter((r) =>  r.recebido)
  const pendentes = records.filter((r) => !r.recebido)

  const comValor = records.filter((r) => r.valor !== null)
  const receitaTotal = comValor.reduce((sum, r) => sum + r.valor!, 0)

  const comDespesas = records.filter((r) => r.hasExpenses)
  const despesasTotal = comDespesas.length > 0
    ? records.reduce((sum, r) => sum + (r.totalExpenses ?? 0), 0)
    : null

  const lucroTotal = despesasTotal !== null
    ? receitaTotal - despesasTotal
    : null

  const margemMedia = receitaTotal > 0 && lucroTotal !== null
    ? (lucroTotal / receitaTotal) * 100
    : null

  const ticketMedio = comValor.length > 0
    ? receitaTotal / comValor.length
    : null

  const flags: string[] = []
  const semValor = records.filter((r) => r.valor === null)
  if (semValor.length > 0) {
    flags.push(
      `${semValor.length} projeto(s) sem campo "Valor" — excluídos do cálculo de receita`
    )
  }
  if (comDespesas.length === 0) {
    flags.push('Nenhum projeto com dados de despesas — lucro e margem indisponíveis')
  } else if (comDespesas.length < records.length) {
    flags.push(
      `${records.length - comDespesas.length} projeto(s) sem despesas — margem parcial`
    )
  }

  return {
    totalProjetos:     records.length,
    projetosRecebidos: recebidos.length,
    projetosPendentes: pendentes.length,
    receitaTotal,
    despesasTotal,
    lucroTotal,
    margemMedia,
    ticketMedio,
    dataQualityFlags:  flags,
  }
}

// ── Aggregation: unit economics ────────────────────────────────────────────────

export function deriveUnitEconomics(records: ProjectRecord[]): UnitEconomicsMetrics {
  const comValor    = records.filter((r) => r.valor !== null)
  const comDespesas = records.filter((r) => r.hasExpenses)
  const semDespesas = records.filter((r) => !r.hasExpenses)
  const flags: string[] = []

  const receitaMedia = comValor.length > 0
    ? comValor.reduce((s, r) => s + r.valor!, 0) / comValor.length
    : null

  const despesaMedia = comDespesas.length > 0
    ? comDespesas.reduce((s, r) => s + r.totalExpenses!, 0) / comDespesas.length
    : null

  const margens = records.filter((r) => r.margin !== null).map((r) => r.margin!)
  const margemMediaPonderada = margens.length > 0
    ? margens.reduce((s, m) => s + m, 0) / margens.length
    : null

  if (comDespesas.length === 0) {
    flags.push('Nenhum projeto com dados de despesas — métricas de custo indisponíveis')
  } else if (semDespesas.length > 0) {
    flags.push(
      `${semDespesas.length} projeto(s) sem despesas — excluídos da margem média ponderada`
    )
  }
  if (comValor.length < records.length) {
    flags.push(
      `${records.length - comValor.length} projeto(s) sem "Valor" — excluídos da receita média`
    )
  }

  return {
    receitaMedia,
    despesaMediaPorProjeto: despesaMedia,
    margemMediaPonderada,
    projetosComDespesas:    comDespesas.length,
    projetosSemDespesas:    semDespesas.length,
    totalProjetos:          records.length,
    dataQualityFlags:       flags,
  }
}
