import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getHoldingConsolidatedFinancials } from "@/lib/awq/selectors/holding";
import { awqStore } from "@/lib/awq/mockData";

export default function AWQBudgetPage() {
  // Holding layer — getHoldingConsolidatedFinancials for group context
  const fin = getHoldingConsolidatedFinancials();
  const budgets = awqStore.budgets;
  const totalPlanned = budgets.reduce((s, b) => s + b.planned_amount, 0);
  const totalActual = budgets.reduce((s, b) => s + b.actual_amount, 0);
  const variance = totalActual - totalPlanned;
  const variancePct = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;

  // Group by BU
  const byBU = new Map<string, typeof budgets>();
  for (const b of budgets) {
    const list = byBU.get(b.business_unit_id) ?? [];
    list.push(b);
    byBU.set(b.business_unit_id, list);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Budget" subtitle="AWQ Group · Budget vs Actual" />

      <main className="flex-1 p-8 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Planned", value: formatCurrency(totalPlanned), color: "text-blue-400" },
            { label: "Total Actual", value: formatCurrency(totalActual), color: "text-white" },
            { label: "Variance", value: formatCurrency(Math.abs(variance)), color: variance > 0 ? "text-red-400" : "text-emerald-400", prefix: variance > 0 ? "+" : "-" },
            { label: "Variance %", value: formatPercent(Math.abs(variancePct)), color: variancePct > 0 ? "text-red-400" : "text-emerald-400" },
          ].map((m) => (
            <div key={m.label} className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
              <p className={cn("text-2xl font-bold tabular-nums mt-1", m.color)}>
                {m.prefix}{m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Budget Table by BU */}
        {Array.from(byBU.entries()).map(([buId, items]) => {
          const buPlanned = items.reduce((s, b) => s + b.planned_amount, 0);
          const buActual = items.reduce((s, b) => s + b.actual_amount, 0);
          const buVar = buActual - buPlanned;
          const buVarPct = buPlanned > 0 ? (buVar / buPlanned) * 100 : 0;

          return (
            <div key={buId} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white capitalize">{buId}</h2>
                <span className={cn("text-xs font-semibold tabular-nums px-2 py-1 rounded-full", buVar > 0 ? "text-red-400 bg-red-500/10" : "text-emerald-400 bg-emerald-500/10")}>
                  {buVar > 0 ? "+" : ""}{formatPercent(buVarPct)} vs plan
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {["Category", "Planned", "Actual", "Variance", "Var %"].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((b) => {
                      const v = b.actual_amount - b.planned_amount;
                      const vp = b.planned_amount > 0 ? (v / b.planned_amount) * 100 : 0;
                      return (
                        <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="py-3 pr-4 text-gray-300 capitalize">{b.category}</td>
                          <td className="py-3 pr-4 text-blue-400 tabular-nums">{formatCurrency(b.planned_amount)}</td>
                          <td className="py-3 pr-4 text-white tabular-nums">{formatCurrency(b.actual_amount)}</td>
                          <td className={cn("py-3 pr-4 tabular-nums font-medium", v > 0 ? "text-red-400" : "text-emerald-400")}>
                            {v > 0 ? "+" : ""}{formatCurrency(Math.abs(v))}
                          </td>
                          <td className={cn("py-3 tabular-nums text-xs font-medium", vp > 0 ? "text-red-400" : "text-emerald-400")}>
                            {vp > 0 ? "+" : ""}{formatPercent(Math.abs(vp))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-800/40">
                      <td className="py-3 pr-4 text-white font-semibold">Total</td>
                      <td className="py-3 pr-4 text-blue-400 font-semibold tabular-nums">{formatCurrency(buPlanned)}</td>
                      <td className="py-3 pr-4 text-white font-semibold tabular-nums">{formatCurrency(buActual)}</td>
                      <td className={cn("py-3 pr-4 font-semibold tabular-nums", buVar > 0 ? "text-red-400" : "text-emerald-400")}>
                        {buVar > 0 ? "+" : ""}{formatCurrency(Math.abs(buVar))}
                      </td>
                      <td className={cn("py-3 font-semibold tabular-nums text-xs", buVarPct > 0 ? "text-red-400" : "text-emerald-400")}>
                        {buVarPct > 0 ? "+" : ""}{formatPercent(Math.abs(buVarPct))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
