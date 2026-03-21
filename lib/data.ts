// ─── Types ────────────────────────────────────────────────────────────────────

export interface KPI {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  unit: "currency" | "number" | "percent";
  prefix?: string;
  suffix?: string;
  icon: string;
  color: string;
  comparisonLabel?: string;
  lowerIsBetter?: boolean;
}

export interface ScoreDimension {
  dimensao: string;
  score: number;
  max: number;
}

export interface ContaData {
  id: string;
  nome: string;
  segmento: string;
  saude: "Saudável" | "Estável com Atenção" | "Sensível" | "Em Risco";
  risco: "Baixo" | "Médio" | "Alto";
  oportunidade: "Sem Oportunidade" | "Leve" | "Média" | "Forte";
  pendencias: number;
  ultimaVisita: string | null;
  proximaVisita: string | null;
  donoProximaAcao: string;
  observacoes: string;
  tendencia: "subindo" | "estavel" | "descendo";
}

export interface AccountHealthSegment {
  name: string;
  value: number;
  color: string;
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
}

export interface ScoreMensal {
  mes: string;
  scoreAtendimento: number;
  scoreVisitas: number;
  scoreOperacao: number;
  scoreRisco: number;
  scoreProcesso: number;
  scoreTotal: number;
  status: string;
  fase: string;
  visitasRealizadas: number;
  visitasPrevistas: number;
  contasSobAcompanhamento: number;
  contaMaisSaudavel: string;
  contaMaisSensivel: string;
  principalAvanco: string;
  principalFalha: string;
  focoProximoMes: string;
  variavelPaga: boolean;
}

// ─── Score Mensal · Março 2026 ────────────────────────────────────────────────
// Source: Notion · 🏆 Score Mensal database · página "Março 2026"

export const scoreMensal: ScoreMensal = {
  mes: "Março 2026",
  scoreAtendimento: 16,
  scoreVisitas: 14,
  scoreOperacao: 15,
  scoreRisco: 13,
  scoreProcesso: 11,
  scoreTotal: 69,
  status: "🟡 Amarelo",
  fase: "Operador em Formação",
  visitasRealizadas: 4,
  visitasPrevistas: 6,
  contasSobAcompanhamento: 5,
  contaMaisSaudavel: "André Vieira",
  contaMaisSensivel: "Tati Simões",
  principalAvanco:
    "Consistência no follow-up com André Vieira e Carol Bertolini. Estruturação da carteira com 5 clientes ativos.",
  principalFalha:
    "2 visitas não realizadas sem reagendamento. Relatório pós-visita pendente em 1 caso.",
  focoProximoMes:
    "Zerar pendências abertas com Tati Simões. Criar checklist de visita padrão. Aumentar autonomia operacional.",
  variavelPaga: false,
};

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const kpis: KPI[] = [
  {
    id: "score",
    label: "Score Geral",
    value: 69,
    previousValue: 75,
    unit: "number",
    suffix: " / 100",
    icon: "TrendingUp",
    color: "brand",
    comparisonLabel: "vs meta (75 pts)",
    lowerIsBetter: false,
  },
  {
    id: "contas",
    label: "Contas Ativas",
    value: 5,
    previousValue: 4,
    unit: "number",
    icon: "Briefcase",
    color: "emerald",
    comparisonLabel: "vs mês anterior",
  },
  {
    id: "visitas",
    label: "Visitas Realizadas",
    value: 4,
    previousValue: 6,
    unit: "number",
    suffix: " / 6",
    icon: "MapPin",
    color: "blue",
    comparisonLabel: "de 6 previstas",
    lowerIsBetter: false,
  },
  {
    id: "pendencias",
    label: "Pendências Abertas",
    value: 13,
    previousValue: 11,
    unit: "number",
    icon: "AlertCircle",
    color: "red",
    comparisonLabel: "total na carteira",
    lowerIsBetter: true,
  },
];

// ─── Score por Dimensão ───────────────────────────────────────────────────────
// Source: Notion · Score Mensal · Março 2026

export const scoreDimensions: ScoreDimension[] = [
  { dimensao: "Atendimento", score: 16, max: 20 },
  { dimensao: "Operação", score: 15, max: 20 },
  { dimensao: "Visitas", score: 14, max: 20 },
  { dimensao: "Risco", score: 13, max: 20 },
  { dimensao: "Processo", score: 11, max: 20 },
];

