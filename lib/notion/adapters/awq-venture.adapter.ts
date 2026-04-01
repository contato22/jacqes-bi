// ─── AWQ Venture — Field Name Adapter ────────────────────────────────────────
// Covers: portfolio view + consolidated financials.
// Portfolio companies (Enerdy, future) inherit this adapter for the portfolio
// database but may have their own adapters for domain-specific databases.

// ─── Portfolio Database Field Candidates ─────────────────────────────────────

export const AWQ_VENTURE_PORTFOLIO_FIELDS = {
  companyName:      ["Nome", "Company", "Empresa", "Portfolio Company", "Name"],
  companyKey:       ["Chave", "Key", "Slug", "ID Empresa"],
  sector:           ["Setor", "Sector", "Segmento", "Vertical"],
  investmentStage:  ["Estágio", "Stage", "Round", "Fase"],
  investmentDate:   ["Data do Investimento", "Investment Date", "Data Entry"],
  ownership:        ["Participação", "Ownership", "Equity %", "% Ownership"],
  currentValuation: ["Valuation Atual", "Current Valuation", "Valuation"],
  investedAmount:   ["Valor Investido", "Invested Amount", "Capital Investido"],
  status:           ["Status", "Situação", "Portfolio Status"],
  website:          ["Website", "URL", "Site"],
  description:      ["Descrição", "Description", "Sumário"],
} as const;

// ─── Financial Database Field Candidates ─────────────────────────────────────
// AWQ Venture consolidated financials (fund-level P&L, not company-level).

export const AWQ_VENTURE_FINANCIAL_FIELDS = {
  date:         ["Data", "Date", "Mês", "Month"],
  month:        ["Mês", "Month", "Período"],
  year:         ["Ano", "Year"],
  grossRevenue: ["Receita do Fundo", "Fund Revenue", "Gross Revenue", "Receita"],
  netRevenue:   ["Receita Líquida", "Net Revenue", "RL"],
  cogs:         ["Custos", "COGS", "Costs"],
  grossProfit:  ["Lucro Bruto", "Gross Profit"],
  opex:         ["Despesas do Fundo", "Fund OpEx", "OpEx"],
  ebitda:       ["EBITDA"],
  netIncome:    ["Resultado Líquido", "Net Income", "Lucro Líquido"],
  cashFlow:     ["Fluxo de Caixa", "Cash Flow"],
  status:       ["Status", "Tipo"],
} as const;

// ─── Enerdy — Financial Field Candidates ─────────────────────────────────────
// Base conectada: 26735d47dc9c81e7ba9af96e8d547dd4
//
// ⚠️  VERIFICAÇÃO PENDENTE:
// Os arrays abaixo cobrem os nomes mais comuns em PT/EN para cada campo.
// Para validar, abra a base no Notion e compare o nome exato de cada coluna
// com os candidatos listados aqui.
//
// Como verificar:
//   1. Abra https://www.notion.so/26735d47dc9c81e7ba9af96e8d547dd4
//   2. Para cada coluna, veja o nome exato (case-insensitive, mas espaços importam)
//   3. Se um nome não estiver nos candidatos, adicione-o como primeiro elemento
//      do array correspondente abaixo.
//
// Exemplo de adição:
//   date: ["Data da Fatura", "Data", "Date", "Mês", "Month", "Período"],
//                ↑ nome real da coluna vai na frente

