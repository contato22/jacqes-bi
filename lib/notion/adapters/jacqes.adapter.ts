// ─── JACQES BI — Field Name Adapter ──────────────────────────────────────────
// Maps canonical field names → the actual property names used in the JACQES
// Notion databases. When the Notion database renames a column, only this file
// needs to change — no normalizer or fetcher needs touching.

// ─── Financial Database Field Candidates ─────────────────────────────────────
// Each array lists accepted names in order of preference (first match wins).

export const JACQES_FINANCIAL_FIELDS = {
  date:         ["Data", "Date", "Mês", "Month"],
  month:        ["Mês", "Month", "Período", "Period"],
  year:         ["Ano", "Year"],
  grossRevenue: ["Receita Bruta", "Gross Revenue", "Revenue", "RB"],
  netRevenue:   ["Receita Líquida", "Net Revenue", "RL", "Receita"],
  cogs:         ["CMV", "COGS", "Custo da Receita", "Cost of Revenue"],
  grossProfit:  ["Lucro Bruto", "Gross Profit", "Margem Bruta"],
  opex:         ["Despesas Operacionais", "OpEx", "OPEX", "Despesas"],
  ebitda:       ["EBITDA", "Ebitda"],
  netIncome:    ["Lucro Líquido", "Net Income", "Resultado Líquido", "LL"],
  cashFlow:     ["Fluxo de Caixa", "Cash Flow", "FC"],
  status:       ["Status", "Tipo", "Type", "Classificação"],
} as const;

// ─── Customer Database Field Candidates ──────────────────────────────────────

export const JACQES_CUSTOMER_FIELDS = {
  clientName:       ["Nome", "Name", "Cliente", "Client Name", "Account"],
  company:          ["Empresa", "Company", "Organização", "Organization"],
  email:            ["Email", "E-mail"],
  plan:             ["Plano", "Plan", "Produto", "Product"],
  segment:          ["Segmento", "Segment", "Tipo de Cliente"],
  mrr:              ["MRR", "Receita Recorrente Mensal", "Recurring Revenue", "RR"],
  ltv:              ["LTV", "Lifetime Value"],
  cac:              ["CAC", "Custo de Aquisição"],
  payback:          ["Payback", "Payback (meses)"],
  churnRisk:        ["Risco de Churn", "Churn Risk", "Saúde"],
  status:           ["Status", "Situação"],
  country:          ["País", "Country"],
  lastActivityDate: ["Último Contato", "Last Activity", "Última Atividade"],
} as const;

// ─── Budget Database Field Candidates ────────────────────────────────────────

export const JACQES_BUDGET_FIELDS = {
  month:          ["Mês", "Month", "Período"],
  year:           ["Ano", "Year"],
  category:       ["Categoria", "Category", "Conta"],
  budgetAmount:   ["Orçado", "Budget", "Valor Orçado", "Previsto"],
  actualAmount:   ["Realizado", "Actual", "Valor Realizado"],
  variance:       ["Variação", "Variance", "Diferença"],
  variancePercent:["Variação %", "Variance %", "Delta %"],
  status:         ["Status", "Situação"],
} as const;
