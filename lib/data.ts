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

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const kpis: KPI[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: 4_821_500,
    previousValue: 4_205_800,
    unit: "currency",
    icon: "DollarSign",
    color: "brand",
  },
  {
    id: "customers",
    label: "Active Customers",
    value: 3_847,
    previousValue: 3_512,
    unit: "number",
    icon: "Users",
    color: "emerald",
  },
  {
    id: "orders",
    label: "Monthly Orders",
    value: 12_394,
    previousValue: 11_280,
    unit: "number",
    icon: "ShoppingCart",
    color: "blue",
  },
  {
    id: "margin",
    label: "Gross Margin",
    value: 67.4,
    previousValue: 63.1,
    unit: "percent",
    suffix: "%",
    icon: "TrendingUp",
    color: "purple",
  },
];

// ─── Revenue Trend ────────────────────────────────────────────────────────────

export const revenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 3_210_000, expenses: 1_120_000, profit: 2_090_000 },
  { month: "Feb", revenue: 3_480_000, expenses: 1_195_000, profit: 2_285_000 },
  { month: "Mar", revenue: 3_650_000, expenses: 1_240_000, profit: 2_410_000 },
  { month: "Apr", revenue: 3_520_000, expenses: 1_180_000, profit: 2_340_000 },
  { month: "May", revenue: 3_900_000, expenses: 1_310_000, profit: 2_590_000 },
  { month: "Jun", revenue: 4_120_000, expenses: 1_390_000, profit: 2_730_000 },
  { month: "Jul", revenue: 4_250_000, expenses: 1_420_000, profit: 2_830_000 },
  { month: "Aug", revenue: 4_380_000, expenses: 1_450_000, profit: 2_930_000 },
  { month: "Sep", revenue: 4_510_000, expenses: 1_500_000, profit: 3_010_000 },
  { month: "Oct", revenue: 4_620_000, expenses: 1_530_000, profit: 3_090_000 },
  { month: "Nov", revenue: 4_730_000, expenses: 1_560_000, profit: 3_170_000 },
  { month: "Dec", revenue: 4_821_500, expenses: 1_580_000, profit: 3_241_500 },
];

// ─── Customer Segments ────────────────────────────────────────────────────────

export const customerSegments: CustomerSegment[] = [
  { name: "Enterprise", value: 42, color: "#6366f1" },
  { name: "SMB", value: 31, color: "#22d3ee" },
  { name: "Startup", value: 18, color: "#f59e0b" },
  { name: "Individual", value: 9, color: "#ec4899" },
];

// ─── Top Products ─────────────────────────────────────────────────────────────

export const topProducts: TopProduct[] = [
  {
    id: "P001",
    name: "JACQES Platform Pro",
    category: "SaaS",
    revenue: 1_842_000,
    units: 412,
    growth: 18.4,
    status: "trending",
  },
  {
    id: "P002",
    name: "Analytics Suite",
    category: "SaaS",
    revenue: 1_120_500,
    units: 289,
    growth: 12.7,
    status: "trending",
  },
  {
    id: "P003",
    name: "Data Connector API",
    category: "API",
    revenue: 756_000,
    units: 1_840,
    growth: 9.2,
    status: "stable",
  },
  {
    id: "P004",
    name: "Enterprise Reporting",
    category: "Add-on",
    revenue: 580_000,
    units: 124,
    growth: -2.1,
    status: "declining",
  },
  {
    id: "P005",
    name: "Custom Dashboards",
    category: "Service",
    revenue: 523_000,
    units: 98,
    growth: 6.8,
    status: "stable",
  },
];

// ─── Customers ────────────────────────────────────────────────────────────────

