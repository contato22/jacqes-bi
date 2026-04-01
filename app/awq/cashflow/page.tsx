import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { getHoldingRiskOverview } from "@/lib/awq/selectors/holding";
import { awqStore } from "@/lib/awq/mockData";

// Holding layer — aggregates all BU receivables/payables directly
function groupByBU<T extends { business_unit_id: string; amount: number }>(items: T[]) {
  const map = new Map<string, { total: number; count: number }>();
  for (const item of items) {
    const entry = map.get(item.business_unit_id) ?? { total: 0, count: 0 };
    entry.total += item.amount;
    entry.count += 1;
    map.set(item.business_unit_id, entry);
  }
  return map;
}

export default function AWQCashFlowPage() {
  const risk = getHoldingRiskOverview();

  const allReceivables = awqStore.receivables;
  const allPayables = awqStore.payables;

  const totalReceivable = allReceivables.reduce((s, r) => s + r.amount, 0);
  const totalPayable = allPayables.reduce((s, p) => s + p.amount, 0);
  const overdueReceivableAmount = risk.overdueReceivables.reduce((s, r) => s + r.amount, 0);
  const overduePayableAmount = risk.overduePayables.reduce((s, p) => s + p.amount, 0);

  const buNames: Record<string, string> = {
    jacqes: "JACQES",
    "caza-vision": "Caza Vision",
    advisor: "Advisor",
    "awq-venture": "AWQ Venture",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Cash Flow" subtitle="AWQ Group · Receivables & Payables" />

      <main className="flex-1 p-8 space-y-8">

        {/* Summary Metrics */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Summary
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Receivable", value: formatCurrency(totalReceivable), color: "text-emerald-400" },
              { label: "Total Payable", value: formatCurrency(totalPayable), color: "text-blue-400" },
              { label: "Overdue Receivables", value: formatCurrency(overdueReceivableAmount), color: "text-red-400" },
              { label: "Overdue Payables", value: formatCurrency(overduePayableAmount), color: "text-amber-400" },
            ].map((m) => (
              <div key={m.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className={cn("text-2xl font-semibold tabular-nums mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All Receivables */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            All Receivables
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Due Date</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {allReceivables.map((rec) => (
                  <tr key={rec.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{rec.id}</td>
                    <td className="px-4 py-3 text-gray-300">{buNames[rec.business_unit_id] ?? rec.business_unit_id}</td>
                    <td className="px-4 py-3 text-gray-400">{rec.customer_id}</td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(rec.amount)}</td>
                    <td className="px-4 py-3 text-gray-400">{rec.due_date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        rec.status === "paid" ? "bg-emerald-900/40 text-emerald-400" :
                        rec.status === "overdue" ? "bg-red-900/40 text-red-400" :
                        "bg-amber-900/40 text-amber-400"
                      )}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Payables */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            All Payables
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Vendor</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Due Date</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {allPayables.map((pay) => (
                  <tr key={pay.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{pay.id}</td>
                    <td className="px-4 py-3 text-gray-300">{buNames[pay.business_unit_id] ?? pay.business_unit_id}</td>
                    <td className="px-4 py-3 text-gray-400">{pay.vendor}</td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(pay.amount)}</td>
                    <td className="px-4 py-3 text-gray-400">{pay.due_date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        pay.status === "paid" ? "bg-emerald-900/40 text-emerald-400" :
                        pay.status === "overdue" ? "bg-red-900/40 text-red-400" :
                        "bg-amber-900/40 text-amber-400"
                      )}>
                        {pay.status}
                      </span>
                    </td>
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
