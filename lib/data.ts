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
  motivoRisco: "Atraso da AWQ" | "Baixa resposta do cliente" | "Desalinhamento de expectativa" | "Expectativa desalinhada" | "Baixa percepção de valor" | "Operação travada" | "Comunicação" | "Indefinido" | null;
  pendenciasVencidas: number;
  pendenciasCriticas: number;
  responsividadeCliente: "Alta" | "Média" | "Baixa";
  gestaoRiscoDanilo: "Boa" | "Média" | "Fraca";
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  criticidade: "critico" | "atencao" | "informativo";
  owner: string;
  prazo?: string;
  status: "aberto" | "em_andamento" | "resolvido";
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
  scorePotencial: number;
  gapParaVariavel: number;
  dimensoesGap: { dimensao: string; gap: number }[];
  faseAnterior: string;
  condicaoProximaFase: string[];
  autonomiaIndex: number; // 1–5
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
    "Consistência no follow-up com JACQES e estruturação inicial da carteira.",
  principalFalha:
    "2 visitas não realizadas sem reagendamento. Relatório pós-visita pendente em 1 caso.",
  focoProximoMes:
    "Zerar pendências abertas na Conta 04. Criar checklist de visita padrão. Aumentar autonomia operacional.",
  variavelPaga: false,
  scorePotencial: 75,
  gapParaVariavel: 6,
  dimensoesGap: [
    { dimensao: "Processo", gap: 4 },
    { dimensao: "Visitas", gap: 2 },
  ],
  faseAnterior: "Apoio Operacional",
  condicaoProximaFase: [
    "Score 75+ por 2 meses consecutivos",
    "Visitas 6/6 realizadas ou reagendadas",
    "Processo 15+ pts",
    "Autonomia índice ≥ 4",
  ],
  autonomiaIndex: 3,
};


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
      "Conta âncora do portfólio AWQ M4E. Faturamento em crescimento consistente. Tranche 1 de vesting conquistada.",
    tendencia: "subindo",
    motivoRisco: null,
    pendenciasVencidas: 0,
    pendenciasCriticas: 0,
    responsividadeCliente: "Alta",
    gestaoRiscoDanilo: "Boa",
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
      "Renda mensal R$ 4,5k. Atenção para alinhamento de expectativas com clientes da carteira.",
    tendencia: "estavel",
    motivoRisco: "Baixa resposta do cliente",
    pendenciasVencidas: 1,
    pendenciasCriticas: 0,
    responsividadeCliente: "Média",
    gestaoRiscoDanilo: "Boa",
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
      "Operação interna. Renda mensal estável R$ 10k.",
    tendencia: "subindo",
    motivoRisco: null,
    pendenciasVencidas: 0,
    pendenciasCriticas: 0,
    responsividadeCliente: "Alta",
    gestaoRiscoDanilo: "Boa",
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
      "Conta em análise para entrada no portfólio M4E. Expectativa desalinhada identificada na última conversa.",
    tendencia: "descendo",
    motivoRisco: "Expectativa desalinhada",
    pendenciasVencidas: 3,
    pendenciasCriticas: 2,
    responsividadeCliente: "Baixa",
    gestaoRiscoDanilo: "Média",
  },
  {
    id: "5",
    nome: "CEM",
    segmento: "Empresa / Institucional",
    saude: "Estável com Atenção",
    risco: "Médio",
    oportunidade: "Média",
    pendencias: 2,
    ultimaVisita: null,
    proximaVisita: null,
    donoProximaAcao: "Danilo",
    observacoes: "",
    tendencia: "estavel",
    motivoRisco: null,
    pendenciasVencidas: 0,
    pendenciasCriticas: 0,
    responsividadeCliente: "Alta",
    gestaoRiscoDanilo: "Boa",
  },
];

