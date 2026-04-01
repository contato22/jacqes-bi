import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  getHoldingConsolidatedKPIs,
  getHoldingBURanking,
  getHoldingRiskOverview,
  getHoldingCapitalAllocation,
} from "@/lib/awq/selectors/holding";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, DollarSign } from "lucide-react";

export default function AWQControlTower() {
  const kpis = getHoldingConsolidatedKPIs();
  const ranking = getHoldingBURanking();
  const risk = getHoldingRiskOverview();
  const capital = getHoldingCapitalAllocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="AWQ Group" subtitle="Control Tower · Consolidated View" />

      <main className="flex-1 p-8 space-y-8">

        {/* KPI Cards */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Consolidated KPIs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const isUp = kpi.growth >= 0;
              return (
                <div key={kpi.id} className="card p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-white tabular-nums mt-1">
                    {kpi.unit === "currency"
                      ? formatCurrency(kpi.value)
                      : kpi.unit === "percent"
                      ? formatPercent(kpi.value)
                      : formatNumber(kpi.value)}
                  </p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm tabular-nums", isUp ? "text-emerald-400" : "text-red-400")}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{isUp ? "+" : ""}{formatPercent(kpi.growth)} vs prev</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Capital Allocation Summary */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Capital Allocation
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Allocated", value: formatCurrency(capital.totalAllocated), color: "text-blue-400" },
              { label: "Total Deployed", value: formatCurrency(capital.totalDeployed), color: "text-emerald-400" },
              { label: "Deployment Rate", value: formatPercent(capital.deploymentRate), color: "text-amber-400" },
              { label: "Weighted IRR", value: formatPercent(capital.weightedIRR), color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className={cn("text-xl font-semibold tabular-nums mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BU Performance Ranking */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            BU Performance Ranking
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Sector</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Growth</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Margin</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Employees</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((bu, i) => (
                  <tr key={bu.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{bu.name}</td>
                    <td className="px-4 py-3 text-gray-400">{bu.sector}</td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(bu.totalRevenue)}</td>
                    <td className={cn("px-4 py-3 text-right tabular-nums", bu.growth >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {bu.growth >= 0 ? "+" : ""}{formatPercent(bu.growth)}
                    </td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">{formatPercent(bu.margin)}</td>
                    <td className="px-4 py-3 text-right text-gray-400 tabular-nums">{formatNumber(bu.employees)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        bu.status === "active" ? "bg-emerald-900/40 text-emerald-400" :
                        bu.status === "inactive" ? "bg-gray-700/40 text-gray-400" :
                        "bg-amber-900/40 text-amber-400"
                      )}>
                        {bu.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Risk Overview */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Risk Overview
          </h2>
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold",
                risk.riskScore === "high" ? "bg-red-900/40 text-red-400" :
                risk.riskScore === "medium" ? "bg-amber-900/40 text-amber-400" :
                "bg-emerald-900/40 text-emerald-400"
              )}>
                {risk.riskScore === "high" ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                Risk Score: {risk.riskScore.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">
                {risk.overdueReceivables.length} overdue receivables · {risk.atRiskCustomers.length} at-risk customers
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Overdue Receivables</p>
                <p className="text-xl font-semibold text-red-400 tabular-nums">{risk.overdueReceivables.length}</p>
                <p className="text-sm text-gray-500 mt-1 tabular-nums">{formatCurrency(risk.totalExposure)} exposure</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Overdue Payables</p>
                <p className="text-xl font-semibold text-amber-400 tabular-nums">{risk.overduePayables.length}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">At-Risk Customers</p>
                <p className="text-xl font-semibold text-amber-400 tabular-nums">{risk.atRiskCustomers.length}</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
