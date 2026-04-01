// ─── Types ────────────────────────────────────────────────────────────────────

export interface KPI {
  id: string;
  label: string;
  value: number;
  /**
   * Provided only when a real comparison value exists in AWQ.
   * Revenue/Margin use the Q1 budget target as comparison.
   * MRR uses the previous month (derived from net new MRR decomposition).
   */
  previousValue?: number;
  unit: "currency" | "number" | "percent";
  prefix?: string;
  suffix?: string;
  icon: string;
  color: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;   // Receita Bruta mensal
  expenses: number;  // CMV mensal (proporcional ao total Q1 do DRE)
  profit: number;    // Lucro Bruto mensal (proporcional ao total Q1 do DRE)
}

export interface CustomerSegment {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  margin: number;   // Margem bruta % por tipo de serviço (fonte: AWQ unit economics)
  status: "trending" | "stable" | "declining";
}

export interface CustomerRecord {
  id: string;
  name: string;     // Empresa cliente (B2B)
  company: string;  // Setor de atuação
  segment: "Enterprise" | "SMB" | "Startup";
  ltv: number;      // LTV (fonte: AWQ customers)
  mrr: number;      // MRR atual (fonte: AWQ customers)
  nps: number;      // NPS score (fonte: AWQ customers)
  status: "active" | "at-risk" | "churned";
  country: string;
}

export interface RegionData {
  region: string;
  revenue: number;   // MRR × 3 (Q1 2026), derivado dos dados reais de clientes
  customers: number; // número de clientes no setor
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
}

// ─── KPIs — YTD Q1 2026 (fonte: AWQ Group) ────────────────────────────────────
// previousValue: receita/margem comparam com orçamento Q1; MRR compara com mês anterior.

export const kpis: KPI[] = [
  {
    // Receita Líquida real YTD (DRE AWQ). Orçamento Q1 = 4.340.000 / 1.031 ≈ 4.210.000
    id: "revenue",
    label: "Receita Líquida YTD",
    value: 4_340_000,
    previousValue: 4_210_000,
    unit: "currency",
    icon: "DollarSign",
    color: "brand",
  },
  {
    // Clientes ativos (fonte: AWQ customers). Sem dado comparativo disponível.
    id: "customers",
    label: "Clientes Ativos",
    value: 8,
    unit: "number",
    icon: "Users",
    color: "emerald",
  },
  {
    // MRR março 2026 (fonte: AWQ unit economics). Net new MRR março = R$213K → mês anterior = 2.143K − 213K
    id: "mrr",
    label: "MRR (Mar 2026)",
    value: 2_143_000,
    previousValue: 1_930_000,
    unit: "currency",
    icon: "ShoppingCart",
    color: "blue",
  },
  {
    // Margem bruta real YTD (DRE AWQ). Orçamento anual = 64.0% (R$9.984M / R$15.6M)
    id: "margin",
    label: "Margem Bruta",
    value: 59.9,
    previousValue: 64.0,
    unit: "percent",
    suffix: "%",
    icon: "TrendingUp",
    color: "purple",
  },
];

// ─── Revenue — Jan–Mar 2026 apenas (dados reais AWQ) ─────────────────────────
// Receita bruta mensal: AWQ financial page.
// Expenses (CMV) e profit (Lucro Bruto) são calculados proporcionalmente
// com base nos totais Q1 reais do DRE:
//   CMV Q1 total = R$4.340.000 − R$2.600.000 = R$1.740.000
//   Lucro Bruto Q1 total = R$2.600.000 (margem 59,9% s/ receita líquida)
// Proporção de cada mês: receita bruta mensal / receita bruta Q1 (R$4.820.000)

export const revenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 1_420_000, expenses: 513_000, profit:  766_000 },
  { month: "Fev", revenue: 1_512_000, expenses: 546_000, profit:  816_000 },
  { month: "Mar", revenue: 1_888_000, expenses: 681_000, profit: 1_018_000 },
];

// ─── MRR por Setor — distribuição % sobre MRR total (fonte: AWQ customers) ───
// Cálculo: MRR por setor / MRR total × 100, arredondado para somar 100%
// MRR total ativo: Ambev 420 + iFood 285 + Samsung 350 + Nubank 175 + Magalu 260
//                + Arezzo 98 + Natura 310 + Nike 195 + Banco XP 230 = R$2.323K

export const customerSegments: CustomerSegment[] = [
  { name: "Bebidas & Alimentos", value: 30, color: "#f59e0b" },  // Ambev+iFood = 705K = 30,3%
  { name: "Tecnologia",          value: 23, color: "#6366f1" },  // Samsung+Nubank = 525K = 22,6%
  { name: "Beleza & Lifestyle",  value: 22, color: "#ec4899" },  // Natura+Nike = 505K = 21,7%
  { name: "Varejo",              value: 15, color: "#22d3ee" },  // Magalu+Arezzo = 358K = 15,4%
  { name: "Finanças",            value: 10, color: "#10b981" },  // Banco XP = 230K = 9,9%
];

