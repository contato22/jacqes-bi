import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  getHoldingConsolidatedFinancials,
  getHoldingBURanking,
} from "@/lib/awq/selectors/holding";

export default function AWQFinancialPage() {
  const fin = getHoldingConsolidatedFinancials();
  const ranking = getHoldingBURanking();

  const totalGroupRevenue = ranking.reduce((s, bu) => s + bu.totalRevenue, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Financial" subtitle="AWQ Group · Consolidated P&L" />

      <main className="flex-1 p-8 space-y-8">

        {/* Summary Cards */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Summary
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: formatCurrency(fin.totalRevenue), color: "text-emerald-400" },
              { label: "Total Expenses", value: formatCurrency(fin.totalExpenses), color: "text-red-400" },
              { label: "Total Profit", value: formatCurrency(fin.totalProfit), color: "text-blue-400" },
              { label: "Gross Margin", value: formatPercent(fin.grossMargin), color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className={cn("text-2xl font-semibold tabular-nums mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly P&L Table */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Monthly P&L
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Period</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Expenses</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Profit</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {fin.monthly.map((row) => {
                  const margin = row.revenue > 0 ? (row.profit / row.revenue) * 100 : 0;
                  return (
                    <tr key={row.period} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300 tabular-nums">{row.period}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(row.revenue)}</td>
                      <td className="px-4 py-3 text-right text-red-400 tabular-nums">{formatCurrency(row.expenses)}</td>
                      <td className={cn("px-4 py-3 text-right tabular-nums font-medium", row.profit >= 0 ? "text-emerald-400" : "text-red-400")}>
                        {formatCurrency(row.profit)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400 tabular-nums">{formatPercent(margin)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-800/40">
                  <td className="px-4 py-3 text-white font-semibold">Total</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-semibold tabular-nums">{formatCurrency(fin.totalRevenue)}</td>
                  <td className="px-4 py-3 text-right text-red-400 font-semibold tabular-nums">{formatCurrency(fin.totalExpenses)}</td>
                  <td className="px-4 py-3 text-right text-blue-400 font-semibold tabular-nums">{formatCurrency(fin.totalProfit)}</td>
                  <td className="px-4 py-3 text-right text-purple-400 font-semibold tabular-nums">{formatPercent(fin.grossMargin)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* BU Revenue Contribution */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            BU Revenue Contribution
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Sector</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">% of Group</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((bu) => {
                  const pct = totalGroupRevenue > 0 ? (bu.totalRevenue / totalGroupRevenue) * 100 : 0;
                  return (
                    <tr key={bu.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{bu.name}</td>
                      <td className="px-4 py-3 text-gray-400">{bu.sector}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(bu.totalRevenue)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-gray-800 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-300 w-12 text-right">{formatPercent(pct)}</span>
                        </div>
                      </td>
                      <td className={cn("px-4 py-3 text-right tabular-nums", bu.margin >= 40 ? "text-emerald-400" : bu.margin >= 20 ? "text-amber-400" : "text-red-400")}>
                        {formatPercent(bu.margin)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