export const customers: CustomerRecord[] = [
  {
    id: "C001",
    name: "Sarah Mitchell",
    company: "Nexus Corp",
    email: "s.mitchell@nexuscorp.com",
    segment: "Enterprise",
    ltv: 284_500,
    lastOrder: "2026-03-12",
    status: "active",
    country: "US",
  },
  {
    id: "C002",
    name: "James Okafor",
    company: "Zenith Digital",
    email: "james@zenithdigital.io",
    segment: "SMB",
    ltv: 94_200,
    lastOrder: "2026-03-10",
    status: "active",
    country: "UK",
  },
  {
    id: "C003",
    name: "Amara Patel",
    company: "Stellar Labs",
    email: "apatel@stellarlabs.co",
    segment: "Startup",
    ltv: 38_700,
    lastOrder: "2026-02-28",
    status: "at-risk",
    country: "CA",
  },
  {
    id: "C004",
    name: "Lena Hoffmann",
    company: "EuroVenture GmbH",
    email: "lhoffmann@euroventure.de",
    segment: "Enterprise",
    ltv: 312_000,
    lastOrder: "2026-03-15",
    status: "active",
    country: "DE",
  },
  {
    id: "C005",
    name: "Kwame Asante",
    company: "AfricaTech Hub",
    email: "kasante@africatechhub.com",
    segment: "SMB",
    ltv: 67_400,
    lastOrder: "2026-01-20",
    status: "at-risk",
    country: "GH",
  },
  {
    id: "C006",
    name: "Yuki Tanaka",
    company: "Shibuya Solutions",
    email: "y.tanaka@shibuya.jp",
    segment: "Enterprise",
    ltv: 198_000,
    lastOrder: "2026-03-14",
    status: "active",
    country: "JP",
  },
  {
    id: "C007",
    name: "Diego Ramirez",
    company: "LatamScale",
    email: "diego@latamscale.mx",
    segment: "Startup",
    ltv: 22_100,
    lastOrder: "2025-11-30",
    status: "churned",
    country: "MX",
  },
  {
    id: "C008",
    name: "Nina Volkov",
    company: "Baltic Systems",
    email: "nvolkov@balticsys.ee",
    segment: "SMB",
    ltv: 81_500,
    lastOrder: "2026-03-08",
    status: "active",
    country: "EE",
  },
];

// ─── Regional Performance ─────────────────────────────────────────────────────

export const regionData: RegionData[] = [
  { region: "North America", revenue: 1_928_600, customers: 1_542, growth: 14.2 },
  { region: "Europe", revenue: 1_445_000, customers: 1_089, growth: 11.8 },
  { region: "Asia Pacific", revenue: 896_500, customers: 712, growth: 22.5 },
  { region: "Middle East & Africa", revenue: 337_200, customers: 284, growth: 31.0 },
  { region: "Latin America", revenue: 214_200, customers: 220, growth: 8.4 },
];

// ─── Acquisition Channels ─────────────────────────────────────────────────────

export const channelData: ChannelData[] = [
  { channel: "Organic Search", sessions: 48_200, conversions: 1_204, revenue: 1_420_000, cac: 0 },
  { channel: "Paid Search", sessions: 22_400, conversions: 672, revenue: 890_000, cac: 180 },
  { channel: "Direct", sessions: 18_900, conversions: 511, revenue: 760_000, cac: 0 },
  { channel: "Referral", sessions: 12_500, conversions: 375, revenue: 640_000, cac: 45 },
  { channel: "Social Media", sessions: 31_000, conversions: 496, revenue: 580_000, cac: 95 },
  { channel: "Email", sessions: 14_700, conversions: 588, revenue: 531_500, cac: 12 },
];

// ─── AWQ Business Units ───────────────────────────────────────────────────────

export interface BusinessUnit {
  id: string;
  name: string;
  description: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  growth: number;
  employees: number;
  status: "ahead" | "on-track" | "at-risk";
  color: string;
}

export interface AWQMonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  jacqes: number;
  ventures: number;
  capital: number;
  labs: number;
}

export const awqBusinessUnits: BusinessUnit[] = [
  {
    id: "BU001",
    name: "JACQES",
    description: "BI & Analytics Platform",
    revenue: 4_821_500,
    expenses: 1_580_000,
    profit: 3_241_500,
    margin: 67.2,
    growth: 14.6,
    employees: 84,
    status: "ahead",
    color: "#6366f1",
  },
  {
    id: "BU002",
    name: "AWQ Ventures",
    description: "Investment & Portfolio",
    revenue: 3_420_000,
    expenses: 1_240_000,
    profit: 2_180_000,
    margin: 63.7,
    growth: 22.3,
    employees: 32,
    status: "ahead",
    color: "#C9A84C",
  },
  {
    id: "BU003",
    name: "AWQ Capital",
    description: "Financial Services",
    revenue: 2_180_000,
    expenses: 980_000,
    profit: 1_200_000,
    margin: 55.0,
    growth: 8.9,
    employees: 47,
    status: "on-track",
    color: "#22d3ee",
  },
  {
    id: "BU004",
    name: "AWQ Labs",
    description: "R&D & Innovation",
    revenue: 1_240_000,
    expenses: 920_000,
    profit: 320_000,
    margin: 25.8,
    growth: 31.4,
    employees: 28,
    status: "on-track",
    color: "#34d399",
  },
];