// ─── Account Health Distribution ─────────────────────────────────────────────

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
    criticidade: "critico",
    owner: "Danilo",
    prazo: "2026-03-28",
    status: "aberto",
  },
  {
    id: "A2",
    type: "warning",
    title: "2 Visitas Não Reagendadas",
    message:
      "Visitas previstas em março não realizadas e sem reagendamento confirmado.",
    timestamp: "2026-03-19T09:00:00Z",
    criticidade: "atencao",
    owner: "Danilo",
    prazo: "2026-03-25",
    status: "aberto",
  },
  {
    id: "A3",
    type: "warning",
    title: "Relatório Pós-Visita Pendente",
    message: "1 relatório pós-visita ainda não preenchido neste mês.",
    timestamp: "2026-03-18T16:00:00Z",
    criticidade: "atencao",
    owner: "Danilo",
    prazo: "2026-03-22",
    status: "em_andamento",
  },
  {
    id: "A4",
    type: "info",
    title: "Variável Não Paga — Março",
    message:
      "Score 69/100 está abaixo do threshold de 75 pts para pagamento da variável mensal.",
    timestamp: "2026-03-18T08:00:00Z",
    criticidade: "informativo",
    owner: "AWQ",
    status: "aberto",
  },
];

// ─── Mini P&L — JACQES BU · Março 2026 ───────────────────────────────────────
// Source: Notion · Mini P&L database (workspace JACQES)
// Colunas: FEE (receita), Danilo (custo alocado), COGS, OPEX, Freelancer

export interface MiniPLConta {
  conta: string;
  fee: number;
  danilo: number;
  cogs: number;
  opex: number;
  freelancer: number;
}

export const miniPLContas: MiniPLConta[] = [
  { conta: "CEM",             fee: 3200,   danilo: 960,  cogs: 160,  opex: 140, freelancer: 0  },
  { conta: "André Vieira",    fee: 1500,   danilo: 450,  cogs: 60,   opex: 140, freelancer: 15 },
  { conta: "Carol Bertolini", fee: 1790,   danilo: 537,  cogs: 89.5, opex: 140, freelancer: 0  },
  { conta: "Tati Simões",     fee: 1790,   danilo: 537,  cogs: 74.5, opex: 140, freelancer: 15 },
  { conta: "Luis Vieira",     fee: 0,      danilo: 0,    cogs: 0,    opex: 0,   freelancer: 0  },
];

export const miniPLMes = "Março 2026";

// ─── DRE Gerencial — JACQES BU ────────────────────────────────────────────────
// Atualizar mensalmente. Campos com (*) são estimativas/rateios — confirmar com AWQ.
// Fonte base: Notion Mini P&L (FEE, Danilo, COGS, OPEX, Freelancer)

export interface DRELinha {
  label: string;
  valor: number;
  /** notion = vem diretamente do Notion Mini P&L
   *  derivado = calculado a partir de dados do Notion
   *  manual = não existe na base → preencher mensalmente */
  fonte: "notion" | "derivado" | "manual";
  nota?: string;
}

export interface DREGerencial {
  mes: string;

  // 1. Receita Bruta
  receitaBruta: {
    recorrente: number;          // FEE mensal das contas ativas
    projetoSetup: number;        // receitas pontuais de projeto/setup
    variavel: number;            // bônus/comissão/performance
    extraordinaria: number;      // outras receitas não recorrentes
  };

  // 2. Deduções
  deducoes: {
    impostosTaxas: DRELinha;     // Simples Nacional ou equivalente (*)
  };

  // 3. Custos Diretos
  custosDiretos: {
    daniloFixo: DRELinha;        // custo fixo alocado Danilo na BU (*)
    daniloVariavel: DRELinha;    // variável/comissão Danilo (*)
    encargosProvisos: DRELinha;  // encargos sociais sobre custo Danilo (*)
    deslocamentosVisitas: DRELinha; // transporte/deslocamento de visitas (*)
    ferramentasDiretas: DRELinha;   // ferramentas diretas da BU (do COGS)
    apoioOperacionalFreela: DRELinha; // freelancers/apoio pontual
    outrosCustosDiretos: DRELinha;
  };

  // 4. Despesas Operacionais da BU
  despesasOperacionais: {
    coordenacaoSupervisao: DRELinha;    // custo de supervisão alocado (*)
    ferramentasCompartilhadas: DRELinha; // ferramentas SaaS rateadas (*)
    administrativoRateado: DRELinha;    // admin/financeiro AWQ rateado (*)
    desenvolvimentoProcessoBI: DRELinha; // BI/processos/melhoria (*)
    outrosOverheads: DRELinha;
  };

  // 5. Ajustes Imputados
  ajustesImputados: {
    custoFounderEstrategico: DRELinha;  // tempo do Miguel alocado (*)
    overheadExtra: DRELinha;
  };
}

