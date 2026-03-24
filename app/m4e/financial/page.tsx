"use client";

import Header from "@/components/Header";
import { m4eMiniPLContas, m4eScoreMensal } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

function pct(v: number, total: number) {
  if (!total) return "—";
  return ((v / total) * 100).toFixed(1) + "%";
}

export default function M4EFinancialPage() {
  const contas   = m4eMiniPLContas.filter((c) => c.fee > 0);
  const totalFee = m4eMiniPLContas.reduce((s, c) => s + c.fee, 0);
  const totalDan = m4eMiniPLContas.reduce((s, c) => s + c.danilo, 0);
  const totalCOGS= m4eMiniPLContas.reduce((s, c) => s + c.cogs, 0);
  const totalOPEX= m4eMiniPLContas.reduce((s, c) => s + c.opex, 0);
  const ebitda   = totalFee - totalDan - totalCOGS - totalOPEX;

  // MC split: variáveis = COGS + parte variável Danilo (30% do total Danilo)
  const totalCV  = totalCOGS + totalDan * 0.3;
  const mc       = totalFee - totalCV;
  const mcPct    = totalFee > 0 ? (mc / totalFee) * 100 : 0;

  return (
    <>
      <Header
        title="M4E — Financial"
        subtitle="Mini P&L por cliente · Margem de Contribuição · Março 2026"
      />

      <div className="page-content">

        {/* KPI strip */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Receita Bruta (FEE)",      value: totalFee,  color: "text-emerald-400" },
            { label: "MC — Margem Contribuição", value: mc,        color: "text-blue-400",     suffix: `${mcPct.toFixed(1)}%` },
            { label: "Margem Bruta",             value: totalFee - totalDan - totalCOGS, color: (totalFee - totalDan - totalCOGS) >= 0 ? "text-emerald-400" : "text-red-400" },
            { label: "EBITDA Mini P&L",          value: ebitda,    color: ebitda >= 0 ? "text-emerald-400" : "text-red-400" },
          ].map((k) => (
            <div key={k.label} className="card p-5">
              <div className={cn("text-xl font-bold tabular-nums", k.color)}>
                {formatCurrency(k.value)}
              </div>
              {"suffix" in k && k.suffix && (
                <div className="text-xs text-blue-400 font-semibold mt-0.5">{k.suffix}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">{k.label}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{pct(k.value, totalFee)} da Rec. Bruta</div>
            </div>
          ))}
        </div>

        {/* Mini P&L por cliente */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Mini P&L · Por Cliente</h2>
          <p className="text-xs text-gray-500 mb-4">
            M4E BU · {m4eScoreMensal.mes} · {contas.length} clientes ativos
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="table-th">Cliente</th>
                  <th className="table-th text-right">FEE</th>
                  <th className="table-th text-right">Danilo</th>
                  <th className="table-th text-right">COGS</th>
                  <th className="table-th text-right">OPEX</th>
                  <th className="table-th text-right">Resultado</th>
                  <th className="table-th text-right">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {m4eMiniPLContas.map((c) => {
                  const resultado = c.fee - c.danilo - c.cogs - c.opex;
                  const margem = c.fee > 0 ? (resultado / c.fee) * 100 : null;
                  return (
                    <tr key={c.cliente}>
                      <td className="table-td font-medium text-white">{c.cliente}</td>
                      <td className="table-td text-right tabular-nums text-emerald-400">
                        {c.fee > 0 ? formatCurrency(c.fee) : <span className="text-gray-700">—</span>}
                      </td>
                      <td className="table-td text-right tabular-nums text-gray-400">
                        {c.danilo > 0 ? formatCurrency(c.danilo) : <span className="text-gray-700">—</span>}
                      </td>
                      <td className="table-td text-right tabular-nums text-gray-400">
                        {c.cogs > 0 ? formatCurrency(c.cogs) : <span className="text-gray-700">—</span>}
                      </td>
                      <td className="table-td text-right tabular-nums text-gray-400">
                        {c.opex > 0 ? formatCurrency(c.opex) : <span className="text-gray-700">—</span>}
                      </td>
                      <td className={cn("table-td text-right tabular-nums font-semibold",
                        c.fee === 0 ? "text-gray-700" : resultado >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {c.fee > 0 ? formatCurrency(resultado) : "—"}
                      </td>
                      <td className={cn("table-td text-right tabular-nums",
                        margem === null ? "text-gray-700" : margem >= 50 ? "text-emerald-400" : margem >= 30 ? "text-yellow-400" : "text-red-400"
                      )}>
                        {margem !== null ? margem.toFixed(1) + "%" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-700 font-semibold">
                  <td className="table-td text-gray-500">TOTAL</td>
                  <td className="table-td text-right tabular-nums text-emerald-400">{formatCurrency(totalFee)}</td>
                  <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalDan)}</td>
                  <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalCOGS)}</td>
                  <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalOPEX)}</td>
                  <td className={cn("table-td text-right tabular-nums", ebitda >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {formatCurrency(ebitda)}
                  </td>
                  <td className={cn("table-td text-right tabular-nums", ebitda >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {pct(ebitda, totalFee)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* MC breakdown */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Margem de Contribuição (MC) · M4E BU</h2>
          <div className="space-y-3">
            {[
              { label: "Receita Bruta (FEE total)", valor: totalFee,  positivo: true },
              { label: "(-) Custos Variáveis (COGS + 30% Danilo)", valor: totalCV, positivo: false },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-800/40">
                <span className="text-sm text-gray-400">{r.label}</span>
                <span className={cn("text-sm font-semibold tabular-nums", r.positivo ? "text-emerald-400" : "text-red-400/80")}>
                  {r.positivo ? formatCurrency(r.valor) : `(${formatCurrency(r.valor)})`}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 bg-blue-900/10 rounded-xl px-4 -mx-4 border border-blue-700/30">
              <div>
                <span className="font-semibold text-sm text-blue-200">= Margem de Contribuição (MC)</span>
                <span className="ml-3 text-xs text-blue-400 font-semibold">{mcPct.toFixed(1)}%</span>
              </div>
              <span className={cn("font-bold tabular-nums text-base", mc >= 0 ? "text-blue-300" : "text-red-400")}>
                {formatCurrency(mc)}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-gray-700 mt-4">
            MC M4E BU: Receita − Custos Variáveis (COGS + parcela variável Danilo).
            Custos fixos (Danilo fixo, OPEX) não estão refletidos na MC mas impactam a Margem Bruta.
          </p>
        </div>

      </div>
    </>
  );
}
