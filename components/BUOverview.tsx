"use client";

/**
 * BUOverview — AWQ Group Business Units static view.
 *
 * STATIC EXPORT NOTE:
 *   Real-time polling (useRealtimeData + /api/bu-data) removed for
 *   static export compatibility. Data comes directly from the holding
 *   selector at build time.
 *
 * MIGRATION NOTE (contato22/awq with server runtime):
 *   Restore useRealtimeData hook + /api/bu-data route to re-enable
 *   live 30s polling. The hook and API route are preserved in the
 *   codebase (lib/useRealtimeData.ts, deleted app/api/bu-data/).
 */

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getHoldingBURanking } from "@/lib/awq/selectors/holding";
import { cn, formatCurrency } from "@/lib/utils";

const statusStyles = {
  "on-track": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "at-risk": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function BUOverview() {
  const units = getHoldingBURanking();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">AWQ Group — Business Units</h2>
          <p className="text-xs text-gray-500 mt-0.5">Build-time snapshot · Updates on redeploy</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border text-gray-400 bg-gray-800 border-gray-700">
          Static
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Unidade</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 hidden sm:table-cell">Setor</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3 pr-4">Receita</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3 pr-4 hidden md:table-cell">Colaboradores</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {units.map((bu) => {
              const isUp = bu.growth >= 0;
              const status = bu.status === "active" ? "on-track" : bu.status === "inactive" ? "at-risk" : "critical";

              return (
                <tr key={bu.id}>
                  <td className="py-3 pr-4 font-medium text-white">{bu.name}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs hidden sm:table-cell">{bu.sector}</td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-semibold text-white tabular-nums">
                        {formatCurrency(bu.totalRevenue, "USD", true)}
                      </span>
                      <span className={cn("flex items-center gap-0.5 text-xs font-medium", isUp ? "text-emerald-400" : "text-red-400")}>
                        {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {Math.abs(bu.growth).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-400 hidden md:table-cell">
                    {bu.employees.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", statusStyles[status])}>
                      {status === "on-track" ? "On Track" : status === "at-risk" ? "At Risk" : "Critical"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
