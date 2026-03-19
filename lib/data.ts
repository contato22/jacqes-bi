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
  contasSobAcompanhamento: 4,
  contaMaisSaudavel: "JACQES",
  contaMaisSensivel: "Conta 04 — Prospecção",
  principalAvanco:
    "Consistência no follow-up com JACQES e estruturação inicial da carteira",
  principalFalha:
    "2 visitas não realizadas sem reagendamento. Relatório pós-visita pendente em 1 caso.",
  focoProximoMes:
    "Zerar pendências abertas na Conta 04. Criar checklist de visita padrão. Aumentar autonomia operacional.",
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
    value: 4,
    previousValue: 3,
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
    value: 11,
    previousValue: 9,
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
    nome: "JACQES",
    segmento: "D2C / E-commerce",
    saude: "Saudável",
    risco: "Baixo",
    oportunidade: "Forte",
    pendencias: 2,
    ultimaVisita: "2026-03-10",
    proximaVisita: "2026-03-25",
    donoProximaAcao: "Danilo",
    observacoes:
      "Conta âncora do portfólio AWQ M4E. Faturamento em crescimento consistente. Tranche 1 de vesting conquistada.",
  },
  {
    id: "2",
    nome: "AWQ - Agência",
    segmento: "Agência de Marketing",
    saude: "Estável com Atenção",
    risco: "Médio",
    oportunidade: "Leve",
    pendencias: 3,
    ultimaVisita: "2026-03-01",
    proximaVisita: "2026-03-28",
    donoProximaAcao: "Danilo",
    observacoes:
      "Renda mensal R$ 4.5k. Atenção para alinhamento de expectativas com clientes da carteira.",
  },
  {
    id: "3",
    nome: "AWQ - Produtora",
    segmento: "Produção de Conteúdo",
    saude: "Saudável",
    risco: "Baixo",
    oportunidade: "Média",
    pendencias: 1,
    ultimaVisita: "2026-03-05",
    proximaVisita: "2026-04-02",
    donoProximaAcao: "Miguel",
    observacoes: "Operação interna. Renda mensal estável R$ 10k.",
  },
  {
    id: "4",
    nome: "Conta 04 — Prospecção",
    segmento: "PME / Varejo",
    saude: "Sensível",
    risco: "Alto",
    oportunidade: "Forte",
    pendencias: 5,
    ultimaVisita: null,
    proximaVisita: "2026-03-22",
    donoProximaAcao: "Danilo",
    observacoes:
      "Conta em análise para entrada no portfólio M4E. Expectativa desalinhada identificada na última conversa.",
  },
];

// ─── Account Health Distribution ─────────────────────────────────────────────

export const accountHealthData: AccountHealthSegment[] = [
  { name: "Saudável", value: 2, color: "#22c55e" },
  { name: "Estável c/ Atenção", value: 1, color: "#eab308" },
  { name: "Sensível", value: 1, color: "#f97316" },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────
// Source: Notion · Score Mensal + Contas & Carteira

export const alerts: Alert[] = [
  {
    id: "A1",
    type: "error",
    title: "Conta 04 — Risco Alto",
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
