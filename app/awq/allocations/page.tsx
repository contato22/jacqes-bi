import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  getHoldingCapitalAllocation,
  getHoldingOverheadAllocation,
} from "@/lib/awq/selectors/holding";

export default function AWQAllocationsPage() {
  const capital = getHoldingCapitalAllocation();
  const overhead = getHoldingOverheadAllocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Allocations" subtitle="AWQ Group · Capital & Overhead Allocation" />

      <main className="flex-1 p-8 space-y-8">

        {/* Summary Metrics */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Summary
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Allocated", value: formatCurrency(capital.totalAllocated), color: "text-blue-400" },
              { label: "Total Deployed", value: formatCurrency(capital.totalDeployed), color: "text-emerald-400" },
              { label: "Avg IRR", value: formatPercent(capital.weightedIRR), color: "text-purple-400" },
              { label: "Deployment Rate", value: formatPercent(capital.deploymentRate), color: "text-amber-400" },
            ].map((m) => (
              <div key={m.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className={cn("text-2xl font-semibold tabular-nums mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capital Allocations Table */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Capital Allocations by BU
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Year</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Allocated</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Deployed</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Deploy Rate</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">IRR %</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">% of Total</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {capital.allocations.map((alloc) => {
                  const deployRate = alloc.total_allocated > 0
                    ? (alloc.total_deployed / alloc.total_allocated) * 100
                    : 0;
                  return (
                    <tr key={alloc.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{alloc.bu.name}</td>
                      <td className="px-4 py-3 text-gray-400 tabular-nums">{alloc.year}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(alloc.total_allocated)}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 tabular-nums">{formatCurrency(alloc.total_deployed)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-800 rounded-full h-1.5">
                            <div
                              className={cn(
                                "h-1.5 rounded-full",
                                deployRate >= 90 ? "bg-emerald-500" : deployRate >= 60 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${Math.min(deployRate, 100)}%` }}
                            />
                          </div>
                          <span className={cn(
                            "tabular-nums text-xs",
                            deployRate >= 90 ? "text-emerald-400" : deployRate >= 60 ? "text-amber-400" : "text-red-400"
                          )}>
                            {formatPercent(deployRate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-purple-400 tabular-nums">{formatPercent(alloc.irr)}</td>
                      <td className="px-4 py-3 text-right text-gray-400 tabular-nums">{formatPercent(alloc.allocationPct)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                          alloc.status === "active" ? "bg-emerald-900/40 text-emerald-400" :
                          alloc.status === "exited" ? "bg-blue-900/40 text-blue-400" :
                          "bg-gray-700/40 text-gray-400"
                        )}>
                          {alloc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-800/40">
                  <td className="px-4 py-3 text-white font-semibold">Total</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right text-blue-400 font-semibold tabular-nums">{formatCurrency(capital.totalAllocated)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-semibold tabular-nums">{formatCurrency(capital.totalDeployed)}</td>
                  <td className="px-4 py-3 text-right text-amber-400 font-semibold tabular-nums">{formatPercent(capital.deploymentRate)}</td>
                  <td className="px-4 py-3 text-right text-purple-400 font-semibold tabular-nums">{formatPercent(capital.weightedIRR)}</td>
                  <td className="px-4 py-3 text-right text-gray-400 tabular-nums">100.0%</td>
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Overhead Allocation Table */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Overhead Allocation by BU
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Holding-level overhead ($1,200,000 annual) allocated proportionally by BU revenue share.
          </p>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Sector</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">BU Revenue</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">% of Group</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Allocated Overhead</th>
                </tr>
              </thead>
              <tbody>
                {overhead.map((row) => (
                  <tr key={row.bu.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{row.bu.name}</td>
                    <td className="px-4 py-3 text-gray-400">{row.bu.sector}</td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(row.buRevenue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(row.revenuePct, 100)}%` }}
                          />
                        </div>
                        <span className="text-gray-300 tabular-nums">{formatPercent(row.revenuePct)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-amber-400 tabular-nums">{formatCurrency(row.allocatedOverhead)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
