"use client";

import { ArrowUpRight, ArrowDownRight, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useRealtimeData } from "@/lib/useRealtimeData";
import { BusinessUnit } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

interface BUDataResponse {
  units: BusinessUnit[];
  fetchedAt: string;
}

const statusStyles: Record<BusinessUnit["status"], string> = {
  "on-track": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "at-risk": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
};

const statusLabel: Record<BusinessUnit["status"], string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  critical: "Critical",
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function BUOverview() {
  const { data, lastUpdated, loading, error, refresh } = useRealtimeData<BUDataResponse>(
    "/api/bu-data",
    30_000
  );

  const units = data?.units ?? [];

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">AWQ Group — Business Units</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {lastUpdated
              ? `Atualizado às ${formatTime(lastUpdated)}`
              : "A carregar..."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Live / error badge */}
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
              error
                ? "text-red-400 bg-red-500/10 border-red-500/20"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            )}
          >
            {error ? <WifiOff size={11} /> : <Wifi size={11} />}
            {error ? "Offline" : "Live · 30s"}
          </span>

          {/* Manual refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-40"
            title="Refresh now"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
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
            {units.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="py-3">
                      <div className="h-4 bg-gray-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : units.map((bu) => {
                  const delta =
                    ((bu.revenue - bu.previousRevenue) / bu.previousRevenue) * 100;
                  const isUp = delta >= 0;

                  return (
                    <tr key={bu.id} className="group">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-white">{bu.name}</span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs hidden sm:table-cell">
                        {bu.sector}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-semibold text-white tabular-nums">
                            {formatCurrency(bu.revenue, "USD", true)}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-0.5 text-xs font-medium",
                              isUp ? "text-emerald-400" : "text-red-400"
                            )}
                          >
                            {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                            {Math.abs(delta).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-400 hidden md:table-cell">
                        {bu.employees.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                            statusStyles[bu.status]
                          )}
                        >
                          {statusLabel[bu.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-400">
          Erro ao atualizar dados: {error}. A tentar novamente em 30s.
        </p>
      )}
    </div>
  );
}
