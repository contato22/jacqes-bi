// ─── Caza Vision — Field Name Adapter ────────────────────────────────────────
// Maps canonical field names → the actual property names used in the Caza
// Vision Notion databases. Maintained independently from JACQES adapter.

// ─── Financial Database Field Candidates ─────────────────────────────────────

export const CAZA_VISION_FINANCIAL_FIELDS = {
  date:         ["Data", "Date", "Mês", "Month", "Período"],
  month:        ["Mês", "Month", "Período", "Period"],
  year:         ["Ano", "Year"],
  grossRevenue: ["Receita Bruta", "Gross Revenue", "Revenue", "RB", "Faturamento"],
  netRevenue:   ["Receita Líquida", "Net Revenue", "RL", "Receita"],
  cogs:         ["CMV", "COGS", "Custo de Serviço", "Cost of Service"],
  grossProfit:  ["Lucro Bruto", "Gross Profit", "GP"],
  opex:         ["Despesas Operacionais", "OpEx", "OPEX", "Despesas G&A"],
  ebitda:       ["EBITDA", "Ebitda"],
  netIncome:    ["Lucro Líquido", "Net Income", "Resultado", "LL"],
  cashFlow:     ["Fluxo de Caixa", "Cash Flow", "FC", "Caixa"],
  status:       ["Status", "Tipo", "Classificação", "Type"],
} as const;

// ─── Customer Database Field Candidates ──────────────────────────────────────

export const CAZA_VISION_CUSTOMER_FIELDS = {
  clientName:       ["Nome", "Client Name", "Cliente", "Account", "Name"],
  company:          ["Empresa", "Company", "Incorporadora", "Construtora"],
  email:            ["Email", "E-mail", "Contato Email"],
  plan:             ["Produto", "Product", "Plano", "Tipo de Serviço"],
  segment:          ["Segmento", "Segment", "Tipo de Cliente", "Perfil"],
  mrr:              ["MRR", "Receita Mensal", "Monthly Revenue"],
  ltv:              ["LTV", "Lifetime Value", "Valor Total Contrato"],
  cac:              ["CAC", "Custo de Aquisição", "Acquisition Cost"],
  payback:          ["Payback", "Retorno (meses)"],
  churnRisk:        ["Risco de Churn", "Churn Risk", "Saúde do Cliente", "NPS"],
  status:           ["Status", "Situação", "Ativo"],
  country:          ["País", "Country", "Estado", "UF"],
  lastActivityDate: ["Último Contato", "Last Contact", "Data Última Interação"],
} as const;
