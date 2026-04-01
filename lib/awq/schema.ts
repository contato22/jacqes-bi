/**
 * AWQ GROUP — CENTRAL DATA SCHEMA
 *
 * ARCHITECTURAL RULE:
 * - Every domain entity MUST have business_unit_id.
 * - BU selectors MUST filter by business_unit_id.
 * - Only holding selectors may aggregate across BUs.
 * - BU pages MUST NOT use holding selectors.
 * - AWQ pages MUST NOT use BU-scoped queries directly.
 */

// ─── Business Unit IDs ────────────────────────────────────────────────────────

export const BU_IDS = {
  jacqes: "jacqes",
  cazaVision: "caza-vision",
  advisor: "advisor",
  awqVenture: "awq-venture",
} as const;

export type BusinessUnitId = (typeof BU_IDS)[keyof typeof BU_IDS];

// ─── Shared Audit & Governance Fields ─────────────────────────────────────────

export interface AuditFields {
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface GovernanceFields {
  classification_status: "public" | "internal" | "confidential" | "restricted";
  visibility_scope: "bu" | "holding" | "public";
  source_system: string;
}

// ─── business_units ───────────────────────────────────────────────────────────

export interface BusinessUnitEntity extends AuditFields {
  id: BusinessUnitId;
  name: string;
  sector: string;
  status: "active" | "inactive" | "acquired";
  established_at: string;
  headquarters: string;
  employees: number;
}

// ─── customers ────────────────────────────────────────────────────────────────

export interface CustomerEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  name: string;
  company: string;
  email: string;
  segment: "Enterprise" | "SMB" | "Startup" | "Individual";
  ltv: number;
  last_order: string;
  status: "active" | "at-risk" | "churned";
  country: string;
}

// ─── contracts ────────────────────────────────────────────────────────────────

export interface ContractEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  customer_id: string;
  value: number;
  start_date: string;
  end_date: string;
  status: "active" | "pending" | "expired" | "cancelled";
  type: "recurring" | "one-time" | "retainer";
}

// ─── projects ─────────────────────────────────────────────────────────────────

export interface ProjectEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  name: string;
  customer_id: string;
  budget: number;
  spent: number;
  status: "on-track" | "at-risk" | "delayed" | "completed";
  due_date: string;
}

// ─── revenue_transactions ─────────────────────────────────────────────────────

export interface RevenueTransactionEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  period: string; // "YYYY-MM"
  amount: number;
  category: "saas" | "services" | "api" | "consulting" | "investment" | "other";
}

// ─── expense_transactions ─────────────────────────────────────────────────────

export interface ExpenseTransactionEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  period: string; // "YYYY-MM"
  amount: number;
  category: "payroll" | "infrastructure" | "marketing" | "ops" | "r&d" | "other";
}

// ─── receivables ──────────────────────────────────────────────────────────────

export interface ReceivableEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  customer_id: string;
  amount: number;
  due_date: string;
  status: "pending" | "overdue" | "paid";
}

// ─── payables ─────────────────────────────────────────────────────────────────

export interface PayableEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  vendor: string;
  amount: number;
  due_date: string;
  status: "pending" | "overdue" | "paid";
}

// ─── budgets ──────────────────────────────────────────────────────────────────

export interface BudgetEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  year: number;
  month: number; // 1–12
  category: string;
  planned_amount: number;
  actual_amount: number;
}

// ─── forecasts ────────────────────────────────────────────────────────────────

export interface ForecastEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  period: string; // "YYYY-MM"
  revenue_forecast: number;
  expense_forecast: number;
  confidence: "high" | "medium" | "low";
}

// ─── allocations ──────────────────────────────────────────────────────────────

export interface AllocationEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  year: number;
  category: "capex" | "opex" | "r&d" | "expansion";
  allocated_amount: number;
  deployed_amount: number;
}

// ─── kpi_snapshots ────────────────────────────────────────────────────────────

export interface KPISnapshotEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  kpi_key: string;
  label: string;
  value: number;
  previous_value: number;
  period: string; // "YYYY-MM"
  unit: "currency" | "number" | "percent";
  icon: string;
  color: string;
}

// ─── capital_allocations ──────────────────────────────────────────────────────

export interface CapitalAllocationEntity extends AuditFields, GovernanceFields {
  id: string;
  business_unit_id: BusinessUnitId;
  year: number;
  total_allocated: number;
  total_deployed: number;
  irr: number; // expected internal rate of return %
  status: "active" | "exited" | "on-hold";
}

// ─── audit_logs ───────────────────────────────────────────────────────────────

export interface AuditLogEntity {
  id: string;
  business_unit_id: BusinessUnitId | "awq";
  entity_type: string;
  entity_id: string;
  action: "create" | "update" | "delete" | "view" | "export";
  performed_by: string;
  performed_at: string;
  ip_address?: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
}

// ─── Central Data Store Shape ─────────────────────────────────────────────────

export interface AWQDataStore {
  business_units: BusinessUnitEntity[];
  customers: CustomerEntity[];
  contracts: ContractEntity[];
  projects: ProjectEntity[];
  revenue_transactions: RevenueTransactionEntity[];
  expense_transactions: ExpenseTransactionEntity[];
  receivables: ReceivableEntity[];
  payables: PayableEntity[];
  budgets: BudgetEntity[];
  forecasts: ForecastEntity[];
  allocations: AllocationEntity[];
  kpi_snapshots: KPISnapshotEntity[];
  capital_allocations: CapitalAllocationEntity[];
  audit_logs: AuditLogEntity[];
}
