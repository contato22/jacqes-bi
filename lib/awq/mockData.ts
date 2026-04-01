/**
 * AWQ GROUP — CENTRAL MOCK DATA STORE
 *
 * SINGLE SOURCE OF TRUTH: All entities live here, scoped by business_unit_id.
 * BU selectors filter from this store. Holding selectors aggregate across it.
 * NO BU PAGE may import this file directly — use selectors only.
 */

import type {
  AWQDataStore,
  BusinessUnitEntity,
  CustomerEntity,
  ContractEntity,
  ProjectEntity,
  RevenueTransactionEntity,
  ExpenseTransactionEntity,
  ReceivableEntity,
  PayableEntity,
  BudgetEntity,
  ForecastEntity,
  AllocationEntity,
  KPISnapshotEntity,
  CapitalAllocationEntity,
  AuditLogEntity,
} from "./schema";

const NOW = "2026-04-01T00:00:00Z";
const AUDIT = { created_at: NOW, updated_at: NOW, created_by: "system", updated_by: "system" };
const GOV_INTERNAL = { classification_status: "internal" as const, visibility_scope: "bu" as const, source_system: "mock" };
const GOV_HOLDING = { classification_status: "confidential" as const, visibility_scope: "holding" as const, source_system: "mock" };

// ─── business_units ───────────────────────────────────────────────────────────

const business_units: BusinessUnitEntity[] = [
  { id: "jacqes", name: "JACQES", sector: "SaaS / BI", status: "active", established_at: "2022-01-01", headquarters: "São Paulo, BR", employees: 142, ...AUDIT },
  { id: "caza-vision", name: "Caza Vision", sector: "PropTech / Vision AI", status: "active", established_at: "2021-06-01", headquarters: "Lisboa, PT", employees: 67, ...AUDIT },
  { id: "advisor", name: "Advisor", sector: "Financial Advisory", status: "active", established_at: "2020-03-15", headquarters: "Dubai, UAE", employees: 45, ...AUDIT },
  { id: "awq-venture", name: "AWQ Venture", sector: "Venture Capital", status: "active", established_at: "2019-11-01", headquarters: "London, UK", employees: 31, ...AUDIT },
];

// ─── customers ────────────────────────────────────────────────────────────────

