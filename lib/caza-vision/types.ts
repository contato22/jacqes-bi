// ─── CAZA VISION — Domain Types ────────────────────────────────────────────────

// ── Date parsing ───────────────────────────────────────────────────────────────

export type DateFormat = 'iso' | 'br' | 'us' | 'notion-date' | 'unknown'

export interface DateParseResult {
  date:             Date | null
  format:           DateFormat
  ambiguous:        boolean
  raw:              string | null
  dataQualityFlag:  string | null
}

// ── Core domain record ─────────────────────────────────────────────────────────

export interface ProjectRecord {
  id:           string
  name:         string
  priority:     string | null
  responsible:  string | null
  competencia:  DateParseResult
  recebimento:  DateParseResult
  recebido:     boolean
  valor:        number | null   // Receita bruta
  alimentacao:  number | null   // Despesa: alimentação
  gasolina:     number | null   // Despesa: gasolina

  // Derived — null means "indisponível", never assumed
  totalExpenses:  number | null // null when ALL expense fields are null/missing
  profit:         number | null // null when valor or totalExpenses is null
  margin:         number | null // null = margem indisponível (NOT 0% or 100%)
  hasExpenses:    boolean       // true if at least one expense field is present

  dataQualityFlags: string[]
  notionPageId:     string
}

// ── Fetch result envelope ──────────────────────────────────────────────────────

export type FetchStatus =
  | 'ok'
  | 'empty'
  | 'no_credentials'
  | 'api_error'
  | 'parse_error'

export interface FetchResult<T> {
  status:           FetchStatus
  data:             T[]
  recordsTotal:     number
  recordsValid:     number    // records with Valor present
  recordsDiscarded: number    // records with Valor absent
  missingFields:    string[]
  fallbackActive:   boolean   // always false — no mock fallback
  errorMessage:     string | null
  fetchedAt:        string    // ISO timestamp
}

// ── Financial aggregation by competência month ─────────────────────────────────

export interface FinancialMonth {
  competencia:      string        // display label e.g. "Set/2025"
  competenciaRaw:   Date | null
  receita:          number
  alimentacao:      number
  gasolina:         number
  totalDespesas:    number
  lucro:            number
  margem:           number | null // null when no expense data exists for this month
  projetosCount:    number
  dataQualityFlags: string[]
}

// ── Overview (Visão Geral) metrics ─────────────────────────────────────────────

export interface OverviewMetrics {
  totalProjetos:     number
  projetosRecebidos: number
  projetosPendentes: number
  receitaTotal:      number
  despesasTotal:     number | null // null when no expense data in the base
  lucroTotal:        number | null
  margemMedia:       number | null
  ticketMedio:       number | null // null when no projects with Valor
  dataQualityFlags:  string[]
}

// ── Unit Economics — only what the schema actually supports ────────────────────

export interface UnitEconomicsMetrics {
  receitaMedia:           number | null // avg Valor per project with Valor present
  despesaMediaPorProjeto: number | null // avg totalExpenses for projects with expenses
  margemMediaPonderada:   number | null // avg margin across projects with margin data
  projetosComDespesas:    number
  projetosSemDespesas:    number
  totalProjetos:          number
  dataQualityFlags:       string[]
}
