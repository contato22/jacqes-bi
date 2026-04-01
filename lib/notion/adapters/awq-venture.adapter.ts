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

// ─── Enerdy — Field Candidates (inherits for portfolio-level data) ───────────
// For Enerdy-specific databases (financial, unit economics), define overrides
// here as needed once the database is connected.

export const ENERDY_FINANCIAL_FIELDS = {
  ...AWQ_VENTURE_FINANCIAL_FIELDS,
  // Enerdy-specific overrides go here (add when DB is connected):
  // grossRevenue: ["Receita de Energia", "Energy Revenue", ...],
} as const;

export const ENERDY_UNIT_ECONOMICS_FIELDS = {
  month:          ["Mês", "Month", "Período"],
  year:           ["Ano", "Year"],
  mrr:            ["MRR", "ARR Mensal", "Receita Recorrente"],
  arr:            ["ARR", "Receita Recorrente Anual"],
  churnRate:      ["Churn Rate", "Taxa de Churn", "% Churn"],
  ltv:            ["LTV", "Lifetime Value"],
  cac:            ["CAC", "Custo de Aquisição"],
  ltvCacRatio:    ["LTV/CAC", "Ratio LTV/CAC"],
  paybackMonths:  ["Payback", "Payback (meses)", "Meses de Payback"],
  nrr:            ["NRR", "Net Revenue Retention", "Retenção de Receita"],
  nps:            ["NPS", "Net Promoter Score"],
} as const;
