import Header from "@/components/Header";
import {
  getBusinessUnitKPIs,
  getBusinessUnitFinancialView,
  getBusinessUnitCustomers,
  getBusinessUnitCashflow,
} from "@/lib/awq/selectors/bu";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, TrendingUp, Wallet } from "lucide-react";

const BU_ID = "jacqes" as const;

export default function JacqesPage() {
  const kpis = getBusinessUnitKPIs(BU_ID);
  const financial = getBusinessUnitFinancialView(BU_ID);
  const customers = getBusinessUnitCustomers(BU_ID);
  const cashflow = getBusinessUnitCashflow(BU_ID);

  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const atRiskCustomers = customers.filter((c) => c.status === "at-risk").length;
  const churnedCustomers = customers.filter((c) => c.status === "churned").length;

  const overdueCount = cashflow.overdueReceivables.length + cashflow.overduePayables.length;

  return (
    <>
      <Header title="JACQES" subtitle="Business Unit · SaaS / BI Platform" />

      <div className="px-8 py-6 space-y-6">
        {/* BU Scope Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scope: JACQES only · Dados isolados por BU
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.slice(0, 4).map((kpi) => {
            const delta =
              kpi.previous_value > 0
                ? ((kpi.value - kpi.previous_value) / kpi.previous_value) * 100
                : 0;
            const isPositive = delta >= 0;

            return (
              <div key={kpi.id} className="card p-5 space-y-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className="text-2xl font-semibold text-white tabular-nums">
                  {kpi.unit === "currency"
                    ? formatCurrency(kpi.value, "USD", true)
                    : kpi.unit === "percent"
                    ? formatPercent(kpi.value, 1)
                    : formatNumber(kpi.value, true)}
                </p>
                <div
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  <span className="tabular-nums">
                    {isPositive ? "+" : ""}
                    {delta.toFixed(1)}% vs prev
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Financial Summary */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Financial Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Revenue</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatCurrency(financial.totalRevenue, "USD", true)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Profit</span>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    financial.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(financial.totalProfit, "USD", true)}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Gross Margin</span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {financial.grossMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Customer Summary */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Customer Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Customers</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatNumber(customers.length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active</span>
                <span className="text-sm font-medium text-emerald-400 tabular-nums">
                  {formatNumber(activeCustomers)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">At-Risk</span>
                <span className="text-sm font-medium text-yellow-400 tabular-nums">
                  {formatNumber(atRiskCustomers)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Churned</span>
                <span className="text-sm font-medium text-red-400 tabular-nums">
                  {formatNumber(churnedCustomers)}
                </span>
              </div>
            </div>
          </div>

          {/* Cashflow Summary */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-white">Cashflow Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Receivable</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatCurrency(cashflow.totalReceivable, "USD", true)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Payable</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatCurrency(cashflow.totalPayable, "USD", true)}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Overdue Items</span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    overdueCount > 0 ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {overdueCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
