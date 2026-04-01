// ─── CAZA VISION — Domain Types ────────────────────────────────────────────────

// ── Projetos ───────────────────────────────────────────────────────────────────

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
}

// ── Financeiro ─────────────────────────────────────────────────────────────────

export interface FinanceiroRecord {
  id:        string
  mes:       string        // "Mar/26"
  mesOrder:  number        // 202603
  receita:   number
  orcamento: number
  despesas:  number
  lucro:     number
  margem:    number | null // lucro / receita * 100; null se receita = 0
}

// ── Clientes ───────────────────────────────────────────────────────────────────

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
}

// ── Fetch result envelope ──────────────────────────────────────────────────────

export type FetchStatus = 'ok' | 'empty'

export interface FetchResult<T> {
  status:       FetchStatus
  data:         T[]
  total:        number
  errorMessage: string | null
  fetchedAt:    string
}

// ── Overview metrics (cross-database) ─────────────────────────────────────────

export interface OverviewMetrics {
  totalProjetos:     number
  projetosAtivos:    number
  projetosEntregues: number
  mesMaisRecente:    string | null
  receitaMesAtual:   number | null
  receitaYTD:        number
  despesasYTD:       number
  lucroYTD:          number
  margemMedia:       number | null
  clientesAtivos:    number
  totalBudgetAtivos: number
  ticketMedio:       number | null
}

// ── Pipeline ───────────────────────────────────────────────────────────────────

export interface PipelineGroup {
  status:   ProjetoStatus
  projetos: ProjetoRecord[]
  total:    number
  valor:    number
}
