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
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
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
  revenue: number;
  units: number;
  growth: number;
  status: "trending" | "stable" | "declining";
}

export interface CustomerRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  segment: "Enterprise" | "SMB" | "Startup";
  ltv: number;
  lastOrder: string;
  status: "active" | "at-risk" | "churned";
  country: string;
}

export interface RegionData {
  region: string;
  revenue: number;
  customers: number;
  growth: number;
}

export interface ChannelData {
  channel: string;
  sessions: number;
  conversions: number;
  revenue: number;
  cac: number;
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
}

// ─── KPIs — YTD Q1 2026 (source: AWQ Group) ──────────────────────────────────

export const kpis: KPI[] = [
  {
    id: "revenue",
    label: "Receita Líquida",
    value: 4_340_000,
    previousValue: 3_710_000,
    unit: "currency",
    icon: "DollarSign",
    color: "brand",
  },
  {
    id: "customers",
    label: "Clientes Ativos",
    value: 8,
    previousValue: 7,
    unit: "number",
    icon: "Users",
    color: "emerald",
  },
  {
    id: "mrr",
    label: "MRR",
    value: 2_323_000,
    previousValue: 2_050_000,
    unit: "currency",
    icon: "ShoppingCart",
    color: "blue",
  },
  {
    id: "margin",
    label: "Margem Bruta",
    value: 59.9,
    previousValue: 54.2,
    unit: "percent",
    suffix: "%",
    icon: "TrendingUp",
    color: "purple",
  },
];

// ─── Revenue Trend — Jan–Mar 2026 actual, Apr–Dec budget projection ───────────

export const revenueData: RevenueDataPoint[] = [
  // Actual Q1 2026 (source: AWQ DRE)
  { month: "Jan", revenue: 1_420_000, expenses: 567_400, profit: 852_600 },
  { month: "Feb", revenue: 1_512_000, expenses: 604_500, profit: 907_500 },
  { month: "Mar", revenue: 1_888_000, expenses: 754_600, profit: 1_133_400 },
  // Budget projections Q2–Q4 2026 (annual target R$15.6M)
  { month: "Abr", revenue: 1_080_000, expenses: 432_000, profit: 648_000 },
  { month: "Mai", revenue: 1_100_000, expenses: 440_000, profit: 660_000 },
  { month: "Jun", revenue: 1_160_000, expenses: 464_000, profit: 696_000 },
  { month: "Jul", revenue: 1_120_000, expenses: 448_000, profit: 672_000 },
  { month: "Ago", revenue: 1_180_000, expenses: 472_000, profit: 708_000 },
  { month: "Set", revenue: 1_220_000, expenses: 488_000, profit: 732_000 },
  { month: "Out", revenue: 1_260_000, expenses: 504_000, profit: 756_000 },
  { month: "Nov", revenue: 1_310_000, expenses: 524_000, profit: 786_000 },
  { month: "Dez", revenue: 1_360_000, expenses: 544_000, profit: 816_000 },
];

// ─── Customer Segments — by MRR share (source: AWQ customers) ─────────────────

export const customerSegments: CustomerSegment[] = [
  { name: "Bebidas & Alimentos", value: 30, color: "#f59e0b" },
  { name: "Tecnologia", value: 23, color: "#6366f1" },
  { name: "Beleza & Lifestyle", value: 22, color: "#ec4899" },
  { name: "Varejo", value: 15, color: "#22d3ee" },
  { name: "Finanças", value: 10, color: "#10b981" },
];

// ─── Top Services ─────────────────────────────────────────────────────────────

export const topProducts: TopProduct[] = [
  {
    id: "S001",
    name: "Retainer Mensal",
    category: "Recorrente",
    revenue: 2_506_000,
    units: 7,
    growth: 8.1,
    status: "trending",
  },
  {
    id: "S002",
    name: "Performance Marketing",
    category: "Recorrente",
    revenue: 1_205_000,
    units: 4,
    growth: 15.2,
    status: "trending",
  },
  {
    id: "S003",
    name: "Consultoria Estratégica",
    category: "Consultoria",
    revenue: 723_000,
    units: 3,
    growth: 22.5,
    status: "trending",
  },
  {
    id: "S004",
    name: "Projetos Spot",
    category: "Projeto",
    revenue: 386_000,
    units: 5,
    growth: -3.2,
    status: "declining",
  },
];

// ─── Customers — active portfolio (source: AWQ customers) ────────────────────

