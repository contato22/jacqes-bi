import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  getHoldingCapitalAllocation,
  getHoldingBURanking,
} from "@/lib/awq/selectors/holding";

export default function AWQPortfolioPage() {
  const capital = getHoldingCapitalAllocation();
  const ranking = getHoldingBURanking();

  // Merge capital data into ranking for each BU
  const portfolio = ranking.map((bu) => {
    const cap = capital.allocations.find((a) => a.business_unit_id === bu.id);
    return { ...bu, cap };
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Portfolio" subtitle="AWQ Group · Business Unit Portfolio" />

      <main className="flex-1 p-8 space-y-8">

        {/* Portfolio Summary */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Portfolio Summary
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Portfolio BUs", value: formatNumber(ranking.length), color: "text-white" },
              { label: "Total Capital", value: formatCurrency(capital.totalAllocated), color: "text-blue-400" },
              { label: "Deployed Capital", value: formatCurrency(capital.totalDeployed), color: "text-emerald-400" },
              { label: "Weighted IRR", value: formatPercent(capital.weightedIRR), color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className={cn("text-2xl font-semibold tabular-nums mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BU Portfolio Cards */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Business Units
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {portfolio.map((bu) => {
              const deployRate = bu.cap && bu.cap.total_allocated > 0
                ? (bu.cap.total_deployed / bu.cap.total_allocated) * 100
                : 0;
              return (
                <div key={bu.id} className="card p-5 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold text-base">{bu.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{bu.sector}</p>
                    </div>
                    <span className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                      bu.status === "active" ? "bg-emerald-900/40 text-emerald-400" :
                      bu.status === "inactive" ? "bg-gray-700/40 text-gray-400" :
                      "bg-amber-900/40 text-amber-400"
                    )}>
                      {bu.status}
                    </span>
                  </div>

                  {/* Revenue */}
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Revenue</p>
                    <p className="text-lg font-semibold text-white tabular-nums">{formatCurrency(bu.totalRevenue)}</p>
                    <p className={cn("text-xs tabular-nums mt-0.5", bu.growth >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {bu.growth >= 0 ? "▲" : "▼"} {formatPercent(Math.abs(bu.growth))} growth
                    </p>
                  </div>

                  {/* Capital */}
                  {bu.cap && (
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Capital Allocated</p>
                      <p className="text-lg font-semibold text-blue-400 tabular-nums">{formatCurrency(bu.cap.total_allocated)}</p>
                      <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                        {formatPercent(bu.cap.allocationPct)} of portfolio
                      </p>
                    </div>
                  )}

                  {/* IRR & Deployment */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">IRR</p>
                      <p className="text-sm font-semibold text-purple-400 tabular-nums">
                        {bu.cap ? formatPercent(bu.cap.irr) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Deploy Rate</p>
                      <p className={cn(
                        "text-sm font-semibold tabular-nums",
                        deployRate >= 90 ? "text-emerald-400" : deployRate >= 60 ? "text-amber-400" : "text-red-400"
                      )}>
                        {formatPercent(deployRate)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-800">
                    <span>{formatNumber(bu.employees)} employees</span>
                    <span>{bu.headquarters}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Capital Distribution — text-based breakdown */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Capital Distribution
          </h2>
          <div className="card p-6">
            <div className="space-y-4">
              {capital.allocations.map((alloc) => (
                <div key={alloc.id} className="flex items-center gap-4">
                  <div className="w-28 shrink-0">
                    <p className="text-white text-sm font-medium">{alloc.bu.name}</p>
                    <p className="text-gray-500 text-xs">{alloc.bu.sector}</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(alloc.allocationPct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right tabular-nums">
                    <p className="text-white text-sm font-semibold">{formatPercent(alloc.allocationPct)}</p>
                    <p className="text-gray-500 text-xs">{formatCurrency(alloc.total_allocated)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