export const ENERDY_FINANCIAL_FIELDS = {
  // ── Temporal ──────────────────────────────────────────────────────────────
  // Candidatos: nome da coluna de data/período da base
  date: [
    "Data", "Date", "Mês", "Month", "Período", "Period",
    "Data Referência", "Data de Referência", "Competência",
    "Data Faturamento", "Data da Fatura",
  ],
  month: [
    "Mês", "Month", "Período", "Period", "Competência",
    "Mês/Ano", "Mês de Referência",
  ],
  year: ["Ano", "Year", "Ano Referência"],

  // ── Receita ───────────────────────────────────────────────────────────────
  // Setor de energia: pode chamar "Faturamento", "Receita de Geração", etc.
  grossRevenue: [
    "Receita Bruta", "Gross Revenue", "Faturamento", "Receita Total",
    "Receita de Energia", "Energy Revenue", "Receita", "Revenue",
    "Receita Geração", "Receita de Geração", "RB",
    "Faturamento Bruto", "Total Receita",
  ],
  netRevenue: [
    "Receita Líquida", "Net Revenue", "RL",
    "Receita Líquida de Energia", "Receita (Líquida)",
    "Receita Ajustada", "Net Revenue (Energy)",
  ],

  // ── Custos ────────────────────────────────────────────────────────────────
  // Setor de energia: "Custo de Geração", "CMO", "Custo de Energia", etc.
  cogs: [
    "CMV", "COGS", "Custo de Geração", "Custo de Energia",
    "Custo da Energia", "Custo Variável", "Custos Diretos",
    "Custo de Compra", "Energia Comprada", "Costs",
    "Custo da Receita", "Cost of Revenue",
  ],

  // ── Resultado Bruto ───────────────────────────────────────────────────────
  grossProfit: [
    "Lucro Bruto", "Gross Profit", "Margem Bruta", "GP",
    "Resultado Bruto", "Margem de Contribuição",
  ],

  // ── Despesas Operacionais ─────────────────────────────────────────────────
  opex: [
    "Despesas Operacionais", "OpEx", "OPEX",
    "Despesas G&A", "Despesas Administrativas",
    "Despesas com Pessoal", "SG&A", "Operating Expenses",
    "Despesas", "Custos Operacionais",
  ],

  // ── EBITDA ────────────────────────────────────────────────────────────────
  ebitda: [
    "EBITDA", "Ebitda",
    "Resultado Operacional", "EBIT", "Resultado antes IR",
  ],

  // ── Lucro Líquido ─────────────────────────────────────────────────────────
  netIncome: [
    "Lucro Líquido", "Net Income", "Resultado Líquido", "LL",
    "Resultado do Período", "Resultado Final", "Lucro",
    "Net Profit", "Resultado",
  ],

  // ── Fluxo de Caixa ────────────────────────────────────────────────────────
  cashFlow: [
    "Fluxo de Caixa", "Cash Flow", "FC",
    "Caixa Gerado", "FCO", "Free Cash Flow",
    "Fluxo de Caixa Operacional",
  ],

  // ── Status / Tipo de Lançamento ───────────────────────────────────────────
  status: [
    "Status", "Tipo", "Type", "Classificação",
    "Realizado/Previsto", "Categoria", "Natureza",
  ],
} as const;

// ─── Enerdy — Unit Economics Field Candidates ─────────────────────────────────
// Setor de energia: métricas comuns incluem capacidade instalada (MW),
// energia gerada (MWh), custo/MWh, contratos ativos, etc.
//
// ⚠️  VERIFICAÇÃO PENDENTE: mesma orientação acima.

export const ENERDY_UNIT_ECONOMICS_FIELDS = {
  month: [
    "Mês", "Month", "Período", "Period", "Competência",
    "Data", "Mês Referência",
  ],
  year: ["Ano", "Year"],

  // ── Receita Recorrente ────────────────────────────────────────────────────
  mrr: [
    "MRR", "Receita Recorrente Mensal", "Receita Recorrente",
    "ARR Mensal", "Receita Contratada Mensal",
    "Recurring Revenue", "Monthly Recurring Revenue",
  ],
  arr: [
    "ARR", "Receita Recorrente Anual", "Receita Anual Contratada",
    "Annual Recurring Revenue",
  ],

  // ── Churn ─────────────────────────────────────────────────────────────────
  churnRate: [
    "Churn Rate", "Taxa de Churn", "% Churn",
    "Churn", "Taxa de Cancelamento", "Perda de Contratos",
  ],

  // ── LTV / CAC ─────────────────────────────────────────────────────────────
  ltv: [
    "LTV", "Lifetime Value", "Valor do Contrato",
    "Receita Total Esperada", "Valor Esperado do Cliente",
  ],
  cac: [
    "CAC", "Custo de Aquisição", "Custo de Aquisição de Cliente",
    "Customer Acquisition Cost", "Custo Comercial por Cliente",
  ],
  ltvCacRatio: [
    "LTV/CAC", "Ratio LTV/CAC", "LTV CAC", "Relação LTV CAC",
  ],

  // ── Payback ───────────────────────────────────────────────────────────────
  paybackMonths: [
    "Payback", "Payback (meses)", "Meses de Payback",
    "Tempo de Retorno", "Payback Period",
  ],

  // ── Retenção ──────────────────────────────────────────────────────────────
  nrr: [
    "NRR", "Net Revenue Retention", "Retenção de Receita",
    "Net Dollar Retention", "Expansão de Receita",
  ],

  // ── NPS ───────────────────────────────────────────────────────────────────
  nps: [
    "NPS", "Net Promoter Score", "Satisfação", "CSAT",
  ],
} as const;
