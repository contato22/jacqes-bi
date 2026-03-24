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
  {
    id: "6",
    nome: "Caza Vision",
    segmento: "Empresa / Produtora",
    saude: "Saudável",
    risco: "Baixo",
    oportunidade: "Média",
    pendencias: 1,
    ultimaVisita: "2026-03-15",
    proximaVisita: "2026-04-10",
    donoProximaAcao: "Danilo",
    observacoes: "Produtora de conteúdo. FEE mensal R$6.741,36. Conta nova na carteira.",
    tendencia: "subindo",
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
  { conta: "CEM",             fee: 3200,    danilo: 960,    cogs: 160,   opex: 140, freelancer: 0  },
  { conta: "André Vieira",    fee: 1500,    danilo: 450,    cogs: 60,    opex: 140, freelancer: 15 },
  { conta: "Carol Bertolini", fee: 1790,    danilo: 537,    cogs: 89.5,  opex: 140, freelancer: 0  },
  { conta: "Tati Simões",     fee: 1790,    danilo: 537,    cogs: 74.5,  opex: 140, freelancer: 15 },
  { conta: "Luis Vieira",     fee: 1500,    danilo: 450,    cogs: 60,    opex: 140, freelancer: 0  },
  { conta: "Caza Vision",     fee: 6741.36, danilo: 2022,   cogs: 337,   opex: 140, freelancer: 0  },
];

export const miniPLMes = "Março 2026";

// ─── Contas a Receber (AR) ─────────────────────────────────────────────────────
// Source: preencher mensalmente — não existe no Notion Mini P&L

export interface ContaReceber {
  id: string;
  conta: string;            // cliente/conta
  descricao: string;        // serviço ou referência
  valor: number;
  vencimento: string;       // YYYY-MM-DD
  status: "a_vencer" | "vencido" | "recebido" | "em_negociacao";
  diasEmAberto?: number;    // calculado
  mes: string;              // "Março 2026"
}

export const contasReceber: ContaReceber[] = [
  { id: "AR001", conta: "CEM",             descricao: "FEE Março 2026",  valor: 3200,    vencimento: "2026-03-05", status: "recebido",     mes: "Março 2026" },
  { id: "AR002", conta: "Tati Simões",     descricao: "FEE Março 2026",  valor: 1790,    vencimento: "2026-03-05", status: "recebido",     mes: "Março 2026" },
  { id: "AR003", conta: "Luis Vieira",     descricao: "FEE Março 2026",  valor: 1500,    vencimento: "2026-03-05", status: "recebido",     mes: "Março 2026" },
  { id: "AR004", conta: "Carol Bertolini", descricao: "FEE Março 2026",  valor: 1790,    vencimento: "2026-03-16", status: "recebido",     mes: "Março 2026" },
  { id: "AR005", conta: "Caza Vision",     descricao: "FEE Março 2026",  valor: 6741.36, vencimento: "2026-03-20", status: "recebido",     mes: "Março 2026" },
  { id: "AR006", conta: "André Vieira",    descricao: "FEE Março 2026",  valor: 1500,    vencimento: "2026-03-26", status: "a_vencer",     mes: "Março 2026" },
];

// ─── Contas a Pagar (AP) ───────────────────────────────────────────────────────
// Source: preencher mensalmente — não existe no Notion Mini P&L

export interface ContaPagar {
  id: string;
  fornecedor: string;
  descricao: string;
  valor: number;
  vencimento: string;       // YYYY-MM-DD
  status: "a_pagar" | "vencido" | "pago" | "em_negociacao";
  categoria: "remuneracao" | "ferramentas" | "freela" | "impostos" | "overhead" | "outros";
  mes: string;
}

export const contasPagar: ContaPagar[] = [
  { id: "AP001", fornecedor: "Danilo (fixo)",         descricao: "Remuneração fixa — Março",          valor: 2000, vencimento: "2026-03-05", status: "pago",     categoria: "remuneracao", mes: "Março 2026" },
  { id: "AP002", fornecedor: "Danilo (variável)",     descricao: "Comissão/variável — Março",         valor:  484, vencimento: "2026-03-10", status: "pago",     categoria: "remuneracao", mes: "Março 2026" },
  { id: "AP003", fornecedor: "Notion (tools)",        descricao: "Ferramentas diretas — COGS",        valor:  184, vencimento: "2026-03-01", status: "pago",     categoria: "ferramentas", mes: "Março 2026" },
  { id: "AP004", fornecedor: "Freela Operacional",    descricao: "Apoio pontual — Março",             valor:   30, vencimento: "2026-03-20", status: "pago",     categoria: "freela",      mes: "Março 2026" },
  { id: "AP005", fornecedor: "Impostos / Taxas",      descricao: "Simples Nacional — estimado",       valor:    0, vencimento: "2026-04-10", status: "a_pagar",  categoria: "impostos",    mes: "Março 2026" },
  { id: "AP006", fornecedor: "SaaS Rateado AWQ",      descricao: "Ferramentas compartilhadas — Março",valor:    0, vencimento: "2026-03-31", status: "a_pagar",  categoria: "overhead",    mes: "Março 2026" },
];

// ─── Inventário ────────────────────────────────────────────────────────────────
// Source: preencher mensalmente — ativos e recursos sob gestão da BU

export interface InventarioItem {
  id: string;
  categoria: "ferramenta_saas" | "ativo_digital" | "recurso_humano" | "contrato" | "outros";
  nome: string;
  descricao: string;
  valorMensal: number;      // custo ou valor mensal
  valorTotal?: number;      // valor contratado/total (se aplicável)
  status: "ativo" | "inativo" | "em_avaliacao" | "cancelar";
  conta?: string;           // conta associada (se específico de uma conta)
  responsavel: string;
  renovacao?: string;       // YYYY-MM-DD
  fonte: "notion" | "manual";
}

