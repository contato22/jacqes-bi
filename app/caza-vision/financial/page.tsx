"use client";

import { cazaVisionFinanceiro } from "@/lib/data";
import { DollarSign, TrendingUp, BarChart2, Calendar } from "lucide-react";

// ── helpers ────────────────────────────────────────────────────────────────────

function brl(value: number) {
  if (value === 0) return "R$ 0";
  if (Math.abs(value) >= 1_000_000)
    return `R$ ${(value / 1_000_000).toFixed(2).replace(".", ",")}M`;
  if (Math.abs(value) >= 1_000)
    return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

function pct(lucro: number, receita: number) {
  if (!receita) return "—";
  return `${((lucro / receita) * 100).toFixed(1)}%`;
}

// ── KPIs derivados do Notion ───────────────────────────────────────────────────

const meses2026 = cazaVisionFinanceiro.filter((m) => m.mes.endsWith("/26"));
const receitaYTD = meses2026.reduce((s, m) => s + m.orcamento, 0);
const despesasYTD = meses2026.reduce((s, m) => s + m.despesas, 0);
const lucroYTD = meses2026.reduce((s, m) => s + m.lucro, 0);
const margemYTD = receitaYTD > 0 ? ((lucroYTD / receitaYTD) * 100).toFixed(1) : "—";

const mar26 = cazaVisionFinanceiro.find((m) => m.mes === "Mar/26");
const receitaMar26 = mar26?.orcamento ?? 0;
const lucroMar26 = mar26?.lucro ?? 0;

const mesesAnteriores2026 = meses2026.filter((m) => m.mes !== "Mar/26");
const receitaAnterior = mesesAnteriores2026.reduce((s, m) => s + m.orcamento, 0);
const varMar =
  receitaAnterior > 0
    ? `+${(((receitaMar26 - receitaAnterior) / receitaAnterior) * 100).toFixed(1)}%`
    : null;

const KPIS = [
  {
    label: "Receita YTD 2026",
    value: brl(receitaYTD),
    sub: `${meses2026.filter((m) => m.orcamento > 0).length} meses com dados`,
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Despesas YTD",
    value: brl(despesasYTD),
    sub: "Total registrado",
    icon: BarChart2,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    label: "Lucro Líquido YTD",
    value: brl(lucroYTD),
    sub: `Margem ${margemYTD}`,
    icon: TrendingUp,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  {
    label: "Receita — Mar/26",
    value: brl(receitaMar26),
    sub: varMar ? `${varMar} · Lucro: ${brl(lucroMar26)}` : `Lucro: ${brl(lucroMar26)}`,
    icon: Calendar,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

// ── component ──────────────────────────────────────────────────────────────────

export default function CazaVisionFinancialPage() {
  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Financial — Caza Vision</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Receita, despesas e lucro por projeto · agrupado por mês
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                  <Icon size={15} className={k.color} />
                </div>
                <span className="text-xs text-gray-500">{k.label}</span>
              </div>
              <div className={`text-2xl font-bold tabular-nums ${k.color}`}>{k.value}</div>
              <div className="text-[11px] text-gray-600 mt-1">{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Tabela mensal */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800/60">
          <h2 className="text-sm font-semibold text-white">
            Receita por Mês — agrupado por COMPETÊNCIA
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Mês
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Receita (Orç.)
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Receita Real
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Despesas
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Lucro
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Margem
                </th>
              </tr>
            </thead>
            <tbody>
              {cazaVisionFinanceiro.map((row, i) => {
                const hasData = row.orcamento > 0 || row.receita > 0;
                const margem = pct(row.lucro, row.orcamento);
                const is2026 = row.mes.endsWith("/26");
                return (
                  <tr
                    key={row.mes}
                    className={`border-b border-gray-800/30 last:border-0 transition-colors hover:bg-gray-800/20 ${
                      is2026 ? "bg-brand-500/5" : ""
                    }`}
                  >
                    <td className="px-5 py-3 font-medium text-gray-300">
                      <span className={is2026 ? "text-brand-300" : ""}>{row.mes}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={hasData ? "text-white font-semibold" : "text-gray-700"}>
                        {hasData ? brl(row.orcamento) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={row.receita > 0 ? "text-emerald-400" : "text-gray-700"}>
                        {row.receita > 0 ? brl(row.receita) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={row.despesas > 0 ? "text-red-400" : "text-gray-700"}>
                        {row.despesas > 0 ? brl(row.despesas) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={row.lucro > 0 ? "text-emerald-400 font-semibold" : "text-gray-700"}>
                        {row.lucro > 0 ? brl(row.lucro) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {hasData ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                          {margem}
                        </span>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totais */}
            <tfoot>
              <tr className="border-t border-gray-700/60 bg-gray-800/30">
                <td className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Total
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-white">
                  {brl(cazaVisionFinanceiro.reduce((s, m) => s + m.orcamento, 0))}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-emerald-400">
                  {brl(cazaVisionFinanceiro.reduce((s, m) => s + m.receita, 0))}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-red-400">
                  {brl(cazaVisionFinanceiro.reduce((s, m) => s + m.despesas, 0))}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-emerald-400">
                  {brl(cazaVisionFinanceiro.reduce((s, m) => s + m.lucro, 0))}
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">
                    {pct(
                      cazaVisionFinanceiro.reduce((s, m) => s + m.lucro, 0),
                      cazaVisionFinanceiro.reduce((s, m) => s + m.orcamento, 0)
                    )}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-800/30 text-[11px] text-gray-600">
          Fonte: Notion · Caza Vision — Financeiro · Última sincronização: Mar/26
        </div>
      </div>
    </div>
  );
}
