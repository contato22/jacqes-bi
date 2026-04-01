"use client";

import type { MiniPL } from "@/lib/consolidation/group-metrics";
import { cn } from "@/lib/utils";

interface Props {
  rows: MiniPL[];
  period?: string;
}

const BU_LABELS: Record<string, { name: string; color: string }> = {
  jacqes: { name: "JACQES", color: "text-brand-400" },
  "caza-vision": { name: "Caza Vision", color: "text-cyan-400" },
  "awq-venture": { name: "AWQ Venture", color: "text-amber-400" },
  "awq-holding": { name: "AWQ Holding", color: "text-purple-400" },
  consolidated: { name: "CONSOLIDADO", color: "text-white" },
};

function fmt(value: number): string {
  if (value >= 1_000_000) return `R$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `R$${(value / 1_000).toFixed(0)}K`;
  return `R$${value.toFixed(0)}`;
}

function pct(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function BUBreakdownTable({ rows, period }: Props) {
  // Sort: BUs first, consolidated last
  const sorted = [...rows].sort((a, b) => {
    if (a.buId === "consolidated") return 1;
    if (b.buId === "consolidated") return -1;
    return 0;
  });

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Mini P&L por Unidade</h3>
          {period && <p className="text-xs text-gray-500 mt-0.5">Período: {period}</p>}
        </div>
        <span className="text-xs text-gray-600">Valores em BRL</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Unidade
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Receita Bruta
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                CPV
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Lucro Bruto
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Margem
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                OPEX
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                EBITDA
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Mg. EBITDA
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Liq.
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const isConsolidated = row.buId === "consolidated";
              const label = BU_LABELS[row.buId] ?? { name: row.buId, color: "text-gray-300" };

              return (
                <tr
                  key={row.buId}
                  className={cn(
                    "border-b border-gray-800/50 transition-colors",
                    isConsolidated
                      ? "bg-gray-800/40 font-semibold"
                      : "hover:bg-gray-800/20"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <span className={cn("font-medium", label.color)}>{label.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-300 font-mono text-xs">
                    {fmt(row.grossRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-red-400/70 font-mono text-xs">
                    ({fmt(row.cogs)})
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-200 font-mono text-xs">
                    {fmt(row.grossProfit)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs">
                    <MarginBadge value={row.grossMargin} />
                  </td>
                  <td className="px-4 py-3.5 text-right text-red-400/70 font-mono text-xs">
                    ({fmt(row.opex)})
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-200 font-mono text-xs">
                    {fmt(row.ebitda)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs">
                    <MarginBadge value={row.ebitdaMargin} />
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs">
                    <span className={row.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}>
                      {fmt(row.netProfit)}
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

function MarginBadge({ value }: { value: number }) {
  const color =
    value >= 60
      ? "text-emerald-400"
      : value >= 40
      ? "text-blue-400"
      : value >= 20
      ? "text-amber-400"
      : "text-red-400";

  return <span className={color}>{value.toFixed(1)}%</span>;
}