// ─── Contas & Carteira ────────────────────────────────────────────────────────
// Source: Notion · 🏢 Contas & Carteira database

export const contasData: ContaData[] = [
  {
    id: "1",
    nome: "André Vieira",
    segmento: "Pessoa Física / Consultoria",
    saude: "Saudável",
    risco: "Baixo",
    oportunidade: "Forte",
    pendencias: 2,
    ultimaVisita: "2026-03-10",
    proximaVisita: "2026-03-25",
    donoProximaAcao: "Danilo",
    observacoes:
      "Cliente saudável com alto potencial de expansão. Follow-up consistente e boa percepção de valor.",
    tendencia: "subindo",
  },
  {
    id: "2",
    nome: "Luis Vieira",
    segmento: "Pessoa Física / Consultoria",
    saude: "Estável com Atenção",
    risco: "Médio",
    oportunidade: "Leve",
    pendencias: 3,
    ultimaVisita: "2026-03-01",
    proximaVisita: "2026-03-28",
    donoProximaAcao: "Danilo",
    observacoes:
      "Atenção para alinhamento de expectativas. 3 pendências abertas precisam de resolução.",
    tendencia: "estavel",
  },
  {
    id: "3",
    nome: "Carol Bertolini",
    segmento: "Pessoa Física / Consultoria",
    saude: "Saudável",
    risco: "Baixo",
    oportunidade: "Média",
    pendencias: 1,
    ultimaVisita: "2026-03-05",
    proximaVisita: "2026-04-02",
    donoProximaAcao: "Danilo",
    observacoes:
      "Boa saúde de conta. 1 pendência em aberto. Oportunidade de expansão a ser explorada.",
    tendencia: "subindo",
  },
  {
    id: "4",
    nome: "Tati Simões",
    segmento: "Pessoa Física / Consultoria",
    saude: "Sensível",
    risco: "Alto",
    oportunidade: "Forte",
    pendencias: 5,
    ultimaVisita: null,
    proximaVisita: "2026-03-22",
    donoProximaAcao: "Danilo",
    observacoes:
      "Conta em situação sensível. 5 pendências abertas sem resolução. Expectativa desalinhada identificada.",
    tendencia: "descendo",
  },
  {
    id: "5",
    nome: "CEM",
    segmento: "Empresa / Institucional",
    saude: "Estável com Atenção",
    risco: "Médio",
    oportunidade: "Média",
    pendencias: 2,
    ultimaVisita: "2026-03-08",
    proximaVisita: "2026-03-30",
    donoProximaAcao: "Danilo",
    observacoes:
      "Conta institucional com potencial de crescimento. Monitorar engajamento e alinhar próximos passos.",
    tendencia: "estavel",
  },
];

// ─── Account Health Distribution ─────────────────────────────────────────────

