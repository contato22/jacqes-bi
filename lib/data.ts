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