export const dreGerencial: DREGerencial = {
  mes: "Março 2026",

  // ── Receita Bruta ──────────────────────────────────────────────────────────
  // Fonte: Notion Mini P&L · FEE total = R$8.280
  receitaBruta: {
    recorrente:    8280,   // FEE mensal CEM + André + Carol + Tati
    projetoSetup:     0,   // sem projetos/setup em março
    variavel:         0,   // sem receita variável em março
    extraordinaria:   0,   // sem receitas extraordinárias
  },

  // ── Deduções ───────────────────────────────────────────────────────────────
  // ⚠ Não existe na base Notion — preencher mensalmente
  deducoes: {
    impostosTaxas: { label: "Impostos / descontos / taxas", valor: 0, fonte: "manual",
      nota: "Preencher mensalmente — ex.: Simples Nacional ~12% sobre receita bruta" },
  },

  // ── Custos Diretos ─────────────────────────────────────────────────────────
  custosDiretos: {
    // ← Notion: campo "Danilo" do Mini P&L (total = R$2.484 em março)
    // A divisão entre fixo e variável deve ser informada mensalmente
    daniloFixo:            { label: "Danilo fixo",                        valor: 2000, fonte: "derivado", nota: "Parcela fixa do custo Danilo — Notion Mini P&L campo Danilo" },
    daniloVariavel:        { label: "Danilo variável",                    valor:  484, fonte: "derivado", nota: "Parcela variável/comissão — complemento até total Notion" },
    // ← Não existe na base Notion → preencher mensalmente
    encargosProvisos:      { label: "Encargos / provisões",               valor:    0, fonte: "manual",   nota: "Preencher mensalmente — FGTS, férias, 13º proporcional" },
    deslocamentosVisitas:  { label: "Deslocamentos / visitas",            valor:    0, fonte: "manual",   nota: "Preencher mensalmente — transporte de visitas às contas" },
    // ← Notion: campo "COGS" do Mini P&L
    ferramentasDiretas:    { label: "Ferramentas diretas",                valor:  184, fonte: "notion",   nota: "Notion Mini P&L · campo COGS" },
    // ← Notion: campo "Freelancer" do Mini P&L
    apoioOperacionalFreela:{ label: "Apoio operacional / freela",         valor:   30, fonte: "notion",   nota: "Notion Mini P&L · campo Freelancer" },
    // ← Não existe na base Notion → preencher mensalmente
    outrosCustosDiretos:   { label: "Outros custos diretos",              valor:    0, fonte: "manual",   nota: "Preencher mensalmente" },
  },

  // ── Despesas Operacionais da BU ────────────────────────────────────────────
  // ⚠ Nenhum desses campos existe na base Notion → preencher mensalmente
  despesasOperacionais: {
    coordenacaoSupervisao:      { label: "Coordenação / supervisão",          valor: 0, fonte: "manual", nota: "Preencher mensalmente — custo de supervisão alocado à BU" },
    ferramentasCompartilhadas:  { label: "Ferramentas compartilhadas",        valor: 0, fonte: "manual", nota: "Preencher mensalmente — SaaS rateados entre BUs" },
    administrativoRateado:      { label: "Administrativo rateado",            valor: 0, fonte: "manual", nota: "Preencher mensalmente — admin/financeiro AWQ rateado" },
    desenvolvimentoProcessoBI:  { label: "Desenvolvimento de processo / BI",  valor: 0, fonte: "manual", nota: "Preencher mensalmente — custo de evolução do BI/processos" },
    outrosOverheads:            { label: "Outros overheads",                  valor: 0, fonte: "manual", nota: "Preencher mensalmente" },
  },

  // ── Ajustes Imputados ──────────────────────────────────────────────────────
  // ⚠ Não existe na base Notion → preencher mensalmente
  ajustesImputados: {
    custoFounderEstrategico: { label: "Custo founder / estratégico (Miguel)", valor: 0, fonte: "manual", nota: "Preencher mensalmente — tempo do Miguel alocado à BU" },
    overheadExtra:           { label: "Overhead extra",                       valor: 0, fonte: "manual", nota: "Preencher mensalmente — se houver" },
  },
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

// ─── Comparativo Previsto × Realizado por Período ─────────────────────────────
// Referência: Março 2026 · Meta variável = 75 pts · FEE alvo = R$10.500

export type PeriodKey = "diario" | "semanal" | "mensal" | "trimestral" | "anual";

export interface MetricaComparativa {
  id: string;
  label: string;
  sublabel?: string;
  previsto: number;
  realizado: number;
  unidade: string;      // "pts" | "%" | "R$" | "visitas" | "msgs" | "h" | "tasks"
  lowerIsBetter?: boolean;
  categoria: "score" | "financeiro" | "operacional" | "sla";
}

export interface PeriodoComparativo {
  periodo: PeriodKey;
  label: string;        // ex.: "Semana 12 · 17–21 Mar"
  metricas: MetricaComparativa[];
}

export const comparativoPeriodos: PeriodoComparativo[] = [
  {
    periodo: "diario",
    label: "Hoje · 21 Mar 2026",
    metricas: [
      { id: "d-msgs-prazo",   label: "Mensagens respondidas no prazo", sublabel: "< 24 h",          previsto: 100, realizado: 80,  unidade: "%",    categoria: "sla"          },
      { id: "d-tarefas",      label: "Tarefas do dia concluídas",      sublabel: "Execução",         previsto: 5,   realizado: 3,   unidade: "tasks", categoria: "operacional"  },
      { id: "d-follow-up",    label: "Follow-ups realizados",          sublabel: "Diário",           previsto: 2,   realizado: 1,   unidade: "msgs",  categoria: "operacional"  },
      { id: "d-contatos",     label: "Contas tocadas hoje",            sublabel: "Min. 1 contato",   previsto: 3,   realizado: 2,   unidade: "contas",categoria: "sla"          },
    ],
  },
  {
    periodo: "semanal",
    label: "Semana 12 · 16–21 Mar 2026",
    metricas: [
      { id: "w-follow-up",    label: "Follow-ups realizados",          sublabel: "vs previstos",     previsto: 3,   realizado: 2,   unidade: "msgs",  categoria: "operacional"  },
      { id: "w-visitas",      label: "Visitas realizadas",             sublabel: "vs planejadas",    previsto: 2,   realizado: 1,   unidade: "visitas",categoria: "operacional" },
      { id: "w-sla",          label: "SLA de resposta",                sublabel: "% no prazo",       previsto: 90,  realizado: 73,  unidade: "%",     categoria: "sla"          },
      { id: "w-pendencias",   label: "Pendências abertas",             sublabel: "Meta: reduzir",    previsto: 5,   realizado: 11,  unidade: "itens", lowerIsBetter: true, categoria: "operacional" },
      { id: "w-contatos",     label: "Contas com contato ativo",       sublabel: "das 5",            previsto: 5,   realizado: 4,   unidade: "contas",categoria: "sla"          },
    ],
  },
  {
    periodo: "mensal",
    label: "Março 2026",
    metricas: [
      { id: "m-score",        label: "Score Total",                    sublabel: "Meta variável",    previsto: 75,  realizado: 69,  unidade: "pts",   categoria: "score"        },
      { id: "m-fee",          label: "FEE Carteira",                   sublabel: "Receita do mês",   previsto: 10500, realizado: 8280, unidade: "R$", categoria: "financeiro"   },
      { id: "m-visitas",      label: "Visitas realizadas",             sublabel: "vs planejadas",    previsto: 6,   realizado: 4,   unidade: "visitas",categoria: "operacional" },
      { id: "m-followup",     label: "Follow-ups",                     sublabel: "Total do mês",     previsto: 12,  realizado: 9,   unidade: "msgs",  categoria: "operacional"  },
      { id: "m-sla",          label: "SLA de resposta",                sublabel: "% no prazo",       previsto: 90,  realizado: 73,  unidade: "%",     categoria: "sla"          },
      { id: "m-resultado",    label: "Resultado operacional",          sublabel: "EBITDA BU",        previsto: 5600, realizado: 4822, unidade: "R$",  categoria: "financeiro"   },
    ],
  },
  {
    periodo: "trimestral",
    label: "Q1 2026 · Jan–Mar",
    metricas: [
      { id: "q-score-med",    label: "Score médio trimestral",         sublabel: "Meta: 75 / mês",   previsto: 75,  realizado: 69,  unidade: "pts",   categoria: "score"        },
      { id: "q-fee",          label: "FEE acumulado",                  sublabel: "Jan–Mar",          previsto: 31500, realizado: 8280, unidade: "R$", categoria: "financeiro"   },
      { id: "q-visitas",      label: "Visitas realizadas",             sublabel: "Meta 18 no tri",   previsto: 18,  realizado: 4,   unidade: "visitas",categoria: "operacional" },
      { id: "q-contas-ativas",label: "Contas com fee ativo",           sublabel: "das 5 na carteira",previsto: 5,   realizado: 4,   unidade: "contas",categoria: "operacional"  },
      { id: "q-followup",     label: "Follow-ups acumulados",          sublabel: "Meta 36 no tri",   previsto: 36,  realizado: 9,   unidade: "msgs",  categoria: "operacional"  },
    ],
  },
  {
    periodo: "anual",
    label: "2026 · Jan–Dez",
    metricas: [
      { id: "a-score-meta",   label: "Score-alvo anual",               sublabel: "Owner em Formação",previsto: 85,  realizado: 69,  unidade: "pts",   categoria: "score"        },
      { id: "a-fee-anual",    label: "FEE anualizado",                 sublabel: "Projeção 12 meses",previsto: 126000, realizado: 8280, unidade: "R$",categoria: "financeiro"  },
      { id: "a-visitas",      label: "Visitas no ano",                 sublabel: "Meta 72 visitas",  previsto: 72,  realizado: 4,   unidade: "visitas",categoria: "operacional" },
      { id: "a-contas-plenas",label: "Contas com fee pleno",           sublabel: "todas com FEE",    previsto: 5,   realizado: 4,   unidade: "contas",categoria: "operacional"  },
      { id: "a-sops",         label: "SOPs criados",                   sublabel: "Meta: 12 no ano",  previsto: 12,  realizado: 0,   unidade: "docs",  categoria: "operacional"  },
    ],
  },
];

// ─── Fluxo de Caixa ───────────────────────────────────────────────────────────
// Entradas = FEEs recebidos + receitas extras
// Saídas   = custos diretos + despesas operacionais + ajustes
// Saldo    = Entradas − Saídas (derivado)

export interface FluxoCaixaEntry {
  periodo: string;
  entradasPrev: number;
  entradasReal: number;
  saidasPrev: number;
  saidasReal: number;
}

// Visão mensal — Q1 2026 + projeção Q2 (Apr–Jun)
// Mar: valores do DRE Gerencial (entradas=8280, saídas=3458, saldo=4822)
export const fluxoCaixaMensal: FluxoCaixaEntry[] = [
  { periodo: "Jan",  entradasPrev: 9000,  entradasReal: 5500,  saidasPrev: 6800, saidasReal: 5900 },
  { periodo: "Fev",  entradasPrev: 9500,  entradasReal: 7200,  saidasPrev: 6800, saidasReal: 6100 },
  { periodo: "Mar",  entradasPrev: 10500, entradasReal: 8280,  saidasPrev: 4900, saidasReal: 3458 },
  { periodo: "Abr",  entradasPrev: 10500, entradasReal: 0,     saidasPrev: 4900, saidasReal: 0    },
  { periodo: "Mai",  entradasPrev: 10500, entradasReal: 0,     saidasPrev: 4900, saidasReal: 0    },
  { periodo: "Jun",  entradasPrev: 10500, entradasReal: 0,     saidasPrev: 4900, saidasReal: 0    },
];

// Visão semanal — Março 2026 (4 semanas)
export const fluxoCaixaSemanal: FluxoCaixaEntry[] = [
  { periodo: "Sem 1 · 1–7/3",   entradasPrev: 2625, entradasReal: 1800, saidasPrev: 1225, saidasReal: 1050 },
  { periodo: "Sem 2 · 8–14/3",  entradasPrev: 2625, entradasReal: 2200, saidasPrev: 1225, saidasReal: 900  },
  { periodo: "Sem 3 · 15–21/3", entradasPrev: 2625, entradasReal: 2480, saidasPrev: 1225, saidasReal: 950  },
  { periodo: "Sem 4 · 22–31/3", entradasPrev: 2625, entradasReal: 1800, saidasPrev: 1225, saidasReal: 558  },
];