// ─── Top Services — margens reais por tipo de serviço (fonte: AWQ unit economics) ─

export const topProducts: TopProduct[] = [
  { id: "S001", name: "Consultoria Estratégica", category: "Consultoria", margin: 81, status: "trending" },
  { id: "S002", name: "Retainer Mensal",         category: "Recorrente",  margin: 72, status: "stable"   },
  { id: "S003", name: "Performance Marketing",   category: "Recorrente",  margin: 65, status: "stable"   },
  { id: "S004", name: "Projetos Spot",           category: "Projeto",     margin: 58, status: "declining" },
];

// ─── Clientes — portfólio ativo (fonte: AWQ customers) ───────────────────────

export const customers: CustomerRecord[] = [
  { id: "C01", name: "Ambev",          company: "Bebidas & FMCG",      segment: "Enterprise", ltv: 5_040_000, mrr: 420_000, nps: 82, status: "active",   country: "BR" },
  { id: "C02", name: "Samsung Brasil", company: "Tecnologia",          segment: "Enterprise", ltv: 4_200_000, mrr: 350_000, nps: 91, status: "active",   country: "BR" },
  { id: "C03", name: "Natura",         company: "Beleza & Sustentab.", segment: "Enterprise", ltv: 2_480_000, mrr: 310_000, nps: 78, status: "active",   country: "BR" },
  { id: "C04", name: "Nike Brasil",    company: "Esporte & Lifestyle", segment: "Enterprise", ltv: 2_340_000, mrr: 195_000, nps: 88, status: "active",   country: "BR" },
  { id: "C05", name: "iFood",          company: "Food & Tech",         segment: "Enterprise", ltv: 1_710_000, mrr: 285_000, nps: 65, status: "active",   country: "BR" },
  { id: "C06", name: "Banco XP",       company: "Finanças",            segment: "Enterprise", ltv: 1_380_000, mrr: 230_000, nps: 42, status: "at-risk",  country: "BR" },
  { id: "C07", name: "Nubank",         company: "Fintech",             segment: "SMB",        ltv:   700_000, mrr: 175_000, nps: 74, status: "active",   country: "BR" },
  { id: "C08", name: "Magazine Luiza", company: "Varejo",              segment: "Enterprise", ltv: 1_040_000, mrr: 260_000, nps: 61, status: "active",   country: "BR" },
  { id: "C09", name: "Arezzo",         company: "Moda & Varejo",       segment: "SMB",        ltv:   392_000, mrr:  98_000, nps: 79, status: "active",   country: "BR" },
  { id: "C10", name: "Startup XYZ",    company: "Tecnologia",          segment: "Startup",    ltv:   145_000, mrr:       0, nps: 31, status: "churned",  country: "BR" },
];

// ─── Receita por Setor — MRR × 3 meses (Q1 2026), derivado dos dados de clientes AWQ ─

export const regionData: RegionData[] = [
  { region: "Bebidas & Alimentos", revenue: 2_115_000, customers: 2 }, // (420+285) × 3
  { region: "Tecnologia",          revenue: 1_575_000, customers: 2 }, // (350+175) × 3
  { region: "Beleza & Lifestyle",  revenue: 1_515_000, customers: 2 }, // (310+195) × 3
  { region: "Varejo",              revenue: 1_074_000, customers: 2 }, // (260+98)  × 3
  { region: "Finanças",            revenue:   690_000, customers: 1 }, // (230)     × 3
];

// ─── Alertas — sinais de risco ativos (fonte: AWQ risk engine) ───────────────

export const alerts: Alert[] = [
  {
    id: "A1",
    type: "error",
    title: "Concentração de Clientes — ALTA",
    message: "Top 3 clientes = 58% do MRR. Ambev isolado = 20%. Risco de concentração elevado.",
    timestamp: "2026-03-28T09:00:00Z",
  },
  {
    id: "A2",
    type: "warning",
    title: "Gap de Margem EBITDA",
    message: "Margem EBITDA em 19,9% (real) vs 22% (meta). Gap de −2,1pp abaixo do plano.",
    timestamp: "2026-03-28T08:30:00Z",
  },
  {
    id: "A3",
    type: "warning",
    title: "Banco XP — Em Risco",
    message: "NPS caiu para 42. Baixo engajamento detectado. Probabilidade de churn é ALTA.",
    timestamp: "2026-03-27T16:00:00Z",
  },
  {
    id: "A4",
    type: "info",
    title: "Samsung Brasil — Oportunidade de Upsell",
    message: "NPS em 91 — maior da carteira. Sinal forte para expansão de contrato.",
    timestamp: "2026-03-26T10:00:00Z",
  },
];