export const awqConsolidatedRevenue: AWQMonthlyData[] = [
  { month: "Jan", revenue: 8_360_000, expenses: 3_540_000, profit: 4_820_000, jacqes: 3_210_000, ventures: 2_480_000, capital: 1_620_000, labs: 1_050_000 },
  { month: "Feb", revenue: 8_970_000, expenses: 3_780_000, profit: 5_190_000, jacqes: 3_480_000, ventures: 2_650_000, capital: 1_740_000, labs: 1_100_000 },
  { month: "Mar", revenue: 9_290_000, expenses: 3_920_000, profit: 5_370_000, jacqes: 3_650_000, ventures: 2_740_000, capital: 1_790_000, labs: 1_110_000 },
  { month: "Apr", revenue: 9_060_000, expenses: 3_820_000, profit: 5_240_000, jacqes: 3_520_000, ventures: 2_680_000, capital: 1_750_000, labs: 1_110_000 },
  { month: "May", revenue: 9_830_000, expenses: 4_080_000, profit: 5_750_000, jacqes: 3_900_000, ventures: 2_890_000, capital: 1_920_000, labs: 1_120_000 },
  { month: "Jun", revenue: 10_340_000, expenses: 4_280_000, profit: 6_060_000, jacqes: 4_120_000, ventures: 3_020_000, capital: 2_060_000, labs: 1_140_000 },
  { month: "Jul", revenue: 10_620_000, expenses: 4_380_000, profit: 6_240_000, jacqes: 4_250_000, ventures: 3_080_000, capital: 2_120_000, labs: 1_170_000 },
  { month: "Aug", revenue: 10_970_000, expenses: 4_480_000, profit: 6_490_000, jacqes: 4_380_000, ventures: 3_180_000, capital: 2_190_000, labs: 1_220_000 },
  { month: "Sep", revenue: 11_260_000, expenses: 4_580_000, profit: 6_680_000, jacqes: 4_510_000, ventures: 3_240_000, capital: 2_270_000, labs: 1_240_000 },
  { month: "Oct", revenue: 11_510_000, expenses: 4_660_000, profit: 6_850_000, jacqes: 4_620_000, ventures: 3_310_000, capital: 2_340_000, labs: 1_240_000 },
  { month: "Nov", revenue: 11_740_000, expenses: 4_730_000, profit: 7_010_000, jacqes: 4_730_000, ventures: 3_360_000, capital: 2_410_000, labs: 1_240_000 },
  { month: "Dec", revenue: 11_661_500, expenses: 4_720_000, profit: 6_941_500, jacqes: 4_821_500, ventures: 3_420_000, capital: 2_180_000, labs: 1_240_000 },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const alerts: Alert[] = [
  {
    id: "A1",
    type: "warning",
    title: "At-Risk Customers",
    message: "12 enterprise customers have not placed an order in 45+ days.",
    timestamp: "2026-03-18T09:15:00Z",
  },
  {
    id: "A2",
    type: "success",
    title: "Revenue Milestone",
    message: "Q1 2026 revenue exceeded target by 8.3% — $4.82M vs $4.45M goal.",
    timestamp: "2026-03-18T08:00:00Z",
  },
  {
    id: "A3",
    type: "info",
    title: "APAC Growth Surge",
    message: "Asia Pacific region showing 22.5% YoY growth — consider capacity planning.",
    timestamp: "2026-03-17T16:30:00Z",
  },
  {
    id: "A4",
    type: "error",
    title: "Analytics Suite Churn Signal",
    message: "NPS for Analytics Suite dropped to 32 this month from 48 last month.",
    timestamp: "2026-03-17T11:00:00Z",
  },
];
