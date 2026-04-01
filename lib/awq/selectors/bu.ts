/**
 * AWQ GROUP — BU-SCOPED SELECTORS
 *
 * RULE: These selectors are the ONLY way BU pages may access data.
 * Every function here enforces a mandatory business_unit_id filter.
 * No function here may return data from more than one BU.
 * BU pages MUST NOT use holding.ts selectors.
 */

import { awqStore } from "../mockData";
import type { BusinessUnitId } from "../schema";

// ─── Guard: enforce BU scope at runtime ──────────────────────────────────────

function assertBU(businessUnitId: BusinessUnitId) {
  if (!businessUnitId) throw new Error("business_unit_id is required for BU selectors");
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export function getBusinessUnitKPIs(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.kpi_snapshots.filter((k) => k.business_unit_id === businessUnitId);
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function getBusinessUnitCustomers(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.customers.filter((c) => c.business_unit_id === businessUnitId);
}

// ─── Revenue ─────────────────────────────────────────────────────────────────

export function getBusinessUnitRevenue(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.revenue_transactions.filter((r) => r.business_unit_id === businessUnitId);
}

export function getBusinessUnitExpenses(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.expense_transactions.filter((e) => e.business_unit_id === businessUnitId);
}

// ─── Financial View ───────────────────────────────────────────────────────────

export function getBusinessUnitFinancialView(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  const revenues = getBusinessUnitRevenue(businessUnitId);
  const expenses = getBusinessUnitExpenses(businessUnitId);

  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const grossMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const monthly = revenues.map((r, i) => ({
    period: r.period,
    revenue: r.amount,
    expenses: expenses[i]?.amount ?? 0,
    profit: r.amount - (expenses[i]?.amount ?? 0),
  }));

  return { totalRevenue, totalExpenses, totalProfit, grossMargin, monthly };
}

// ─── Cash Flow ────────────────────────────────────────────────────────────────

export function getBusinessUnitCashflow(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  const receivables = awqStore.receivables.filter((r) => r.business_unit_id === businessUnitId);
  const payables = awqStore.payables.filter((p) => p.business_unit_id === businessUnitId);

  const totalReceivable = receivables.filter((r) => r.status !== "paid").reduce((s, r) => s + r.amount, 0);
  const totalPayable = payables.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);
  const overdueReceivables = receivables.filter((r) => r.status === "overdue");
  const overduePayables = payables.filter((p) => p.status === "overdue");

  return { receivables, payables, totalReceivable, totalPayable, overdueReceivables, overduePayables };
}

// ─── Budget ───────────────────────────────────────────────────────────────────

export function getBusinessUnitBudget(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  const budgets = awqStore.budgets.filter((b) => b.business_unit_id === businessUnitId);

  const totalPlanned = budgets.reduce((s, b) => s + b.planned_amount, 0);
  const totalActual = budgets.reduce((s, b) => s + b.actual_amount, 0);
  const variance = totalActual - totalPlanned;
  const variancePct = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;

  return { budgets, totalPlanned, totalActual, variance, variancePct };
}

// ─── Forecast ─────────────────────────────────────────────────────────────────

export function getBusinessUnitForecast(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.forecasts.filter((f) => f.business_unit_id === businessUnitId);
}

// ─── Allocations ──────────────────────────────────────────────────────────────

export function getBusinessUnitAllocations(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.allocations.filter((a) => a.business_unit_id === businessUnitId);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function getBusinessUnitProjects(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.projects.filter((p) => p.business_unit_id === businessUnitId);
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export function getBusinessUnitContracts(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.contracts.filter((c) => c.business_unit_id === businessUnitId);
}

// ─── Audit Logs (BU-scoped) ───────────────────────────────────────────────────

export function getBusinessUnitAuditLog(businessUnitId: BusinessUnitId) {
  assertBU(businessUnitId);
  return awqStore.audit_logs
    .filter((l) => l.business_unit_id === businessUnitId)
    .sort((a, b) => b.performed_at.localeCompare(a.performed_at));
}