export const inventarioData: InventarioItem[] = [
  // Ferramentas SaaS diretas (COGS)
  { id: "INV001", categoria: "ferramenta_saas", nome: "Notion",           descricao: "Workspace principal — gestão de contas e BI",      valorMensal:  32, status: "ativo",         responsavel: "Danilo",  renovacao: "2026-12-31", fonte: "notion" },
  { id: "INV002", categoria: "ferramenta_saas", nome: "Make (Integromat)", descricao: "Automações e integrações de fluxo",                valorMensal:  49, status: "ativo",         responsavel: "Danilo",  renovacao: "2026-06-30", fonte: "notion" },
  { id: "INV003", categoria: "ferramenta_saas", nome: "Loom",              descricao: "Vídeos de atualização e treinamento para contas",  valorMensal:  15, status: "ativo",         responsavel: "Danilo",  renovacao: "2026-12-31", fonte: "notion" },
  { id: "INV004", categoria: "ferramenta_saas", nome: "Google Workspace",  descricao: "E-mail e Drive — compartilhado AWQ",               valorMensal:  88, status: "ativo",         responsavel: "AWQ",     renovacao: "2026-12-31", fonte: "manual" },
  { id: "INV005", categoria: "ferramenta_saas", nome: "Slack",             descricao: "Comunicação interna e com clientes",               valorMensal:   0, status: "ativo",         responsavel: "AWQ",     fonte: "manual" },
  // Ativos digitais
  { id: "INV006", categoria: "ativo_digital",   nome: "Dashboard JACQES BI", descricao: "Este BI — código-fonte Next.js",                valorMensal:   0, status: "ativo",         responsavel: "Danilo",  fonte: "manual" },
  { id: "INV007", categoria: "ativo_digital",   nome: "SOPs & Playbooks",    descricao: "Biblioteca de processos no Notion",             valorMensal:   0, status: "em_avaliacao",  responsavel: "Danilo",  fonte: "manual" },
  // Contratos ativos
  { id: "INV008", categoria: "contrato",        nome: "Contrato CEM",           descricao: "CS + Operações · R$3.200/mês",  valorMensal: 3200, status: "ativo", conta: "CEM",             responsavel: "AWQ",   renovacao: "2026-12-31", fonte: "manual" },
  { id: "INV009", categoria: "contrato",        nome: "Contrato André Vieira",  descricao: "CS + Ops · R$1.500/mês",        valorMensal: 1500, status: "ativo", conta: "André Vieira",    responsavel: "AWQ",   renovacao: "2026-09-30", fonte: "manual" },
  { id: "INV010", categoria: "contrato",        nome: "Contrato Carol Bertolini",descricao: "CS + Ops · R$1.790/mês",       valorMensal: 1790, status: "ativo", conta: "Carol Bertolini", responsavel: "AWQ",   renovacao: "2026-09-30", fonte: "manual" },
  { id: "INV011", categoria: "contrato",        nome: "Contrato Tati Simões",   descricao: "CS + Ops · R$1.790/mês",        valorMensal: 1790, status: "ativo", conta: "Tati Simões",     responsavel: "AWQ",   renovacao: "2026-09-30", fonte: "manual" },
  // Recurso humano
  { id: "INV012", categoria: "recurso_humano",  nome: "Danilo — CS & Ops",      descricao: "Alocação full — BU JACQES",     valorMensal: 2484, status: "ativo",                           responsavel: "AWQ",   fonte: "notion" },
];

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

  // 3a. Custos Variáveis Diretos → base para Margem de Contribuição (MC)
  custosVariaveis: {
    daniloVariavel: DRELinha;         // variável/comissão Danilo (*)
    ferramentasDiretas: DRELinha;     // ferramentas diretas da BU (do COGS)
    apoioOperacionalFreela: DRELinha; // freelancers/apoio pontual
    deslocamentosVisitas: DRELinha;   // transporte/deslocamento de visitas (*)
    outrosCustosVariaveis: DRELinha;
  };
  // MC = Receita Líquida − Custos Variáveis

  // 3b. Custos Fixos Diretos → abaixo da MC
  custosFixos: {
    daniloFixo: DRELinha;       // custo fixo alocado Danilo na BU (*)
    encargosProvisos: DRELinha; // encargos sociais sobre custo Danilo (*)
    outrosCustosFixos: DRELinha;
  };
  // Margem Bruta = MC − Custos Fixos

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
  // Fonte: Notion Mini P&L · FEE total = R$16.521,36
  receitaBruta: {
    recorrente:    16521,  // FEE mensal CEM + André + Carol + Tati + Luis + Caza Vision
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

  // ── Custos Variáveis Diretos (base para MC) ────────────────────────────────
  custosVariaveis: {
    // ← Notion: parcela variável do campo "Danilo" do Mini P&L
    daniloVariavel:        { label: "Danilo variável / comissão",         valor:  484, fonte: "derivado", nota: "Parcela variável/comissão — complemento até total Notion" },
    // ← Notion: campo "COGS" do Mini P&L
    ferramentasDiretas:    { label: "Ferramentas diretas (COGS)",         valor:  184, fonte: "notion",   nota: "Notion Mini P&L · campo COGS" },
    // ← Notion: campo "Freelancer" do Mini P&L
    apoioOperacionalFreela:{ label: "Apoio operacional / freela",         valor:   30, fonte: "notion",   nota: "Notion Mini P&L · campo Freelancer" },
    // ← Não existe na base Notion → preencher mensalmente
    deslocamentosVisitas:  { label: "Deslocamentos / visitas",            valor:    0, fonte: "manual",   nota: "Preencher mensalmente — transporte de visitas às contas" },
    outrosCustosVariaveis: { label: "Outros custos variáveis",            valor:    0, fonte: "manual",   nota: "Preencher mensalmente" },
  },
  // MC = Receita Líquida − Custos Variáveis

  // ── Custos Fixos Diretos (abaixo da MC) ────────────────────────────────────
  custosFixos: {
    // ← Notion: parcela fixa do campo "Danilo" do Mini P&L
    daniloFixo:            { label: "Danilo fixo",                        valor: 2000, fonte: "derivado", nota: "Parcela fixa do custo Danilo — Notion Mini P&L campo Danilo" },
    // ← Não existe na base Notion → preencher mensalmente
    encargosProvisos:      { label: "Encargos / provisões",               valor:    0, fonte: "manual",   nota: "Preencher mensalmente — FGTS, férias, 13º proporcional" },
    outrosCustosFixos:     { label: "Outros custos fixos diretos",        valor:    0, fonte: "manual",   nota: "Preencher mensalmente" },
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

// ─── Modo Carreira — 6 Pilares da BU ──────────────────────────────────────────
// Framework de avaliação do dono de BU: pipeline → ativação → retenção →
// expansão → NPS → margem de contribuição.
// Source: preencher mensalmente. Referência: modelo M4E AWQ Group.

export interface ModoCarreiraPilar {
  id: string;
  pilar: "pipeline" | "ativacao" | "retencao" | "expansao" | "nps" | "mc";
  label: string;
  descricao: string;
  valor: number;
  meta: number;
  unidade: "currency" | "number" | "percent" | "score";
  status: "acima_meta" | "na_meta" | "abaixo_meta" | "sem_dados";
  tendencia: "subindo" | "estavel" | "descendo";
  detalhe?: string;
}

export interface ModoCarreiraMetricas {
  mes: string;

  pipeline: {
    totalProspectos: number;        // contas em avaliação/prospecção
    valorPipelineMRR: number;       // MRR potencial em pipeline (R$)
    taxaConversao: number;          // % prospectos → contratos (histórico)
    novasOportunidades: number;     // oportunidades abertas no mês
  };

  ativacao: {
    novasContasAtivadas: number;    // contratos iniciados no mês
    taxaAtivacao: number;           // % de ativação (ativadas / total iniciado)
    tempoMedioOnboarding: number;   // dias médios até 1ª entrega de valor
    onboardingsConcluidos: number;
  };

  retencao: {
    contasAtivas: number;
    churnMes: number;               // contas perdidas no mês
    taxaRetencao: number;           // % (contasAtivas - churn) / contasAtivas
    mrr: number;                    // Monthly Recurring Revenue (R$)
    mrrMeta: number;                // meta de MRR
  };

  expansao: {
    upsellReceita: number;          // receita gerada por upsell/cross-sell (R$)
    novasOportunidadesExpansao: number;
    expansaoMRRPct: number;         // % crescimento MRR via expansão
    contasComOportunidade: number;  // contas com Oportunidade Forte ou Média
  };

  nps: {
    score: number;                  // NPS: -100 a 100
    meta: number;
    promotores: number;             // % promotores (9-10)
    neutros: number;                // % neutros (7-8)
    detratores: number;             // % detratores (0-6)
    respostas: number;
    ultimaColeta: string;           // YYYY-MM-DD
  };

  margemContribuicao: {
    mc: number;                     // valor absoluto (R$)
    mcPct: number;                  // MC / Receita Líquida × 100
    metaMcPct: number;              // meta de % MC
    porConta: {
      conta: string;
      fee: number;
      custoVariavel: number;
      mc: number;
      mcPct: number;
    }[];
  };
}

export const modoCarreiraMetricas: ModoCarreiraMetricas = {
  mes: "Março 2026",

  pipeline: {
    totalProspectos:     1,      // Conta 04 — Prospecção
    valorPipelineMRR:    2000,   // estimativa de MRR potencial da Conta 04
    taxaConversao:       50,     // histórico AWQ — 1 em 2 prospectos fecha
    novasOportunidades:  1,
  },

  ativacao: {
    novasContasAtivadas:   0,    // sem novos contratos iniciados em março
    taxaAtivacao:          100,  // 100% das contas em onboarding concluíram
    tempoMedioOnboarding:  14,   // ~14 dias até 1ª entrega de valor
    onboardingsConcluidos: 0,
  },

  retencao: {
    contasAtivas:   4,
    churnMes:       0,           // sem churn em março
    taxaRetencao:   100,         // 100% de retenção
    mrr:            8280,        // FEE total março
    mrrMeta:        9000,        // meta de MRR definida para 2026
  },

  expansao: {
    upsellReceita:              0,    // sem upsell concluído em março
    novasOportunidadesExpansao: 2,   // CEM (Forte) + AWQ-Produtora (Média)
    expansaoMRRPct:             0,
    contasComOportunidade:      3,   // JACQES Forte, AWQ-Produtora Média, CEM implícito
  },

  nps: {
    score:         72,            // estimativa — NPS formal pendente
    meta:          75,
    promotores:    60,            // % de clientes promotores
    neutros:       30,            // % neutros
    detratores:    10,            // % detratores (Conta 04 em risco)
    respostas:     3,             // de 4 contas, 3 responderam
    ultimaColeta:  "2026-03-15",
  },

  margemContribuicao: {
    mc:         7582,             // Rec Líquida R$8.280 − CV R$698
    mcPct:      91.6,
    metaMcPct:  80,               // meta mínima de MC%
    porConta: [
      { conta: "CEM",             fee: 3200, custoVariavel: 320, mc: 2880, mcPct: 90.0 },
      { conta: "André Vieira",    fee: 1500, custoVariavel: 165, mc: 1335, mcPct: 89.0 },
      { conta: "Carol Bertolini", fee: 1790, custoVariavel: 134, mc: 1656, mcPct: 92.5 },
      { conta: "Tati Simões",     fee: 1790, custoVariavel: 179, mc: 1611, mcPct: 90.0 },
    ],
  },
};

// ─── Pilares Modo Carreira — cards de status ──────────────────────────────────

export const modoCarreiraPilares: ModoCarreiraPilar[] = [
  {
    id: "pipeline",
    pilar: "pipeline",
    label: "Pipeline",
    descricao: "Prospectos ativos e MRR potencial em avaliação",
    valor:   1,
    meta:    2,
    unidade: "number",
    status:  "abaixo_meta",
    tendencia: "estavel",
    detalhe: "Conta 04 em prospecção · MRR pot. R$2.000",
  },
  {
    id: "ativacao",
    pilar: "ativacao",
    label: "Ativação",
    descricao: "Novos contratos ativados e tempo de onboarding",
    valor:   0,
    meta:    1,
    unidade: "number",
    status:  "sem_dados",
    tendencia: "estavel",
    detalhe: "Sem novas ativações em março · onboarding: 14 dias médio",
  },
  {
    id: "retencao",
    pilar: "retencao",
    label: "Retenção",
    descricao: "Taxa de retenção mensal e MRR mantido",
    valor:   100,
    meta:    95,
    unidade: "percent",
    status:  "acima_meta",
    tendencia: "estavel",
    detalhe: "0 churn · 4 contas ativas · MRR R$8.280",
  },
  {
    id: "expansao",
    pilar: "expansao",
    label: "Expansão",
    descricao: "Upsell, cross-sell e expansão de MRR",
    valor:   0,
    meta:    500,
    unidade: "currency",
    status:  "abaixo_meta",
    tendencia: "subindo",
    detalhe: "2 oportunidades abertas · upsell CEM em negociação R$800",
  },
  {
    id: "nps",
    pilar: "nps",
    label: "NPS",
    descricao: "Net Promoter Score — satisfação da carteira",
    valor:   72,
    meta:    75,
    unidade: "score",
    status:  "abaixo_meta",
    tendencia: "subindo",
    detalhe: "3/4 contas responderam · Conta 04 detratora",
  },
  {
    id: "mc",
    pilar: "mc",
    label: "Margem Contribuição",
    descricao: "MC% da BU — Receita Líquida − Custos Variáveis",
    valor:   91.6,
    meta:    80,
    unidade: "percent",
    status:  "acima_meta",
    tendencia: "estavel",
    detalhe: "MC R$7.582 · meta ≥ 80% · todas as contas acima do break-even",
  },
];

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

// Visão anual — 2026 completo (Jan–Mar realizados · Abr–Dez projetados)
export const fluxoCaixaAnual: FluxoCaixaEntry[] = [
  { periodo: "Jan",  entradasPrev: 9000,  entradasReal: 5500,  saidasPrev: 6800, saidasReal: 5900 },
  { periodo: "Fev",  entradasPrev: 9500,  entradasReal: 7200,  saidasPrev: 6800, saidasReal: 6100 },
  { periodo: "Mar",  entradasPrev: 10500, entradasReal: 8280,  saidasPrev: 4900, saidasReal: 3458 },
  { periodo: "Abr",  entradasPrev: 10500, entradasReal: 0,     saidasPrev: 4900, saidasReal: 0    },
  { periodo: "Mai",  entradasPrev: 10500, entradasReal: 0,     saidasPrev: 4900, saidasReal: 0    },
  { periodo: "Jun",  entradasPrev: 10500, entradasReal: 0,     saidasPrev: 4900, saidasReal: 0    },
  { periodo: "Jul",  entradasPrev: 11000, entradasReal: 0,     saidasPrev: 5000, saidasReal: 0    },
  { periodo: "Ago",  entradasPrev: 11000, entradasReal: 0,     saidasPrev: 5000, saidasReal: 0    },
  { periodo: "Set",  entradasPrev: 11500, entradasReal: 0,     saidasPrev: 5100, saidasReal: 0    },
  { periodo: "Out",  entradasPrev: 11500, entradasReal: 0,     saidasPrev: 5100, saidasReal: 0    },
  { periodo: "Nov",  entradasPrev: 12000, entradasReal: 0,     saidasPrev: 5200, saidasReal: 0    },
  { periodo: "Dez",  entradasPrev: 12000, entradasReal: 0,     saidasPrev: 5200, saidasReal: 0    },
];

// Visão semanal — Março 2026 (4 semanas)
export const fluxoCaixaSemanal: FluxoCaixaEntry[] = [
  { periodo: "Sem 1 · 1–7/3",   entradasPrev: 2625, entradasReal: 1800, saidasPrev: 1225, saidasReal: 1050 },
  { periodo: "Sem 2 · 8–14/3",  entradasPrev: 2625, entradasReal: 2200, saidasPrev: 1225, saidasReal: 900  },
  { periodo: "Sem 3 · 15–21/3", entradasPrev: 2625, entradasReal: 2480, saidasPrev: 1225, saidasReal: 950  },
  { periodo: "Sem 4 · 22–31/3", entradasPrev: 2625, entradasReal: 1800, saidasPrev: 1225, saidasReal: 558  },
];

// ─── Marketing · Mercadologia por Cliente ─────────────────────────────────────

export type CanalStatus = "ativo" | "pausado" | "em_estruturação" | "inativo";
export type FonteStatus = "conectado" | "manual" | "nao_configurado";
export type AcaoAtualizar = "pull_notion" | "pull_ga" | "pull_meta" | "pull_email" | "upload_planilha" | "none";

export interface CanalMarketing {
  canal: string;
  tipo: "instagram" | "tiktok" | "youtube" | "linkedin" | "email" | "site" | "whatsapp" | "meta_ads" | "google_ads" | "outro";
  status: CanalStatus;
  metricas: {
    label: string;
    valor: string;
    delta?: number;   // positivo = crescimento vs mês anterior
  }[];
}

export interface FunilMarketing {
  topo: number;
  meio: number;
  fundo: number;
  clientes: number;
  rotuloTopo?: string;
  rotuloMeio?: string;
  rotuloFundo?: string;
  rotuloClientes?: string;
}

export interface CampanhaMarketing {
  nome: string;
  canal: string;
  status: "ativa" | "pausada" | "encerrada" | "planejada";
  orcamento?: string;
  resultado?: string;
  inicio: string;
  fim?: string;
}

export interface BaseDados {
  id: string;
  fonte: string;
  icone: "Database" | "BarChart2" | "Megaphone" | "Mail" | "Users" | "FileSpreadsheet" | "Globe" | "MessageSquare";
  status: FonteStatus;
  ultimaSincronizacao: string | null;
  descricao: string;
  acaoAtualizar: AcaoAtualizar;
}

export interface MarketingCliente {
  contaId: string;
  posicionamento: string;
  publicoAlvo: string[];
  diferenciais: string[];
  canais: CanalMarketing[];
  funil: FunilMarketing;
  campanhas: CampanhaMarketing[];
  oportunidades: string[];
  desafios: string[];
  bases: BaseDados[];
}

export const marketingData: MarketingCliente[] = [
  // ── André Vieira · id "1" ──────────────────────────────────────────────────
  {
    contaId: "1",
    posicionamento:
      "Marca pessoal focada em consultoria de crescimento para empreendedores individuais. Posicionamento de autoridade via conteúdo educativo e resultados comprovados de clientes.",
    publicoAlvo: [
      "Empreendedores solo (25–45 anos)",
      "Coaches e consultores em início de carreira",
      "Profissionais liberais em transição",
    ],
    diferenciais: [
      "Método M4E validado com resultados documentados",
      "Comunidade fechada com acompanhamento contínuo",
      "Conteúdo prático baseado em casos reais",
    ],
    canais: [
      {
        canal: "Instagram",
        tipo: "instagram",
        status: "ativo",
        metricas: [
          { label: "Seguidores",     valor: "8.4K",  delta: 4.2  },
          { label: "Engajamento",    valor: "5,8%",  delta: 0.3  },
          { label: "Alcance mensal", valor: "42K",   delta: 12   },
        ],
      },
      {
        canal: "Email MKT",
        tipo: "email",
        status: "ativo",
        metricas: [
          { label: "Lista",          valor: "1.230", delta: 3.1  },
          { label: "Taxa de abertura",valor: "34%",  delta: -1.5 },
          { label: "Cliques",        valor: "8,2%",  delta: 0.4  },
        ],
      },
      {
        canal: "Meta Ads",
        tipo: "meta_ads",
        status: "ativo",
        metricas: [
          { label: "Investimento",   valor: "R$ 900/mês",   delta: 0    },
          { label: "CPL",            valor: "R$ 18,40",     delta: -5.2 },
          { label: "ROAS",           valor: "3,2×",         delta: 0.4  },
        ],
      },
      {
        canal: "WhatsApp Business",
        tipo: "whatsapp",
        status: "ativo",
        metricas: [
          { label: "Contatos ativos", valor: "320",  delta: 8    },
          { label: "Taxa de resposta",valor: "91%",  delta: 1    },
        ],
      },
    ],
    funil: {
      topo: 4200,
      meio: 610,
      fundo: 84,
      clientes: 22,
      rotuloTopo:     "Alcance / Visitantes",
      rotuloMeio:     "Leads captados",
      rotuloFundo:    "Oportunidades",
      rotuloClientes: "Clientes ativos",
    },
    campanhas: [
      {
        nome: "Lead Magnet — E-book Método M4E",
        canal: "Meta Ads + Email",
        status: "ativa",
        orcamento: "R$ 600/mês",
        resultado: "CPL R$ 18,40 · 48 leads/mês",
        inicio: "2026-02-01",
      },
      {
        nome: "Sequência de nutrição — 7 emails",
        canal: "Email MKT",
        status: "ativa",
        resultado: "Abertura 38% · Conversão 6,2%",
        inicio: "2026-01-15",
      },
      {
        nome: "Campanha de reativação lista fria",
        canal: "Email MKT",
        status: "encerrada",
        resultado: "Reativou 12% · 94 contatos",
        inicio: "2026-02-10",
        fim: "2026-03-01",
      },
    ],
    oportunidades: [
      "Lançamento de programa em grupo (leverage do 1:1)",
      "Parceria com creators do nicho para co-marketing",
      "Produção de mini-curso no YouTube para topo de funil",
    ],
    desafios: [
      "Dependência elevada de tráfego pago (65% dos leads)",
      "Taxa de abertura de email caindo — necessita atualização da cadência",
    ],
    bases: [
      { id: "a1-notion",  fonte: "Notion",            icone: "Database",       status: "conectado",     ultimaSincronizacao: "2026-03-21T18:00:00Z", descricao: "CRM e gestão de clientes / leads",                     acaoAtualizar: "pull_notion"    },
      { id: "a1-ga",      fonte: "Google Analytics",  icone: "BarChart2",      status: "manual",        ultimaSincronizacao: "2026-03-15T10:30:00Z", descricao: "Tráfego do site e conversões de landing page",          acaoAtualizar: "pull_ga"        },
      { id: "a1-meta",    fonte: "Meta Ads Manager",  icone: "Megaphone",      status: "manual",        ultimaSincronizacao: "2026-03-20T09:00:00Z", descricao: "Performance de campanhas pagas no Instagram/Facebook",  acaoAtualizar: "pull_meta"      },
      { id: "a1-email",   fonte: "Email MKT",         icone: "Mail",           status: "manual",        ultimaSincronizacao: "2026-03-18T14:00:00Z", descricao: "Métricas de listas e campanhas de email",              acaoAtualizar: "pull_email"     },
      { id: "a1-plan",    fonte: "Planilha de Leads",  icone: "FileSpreadsheet",status: "nao_configurado",ultimaSincronizacao: null,                   descricao: "Controle manual de pipeline de vendas",               acaoAtualizar: "upload_planilha"},
    ],
  },

  // ── Luis Vieira · id "2" ───────────────────────────────────────────────────
  {
    contaId: "2",
    posicionamento:
      "Consultoria financeira pessoal para profissionais de renda média-alta. Foco em organização patrimonial e planejamento de médio prazo.",
    publicoAlvo: [
      "Profissionais CLT com renda R$ 8k–25k/mês",
      "Autônomos e liberais com dificuldade de organização financeira",
    ],
    diferenciais: [
      "Diagnóstico financeiro estruturado em 30 dias",
      "Acompanhamento mensal com planilha personalizada",
    ],
    canais: [
      {
        canal: "Instagram",
        tipo: "instagram",
        status: "pausado",
        metricas: [
          { label: "Seguidores",  valor: "1.820", delta: 0    },
          { label: "Engajamento", valor: "1,4%",  delta: -0.8 },
        ],
      },
      {
        canal: "WhatsApp Business",
        tipo: "whatsapp",
        status: "ativo",
        metricas: [
          { label: "Contatos ativos", valor: "87",  delta: 2   },
          { label: "Taxa de resposta",valor: "68%", delta: -5  },
        ],
      },
    ],
    funil: {
      topo: 380,
      meio: 52,
      fundo: 14,
      clientes: 4,
      rotuloTopo:     "Alcance orgânico",
      rotuloMeio:     "Contatos no WhatsApp",
      rotuloFundo:    "Conversas avançadas",
      rotuloClientes: "Clientes ativos",
    },
    campanhas: [
      {
        nome: "Reativação do Instagram",
        canal: "Instagram",
        status: "planejada",
        orcamento: "R$ 200/mês",
        inicio: "2026-04-01",
      },
    ],
    oportunidades: [
      "Reativação do canal no Instagram com conteúdo educativo",
      "Desenvolvimento de planilha de diagnóstico como lead magnet",
      "Indicações estruturadas a partir da base existente de clientes",
    ],
    desafios: [
      "Baixa constância de produção de conteúdo",
      "Responsividade reduzida do próprio cliente para validar materiais",
      "Sem funil estruturado — dependência de indicações informais",
    ],
    bases: [
      { id: "l2-notion", fonte: "Notion",           icone: "Database",       status: "conectado",      ultimaSincronizacao: "2026-03-19T14:00:00Z", descricao: "Gestão de tarefas e histórico de cliente",       acaoAtualizar: "pull_notion"     },
      { id: "l2-plan",   fonte: "Planilha Controle", icone: "FileSpreadsheet",status: "manual",         ultimaSincronizacao: "2026-03-10T09:00:00Z", descricao: "Pipeline de prospects e controle de indicações", acaoAtualizar: "upload_planilha" },
      { id: "l2-meta",   fonte: "Meta Ads Manager",  icone: "Megaphone",      status: "nao_configurado",ultimaSincronizacao: null,                   descricao: "Campanhas pagas (a estruturar em Abril 2026)",   acaoAtualizar: "pull_meta"       },
    ],
  },

  // ── Carol Bertolini · id "3" ───────────────────────────────────────────────
  {
    contaId: "3",
    posicionamento:
      "Operação interna AWQ Group — foco em gestão de processos e capacitação de equipe. Marketing voltado para posicionamento institucional B2B e comunicação com stakeholders.",
    publicoAlvo: [
      "Lideranças internas AWQ",
      "Parceiros e fornecedores estratégicos",
      "Potenciais talentos para recrutamento",
    ],
    diferenciais: [
      "Processos documentados e replicáveis",
      "Gestão baseada em dados e KPIs claros",
    ],
    canais: [
      {
        canal: "LinkedIn",
        tipo: "linkedin",
        status: "ativo",
        metricas: [
          { label: "Conexões",       valor: "1.1K",  delta: 2.8  },
          { label: "Impressões",     valor: "6.2K",  delta: 15   },
          { label: "Engajamento",    valor: "3,1%",  delta: 0.5  },
        ],
      },
      {
        canal: "Email Corporativo",
        tipo: "email",
        status: "ativo",
        metricas: [
          { label: "Taxa de abertura", valor: "47%", delta: 2    },
          { label: "Lista corporativa",valor: "210", delta: 5    },
        ],
      },
    ],
    funil: {
      topo: 620,
      meio: 140,
      fundo: 38,
      clientes: 12,
      rotuloTopo:     "Impressões LinkedIn",
      rotuloMeio:     "Visitas perfil / site",
      rotuloFundo:    "Contatos qualificados",
      rotuloClientes: "Parceiros / talentos",
    },
    campanhas: [
      {
        nome: "Posicionamento LinkedIn — Série de artigos",
        canal: "LinkedIn",
        status: "ativa",
        resultado: "Alcance médio 850/post",
        inicio: "2026-02-15",
      },
    ],
    oportunidades: [
      "Newsletter interna como repositório de conhecimento da operação",
      "Employer branding para atrair perfis técnicos ao time AWQ",
      "Case studies de processos como conteúdo externo",
    ],
    desafios: [
      "Foco interno limita o alcance de marketing externo",
      "Ausência de landing page institucional dedicada",
    ],
    bases: [
      { id: "c3-notion",  fonte: "Notion",            icone: "Database",       status: "conectado",      ultimaSincronizacao: "2026-03-20T11:00:00Z", descricao: "Processos, SOPs e documentação interna",                   acaoAtualizar: "pull_notion"     },
      { id: "c3-linkedin",fonte: "LinkedIn Analytics", icone: "BarChart2",      status: "manual",         ultimaSincronizacao: "2026-03-18T16:00:00Z", descricao: "Métricas de alcance e engajamento no LinkedIn",             acaoAtualizar: "none"            },
      { id: "c3-crm",     fonte: "CRM Interno",        icone: "Users",          status: "nao_configurado",ultimaSincronizacao: null,                   descricao: "Gestão de contatos estratégicos e parceiros",              acaoAtualizar: "none"            },
      { id: "c3-email",   fonte: "Email Corporativo",  icone: "Mail",           status: "manual",         ultimaSincronizacao: "2026-03-15T09:00:00Z", descricao: "Taxa de abertura e cliques de comunicações internas",      acaoAtualizar: "pull_email"      },
    ],
  },

  // ── Tati Simões · id "4" ───────────────────────────────────────────────────
  {
    contaId: "4",
    posicionamento:
      "Em estruturação. Nova frente identificada com potencial de expansão, porém com expectativa desalinhada. Marca pessoal ainda não definida — necessita de diagnóstico de posicionamento antes de qualquer ação de marketing.",
    publicoAlvo: [
      "A definir após alinhamento de expectativas",
    ],
    diferenciais: [
      "Oportunidade forte identificada na área (a explorar)",
      "Engajamento potencial com audiência digital",
    ],
    canais: [
      {
        canal: "Instagram",
        tipo: "instagram",
        status: "em_estruturação",
        metricas: [
          { label: "Seguidores",  valor: "640",  delta: 0  },
          { label: "Engajamento", valor: "—",    delta: 0  },
        ],
      },
    ],
    funil: {
      topo: 0,
      meio: 0,
      fundo: 0,
      clientes: 0,
      rotuloTopo:     "Alcance (a estruturar)",
      rotuloMeio:     "Leads (a estruturar)",
      rotuloFundo:    "Oportunidades",
      rotuloClientes: "Clientes",
    },
    campanhas: [],
    oportunidades: [
      "Diagnóstico de posicionamento como primeiro entregável",
      "Forte oportunidade de mercado identificada — validar com cliente",
      "Potencial de crescimento acelerado uma vez alinhadas expectativas",
    ],
    desafios: [
      "Expectativa desalinhada — prioridade: alinhamento antes de ações",
      "5 pendências abertas bloqueando avanço operacional",
      "Funil e canais ainda não estruturados",
    ],
    bases: [
      { id: "t4-notion", fonte: "Notion",  icone: "Database",        status: "conectado", ultimaSincronizacao: "2026-03-19T14:00:00Z", descricao: "Registro de interações e pendências abertas", acaoAtualizar: "pull_notion" },
    ],
  },

  // ── CEM · id "5" ──────────────────────────────────────────────────────────
  {
    contaId: "5",
    posicionamento:
      "Centro de educação e capacitação corporativa. Foco em B2B — atração de empresas e gestores de T&D para programas in-company e abertos.",
    publicoAlvo: [
      "Gestores de RH e T&D de empresas médias (50–500 funcionários)",
      "Lideranças corporativas em busca de capacitação executiva",
    ],
    diferenciais: [
      "Metodologia proprietária de capacitação acelerada",
      "Certificação reconhecida no setor",
      "Programas customizáveis por vertical",
    ],
    canais: [
      {
        canal: "LinkedIn",
        tipo: "linkedin",
        status: "ativo",
        metricas: [
          { label: "Seguidores página",  valor: "2.8K",  delta: 3.2  },
          { label: "Impressões",         valor: "18K",   delta: 22   },
          { label: "Engajamento",        valor: "2,4%",  delta: 0.2  },
        ],
      },
      {
        canal: "Email MKT",
        tipo: "email",
        status: "ativo",
        metricas: [
          { label: "Lista B2B",          valor: "3.420",  delta: 1.8  },
          { label: "Taxa de abertura",   valor: "22%",    delta: -0.5 },
          { label: "Conversão form",     valor: "3,1%",   delta: 0.4  },
        ],
      },
      {
        canal: "Site Institucional",
        tipo: "site",
        status: "ativo",
        metricas: [
          { label: "Visitantes/mês",  valor: "4.100",  delta: 8.5  },
          { label: "Taxa de rejeição", valor: "52%",   delta: -3   },
          { label: "Leads/mês",       valor: "34",     delta: 5    },
        ],
      },
      {
        canal: "Google Ads",
        tipo: "google_ads",
        status: "pausado",
        metricas: [
          { label: "CPC médio",     valor: "R$ 4,80",  delta: 0 },
          { label: "Conversões",    valor: "0 (pausado)", delta: 0 },
        ],
      },
    ],
    funil: {
      topo: 4100,
      meio: 680,
      fundo: 98,
      clientes: 14,
      rotuloTopo:     "Visitantes site / LinkedIn",
      rotuloMeio:     "Leads qualificados",
      rotuloFundo:    "Propostas enviadas",
      rotuloClientes: "Empresas ativas",
    },
    campanhas: [
      {
        nome: "Inbound B2B — Série de conteúdo LinkedIn",
        canal: "LinkedIn",
        status: "ativa",
        resultado: "Alcance médio 2.1K/post · +12 seguidores/sem",
        inicio: "2026-01-10",
      },
      {
        nome: "Email nurturing — Trilha T&D",
        canal: "Email MKT",
        status: "ativa",
        orcamento: "R$ 0 (ferramenta inclusa)",
        resultado: "Abertura 22% · 3 oportunidades geradas",
        inicio: "2026-02-01",
      },
      {
        nome: "Google Ads — Palavras-chave capacitação",
        canal: "Google Ads",
        status: "pausada",
        orcamento: "R$ 1.500/mês (pausado)",
        resultado: "Pausa por revisão de landing page",
        inicio: "2025-11-01",
        fim: "2026-02-28",
      },
    ],
    oportunidades: [
      "Reativação do Google Ads com nova landing page otimizada para conversão",
      "Webinar mensal aberto como gerador de leads B2B",
      "Parceria com associações de RH para co-marketing",
    ],
    desafios: [
      "Google Ads pausado — perda de volume de leads pagos",
      "Taxa de abertura de email abaixo da média B2B (meta: 28%)",
      "Ciclo de venda longo — nurturing precisa de mais touchpoints",
    ],
    bases: [
      { id: "e5-notion", fonte: "Notion",           icone: "Database",       status: "conectado",      ultimaSincronizacao: "2026-03-20T21:00:00Z", descricao: "CRM, tarefas e histórico de relacionamento B2B",           acaoAtualizar: "pull_notion"     },
      { id: "e5-ga",     fonte: "Google Analytics", icone: "BarChart2",      status: "conectado",      ultimaSincronizacao: "2026-03-21T06:00:00Z", descricao: "Tráfego do site, metas e conversões",                      acaoAtualizar: "pull_ga"         },
      { id: "e5-email",  fonte: "Email MKT",        icone: "Mail",           status: "manual",         ultimaSincronizacao: "2026-03-18T10:00:00Z", descricao: "Métricas de listas e campanhas (Mailchimp)",               acaoAtualizar: "pull_email"      },
      { id: "e5-li",     fonte: "LinkedIn Analytics",icone: "BarChart2",     status: "manual",         ultimaSincronizacao: "2026-03-17T15:00:00Z", descricao: "Dados de alcance e engajamento da página empresarial",     acaoAtualizar: "none"            },
      { id: "e5-crm",    fonte: "CRM",              icone: "Users",          status: "nao_configurado",ultimaSincronizacao: null,                   descricao: "Pipeline B2B — integração pendente",                       acaoAtualizar: "none"            },
    ],
  },
];

// ─── Modo Carreira — Danilo · AWQ Group ───────────────────────────────────────

export type OKRStatus = "on_track" | "at_risk" | "behind" | "futuro";
export type EstudoStatus = "em_andamento" | "concluido" | "planejado";
export type HabilidadeArea = "tecnica" | "soft" | "gestao" | "marketing";
export type MilestoneStatus = "concluido" | "em_andamento" | "proximo" | "futuro";

export interface CarreiraReceita {
  fixoMensal: number;
  variavelMeta: number;
  variavelStatus: "paga" | "nao_paga";
  variavelScoreMin: number;
  vestingContaAncora: string;
  vestingProgresso: number;
  vestingDescricao: string;
  projecaoAnualBase: number;
  projecaoAnualComVariavel: number;
}

export interface CarreiraOKR {
  objetivo: string;
  trimestre: string;
  keyResults: {
    descricao: string;
    meta: string;
    atual: string;
    progresso: number;
    status: OKRStatus;
  }[];
}

export interface CarreiraEstudo {
  curso: string;
  plataforma: string;
  status: EstudoStatus;
  progresso?: number;
  prazo?: string;
  area: string;
  cargaHoras?: number;
}

export interface CarreiraHabilidade {
  nome: string;
  nivel: number;
  meta: number;
  area: HabilidadeArea;
}

export interface CarreiraMilestone {
  titulo: string;
  descricao: string;
  prazo: string;
  status: MilestoneStatus;
}

export interface CarreiraEstagio {
  titulo: string;
  scoreMin: number;
  scoreMax: number | null;
  descricao: string;
  beneficios: string[];
  isCurrent?: boolean;
}

export interface CarreiraData {
  nomeCompleto: string;
  cargo: string;
  empresa: string;
  ingressoMes: string;
  scoreAtual: number;
  estagioAtual: string;
  receita: CarreiraReceita;
  estagios: CarreiraEstagio[];
  okrs: CarreiraOKR[];
  estudos: CarreiraEstudo[];
  habilidades: CarreiraHabilidade[];
  milestones: CarreiraMilestone[];
  mentores: { nome: string; relacao: string; area: string }[];
  notasCarreira: string;
}

export const carreiraData: CarreiraData = {
  nomeCompleto:  "Danilo",
  cargo:         "CS & Operações",
  empresa:       "AWQ Group",
  ingressoMes:   "2025-08",
  scoreAtual:    69,
  estagioAtual:  "Operador em Formação",

  receita: {
    fixoMensal:              4500,
    variavelMeta:            1200,
    variavelStatus:          "nao_paga",
    variavelScoreMin:        75,
    vestingContaAncora:      "JACQES",
    vestingProgresso:        35,
    vestingDescricao:        "Vesting JACQES em andamento — 35% acumulado. Progressão vinculada à entrega de resultados trimestrais e manutenção da conta como saudável.",
    projecaoAnualBase:       54000,
    projecaoAnualComVariavel:68400,
  },

  estagios: [
    {
      titulo:    "Operador em Formação",
      scoreMin:  60,
      scoreMax:  74,
      descricao: "Etapa atual. Processos básicos sendo estabelecidos, carteira em maturação.",
      beneficios: ["Fixo garantido", "Acesso ao modelo M4E", "Início do vesting JACQES"],
      isCurrent: true,
    },
    {
      titulo:    "Bom Nível",
      scoreMin:  75,
      scoreMax:  84,
      descricao: "Variável desbloqueada. Carteira estabilizada com SLA consistente.",
      beneficios: ["Variável mensal R$ 1.200", "Revisão de cargo elegível", "Expansão de carteira autorizada"],
    },
    {
      titulo:    "Operador Sólido",
      scoreMin:  85,
      scoreMax:  94,
      descricao: "Referência de operação. Processos auditáveis e carteira com crescimento.",
      beneficios: ["Variável + bônus semestral", "Elegível a lead de squad", "Participação em decisões estratégicas"],
    },
    {
      titulo:    "Owner em Formação",
      scoreMin:  95,
      scoreMax:  null,
      descricao: "Autonomia operacional total. Gestão de receita do próprio portfólio.",
      beneficios: ["Modelo de receita compartilhada", "Autonomia de precificação", "Expansão de equity"],
    },
  ],

  okrs: [
    {
      objetivo:  "Atingir score 75+ em Abril 2026 e desbloquear a variável",
      trimestre: "Q2 2026",
      keyResults: [
        { descricao: "Elevar dimensão Processo de 11 para 14 pts",   meta: "14 pts",  atual: "11 pts", progresso: 55, status: "at_risk"   },
        { descricao: "Elevar dimensão Risco de 13 para 17 pts",      meta: "17 pts",  atual: "13 pts", progresso: 65, status: "at_risk"   },
        { descricao: "Manter Atendimento e Operação ≥ 16 pts",       meta: "≥ 16 pts",atual: "16/15",  progresso: 78, status: "on_track"  },
        { descricao: "Reduzir pendências totais de 11 para ≤ 5",     meta: "≤ 5",     atual: "11",     progresso: 30, status: "behind"    },
        { descricao: "Criar mínimo 3 SOPs documentados no Notion",   meta: "3 SOPs",  atual: "0",      progresso: 0,  status: "behind"    },
      ],
    },
    {
      objetivo:  "Estabilizar a carteira e expandir para 5 contas em Q3 2026",
      trimestre: "Q3 2026",
      keyResults: [
        { descricao: "Conta 04 passar de Sensível para Estável",     meta: "Estável",   atual: "Sensível",progresso: 10, status: "at_risk"  },
        { descricao: "JACQES vesting ≥ 50% acumulado",              meta: "50%",       atual: "35%",     progresso: 70, status: "on_track" },
        { descricao: "Prospecção e onboarding de 1 nova conta",     meta: "1 conta",   atual: "0",       progresso: 0,  status: "futuro"   },
        { descricao: "NPS médio da carteira ≥ 8,0",                 meta: "≥ 8,0",     atual: "—",       progresso: 0,  status: "futuro"   },
      ],
    },
  ],

  estudos: [
    { curso: "Customer Success Manager Certification (CSMC)", plataforma: "SuccessHACKER",    status: "em_andamento", progresso: 60, prazo: "2026-05-31", area: "CS",        cargaHoras: 40  },
    { curso: "Fundamentos de Gestão de Receita (RevOps)",      plataforma: "HubSpot Academy",  status: "em_andamento", progresso: 35, prazo: "2026-06-30", area: "RevOps",    cargaHoras: 20  },
    { curso: "Método M4E — Módulo Avançado",                   plataforma: "AWQ Interno",      status: "em_andamento", progresso: 80, prazo: "2026-04-15", area: "Operações", cargaHoras: 12  },
    { curso: "Negociação e Gestão de Conflitos",               plataforma: "Coursera",         status: "planejado",    prazo: "2026-07-31",                  area: "Soft Skills",cargaHoras: 15 },
    { curso: "Análise de Dados com Google Sheets & Notion",    plataforma: "Udemy",            status: "concluido",    progresso: 100,                       area: "Dados",     cargaHoras: 10  },
    { curso: "Comunicação Executiva",                          plataforma: "LinkedIn Learning", status: "concluido",   progresso: 100,                       area: "Soft Skills",cargaHoras: 8  },
  ],

  habilidades: [
    { nome: "Customer Success",       nivel: 3, meta: 5, area: "gestao"    },
    { nome: "Gestão de Conta (AM)",   nivel: 3, meta: 4, area: "gestao"    },
    { nome: "Análise de Dados",       nivel: 2, meta: 4, area: "tecnica"   },
    { nome: "Processos & SOPs",       nivel: 2, meta: 4, area: "tecnica"   },
    { nome: "Comunicação Executiva",  nivel: 3, meta: 5, area: "soft"      },
    { nome: "Negociação",             nivel: 2, meta: 4, area: "soft"      },
    { nome: "Marketing Digital",      nivel: 2, meta: 3, area: "marketing" },
    { nome: "RevOps",                 nivel: 1, meta: 3, area: "gestao"    },
  ],

  milestones: [
    { titulo: "Início na AWQ Group",              descricao: "Onboarding e integração ao modelo M4E",                     prazo: "2025-08", status: "concluido"    },
    { titulo: "Carteira ativa com 4 contas",      descricao: "Onboarding de JACQES, AWQ Agência, AWQ Produtora e Conta 04",prazo: "2025-10", status: "concluido"    },
    { titulo: "Primeiro mês com score ≥ 60",      descricao: "Operação mínima estabelecida",                               prazo: "2025-12", status: "concluido"    },
    { titulo: "Score 75 — variável desbloqueada", descricao: "Meta de Abril 2026 — faltam +6 pts",                         prazo: "2026-04", status: "em_andamento" },
    { titulo: "CSMC Certification",               descricao: "Certificação oficial de Customer Success Manager",            prazo: "2026-05", status: "em_andamento" },
    { titulo: "Score 85 — Operador Sólido",       descricao: "Carteira madura, revisão de cargo elegível",                 prazo: "2026-09", status: "proximo"      },
    { titulo: "5ª conta onboarded",               descricao: "Expansão da carteira com nova prospecção",                   prazo: "2026-09", status: "proximo"      },
    { titulo: "Score 95 — Owner em Formação",     descricao: "Autonomia total, modelo de receita compartilhada",           prazo: "2027-01", status: "futuro"       },
  ],

  mentores: [
    { nome: "Liderança AWQ",     relacao: "Gestora direta",      area: "Operações & Estratégia" },
    { nome: "Rede CS Community", relacao: "Comunidade de pares", area: "Customer Success"       },
  ],

  notasCarreira:
    "Foco no curto prazo: desbloquear a variável atingindo 75 pts em Abril. A dimensão Processo é o maior gargalo — 0 SOPs criados até agora. O vesting JACQES está em progresso e depende da continuidade saudável da conta.",
};

// ─── Fluxo de Caixa · Categorias Detalhadas ──────────────────────────────────
// Conectado diretamente ao DRE Gerencial · Março 2026

export type FluxoGrupo = "entradas" | "saidas";
export type FluxoSubgrupo =
  | "Receita de Serviços"
  | "Receitas Extras"
  | "Remuneração & RH"
  | "Ferramentas & Infraestrutura"
  | "Impostos & Taxas"
  | "Encargos & Provisões"
  | "Overhead & Estrutura"
  | "Ajustes & Reconciliação";

export interface FluxoCaixaCategoria {
  id: string;
  grupo: FluxoGrupo;
  subgrupo: FluxoSubgrupo;
  label: string;
  fonte: "notion" | "derivado" | "manual";
  dreRef?: string;        // campo correspondente no DRE
  prevMensal: number;     // projeção mensal (meta)
  realJan: number;
  realFev: number;
  realMar: number;        // março = referência DRE
  nota?: string;
}

// Entradas: FEE recorrente = R$8.280 (Notion)
// Saídas DRE: fixo=2.000 + variável=484 + ferramentas=184 + freela=30 = 2.698
// Fluxo total saídas Mar: 3.458 — diferença de 760 = timing/ajustes de caixa
export const fluxoCaixaCategorias: FluxoCaixaCategoria[] = [
  // ── ENTRADAS ───────────────────────────────────────────────────────────────
  {
    id: "ent-fee",
    grupo: "entradas",
    subgrupo: "Receita de Serviços",
    label: "FEE recorrente (contratos ativos)",
    fonte: "notion",
    dreRef: "receitaBruta.recorrente",
    prevMensal: 9000,
    realJan: 5500,
    realFev: 7200,
    realMar: 8280,
    nota: "Notion Mini P&L · soma dos FEEs das 4 contas ativas",
  },
  {
    id: "ent-projeto",
    grupo: "entradas",
    subgrupo: "Receita de Serviços",
    label: "Projetos / Setup pontual",
    fonte: "manual",
    dreRef: "receitaBruta.projetoSetup",
    prevMensal: 500,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — serviços avulsos ou onboarding",
  },
  {
    id: "ent-variavel",
    grupo: "entradas",
    subgrupo: "Receitas Extras",
    label: "Receita variável / bônus de resultado",
    fonte: "manual",
    dreRef: "receitaBruta.variavel",
    prevMensal: 0,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — comissões ou bônus de performance",
  },
  {
    id: "ent-extra",
    grupo: "entradas",
    subgrupo: "Receitas Extras",
    label: "Receita extraordinária",
    fonte: "manual",
    dreRef: "receitaBruta.extraordinaria",
    prevMensal: 0,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — itens não recorrentes",
  },

  // ── SAÍDAS ─────────────────────────────────────────────────────────────────
  {
    id: "sai-fixo",
    grupo: "saidas",
    subgrupo: "Remuneração & RH",
    label: "Remuneração fixa — Danilo",
    fonte: "notion",
    dreRef: "custosDiretos.daniloFixo",
    prevMensal: 2000,
    realJan: 2000,
    realFev: 2000,
    realMar: 2000,
    nota: "Notion Mini P&L · campo Danilo (Fixo)",
  },
  {
    id: "sai-variavel",
    grupo: "saidas",
    subgrupo: "Remuneração & RH",
    label: "Remuneração variável — Danilo",
    fonte: "notion",
    dreRef: "custosDiretos.daniloVariavel",
    prevMensal: 1200,
    realJan: 0,
    realFev: 0,
    realMar: 484,
    nota: "Notion Mini P&L · variável proporcional ao score (69/100 → R$484)",
  },
  {
    id: "sai-encargos",
    grupo: "saidas",
    subgrupo: "Encargos & Provisões",
    label: "Encargos / provisões trabalhistas",
    fonte: "manual",
    dreRef: "custosDiretos.encargosProvisos",
    prevMensal: 300,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — FGTS, férias e 13º proporcional",
  },
  {
    id: "sai-deslocamento",
    grupo: "saidas",
    subgrupo: "Encargos & Provisões",
    label: "Deslocamentos / visitas às contas",
    fonte: "manual",
    dreRef: "custosDiretos.deslocamentosVisitas",
    prevMensal: 200,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — transporte e deslocamento a clientes",
  },
  {
    id: "sai-ferramentas",
    grupo: "saidas",
    subgrupo: "Ferramentas & Infraestrutura",
    label: "Ferramentas diretas (COGS)",
    fonte: "notion",
    dreRef: "custosDiretos.ferramentasDiretas",
    prevMensal: 200,
    realJan: 184,
    realFev: 184,
    realMar: 184,
    nota: "Notion Mini P&L · campo COGS — ferramentas diretas de entrega",
  },
  {
    id: "sai-freela",
    grupo: "saidas",
    subgrupo: "Ferramentas & Infraestrutura",
    label: "Apoio operacional / freela",
    fonte: "notion",
    dreRef: "custosDiretos.apoioOperacionalFreela",
    prevMensal: 100,
    realJan: 30,
    realFev: 30,
    realMar: 30,
    nota: "Notion Mini P&L · campo Freelancer",
  },
  {
    id: "sai-impostos",
    grupo: "saidas",
    subgrupo: "Impostos & Taxas",
    label: "Impostos / taxas sobre receita",
    fonte: "manual",
    dreRef: "deducoes.impostosTaxas",
    prevMensal: 400,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — DAS, ISS, PIS/COFINS conforme regime",
  },
  {
    id: "sai-coord",
    grupo: "saidas",
    subgrupo: "Overhead & Estrutura",
    label: "Coordenação / supervisão (rateio)",
    fonte: "manual",
    dreRef: "despesasOperacionais.coordenacaoSupervisao",
    prevMensal: 0,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — custo de supervisão alocado à BU",
  },
  {
    id: "sai-saas",
    grupo: "saidas",
    subgrupo: "Overhead & Estrutura",
    label: "Ferramentas compartilhadas (SaaS rateado)",
    fonte: "manual",
    dreRef: "despesasOperacionais.ferramentasCompartilhadas",
    prevMensal: 200,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — SaaS rateados entre BUs AWQ",
  },
  {
    id: "sai-admin",
    grupo: "saidas",
    subgrupo: "Overhead & Estrutura",
    label: "Administrativo rateado",
    fonte: "manual",
    dreRef: "despesasOperacionais.administrativoRateado",
    prevMensal: 150,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — admin/financeiro AWQ rateado à BU",
  },
  {
    id: "sai-founder",
    grupo: "saidas",
    subgrupo: "Ajustes & Reconciliação",
    label: "Custo founder / estratégico (Miguel)",
    fonte: "manual",
    dreRef: "ajustesImputados.custoFounderEstrategico",
    prevMensal: 0,
    realJan: 0,
    realFev: 0,
    realMar: 0,
    nota: "Preencher mensalmente — tempo estratégico do Miguel alocado à BU",
  },
  {
    id: "sai-reconciliacao",
    grupo: "saidas",
    subgrupo: "Ajustes & Reconciliação",
    label: "Diferença de caixa (timing / itens pendentes)",
    fonte: "derivado",
    prevMensal: 0,
    realJan: 1716,
    realFev: 1886,
    realMar: 760,
    nota: "Gap entre saídas totais do fluxo de caixa e custos do DRE — timing de pagamentos, provisões, impostos antecipados",
  },
];

// ─── Agência · Funções & Organograma ─────────────────────────────────────────

export type FuncaoStatus = "ativo" | "vago" | "a_estruturar";
export type FuncaoNivel = "c_level" | "senior" | "pleno" | "junior";
export type KPIStatus = "ok" | "atencao" | "risco" | "nd";
export type AcessoNivel = "admin" | "editor" | "viewer" | "sem_acesso";
export type FerramentaCategoria =
  | "comunicacao" | "projeto" | "financeiro" | "marketing" | "bi" | "infra" | "crm";

export interface FuncaoKPI {
  label: string;
  meta: string;
  atual: string;
  status: KPIStatus;
}

export interface FuncaoAgencia {
  id: string;
  titulo: string;
  categoria: "estrategia" | "cs_ops" | "marketing" | "financeiro" | "produto";
  responsavel: string | null;
  status: FuncaoStatus;
  nivel: FuncaoNivel;
  descricao: string;
  responsabilidades: string[];
  kpis: FuncaoKPI[];
  contas: string[];        // IDs das contas envolvidas
  ferramentas: string[];   // nomes das ferramentas
}

export const agenciaFuncoes: FuncaoAgencia[] = [
  {
    id: "estrategia",
    titulo: "Estratégia & Growth",
    categoria: "estrategia",
    responsavel: "Miguel",
    status: "ativo",
    nivel: "c_level",
    descricao: "Definição de posicionamento, modelo de negócio, precificação, expansão e decisões de portfólio. Condução das relações estratégicas com contas âncora.",
    responsabilidades: [
      "Definição do modelo M4E e evolução de metodologia",
      "Aprovação de precificação e contratos",
      "Relacionamento estratégico com contas JACQES e AWQ",
      "Decisões de expansão de carteira e prospecção",
      "Avaliação e gestão do vesting / equity",
      "Arquitetura do JACQES BI e ferramentas de gestão",
    ],
    kpis: [
      { label: "Contas sob gestão estratégica", meta: "5",    atual: "4",   status: "atencao" },
      { label: "Score médio da carteira",        meta: "75",   atual: "69",  status: "risco"   },
      { label: "Receita mensal BU",              meta: "10500",atual: "8280",status: "atencao" },
    ],
    contas: ["1", "2", "3", "4", "5"],
    ferramentas: ["Notion", "JACQES BI", "GitHub", "WhatsApp Business"],
  },
  {
    id: "cs_ops",
    titulo: "CS & Operações",
    categoria: "cs_ops",
    responsavel: "Danilo",
    status: "ativo",
    nivel: "pleno",
    descricao: "Execução do modelo M4E junto às contas: atendimento, visitas, follow-ups, gestão de pendências, SLA e relatórios operacionais. Primeiro ponto de contato dos clientes.",
    responsabilidades: [
      "Atendimento diário a todas as contas da carteira",
      "Realização e relatório de visitas mensais",
      "Gestão de pendências e SLA de resposta (< 24h)",
      "Preenchimento e atualização do Notion por conta",
      "Identificação e escalada de riscos de churn",
      "Follow-up de oportunidades de expansão",
      "Uso e alimentação do JACQES BI",
    ],
    kpis: [
      { label: "Score mensal M4E",      meta: "75",  atual: "69",  status: "atencao" },
      { label: "SLA de resposta",        meta: "90%", atual: "73%", status: "risco"   },
      { label: "Visitas realizadas/mês", meta: "6",   atual: "4",   status: "atencao" },
      { label: "Pendências abertas",     meta: "≤5",  atual: "11",  status: "risco"   },
    ],
    contas: ["1", "2", "3", "4", "5"],
    ferramentas: ["Notion", "JACQES BI", "WhatsApp Business", "Google Agenda"],
  },
  {
    id: "marketing",
    titulo: "Marketing & Criação",
    categoria: "marketing",
    responsavel: null,
    status: "a_estruturar",
    nivel: "pleno",
    descricao: "Execução de estratégias de marketing para os clientes da carteira: criação de conteúdo, gestão de canais, campanhas pagas, métricas e relatórios de marketing.",
    responsabilidades: [
      "Criação e publicação de conteúdo por conta",
      "Gestão de campanhas pagas (Meta Ads, Google Ads)",
      "Produção de materiais visuais e copywriting",
      "Monitoramento de métricas de marketing (alcance, engajamento, ROAS)",
      "Relatório mensal de marketing por conta",
      "Estruturação de funis e automações de email",
    ],
    kpis: [
      { label: "Contas com plano de marketing ativo", meta: "5",    atual: "2",  status: "risco"   },
      { label: "ROAS médio (contas com paid)",         meta: "3,5×", atual: "3,2×",status: "atencao"},
      { label: "CPL médio",                            meta: "R$15", atual: "R$18,40",status: "atencao"},
    ],
    contas: ["1", "2", "3", "4", "5"],
    ferramentas: ["Meta Ads Manager", "Google Analytics", "Canva", "Mailchimp", "Notion"],
  },
  {
    id: "financeiro",
    titulo: "Financeiro & Admin",
    categoria: "financeiro",
    responsavel: null,
    status: "a_estruturar",
    nivel: "senior",
    descricao: "Controle financeiro da BU, emissão de notas, gestão de contratos, pagamentos e relatórios financeiros. Alimentação do DRE Gerencial e reconciliação de caixa.",
    responsabilidades: [
      "Emissão e controle de NFs por conta",
      "Gestão de contratos e reajustes anuais",
      "Conciliação bancária mensal",
      "Preenchimento do DRE Gerencial (campos manuais)",
      "Controle de impostos e obrigações fiscais",
      "Relatório de fluxo de caixa mensal",
    ],
    kpis: [
      { label: "Campos DRE preenchidos",   meta: "100%", atual: "35%", status: "risco"   },
      { label: "Inadimplência da carteira",meta: "0%",   atual: "0%",  status: "ok"      },
      { label: "NFs emitidas no prazo",    meta: "100%", atual: "nd",  status: "nd"      },
    ],
    contas: ["1", "2", "3", "4", "5"],
    ferramentas: ["Notion", "JACQES BI", "Planilha Financeira"],
  },
  {
    id: "produto",
    titulo: "Produto & BI",
    categoria: "produto",
    responsavel: "Miguel",
    status: "ativo",
    nivel: "c_level",
    descricao: "Desenvolvimento e evolução do JACQES BI, ferramentas internas de gestão, automações e processos de dados. Responsável pelo stack tecnológico da agência.",
    responsabilidades: [
      "Desenvolvimento do JACQES BI (Next.js + Notion MCP)",
      "Evolução do modelo de score M4E",
      "Automações de coleta de dados do Notion",
      "Criação e manutenção de SOPs digitais",
      "Integrações de ferramentas (MCP, webhooks)",
      "Deploy e manutenção em GitHub Pages",
    ],
    kpis: [
      { label: "Uptime do BI",               meta: "99%",  atual: "99%", status: "ok"      },
      { label: "Campos Notion conectados",    meta: "15",   atual: "8",   status: "atencao" },
      { label: "Automações ativas",           meta: "5",    atual: "1",   status: "risco"   },
    ],
    contas: [],
    ferramentas: ["GitHub", "Notion", "JACQES BI", "Next.js", "Vercel"],
  },
];

// ─── Agência · Ferramentas & Acessos ─────────────────────────────────────────

export interface AcessoFerramenta {
  ferramenta: string;
  categoria: FerramentaCategoria;
  custo?: string;
  status: "ativo" | "a_configurar" | "descontinuar";
  // funcaoId → nível de acesso
  acessos: Partial<Record<string, AcessoNivel>>;
}

export const agenciaAcessos: AcessoFerramenta[] = [
  {
    ferramenta: "Notion",
    categoria: "projeto",
    custo: "R$ 0 (gratuito)",
    status: "ativo",
    acessos: { estrategia: "admin", cs_ops: "editor", marketing: "editor", financeiro: "editor", produto: "admin" },
  },
  {
    ferramenta: "JACQES BI",
    categoria: "bi",
    custo: "R$ 0 (self-hosted)",
    status: "ativo",
    acessos: { estrategia: "admin", cs_ops: "viewer", marketing: "sem_acesso", financeiro: "viewer", produto: "admin" },
  },
  {
    ferramenta: "WhatsApp Business",
    categoria: "comunicacao",
    custo: "R$ 0",
    status: "ativo",
    acessos: { estrategia: "admin", cs_ops: "editor", marketing: "viewer", financeiro: "sem_acesso", produto: "sem_acesso" },
  },
  {
    ferramenta: "Meta Ads Manager",
    categoria: "marketing",
    custo: "variável (budget por conta)",
    status: "ativo",
    acessos: { estrategia: "admin", cs_ops: "viewer", marketing: "editor", financeiro: "sem_acesso", produto: "sem_acesso" },
  },
  {
    ferramenta: "Google Analytics",
    categoria: "marketing",
    custo: "R$ 0",
    status: "ativo",
    acessos: { estrategia: "viewer", cs_ops: "viewer", marketing: "editor", financeiro: "sem_acesso", produto: "admin" },
  },
  {
    ferramenta: "GitHub",
    categoria: "infra",
    custo: "R$ 0 (gratuito)",
    status: "ativo",
    acessos: { estrategia: "admin", cs_ops: "sem_acesso", marketing: "sem_acesso", financeiro: "sem_acesso", produto: "admin" },
  },
  {
    ferramenta: "Google Agenda",
    categoria: "comunicacao",
    custo: "R$ 0",
    status: "ativo",
    acessos: { estrategia: "admin", cs_ops: "editor", marketing: "viewer", financeiro: "viewer", produto: "viewer" },
  },
  {
    ferramenta: "Planilha Financeira",
    categoria: "financeiro",
    custo: "R$ 0",
    status: "a_configurar",
    acessos: { estrategia: "admin", cs_ops: "sem_acesso", marketing: "sem_acesso", financeiro: "editor", produto: "viewer" },
  },
  {
    ferramenta: "CRM (a definir)",
    categoria: "crm",
    custo: "a definir",
    status: "a_configurar",
    acessos: { estrategia: "admin", cs_ops: "editor", marketing: "editor", financeiro: "viewer", produto: "admin" },
  },
  {
    ferramenta: "Mailchimp / Email MKT",
    categoria: "marketing",
    custo: "R$ 0–R$ 150/mês (plano)",
    status: "ativo",
    acessos: { estrategia: "viewer", cs_ops: "sem_acesso", marketing: "admin", financeiro: "sem_acesso", produto: "sem_acesso" },
  },
];

// ─── Agência · Gestão de Contas por Função ───────────────────────────────────

export interface ContaGestao {
  contaId: string;
  nomeConta: string;
  funcoes: {
    funcaoId: string;
    responsavel: string;
    nivel: "primario" | "secundario" | "suporte";
  }[];
  proximasAcoes: {
    descricao: string;
    funcaoId: string;
    prazo: string;
    prioridade: "alta" | "media" | "baixa";
  }[];
}

export const agenciaContaGestao: ContaGestao[] = [
  {
    contaId: "1",
    nomeConta: "André Vieira",
    funcoes: [
      { funcaoId: "cs_ops",    responsavel: "Danilo",  nivel: "primario"   },
      { funcaoId: "marketing", responsavel: "a contratar", nivel: "primario" },
      { funcaoId: "estrategia",responsavel: "Miguel",  nivel: "secundario" },
    ],
    proximasAcoes: [
      { descricao: "Visita de QBR e revisão de resultados Q1",  funcaoId: "cs_ops",    prazo: "2026-04-05", prioridade: "alta"  },
      { descricao: "Otimizar CPL das campanhas Meta Ads",       funcaoId: "marketing", prazo: "2026-04-10", prioridade: "media" },
      { descricao: "Proposta de programa em grupo (leverage)",  funcaoId: "estrategia",prazo: "2026-04-20", prioridade: "media" },
    ],
  },
  {
    contaId: "2",
    nomeConta: "Luis Vieira",
    funcoes: [
      { funcaoId: "cs_ops",    responsavel: "Danilo",  nivel: "primario"   },
      { funcaoId: "marketing", responsavel: "a contratar", nivel: "secundario" },
      { funcaoId: "estrategia",responsavel: "Miguel",  nivel: "suporte"    },
    ],
    proximasAcoes: [
      { descricao: "Follow-up urgente — 9 dias sem contato",   funcaoId: "cs_ops",    prazo: "2026-03-23", prioridade: "alta"  },
      { descricao: "Reativação do Instagram — plano de conteúdo", funcaoId: "marketing", prazo: "2026-04-01", prioridade: "media" },
      { descricao: "Estruturar lead magnet (planilha diagnóstico)", funcaoId: "marketing", prazo: "2026-04-15", prioridade: "media" },
    ],
  },
  {
    contaId: "3",
    nomeConta: "Carol Bertolini",
    funcoes: [
      { funcaoId: "cs_ops",    responsavel: "Danilo",  nivel: "primario"   },
      { funcaoId: "marketing", responsavel: "a contratar", nivel: "secundario" },
      { funcaoId: "estrategia",responsavel: "Miguel",  nivel: "suporte"    },
    ],
    proximasAcoes: [
      { descricao: "Revisão de processos documentados Q1",     funcaoId: "cs_ops",    prazo: "2026-04-08", prioridade: "media" },
      { descricao: "Newsletter interna — primeiros 2 posts",   funcaoId: "marketing", prazo: "2026-04-12", prioridade: "baixa" },
    ],
  },
  {
    contaId: "4",
    nomeConta: "Tati Simões",
    funcoes: [
      { funcaoId: "cs_ops",    responsavel: "Danilo",  nivel: "primario"   },
      { funcaoId: "estrategia",responsavel: "Miguel",  nivel: "primario"   },
    ],
    proximasAcoes: [
      { descricao: "Reunião urgente de alinhamento de expectativas", funcaoId: "cs_ops",    prazo: "2026-03-25", prioridade: "alta" },
      { descricao: "Diagnóstico de posicionamento — entregável #1",  funcaoId: "marketing", prazo: "2026-04-15", prioridade: "alta" },
      { descricao: "Endereçar as 5 pendências abertas",             funcaoId: "cs_ops",    prazo: "2026-03-28", prioridade: "alta" },
      { descricao: "Decisão estratégica: continuar ou desengajar",  funcaoId: "estrategia",prazo: "2026-04-01", prioridade: "alta" },
    ],
  },
  {
    contaId: "5",
    nomeConta: "CEM",
    funcoes: [
      { funcaoId: "cs_ops",    responsavel: "Danilo",  nivel: "primario"   },
      { funcaoId: "marketing", responsavel: "a contratar", nivel: "primario" },
      { funcaoId: "estrategia",responsavel: "Miguel",  nivel: "suporte"    },
    ],
    proximasAcoes: [
      { descricao: "Reativar Google Ads com nova LP",           funcaoId: "marketing", prazo: "2026-04-10", prioridade: "alta"  },
      { descricao: "Webinar mensal aberto — primeiro piloto",   funcaoId: "marketing", prazo: "2026-04-25", prioridade: "media" },
      { descricao: "Check-in mensal e próximos entregáveis",    funcaoId: "cs_ops",    prazo: "2026-04-05", prioridade: "media" },
    ],
  },
];

// ─── AWQ Group — Plataforma Central ───────────────────────────────────────────
// Cada BU é uma plataforma dentro do AWQ Group.
// JACQES BU é a primeira ativa; as demais estão em construção.

export interface AWQBuCard {
  id: string;
  nome: string;
  tag: string;                  // ex: "CS & Ops", "Marketing", "Produção"
  descricao: string;
  status: "ativo" | "em_construcao" | "prospeccao" | "inativo";
  responsavel: string;
  mrr: number;                  // MRR atual (R$)
  mrrMeta: number;              // meta de MRR
  contas: number;               // contas/clientes ativos
  scoreCS: number | null;       // score CS (0–100) — null se não aplicável
  saude: "Saudável" | "Estável" | "Em Atenção" | "Em Construção" | null;
  href: string;                 // rota interna (ou "#" se não disponível)
  cor: string;                  // cor de destaque Tailwind (ex: "brand", "emerald")
  caixa?: number;               // posição de caixa da BU (R$)
}

// ─── M4E BU — Metodologia & Frameworks ───────────────────────────────────────
// M4E é o sistema de score e metodologia de CS operado como BU própria.
// Clientes: empresas que licenciam e implementam o Modelo M4E.

export interface M4EContaData {
  id: string;
  cliente: string;
  segmento: string;
  produto: "M4E Standard" | "M4E Enterprise" | "M4E Consultoria" | "Prospecção";
  fee: number;                // R$/mês
  status: "Ativo" | "Onboarding" | "Prospecção" | "Churned";
  saude: "Saudável" | "Estável" | "Em Atenção" | "Prospecção" | null;
  scoreM4E: number | null;    // score no modelo M4E (0–100)
  faseM4E: string | null;     // fase do modelo
  responsavel: string;
  inicioCiclo: string | null; // YYYY-MM-DD
  proximaRevisao: string | null;
  pendencias: number;
  oportunidade: "Sem Oportunidade" | "Leve" | "Média" | "Forte";
  observacoes: string;
}

export const m4eContasData: M4EContaData[] = [
  {
    id: "m4e-001",
    cliente: "TechFlow",
    segmento: "SaaS B2B",
    produto: "M4E Standard",
    fee: 2000,
    status: "Ativo",
    saude: "Estável",
    scoreM4E: 72,
    faseM4E: "Operador em Formação",
    responsavel: "Danilo",
    inicioCiclo: "2026-01-10",
    proximaRevisao: "2026-04-10",
    pendencias: 2,
    oportunidade: "Média",
    observacoes: "Score subindo desde jan/26. Boa adesão ao processo de visitas.",
  },
  {
    id: "m4e-002",
    cliente: "Prismo",
    segmento: "E-commerce",
    produto: "M4E Enterprise",
    fee: 3500,
    status: "Ativo",
    saude: "Saudável",
    scoreM4E: 81,
    faseM4E: "Bom",
    responsavel: "Danilo",
    inicioCiclo: "2025-11-01",
    proximaRevisao: "2026-04-01",
    pendencias: 1,
    oportunidade: "Forte",
    observacoes: "Cliente mais maduro. Candidato a caso de sucesso e expansão.",
  },
  {
    id: "m4e-003",
    cliente: "Vega Digital",
    segmento: "Agência",
    produto: "Prospecção",
    fee: 0,
    status: "Prospecção",
    saude: "Prospecção",
    scoreM4E: null,
    faseM4E: null,
    responsavel: "Miguel",
    inicioCiclo: null,
    proximaRevisao: "2026-03-30",
    pendencias: 3,
    oportunidade: "Forte",
    observacoes: "Em avaliação do M4E Enterprise. Proposta enviada em 15/03.",
  },
  {
    id: "m4e-004",
    cliente: "Orbis Labs",
    segmento: "Healthtech",
    produto: "M4E Consultoria",
    fee: 1800,
    status: "Onboarding",
    saude: "Em Atenção",
    scoreM4E: 58,
    faseM4E: "Abaixo da Linha",
    responsavel: "Danilo",
    inicioCiclo: "2026-02-15",
    proximaRevisao: "2026-03-31",
    pendencias: 4,
    oportunidade: "Leve",
    observacoes: "Onboarding lento. Dificuldade de adesão do time interno.",
  },
];

export interface M4EScoreMensal {
  mes: string;
  scoreProduto: number;       // documentação e evolução do modelo M4E (0–20)
  scorePipeline: number;      // vendas e prospecção ativa (0–20)
  scoreEntrega: number;       // qualidade das implementações (0–20)
  scoreClientes: number;      // satisfação e saúde da carteira (0–20)
  scoreOperacao: number;      // operação interna da BU (0–20)
  scoreTotal: number;
  status: string;
  fase: string;
  variavelPaga: boolean;
  clientesAtivos: number;
  churnMes: number;
  mrr: number;
  mrrMeta: number;
  principalAvanco: string;
  principalFalha: string;
  focoProximoMes: string;
}

export const m4eScoreMensal: M4EScoreMensal = {
  mes: "Março 2026",
  scoreProduto:   16,
  scorePipeline:  12,
  scoreEntrega:   15,
  scoreClientes:  14,
  scoreOperacao:  13,
  scoreTotal:     70,
  status:         "🟡 Amarelo",
  fase:           "Operador em Formação",
  variavelPaga:   false,
  clientesAtivos: 3,
  churnMes:       0,
  mrr:            7300,   // TechFlow 2k + Prismo 3.5k + Orbis 1.8k
  mrrMeta:        12000,
  principalAvanco:  "Prismo atingiu fase 'Bom' — primeiro caso de sucesso M4E",
  principalFalha:   "Orbis Labs com baixa adesão no onboarding — risco de churn",
  focoProximoMes:   "Fechar Vega Digital + elevar Orbis para 65+ pts",
};

export const m4eScoreDimensions = [
  { dimensao: "Produto",    score: 16, max: 20 },
  { dimensao: "Pipeline",   score: 12, max: 20 },
  { dimensao: "Entrega",    score: 15, max: 20 },
  { dimensao: "Clientes",   score: 14, max: 20 },
  { dimensao: "Operação",   score: 13, max: 20 },
];

export interface M4EMiniPLConta {
  cliente: string;
  fee: number;
  danilo: number;
  cogs: number;
  opex: number;
}

export const m4eMiniPLContas: M4EMiniPLConta[] = [
  { cliente: "TechFlow",  fee: 2000, danilo: 600,  cogs: 80,  opex: 120 },
  { cliente: "Prismo",    fee: 3500, danilo: 1050, cogs: 140, opex: 120 },
  { cliente: "Orbis Labs",fee: 1800, danilo: 540,  cogs: 72,  opex: 120 },
  { cliente: "Vega Digital",fee: 0,  danilo: 0,    cogs: 0,   opex: 0   },
];

export const awqBus: AWQBuCard[] = [
  {
    id: "jacqes",
    nome: "JACQES BU",
    tag: "CS & Operações",
    descricao: "Customer Success & Ops — carteira com 6 contas ativas. Score M4E, visitas, atendimento e financial.",
    status: "ativo",
    responsavel: "Danilo",
    mrr: 16521,
    mrrMeta: 20000,
    contas: 6,
    scoreCS: 69,
    saude: "Estável",
    href: "/",
    cor: "brand",
    caixa: 8000,
  },
  {
    id: "m4e",
    nome: "Media for Equity",
    tag: "M4E · AWQ Group",
    descricao: "Sistema de score e metodologia de CS — licenciamento, implementação e consultoria do Modelo M4E para empresas.",
    status: "ativo",
    responsavel: "Danilo",
    mrr: 7300,
    mrrMeta: 12000,
    contas: 3,
    scoreCS: 70,
    saude: "Estável",
    href: "/m4e",
    cor: "emerald",
  },
  {
    id: "agencia",
    nome: "AWQ Agência",
    tag: "Marketing Digital",
    descricao: "Agência de performance — tráfego pago, SEO, redes sociais e gestão de campanhas para clientes da carteira.",
    status: "em_construcao",
    responsavel: "A contratar",
    mrr: 0,
    mrrMeta: 15000,
    contas: 0,
    scoreCS: null,
    saude: "Em Construção",
    href: "#",
    cor: "purple",
  },
  {
    id: "produtora",
    nome: "AWQ Produtora",
    tag: "Produção de Conteúdo",
    descricao: "Produtora de conteúdo — vídeo, foto, copy e criação para marcas D2C e e-commerce da carteira AWQ.",
    status: "em_construcao",
    responsavel: "A contratar",
    mrr: 0,
    mrrMeta: 10000,
    contas: 0,
    scoreCS: null,
    saude: "Em Construção",
    href: "#",
    cor: "purple",
  },
  {
    id: "tech",
    nome: "AWQ Tech",
    tag: "Produto & Tecnologia",
    descricao: "Desenvolvimento de produtos digitais, automações e infraestrutura de dados para o grupo e clientes.",
    status: "em_construcao",
    responsavel: "Miguel",
    mrr: 0,
    mrrMeta: 20000,
    contas: 0,
    scoreCS: null,
    saude: "Em Construção",
    href: "#",
    cor: "blue",
  },
];

export const awqGroupMeta = {
  nome: "AWQ Group",
  tagline: "Plataforma Central",
  mrrTotal: awqBus.reduce((s, b) => s + b.mrr, 0),
  mrrMeta:  awqBus.reduce((s, b) => s + b.mrrMeta, 0),
  busAtivas: awqBus.filter((b) => b.status === "ativo").length,
  busTotal:  awqBus.length,
  contasTotal: awqBus.reduce((s, b) => s + b.contas, 0),
  mesReferencia: "Março 2026",
};