const customers: CustomerEntity[] = [
  // JACQES customers
  { id: "J-C001", business_unit_id: "jacqes", name: "Sarah Mitchell", company: "Nexus Corp", email: "s.mitchell@nexuscorp.com", segment: "Enterprise", ltv: 284_500, last_order: "2026-03-12", status: "active", country: "US", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C002", business_unit_id: "jacqes", name: "James Okafor", company: "Zenith Digital", email: "james@zenithdigital.io", segment: "SMB", ltv: 94_200, last_order: "2026-03-10", status: "active", country: "UK", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C003", business_unit_id: "jacqes", name: "Amara Patel", company: "Stellar Labs", email: "apatel@stellarlabs.co", segment: "Startup", ltv: 38_700, last_order: "2026-02-28", status: "at-risk", country: "CA", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C004", business_unit_id: "jacqes", name: "Lena Hoffmann", company: "EuroVenture GmbH", email: "lhoffmann@euroventure.de", segment: "Enterprise", ltv: 312_000, last_order: "2026-03-15", status: "active", country: "DE", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C005", business_unit_id: "jacqes", name: "Kwame Asante", company: "AfricaTech Hub", email: "kasante@africatechhub.com", segment: "SMB", ltv: 67_400, last_order: "2026-01-20", status: "at-risk", country: "GH", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C006", business_unit_id: "jacqes", name: "Yuki Tanaka", company: "Shibuya Solutions", email: "y.tanaka@shibuya.jp", segment: "Enterprise", ltv: 198_000, last_order: "2026-03-14", status: "active", country: "JP", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C007", business_unit_id: "jacqes", name: "Diego Ramirez", company: "LatamScale", email: "diego@latamscale.mx", segment: "Startup", ltv: 22_100, last_order: "2025-11-30", status: "churned", country: "MX", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-C008", business_unit_id: "jacqes", name: "Nina Volkov", company: "Baltic Systems", email: "nvolkov@balticsys.ee", segment: "SMB", ltv: 81_500, last_order: "2026-03-08", status: "active", country: "EE", ...AUDIT, ...GOV_INTERNAL },
  // Caza Vision customers
  { id: "CV-C001", business_unit_id: "caza-vision", name: "Rui Fonseca", company: "Grupo Imóveis SA", email: "rfonseca@grupoimoveis.pt", segment: "Enterprise", ltv: 145_000, last_order: "2026-03-10", status: "active", country: "PT", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-C002", business_unit_id: "caza-vision", name: "Ana Costa", company: "SmartBuild Lda", email: "acosta@smartbuild.pt", segment: "SMB", ltv: 52_000, last_order: "2026-02-20", status: "active", country: "PT", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-C003", business_unit_id: "caza-vision", name: "Hassan Al-Farsi", company: "Gulf Properties", email: "hassan@gulfprop.ae", segment: "Enterprise", ltv: 210_000, last_order: "2026-03-05", status: "active", country: "AE", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-C004", business_unit_id: "caza-vision", name: "Mia Bergstrom", company: "Nordic Realty", email: "mia@nordicrealty.se", segment: "SMB", ltv: 38_500, last_order: "2026-01-15", status: "at-risk", country: "SE", ...AUDIT, ...GOV_INTERNAL },
  // Advisor customers
  { id: "AD-C001", business_unit_id: "advisor", name: "Omar Al-Rashid", company: "Rashid Family Office", email: "omar@rashidfo.ae", segment: "Enterprise", ltv: 890_000, last_order: "2026-03-18", status: "active", country: "AE", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-C002", business_unit_id: "advisor", name: "Isabella Ferrari", company: "Ferrari Capital", email: "iferrari@ferraricap.it", segment: "Enterprise", ltv: 640_000, last_order: "2026-03-12", status: "active", country: "IT", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-C003", business_unit_id: "advisor", name: "David Chen", company: "Chen Wealth Mgmt", email: "dchen@chenwm.hk", segment: "Enterprise", ltv: 720_000, last_order: "2026-02-28", status: "active", country: "HK", ...AUDIT, ...GOV_INTERNAL },
  // AWQ Venture portfolio companies (as "customers")
  { id: "AV-C001", business_unit_id: "awq-venture", name: "Founders – TechPulse", company: "TechPulse Inc.", email: "founders@techpulse.io", segment: "Startup", ltv: 2_400_000, last_order: "2026-03-01", status: "active", country: "US", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-C002", business_unit_id: "awq-venture", name: "Founders – GreenLoop", company: "GreenLoop GmbH", email: "founders@greenloop.de", segment: "Startup", ltv: 1_800_000, last_order: "2026-02-15", status: "active", country: "DE", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-C003", business_unit_id: "awq-venture", name: "Founders – NovaMed", company: "NovaMed SA", email: "founders@novamed.br", segment: "Startup", ltv: 950_000, last_order: "2026-01-20", status: "at-risk", country: "BR", ...AUDIT, ...GOV_INTERNAL },
];

// ─── revenue_transactions (12 months per BU) ─────────────────────────────────

function makeRevenue(buId: CustomerEntity["business_unit_id"], months: number[], cats: string[]): RevenueTransactionEntity[] {
  return months.map((amount, i) => ({
    id: `${buId}-REV-${String(i + 1).padStart(2, "0")}`,
    business_unit_id: buId,
    period: `2026-${String(i + 1).padStart(2, "0")}`,
    amount,
    category: cats[i % cats.length] as RevenueTransactionEntity["category"],
    ...AUDIT,
    ...GOV_HOLDING,
  }));
}

const revenue_transactions: RevenueTransactionEntity[] = [
  ...makeRevenue("jacqes", [3_210_000, 3_480_000, 3_650_000, 3_520_000, 3_900_000, 4_120_000, 4_250_000, 4_380_000, 4_510_000, 4_620_000, 4_730_000, 4_821_500], ["saas", "api", "saas", "saas", "saas", "saas", "saas", "api", "saas", "saas", "saas", "saas"]),
  ...makeRevenue("caza-vision", [820_000, 870_000, 910_000, 880_000, 950_000, 1_010_000, 1_050_000, 1_080_000, 1_120_000, 1_150_000, 1_090_000, 1_130_000], ["services", "saas", "services", "saas", "services", "saas", "services", "saas", "services", "saas", "services", "saas"]),
  ...makeRevenue("advisor", [220_000, 240_000, 310_000, 280_000, 320_000, 340_000, 290_000, 360_000, 380_000, 400_000, 390_000, 420_000], ["consulting", "consulting", "consulting", "consulting", "consulting", "consulting", "consulting", "consulting", "consulting", "consulting", "consulting", "consulting"]),
  ...makeRevenue("awq-venture", [780_000, 820_000, 1_100_000, 950_000, 1_020_000, 1_280_000, 1_050_000, 1_180_000, 1_310_000, 1_420_000, 1_190_000, 1_500_000], ["investment", "investment", "investment", "investment", "investment", "investment", "investment", "investment", "investment", "investment", "investment", "investment"]),
];

// ─── expense_transactions ─────────────────────────────────────────────────────

function makeExpense(buId: CustomerEntity["business_unit_id"], months: number[]): ExpenseTransactionEntity[] {
  return months.map((amount, i) => ({
    id: `${buId}-EXP-${String(i + 1).padStart(2, "0")}`,
    business_unit_id: buId,
    period: `2026-${String(i + 1).padStart(2, "0")}`,
    amount,
    category: (["payroll", "infrastructure", "marketing", "ops"] as const)[i % 4],
    ...AUDIT,
    ...GOV_HOLDING,
  }));
}

const expense_transactions: ExpenseTransactionEntity[] = [
  ...makeExpense("jacqes", [1_120_000, 1_195_000, 1_240_000, 1_180_000, 1_310_000, 1_390_000, 1_420_000, 1_450_000, 1_500_000, 1_530_000, 1_560_000, 1_580_000]),
  ...makeExpense("caza-vision", [410_000, 420_000, 440_000, 430_000, 460_000, 480_000, 490_000, 500_000, 510_000, 520_000, 505_000, 515_000]),
  ...makeExpense("advisor", [90_000, 92_000, 95_000, 90_000, 98_000, 100_000, 94_000, 105_000, 108_000, 110_000, 107_000, 112_000]),
  ...makeExpense("awq-venture", [120_000, 125_000, 130_000, 128_000, 135_000, 140_000, 132_000, 145_000, 148_000, 152_000, 149_000, 155_000]),
];

// ─── receivables ──────────────────────────────────────────────────────────────

const receivables: ReceivableEntity[] = [
  { id: "J-REC-001", business_unit_id: "jacqes", customer_id: "J-C001", amount: 48_000, due_date: "2026-04-15", status: "pending", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-REC-002", business_unit_id: "jacqes", customer_id: "J-C004", amount: 76_000, due_date: "2026-03-31", status: "overdue", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-REC-003", business_unit_id: "jacqes", customer_id: "J-C006", amount: 32_000, due_date: "2026-04-30", status: "pending", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-REC-001", business_unit_id: "caza-vision", customer_id: "CV-C001", amount: 35_000, due_date: "2026-04-10", status: "pending", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-REC-002", business_unit_id: "caza-vision", customer_id: "CV-C003", amount: 62_000, due_date: "2026-04-05", status: "overdue", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-REC-001", business_unit_id: "advisor", customer_id: "AD-C001", amount: 180_000, due_date: "2026-04-20", status: "pending", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-REC-001", business_unit_id: "awq-venture", customer_id: "AV-C001", amount: 250_000, due_date: "2026-04-30", status: "pending", ...AUDIT, ...GOV_INTERNAL },
];

// ─── payables ─────────────────────────────────────────────────────────────────

const payables: PayableEntity[] = [
  { id: "J-PAY-001", business_unit_id: "jacqes", vendor: "AWS", amount: 28_000, due_date: "2026-04-15", status: "pending", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-PAY-002", business_unit_id: "jacqes", vendor: "Stripe", amount: 4_200, due_date: "2026-04-01", status: "overdue", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-PAY-001", business_unit_id: "caza-vision", vendor: "Azure", amount: 12_000, due_date: "2026-04-15", status: "pending", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-PAY-001", business_unit_id: "advisor", vendor: "Bloomberg Terminal", amount: 6_500, due_date: "2026-04-05", status: "overdue", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-PAY-001", business_unit_id: "awq-venture", vendor: "Legal Counsel", amount: 45_000, due_date: "2026-04-20", status: "pending", ...AUDIT, ...GOV_INTERNAL },
];

// ─── budgets ──────────────────────────────────────────────────────────────────

const budgets: BudgetEntity[] = [
  { id: "J-BUD-01", business_unit_id: "jacqes", year: 2026, month: 3, category: "payroll", planned_amount: 1_200_000, actual_amount: 1_240_000, ...AUDIT, ...GOV_INTERNAL },
  { id: "J-BUD-02", business_unit_id: "jacqes", year: 2026, month: 3, category: "marketing", planned_amount: 320_000, actual_amount: 295_000, ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-BUD-01", business_unit_id: "caza-vision", year: 2026, month: 3, category: "payroll", planned_amount: 420_000, actual_amount: 440_000, ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-BUD-01", business_unit_id: "advisor", year: 2026, month: 3, category: "payroll", planned_amount: 90_000, actual_amount: 88_000, ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-BUD-01", business_unit_id: "awq-venture", year: 2026, month: 3, category: "ops", planned_amount: 130_000, actual_amount: 128_000, ...AUDIT, ...GOV_INTERNAL },
];

// ─── forecasts ────────────────────────────────────────────────────────────────

const forecasts: ForecastEntity[] = [
  { id: "J-FOR-01", business_unit_id: "jacqes", period: "2026-04", revenue_forecast: 4_950_000, expense_forecast: 1_600_000, confidence: "high", ...AUDIT, ...GOV_HOLDING },
  { id: "J-FOR-02", business_unit_id: "jacqes", period: "2026-05", revenue_forecast: 5_100_000, expense_forecast: 1_640_000, confidence: "medium", ...AUDIT, ...GOV_HOLDING },
  { id: "CV-FOR-01", business_unit_id: "caza-vision", period: "2026-04", revenue_forecast: 1_180_000, expense_forecast: 530_000, confidence: "medium", ...AUDIT, ...GOV_HOLDING },
  { id: "AD-FOR-01", business_unit_id: "advisor", period: "2026-04", revenue_forecast: 440_000, expense_forecast: 115_000, confidence: "high", ...AUDIT, ...GOV_HOLDING },
  { id: "AV-FOR-01", business_unit_id: "awq-venture", period: "2026-04", revenue_forecast: 1_550_000, expense_forecast: 160_000, confidence: "low", ...AUDIT, ...GOV_HOLDING },
];

// ─── allocations ──────────────────────────────────────────────────────────────

const allocations: AllocationEntity[] = [
  { id: "J-ALL-01", business_unit_id: "jacqes", year: 2026, category: "r&d", allocated_amount: 2_400_000, deployed_amount: 1_820_000, ...AUDIT, ...GOV_HOLDING },
  { id: "J-ALL-02", business_unit_id: "jacqes", year: 2026, category: "expansion", allocated_amount: 800_000, deployed_amount: 210_000, ...AUDIT, ...GOV_HOLDING },
  { id: "CV-ALL-01", business_unit_id: "caza-vision", year: 2026, category: "r&d", allocated_amount: 600_000, deployed_amount: 420_000, ...AUDIT, ...GOV_HOLDING },
  { id: "AD-ALL-01", business_unit_id: "advisor", year: 2026, category: "expansion", allocated_amount: 400_000, deployed_amount: 180_000, ...AUDIT, ...GOV_HOLDING },
  { id: "AV-ALL-01", business_unit_id: "awq-venture", year: 2026, category: "capex", allocated_amount: 5_000_000, deployed_amount: 3_800_000, ...AUDIT, ...GOV_HOLDING },
];

// ─── kpi_snapshots (current period per BU) ───────────────────────────────────

const kpi_snapshots: KPISnapshotEntity[] = [
  // JACQES
  { id: "J-KPI-01", business_unit_id: "jacqes", kpi_key: "revenue", label: "Total Revenue", value: 4_821_500, previous_value: 4_205_800, period: "2026-03", unit: "currency", icon: "DollarSign", color: "brand", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-KPI-02", business_unit_id: "jacqes", kpi_key: "customers", label: "Active Customers", value: 3_847, previous_value: 3_512, period: "2026-03", unit: "number", icon: "Users", color: "emerald", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-KPI-03", business_unit_id: "jacqes", kpi_key: "orders", label: "Monthly Orders", value: 12_394, previous_value: 11_280, period: "2026-03", unit: "number", icon: "ShoppingCart", color: "blue", ...AUDIT, ...GOV_INTERNAL },
  { id: "J-KPI-04", business_unit_id: "jacqes", kpi_key: "margin", label: "Gross Margin", value: 67.4, previous_value: 63.1, period: "2026-03", unit: "percent", icon: "TrendingUp", color: "purple", ...AUDIT, ...GOV_INTERNAL },
  // Caza Vision
  { id: "CV-KPI-01", business_unit_id: "caza-vision", kpi_key: "revenue", label: "Total Revenue", value: 1_130_000, previous_value: 1_090_000, period: "2026-03", unit: "currency", icon: "DollarSign", color: "brand", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-KPI-02", business_unit_id: "caza-vision", kpi_key: "customers", label: "Active Clients", value: 47, previous_value: 43, period: "2026-03", unit: "number", icon: "Users", color: "emerald", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-KPI-03", business_unit_id: "caza-vision", kpi_key: "projects", label: "Active Projects", value: 18, previous_value: 15, period: "2026-03", unit: "number", icon: "ShoppingCart", color: "blue", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-KPI-04", business_unit_id: "caza-vision", kpi_key: "margin", label: "Gross Margin", value: 54.4, previous_value: 51.8, period: "2026-03", unit: "percent", icon: "TrendingUp", color: "purple", ...AUDIT, ...GOV_INTERNAL },
  // Advisor
  { id: "AD-KPI-01", business_unit_id: "advisor", kpi_key: "revenue", label: "Total Revenue", value: 420_000, previous_value: 390_000, period: "2026-03", unit: "currency", icon: "DollarSign", color: "brand", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-KPI-02", business_unit_id: "advisor", kpi_key: "aum", label: "AuM Managed", value: 284_000_000, previous_value: 271_000_000, period: "2026-03", unit: "currency", icon: "TrendingUp", color: "emerald", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-KPI-03", business_unit_id: "advisor", kpi_key: "clients", label: "Active Clients", value: 38, previous_value: 36, period: "2026-03", unit: "number", icon: "Users", color: "blue", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-KPI-04", business_unit_id: "advisor", kpi_key: "margin", label: "Net Margin", value: 73.2, previous_value: 70.1, period: "2026-03", unit: "percent", icon: "TrendingUp", color: "purple", ...AUDIT, ...GOV_INTERNAL },
  // AWQ Venture
  { id: "AV-KPI-01", business_unit_id: "awq-venture", kpi_key: "aum", label: "Portfolio Value", value: 42_500_000, previous_value: 38_200_000, period: "2026-03", unit: "currency", icon: "TrendingUp", color: "brand", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-KPI-02", business_unit_id: "awq-venture", kpi_key: "revenue", label: "Realised Returns", value: 1_500_000, previous_value: 1_190_000, period: "2026-03", unit: "currency", icon: "DollarSign", color: "emerald", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-KPI-03", business_unit_id: "awq-venture", kpi_key: "companies", label: "Portfolio Companies", value: 12, previous_value: 11, period: "2026-03", unit: "number", icon: "Users", color: "blue", ...AUDIT, ...GOV_INTERNAL },
  { id: "AV-KPI-04", business_unit_id: "awq-venture", kpi_key: "irr", label: "Portfolio IRR", value: 24.8, previous_value: 22.1, period: "2026-03", unit: "percent", icon: "TrendingUp", color: "purple", ...AUDIT, ...GOV_INTERNAL },
];

// ─── capital_allocations ──────────────────────────────────────────────────────

const capital_allocations: CapitalAllocationEntity[] = [
  { id: "CAP-J", business_unit_id: "jacqes", year: 2026, total_allocated: 4_200_000, total_deployed: 3_800_000, irr: 18.4, status: "active", ...AUDIT, ...GOV_HOLDING },
  { id: "CAP-CV", business_unit_id: "caza-vision", year: 2026, total_allocated: 1_800_000, total_deployed: 1_420_000, irr: 12.7, status: "active", ...AUDIT, ...GOV_HOLDING },
  { id: "CAP-AD", business_unit_id: "advisor", year: 2026, total_allocated: 600_000, total_deployed: 580_000, irr: 31.2, status: "active", ...AUDIT, ...GOV_HOLDING },
  { id: "CAP-AV", business_unit_id: "awq-venture", year: 2026, total_allocated: 12_000_000, total_deployed: 9_800_000, irr: 24.8, status: "active", ...AUDIT, ...GOV_HOLDING },
];

// ─── audit_logs ───────────────────────────────────────────────────────────────

const audit_logs: AuditLogEntity[] = [
  { id: "LOG-001", business_unit_id: "jacqes", entity_type: "customer", entity_id: "J-C003", action: "view", performed_by: "user@jacqes.com", performed_at: "2026-04-01T08:12:00Z" },
  { id: "LOG-002", business_unit_id: "awq-venture", entity_type: "capital_allocation", entity_id: "CAP-AV", action: "update", performed_by: "admin@awq.com", performed_at: "2026-04-01T09:00:00Z", changes: { total_deployed: { before: 9_500_000, after: 9_800_000 } } },
  { id: "LOG-003", business_unit_id: "awq", entity_type: "kpi_snapshot", entity_id: "J-KPI-01", action: "view", performed_by: "cfo@awq.com", performed_at: "2026-04-01T09:30:00Z" },
  { id: "LOG-004", business_unit_id: "advisor", entity_type: "customer", entity_id: "AD-C001", action: "update", performed_by: "advisor@advisor.awq.com", performed_at: "2026-04-01T10:00:00Z" },
  { id: "LOG-005", business_unit_id: "caza-vision", entity_type: "receivable", entity_id: "CV-REC-002", action: "update", performed_by: "finance@cazavision.com", performed_at: "2026-04-01T10:45:00Z" },
];

// ─── Contracts & Projects (abbreviated) ──────────────────────────────────────

const contracts: ContractEntity[] = [
  { id: "J-CON-001", business_unit_id: "jacqes", customer_id: "J-C001", value: 120_000, start_date: "2026-01-01", end_date: "2026-12-31", status: "active", type: "recurring", ...AUDIT, ...GOV_INTERNAL },
  { id: "CV-CON-001", business_unit_id: "caza-vision", customer_id: "CV-C003", value: 85_000, start_date: "2026-02-01", end_date: "2026-07-31", status: "active", type: "retainer", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-CON-001", business_unit_id: "advisor", customer_id: "AD-C001", value: 300_000, start_date: "2026-01-01", end_date: "2026-12-31", status: "active", type: "retainer", ...AUDIT, ...GOV_INTERNAL },
];

const projects: ProjectEntity[] = [
  { id: "CV-PRJ-001", business_unit_id: "caza-vision", name: "Gulf AI Rollout", customer_id: "CV-C003", budget: 85_000, spent: 62_000, status: "on-track", due_date: "2026-07-31", ...AUDIT, ...GOV_INTERNAL },
  { id: "AD-PRJ-001", business_unit_id: "advisor", name: "Portfolio Restructuring", customer_id: "AD-C001", budget: 200_000, spent: 95_000, status: "on-track", due_date: "2026-06-30", ...AUDIT, ...GOV_INTERNAL },
];

// ─── Export ───────────────────────────────────────────────────────────────────

export const awqStore: AWQDataStore = {
  business_units,
  customers,
  contracts,
  projects,
  revenue_transactions,
  expense_transactions,
  receivables,
  payables,
  budgets,
  forecasts,
  allocations,
  kpi_snapshots,
  capital_allocations,
  audit_logs,
};