export const accountHealthData: AccountHealthSegment[] = [
  { name: "Saudável", value: 2, color: "#22c55e" },
  { name: "Estável c/ Atenção", value: 2, color: "#eab308" },
  { name: "Sensível", value: 1, color: "#f97316" },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────
// Source: Notion · Score Mensal + Contas & Carteira

export const alerts: Alert[] = [
  {
    id: "A1",
    type: "error",
    title: "Tati Simões — Risco Alto",
    message:
      "Expectativa desalinhada identificada. 5 pendências abertas sem resolução. Próxima visita: 22/03.",
    timestamp: "2026-03-19T14:00:00Z",
  },
  {
    id: "A2",
    type: "warning",
    title: "2 Visitas Não Reagendadas",
    message:
      "Visitas previstas em março não realizadas e sem reagendamento confirmado.",
    timestamp: "2026-03-19T09:00:00Z",
  },
  {
    id: "A3",
    type: "warning",
    title: "Relatório Pós-Visita Pendente",
    message: "1 relatório pós-visita ainda não preenchido neste mês.",
    timestamp: "2026-03-18T16:00:00Z",
  },
  {
    id: "A4",
    type: "info",
    title: "Variável Não Paga — Março",
    message:
      "Score 69/100 está abaixo do threshold de 75 pts para pagamento da variável mensal.",
    timestamp: "2026-03-18T08:00:00Z",
  },
];

// ─── Mini P&L — Financeiro ────────────────────────────────────────────────────
// Source: Notion · JACQES ERP Financeiro · Forecast Month
// Databases: Ganhos (mensais) + Despesas (mensais) · ref: Fevereiro/Março 2026

export interface PLItem {
  id: string;
  label: string;
  valor: number;
  categoria?: string;
}

export interface PLData {
  mes: string;
  receitas: PLItem[];
  despesas: PLItem[];
}

export const plData: PLData = {
  mes: "Fevereiro · Março 2026",

  // Source: collection://2f1e9381-f175-81a3-8c02-000b1d2db07c (Ganhos mensais)
  receitas: [
    { id: "r1", label: "AWQ - Produtora", valor: 10000, categoria: "Operação Interna" },
    { id: "r2", label: "AWQ - Ag.",        valor: 4500,  categoria: "Agência" },
    { id: "r3", label: "AWQ - M4E",        valor: 2000,  categoria: "M4E / CS" },
  ],

  // Source: collection://2f1e9381-f175-81f1-877d-000bf9ecae0c (Despesas mensais)
  despesas: [
    { id: "d1", label: "Cartão de Crédito", valor: 10615.22, categoria: "Variável" },
    { id: "d2", label: "Aluguel",            valor: 1880,     categoria: "Fixo" },
    { id: "d3", label: "Internet",           valor: 119.99,   categoria: "Fixo" },
    { id: "d4", label: "Luz",                valor: 114.72,   categoria: "Fixo" },
  ],
};

// ─── Score Auditável — Critérios por Dimensão ────────────────────────────────
// Source: Modelo M4E · 4 critérios × 5 pts = 20 pts por dimensão

export interface ScoreCriterio {
  criterio: string;
  score: number; // 0–5
  max: 5;
  nota?: string;
}

export interface ScoreDimensaoAuditavel {
  dimensao: string;
  scoreTotal: number;
  max: 20;
  criterios: ScoreCriterio[];
}

export const scoreCriterios: ScoreDimensaoAuditavel[] = [
  {
    dimensao: "Atendimento",
    scoreTotal: 16,
    max: 20,
    criterios: [
      { criterio: "SLA de resposta", score: 4, max: 5, nota: "1 resposta acima de 24h no mês" },
      { criterio: "Follow-up no prazo", score: 4, max: 5, nota: "3 vencidos de 12 previstos" },
      { criterio: "Pendências sem retorno", score: 4, max: 5, nota: "2 sem retorno do cliente" },
      { criterio: "Clareza e completude", score: 4, max: 5, nota: "Comunicação consistente" },
    ],
  },
  {
    dimensao: "Operação",
    scoreTotal: 15,
    max: 20,
    criterios: [
      { criterio: "Contas atualizadas", score: 4, max: 5, nota: "5/5 contas com dados atuais" },
      { criterio: "Tarefas no prazo", score: 4, max: 5, nota: "CEM atrasado 2 dias" },
      { criterio: "Retrabalho", score: 3, max: 5, nota: "1 ciclo reaberto por informação incompleta" },
      { criterio: "Fechamento de ciclo", score: 4, max: 5, nota: "4 de 5 ciclos fechados no prazo" },
    ],
  },
  {
    dimensao: "Visitas",
    scoreTotal: 14,
    max: 20,
    criterios: [
      { criterio: "Visitas realizadas", score: 4, max: 5, nota: "4 de 6 previstas (67%)" },
      { criterio: "Reagendamento", score: 3, max: 5, nota: "2 sem reagendamento confirmado" },
      { criterio: "Relatório pós-visita", score: 4, max: 5, nota: "1 relatório pendente" },
      { criterio: "Próximos passos definidos", score: 3, max: 5, nota: "2 visitas sem próximos passos formalizados" },
    ],
  },
  {
    dimensao: "Risco",
    scoreTotal: 13,
    max: 20,
    criterios: [
      { criterio: "Risco identificado cedo", score: 4, max: 5, nota: "Tati Simões mapeada antes de escalar" },
      { criterio: "Alertas acionados", score: 3, max: 5, nota: "1 alerta acionado com atraso" },
      { criterio: "Pendências críticas endereçadas", score: 3, max: 5, nota: "5 pendências Tati em aberto" },
      { criterio: "Oportunidade/expansão mapeada", score: 3, max: 5, nota: "André e Carol mapeados, CEM pendente" },
    ],
  },
  {
    dimensao: "Processo",
    scoreTotal: 11,
    max: 20,
    criterios: [
      { criterio: "Checklist criado", score: 3, max: 5, nota: "1 checklist de visita em rascunho" },
      { criterio: "SOP/template criado", score: 3, max: 5, nota: "2 templates criados este mês" },
      { criterio: "Melhoria implementada", score: 3, max: 5, nota: "1 processo padronizado" },
      { criterio: "IA convertida em ativo", score: 2, max: 5, nota: "Uso pontual, sem documentação" },
    ],
  },
];

// ─── CS Ops — SLA ─────────────────────────────────────────────────────────────

export interface SLAItem {
  conta: string;
  diasSemContato: number;
  pendenciasVencidas: number;
  tempoMedioRespostaH: number;
}

export interface SLAData {
  tempoMedioRespostaH: number;
  percentualNoPrazo: number;
  mensagensVencidas: number;
  contasSemContatoDias: number; // threshold em dias
  porConta: SLAItem[];
}

export const slaData: SLAData = {
  tempoMedioRespostaH: 18.4,
  percentualNoPrazo: 73,
  mensagensVencidas: 4,
  contasSemContatoDias: 7,
  porConta: [
    { conta: "André Vieira",   diasSemContato: 3,  pendenciasVencidas: 0, tempoMedioRespostaH: 8.2  },
    { conta: "Luis Vieira",    diasSemContato: 9,  pendenciasVencidas: 2, tempoMedioRespostaH: 22.5 },
    { conta: "Carol Bertolini",diasSemContato: 5,  pendenciasVencidas: 0, tempoMedioRespostaH: 11.0 },
    { conta: "Tati Simões",    diasSemContato: 12, pendenciasVencidas: 2, tempoMedioRespostaH: 36.8 },
    { conta: "CEM",            diasSemContato: 4,  pendenciasVencidas: 0, tempoMedioRespostaH: 13.7 },
  ],
};

// ─── CS Ops — Follow-ups ──────────────────────────────────────────────────────

export interface FollowUpItem {
  conta: string;
  previstos: number;
  realizados: number;
  vencidos: number;
  semRetorno: number;
  semFechamento: number;
}

export interface FollowUpData {
  totalPrevistos: number;
  totalRealizados: number;
  totalVencidos: number;
  totalSemRetorno: number;
  totalSemFechamento: number;
  porConta: FollowUpItem[];
}

export const followUpData: FollowUpData = {
  totalPrevistos: 12,
  totalRealizados: 9,
  totalVencidos: 3,
  totalSemRetorno: 2,
  totalSemFechamento: 4,
  porConta: [
    { conta: "André Vieira",    previstos: 3, realizados: 3, vencidos: 0, semRetorno: 0, semFechamento: 1 },
    { conta: "Luis Vieira",     previstos: 3, realizados: 2, vencidos: 1, semRetorno: 1, semFechamento: 1 },
    { conta: "Carol Bertolini", previstos: 2, realizados: 2, vencidos: 0, semRetorno: 0, semFechamento: 0 },
    { conta: "Tati Simões",     previstos: 3, realizados: 1, vencidos: 2, semRetorno: 1, semFechamento: 2 },
    { conta: "CEM",             previstos: 1, realizados: 1, vencidos: 0, semRetorno: 0, semFechamento: 0 },
  ],
};

// ─── CS Ops — Processo & Ativos ──────────────────────────────────────────────

export interface ProcessoAtivos {
  checklistsCriados: number;
  sopsCriados: number;
  templatesCriados: number;
  melhorasImplementadas: number;
  padroesReaproveitaveis: number;
  iaEmAtivo: number;
}

export const processoAtivos: ProcessoAtivos = {
  checklistsCriados: 1,
  sopsCriados: 0,
  templatesCriados: 2,
  melhorasImplementadas: 1,
  padroesReaproveitaveis: 1,
  iaEmAtivo: 0,
};
