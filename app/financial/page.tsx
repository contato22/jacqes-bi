import { miniPLContas, miniPLMes } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

function pct(value: number, total: number) {
  if (!total) return "—";
  return ((value / total) * 100).toFixed(1) + "%";
}

export default function FinancialPage() {
  // ── totais ──────────────────────────────────────────────────────────────────
  const contasAtivas = miniPLContas.filter((c) => c.fee > 0);

  const totalFee        = miniPLContas.reduce((s, c) => s + c.fee,        0);
  const totalDanilo     = miniPLContas.reduce((s, c) => s + c.danilo,     0);
  const totalCogs       = miniPLContas.reduce((s, c) => s + c.cogs,       0);
  const totalFreelancer = miniPLContas.reduce((s, c) => s + c.freelancer, 0);
  const totalOpex       = miniPLContas.reduce((s, c) => s + c.opex,       0);

  const custoDireto  = totalDanilo + totalCogs + totalFreelancer;
  const lucroBruto   = totalFee - custoDireto;
  const ebitda       = lucroBruto - totalOpex;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Mini P&L · JACQES BU</h1>
        <p className="text-sm text-gray-500 mt-0.5">{miniPLMes} · {contasAtivas.length} contas ativas</p>
      </div>

      {/* ── P&L Consolidado ─────────────────────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">P&L Consolidado</h2>

        <div className="space-y-0 divide-y divide-gray-800/60">

          {/* Receita Bruta */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-300">Receita Bruta (FEE)</span>
            <span className="text-sm font-semibold text-emerald-400 tabular-nums">
              {formatCurrency(totalFee)}
            </span>
          </div>

          {/* Custo Danilo */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500 pl-4">(-) Custo Danilo</span>
            <span className="text-sm text-red-400/80 tabular-nums">
              ({formatCurrency(totalDanilo)})
            </span>
          </div>

          {/* COGS */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500 pl-4">(-) COGS</span>
            <span className="text-sm text-red-400/80 tabular-nums">
              ({formatCurrency(totalCogs)})
            </span>
          </div>

          {/* Freelancer */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500 pl-4">(-) Freelancer</span>
            <span className="text-sm text-red-400/80 tabular-nums">
              ({formatCurrency(totalFreelancer)})
            </span>
          </div>

          {/* Lucro Bruto */}
          <div className="flex items-center justify-between py-3 border-t border-gray-700 mt-1">
            <span className="text-sm font-semibold text-white">Lucro Bruto</span>
            <div className="text-right">
              <span className={`text-sm font-bold tabular-nums ${lucroBruto >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(lucroBruto)}
              </span>
              <span className="text-xs text-gray-600 ml-2">{pct(lucroBruto, totalFee)}</span>
            </div>
          </div>

          {/* OPEX */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500 pl-4">(-) OPEX</span>
            <span className="text-sm text-red-400/80 tabular-nums">
              ({formatCurrency(totalOpex)})
            </span>
          </div>

          {/* EBITDA */}
          <div className="flex items-center justify-between py-3 border-t border-gray-700 mt-1">
            <span className="text-sm font-bold text-white">EBITDA</span>
            <div className="text-right">
              <span className={`text-sm font-bold tabular-nums ${ebitda >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(ebitda)}
              </span>
              <span className="text-xs text-gray-600 ml-2">{pct(ebitda, totalFee)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Por Conta ───────────────────────────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Por Conta</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-gray-800">
                <th className="text-left pb-2 font-medium">Conta</th>
                <th className="text-right pb-2 font-medium">FEE</th>
                <th className="text-right pb-2 font-medium">Danilo</th>
                <th className="text-right pb-2 font-medium">COGS</th>
                <th className="text-right pb-2 font-medium">OPEX</th>
                <th className="text-right pb-2 font-medium">Freelancer</th>
                <th className="text-right pb-2 font-medium">Resultado</th>
                <th className="text-right pb-2 font-medium">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {miniPLContas.map((c) => {
                const resultado = c.fee - c.danilo - c.cogs - c.opex - c.freelancer;
                const margem = c.fee > 0 ? (resultado / c.fee) * 100 : null;
                return (
                  <tr key={c.conta} className="text-gray-300">
                    <td className="py-2.5 font-medium text-white">{c.conta}</td>
                    <td className="py-2.5 text-right tabular-nums text-emerald-400/90">
                      {c.fee > 0 ? formatCurrency(c.fee) : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-400">
                      {c.danilo > 0 ? formatCurrency(c.danilo) : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-400">
                      {c.cogs > 0 ? formatCurrency(c.cogs) : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-400">
                      {c.opex > 0 ? formatCurrency(c.opex) : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-400">
                      {c.freelancer > 0 ? formatCurrency(c.freelancer) : <span className="text-gray-700">—</span>}
                    </td>
                    <td className={`py-2.5 text-right tabular-nums font-semibold ${
                      c.fee === 0 ? "text-gray-700" : resultado >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {c.fee > 0 ? formatCurrency(resultado) : "—"}
                    </td>
                    <td className={`py-2.5 text-right tabular-nums text-xs ${
                      margem === null ? "text-gray-700" : margem >= 50 ? "text-emerald-500" : margem >= 30 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {margem !== null ? margem.toFixed(1) + "%" : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-700 text-white font-semibold">
                <td className="pt-3 text-xs text-gray-400">TOTAL</td>
                <td className="pt-3 text-right tabular-nums text-emerald-400">{formatCurrency(totalFee)}</td>
                <td className="pt-3 text-right tabular-nums text-gray-400">{formatCurrency(totalDanilo)}</td>
                <td className="pt-3 text-right tabular-nums text-gray-400">{formatCurrency(totalCogs)}</td>
                <td className="pt-3 text-right tabular-nums text-gray-400">{formatCurrency(totalOpex)}</td>
                <td className="pt-3 text-right tabular-nums text-gray-400">{formatCurrency(totalFreelancer)}</td>
                <td className="pt-3 text-right tabular-nums text-emerald-400">{formatCurrency(ebitda)}</td>
                <td className="pt-3 text-right tabular-nums text-emerald-500 text-xs">{pct(ebitda, totalFee)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Composição do Custo ─────────────────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Composição do Custo Direto</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Danilo", valor: totalDanilo, color: "bg-brand-500" },
            { label: "COGS",   valor: totalCogs,   color: "bg-yellow-500" },
            { label: "Freelancer", valor: totalFreelancer, color: "bg-purple-500" },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{item.label}</span>
                <span className="tabular-nums">{pct(item.valor, custoDireto)}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: custoDireto > 0 ? `${(item.valor / custoDireto) * 100}%` : "0%" }}
                />
              </div>
              <div className="text-xs text-gray-500 tabular-nums">{formatCurrency(item.valor)}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-700 text-center">
        Fonte: Notion · Mini P&L · {miniPLMes}
      </p>

    </div>
  );
}
