/**
 * AWQ GROUP — HOLDING CONSOLIDATED SELECTORS
 *
 * RULE: Only AWQ holding pages may use these selectors.
 * These functions aggregate, compare, and rank across all BUs.
 * BU pages MUST NOT import from this file.
 */

import { awqStore } from "../mockData";

// ─── Business Units ───────────────────────────────────────────────────────────

export function getHoldingBusinessUnits() {
  return awqStore.business_units;
}

// ─── Consolidated Financials ──────────────────────────────────────────────────

export function getHoldingConsolidatedFinancials() {
  const revenues = awqStore.revenue_transactions;
  const expenses = awqStore.expense_transactions;

  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const grossMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Group by period across all BUs
  const periodMap = new Map<string, { revenue: number; expenses: number }>();
  for (const r of revenues) {
    const entry = periodMap.get(r.period) ?? { revenue: 0, expenses: 0 };
    entry.revenue += r.amount;
    periodMap.set(r.period, entry);
  }
  for (const e of expenses) {
    const entry = periodMap.get(e.period) ?? { revenue: 0, expenses: 0 };
    entry.expenses += e.amount;
    periodMap.set(e.period, entry);
  }

  const monthly = Array.from(periodMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, { revenue, expenses }]) => ({
      period,
      revenue,
      expenses,
      profit: revenue - expenses,
    }));

  return { totalRevenue, totalExpenses, totalProfit, grossMargin, monthly };
}

// ─── BU Performance Ranking ───────────────────────────────────────────────────

export function getHoldingBURanking() {
  const buRevenues = new Map<string, number>();
  for (const r of awqStore.revenue_transactions) {
    buRevenues.set(r.business_unit_id, (buRevenues.get(r.business_unit_id) ?? 0) + r.amount);
  }

  return awqStore.business_units
    .map((bu) => {
      const revenue = buRevenues.get(bu.id) ?? 0;
      const kpis = awqStore.kpi_snapshots.filter((k) => k.business_unit_id === bu.id && k.kpi_key === "revenue");
      const prevRevenue = kpis[0]?.previous_value ?? 0;
      const currentRevenue = kpis[0]?.value ?? 0;
      const growth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const expenses = awqStore.expense_transactions
        .filter((e) => e.business_unit_id === bu.id)
        .reduce((s, e) => s + e.amount, 0);
      const margin = revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0;

      return { ...bu, totalRevenue: revenue, growth, margin };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
}

// ─── Capital Allocation ───────────────────────────────────────────────────────

export function getHoldingCapitalAllocation() {
  const caps = awqStore.capital_allocations;
  const totalAllocated = caps.reduce((s, c) => s + c.total_allocated, 0);
  const totalDeployed = caps.reduce((s, c) => s + c.total_deployed, 0);
  const weightedIRR =
    totalAllocated > 0
      ? caps.reduce((s, c) => s + (c.irr * c.total_allocated) / totalAllocated, 0)
      : 0;

  return {
    allocations: caps.map((c) => ({
      ...c,
      bu: awqStore.business_units.find((b) => b.id === c.business_unit_id)!,
      allocationPct: totalAllocated > 0 ? (c.total_allocated / totalAllocated) * 100 : 0,
    })),
    totalAllocated,
    totalDeployed,
    deploymentRate: totalAllocated > 0 ? (totalDeployed / totalAllocated) * 100 : 0,
    weightedIRR,
  };
}

// ─── Consolidated KPIs ────────────────────────────────────────────────────────

export function getHoldingConsolidatedKPIs() {
  const fin = getHoldingConsolidatedFinancials();
  const allRevKPIs = awqStore.kpi_snapshots.filter((k) => k.kpi_key === "revenue");
  const prevRevenue = allRevKPIs.reduce((s, k) => s + k.previous_value, 0);
  const currentRevenue = allRevKPIs.reduce((s, k) => s + k.value, 0);
  const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  const totalCustomers = awqStore.customers.filter((c) => c.status === "active").length;
  const prevCustomers = totalCustomers - 8; // simplified

  const caps = awqStore.capital_allocations;
  const portfolioValue = caps.reduce((s, c) => s + c.total_allocated, 0);
  const avgIRR = caps.length > 0 ? caps.reduce((s, c) => s + c.irr, 0) / caps.length : 0;

  return [
    { id: "h-rev", label: "Group Revenue", value: currentRevenue, previousValue: prevRevenue, unit: "currency" as const, icon: "DollarSign", color: "brand", growth: revenueGrowth },
    { id: "h-margin", label: "Group Margin", value: fin.grossMargin, previousValue: fin.grossMargin - 2.1, unit: "percent" as const, icon: "TrendingUp", color: "emerald", growth: 2.1 },
    { id: "h-customers", label: "Total Clients", value: totalCustomers, previousValue: prevCustomers, unit: "number" as const, icon: "Users", color: "blue", growth: ((totalCustomers - prevCustomers) / prevCustomers) * 100 },
    { id: "h-irr", label: "Portfolio IRR", value: avgIRR, previousValue: avgIRR - 1.8, unit: "percent" as const, icon: "TrendingUp", color: "purple", growth: 1.8 },
  ];
}

// ─── Risk Overview ────────────────────────────────────────────────────────────

export function getHoldingRiskOverview() {
  const overdueRec = awqStore.receivables.filter((r) => r.status === "overdue");
  const overduePay = awqStore.payables.filter((p) => p.status === "overdue");
  const atRiskCustomers = awqStore.customers.filter((c) => c.status === "at-risk");

  return {
    overdueReceivables: overdueRec,
    overduePayables: overduePay,
    atRiskCustomers,
    totalExposure: overdueRec.reduce((s, r) => s + r.amount, 0),
    riskScore: overdueRec.length > 2 ? "high" : overdueRec.length > 0 ? "medium" : "low",
  };
}

// ─── Portfolio Overview ───────────────────────────────────────────────────────

export function getHoldingPortfolioOverview() {
  const caps = getHoldingCapitalAllocation();
  const ranking = getHoldingBURanking();
  const risk = getHoldingRiskOverview();
  const kpis = getHoldingConsolidatedKPIs();

  return { capitalAllocation: caps, buRanking: ranking, riskOverview: risk, kpis };
}

// ─── Audit Logs (all BUs, holding-level view) ─────────────────────────────────

export function getHoldingAuditLog() {
  return awqStore.audit_logs.sort((a, b) => b.performed_at.localeCompare(a.performed_at));
}

// ─── Overhead Allocation ──────────────────────────────────────────────────────

export function getHoldingOverheadAllocation() {
  const totalRevenue = awqStore.revenue_transactions.reduce((s, r) => s + r.amount, 0);
  const holdingOverhead = 1_200_000; // annual holding-level costs

  return awqStore.business_units.map((bu) => {
    const buRevenue = awqStore.revenue_transactions
      .filter((r) => r.business_unit_id === bu.id)
      .reduce((s, r) => s + r.amount, 0);
    const revenuePct = totalRevenue > 0 ? buRevenue / totalRevenue : 0;
    const allocatedOverhead = holdingOverhead * revenuePct;

    return { bu, buRevenue, revenuePct: revenuePct * 100, allocatedOverhead };
  });
}
