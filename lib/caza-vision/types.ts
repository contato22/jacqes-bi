// ─── CAZA VISION — Domain Types (schema real) ─────────────────────────────────

// ── Projetos ───────────────────────────────────────────────────────────────────
// Source: Caza Vision — Projetos (308e2d13-dfa9-433e-a0f6-8439b5181845)

export type ProjetoStatus =
  | 'Em Produção'
  | 'Em Edição'
  | 'Entregue'
  | 'Aguardando Aprovação'

export type ProjetoTipo =
  | 'Vídeo Publicitário'
  | 'Filme Institucional'
  | 'Evento / Live'
  | 'Conteúdo Digital'
  | 'Fotografia'

export interface ProjetoRecord {
  id:      string
  titulo:  string
  cliente: string | null
  diretor: string | null
  inicio:  Date | null
  prazo:   Date | null
  status:  ProjetoStatus | null
  tipo:    ProjetoTipo | null
  valor:   number | null
  notionPageId: string
}

// ── Financeiro ─────────────────────────────────────────────────────────────────
// Source: Caza Vision — Financeiro (9a8329e9-6d19-4bdc-8e80-2d59a2658be7)
// Nota: Lucro já existe como campo direto na base — lemos como está.

export interface FinanceiroRecord {
  id:        string
  mes:       string        // "Mar/26" — label original do Notion
  mesOrder:  number        // 202603 — para ordenação cronológica
  receita:   number
  orcamento: number
  despesas:  number
  lucro:     number        // lido diretamente do campo Lucro
  margem:    number | null // lucro / receita * 100; null se receita = 0
  notionPageId: string
}

// ── Clientes ───────────────────────────────────────────────────────────────────
// Source: Caza Vision — Clientes (ca1ba0fe-3d47-4356-8643-23a223a4e710)

export type ClienteStatus = 'Ativo' | 'Em Proposta' | 'Convertido' | 'Perdido'
export type ClienteTipo   = 'Marca' | 'Agência' | 'Empresa' | 'Startup'

export interface ClienteRecord {
  id:          string
  nome:        string
  email:       string | null
  segmento:    string | null
  status:      ClienteStatus | null
  desde:       Date | null
  telefone:    string | null
  budgetAnual: number | null
  tipo:        ClienteTipo | null
  notionPageId: string
}

// ── Fetch result envelope ──────────────────────────────────────────────────────

export type FetchStatus = 'ok' | 'empty' | 'no_credentials' | 'api_error'

export interface FetchResult<T> {
  status:       FetchStatus
  data:         T[]
  total:        number
  errorMessage: string | null
  fetchedAt:    string
}

// ── Overview metrics (cross-database) ─────────────────────────────────────────

export interface OverviewMetrics {
  // Projetos
  totalProjetos:     number
  projetosAtivos:    number   // Em Produção + Em Edição + Aguardando Aprovação
  projetosEntregues: number
  // Financeiro
  mesMaisRecente:    string | null
  receitaMesAtual:   number | null
  receitaYTD:        number
  despesasYTD:       number
  lucroYTD:          number
  margemMedia:       number | null  // avg margem dos meses com receita > 0
  // Clientes
  clientesAtivos:    number
  totalBudgetAtivos: number
  // Derivado
  ticketMedio:       number | null  // avg Valor em Projetos com valor
}

// ── Pipeline ───────────────────────────────────────────────────────────────────

export interface PipelineGroup {
  status:   ProjetoStatus
  projetos: ProjetoRecord[]
  total:    number
  valor:    number
}