export const customers: CustomerRecord[] = [
  {
    id: "C001",
    name: "Ana Lima",
    company: "Ambev",
    email: "ana.lima@ambev.com.br",
    segment: "Enterprise",
    ltv: 5_040_000,
    lastOrder: "2026-03-28",
    status: "active",
    country: "BR",
  },
  {
    id: "C002",
    name: "Roberto Kim",
    company: "Samsung Brasil",
    email: "r.kim@samsung.com.br",
    segment: "Enterprise",
    ltv: 4_200_000,
    lastOrder: "2026-03-25",
    status: "active",
    country: "BR",
  },
  {
    id: "C003",
    name: "Carlos Souza",
    company: "Natura",
    email: "c.souza@natura.net",
    segment: "Enterprise",
    ltv: 2_480_000,
    lastOrder: "2026-03-20",
    status: "active",
    country: "BR",
  },
  {
    id: "C004",
    name: "Fernanda Araújo",
    company: "Nike Brasil",
    email: "f.araujo@nike.com.br",
    segment: "Enterprise",
    ltv: 2_340_000,
    lastOrder: "2026-03-22",
    status: "active",
    country: "BR",
  },
  {
    id: "C005",
    name: "Camila Santos",
    company: "Magazine Luiza",
    email: "c.santos@magazineluiza.com.br",
    segment: "Enterprise",
    ltv: 1_040_000,
    lastOrder: "2026-03-18",
    status: "active",
    country: "BR",
  },
  {
    id: "C006",
    name: "Mariana Costa",
    company: "iFood",
    email: "m.costa@ifood.com.br",
    segment: "Enterprise",
    ltv: 1_710_000,
    lastOrder: "2026-03-15",
    status: "active",
    country: "BR",
  },
  {
    id: "C007",
    name: "Pedro Mendes",
    company: "Banco XP",
    email: "p.mendes@xp.com.br",
    segment: "Enterprise",
    ltv: 1_380_000,
    lastOrder: "2026-01-10",
    status: "at-risk",
    country: "BR",
  },
  {
    id: "C008",
    name: "Juliana Ferreira",
    company: "Nubank",
    email: "j.ferreira@nubank.com.br",
    segment: "SMB",
    ltv: 700_000,
    lastOrder: "2026-03-12",
    status: "active",
    country: "BR",
  },
  {
    id: "C009",
    name: "Lucas Teixeira",
    company: "Arezzo",
    email: "l.teixeira@arezzo.com.br",
    segment: "SMB",
    ltv: 392_000,
    lastOrder: "2026-03-05",
    status: "active",
    country: "BR",
  },
  {
    id: "C010",
    name: "Rodrigo Neves",
    company: "Startup XYZ",
    email: "r.neves@startupxyz.com.br",
    segment: "Startup",
    ltv: 145_000,
    lastOrder: "2025-11-14",
    status: "churned",
    country: "BR",
  },
];

// ─── Industry Sectors — by Q1 2026 revenue (source: AWQ customers) ────────────

export const regionData: RegionData[] = [
  { region: "Bebidas & Alimentos", revenue: 2_115_000, customers: 2, growth: 18.5 },
  { region: "Tecnologia", revenue: 1_575_000, customers: 2, growth: 22.1 },
  { region: "Beleza & Lifestyle", revenue: 1_515_000, customers: 2, growth: 28.4 },
  { region: "Varejo", revenue: 1_074_000, customers: 2, growth: 12.3 },
  { region: "Finanças", revenue: 690_000, customers: 1, growth: -8.2 },
];

// ─── Acquisition Channels ─────────────────────────────────────────────────────

export const channelData: ChannelData[] = [
  { channel: "Indicações", sessions: 18, conversions: 4, revenue: 2_895_000, cac: 0 },
  { channel: "Outbound SDR", sessions: 86, conversions: 3, revenue: 2_325_000, cac: 48_000 },
  { channel: "Parcerias AWQ", sessions: 12, conversions: 2, revenue: 1_455_000, cac: 0 },
  { channel: "Eventos", sessions: 24, conversions: 1, revenue: 700_000, cac: 22_000 },
  { channel: "Inbound / SEO", sessions: 156, conversions: 1, revenue: 392_000, cac: 15_000 },
];

// ─── Alerts — active risk signals (source: AWQ risk engine) ──────────────────

export const alerts: Alert[] = [
  {
    id: "A1",
    type: "error",
    title: "Concentração de Clientes",
    message: "Top 3 clients = 58% of MRR. Ambev alone = 20%. Concentration risk is HIGH.",
    timestamp: "2026-03-28T09:00:00Z",
  },
  {
    id: "A2",
    type: "warning",
    title: "EBITDA Margin Gap",
    message: "EBITDA margin at 19.9%, below the 22% target. Gap: −2.1pp vs plan.",
    timestamp: "2026-03-28T08:30:00Z",
  },
  {
    id: "A3",
    type: "warning",
    title: "Banco XP — Em Risco",
    message: "NPS dropped to 42. Low engagement detected. Churn probability is HIGH.",
    timestamp: "2026-03-27T16:00:00Z",
  },
  {
    id: "A4",
    type: "info",
    title: "Samsung Brasil — Upsell Opportunity",
    message: "NPS at 91 (highest in portfolio). Strong expansion signal — review contract scope.",
    timestamp: "2026-03-26T10:00:00Z",
  },
];
