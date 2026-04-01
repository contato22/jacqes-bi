import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  getHoldingConsolidatedKPIs,
  getHoldingBURanking,
} from "@/lib/awq/selectors/holding";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function AWQKPIsPage() {
  const kpis = getHoldingConsolidatedKPIs();
  const ranking = getHoldingBURanking();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="KPIs" subtitle="AWQ Group · Group-Wide Indicators" />

      <main className="flex-1 p-8 space-y-8">

        {/* Consolidated KPI Cards */}
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
                  <p className="text-xs text-gray-600 mt-1 tabular-nums">
                    Prev:{" "}
                    {kpi.unit === "currency"
                      ? formatCurrency(kpi.previousValue)
                      : kpi.unit === "percent"
                      ? formatPercent(kpi.previousValue)
                      : formatNumber(kpi.previousValue)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* BU KPI Heatmap */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            BU KPI Heatmap
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Sector</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue Growth</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Margin %</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Employees</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((bu) => {
                  // Compute performance tier
                  const isHighMargin = bu.margin >= 50;
                  const isGrowth = bu.growth > 5;
                  const perf = isHighMargin && isGrowth ? "strong"
                    : isHighMargin || isGrowth ? "good"
                    : bu.growth < 0 ? "weak"
                    : "neutral";

                  return (
                    <tr key={bu.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{bu.name}</td>
                      <td className="px-4 py-3 text-gray-400">{bu.sector}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(bu.totalRevenue)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className={cn(
                          "inline-flex items-center gap-1",
                          bu.growth >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {bu.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {bu.growth >= 0 ? "+" : ""}{formatPercent(bu.growth)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className={cn(
                          "font-medium",
                          bu.margin >= 50 ? "text-emerald-400" :
                          bu.margin >= 30 ? "text-amber-400" :
                          "text-red-400"
                        )}>
                          {formatPercent(bu.margin)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400 tabular-nums">{formatNumber(bu.employees)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "inline-flex px-2.5 py-1 rounded-md text-xs font-semibold",
                          perf === "strong" ? "bg-emerald-900/40 text-emerald-400" :
                          perf === "good" ? "bg-blue-900/40 text-blue-400" :
                          perf === "weak" ? "bg-red-900/40 text-red-400" :
                          "bg-gray-700/40 text-gray-400"
                        )}>
                          {perf === "strong" ? "Strong" :
                           perf === "good" ? "Good" :
                           perf === "weak" ? "Weak" : "Neutral"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* KPI Legend */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Performance Definitions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Strong", desc: "Margin ≥50% and Growth >5%", color: "bg-emerald-900/40 text-emerald-400 border-emerald-800/50" },
              { label: "Good", desc: "High margin or strong growth", color: "bg-blue-900/40 text-blue-400 border-blue-800/50" },
              { label: "Neutral", desc: "Stable, no significant momentum", color: "bg-gray-700/40 text-gray-400 border-gray-700/50" },
              { label: "Weak", desc: "Negative growth trend", color: "bg-red-900/40 text-red-400 border-red-800/50" },
            ].map((tier) => (
              <div key={tier.label} className={cn("card p-3 border", tier.color)}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">{tier.label}</p>
                <p className="text-xs opacity-80">{tier.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
