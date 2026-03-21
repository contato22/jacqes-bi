import { dreGerencial, miniPLContas, miniPLMes, type DRELinha } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import { Info } from "lucide-react";

function pct(value: number, total: number) {
  if (!total) return "—";
  return ((value / total) * 100).toFixed(1) + "%";
}

// ── DRE helpers ───────────────────────────────────────────────────────────────

function DRELineItem({ linha, negativo = false }: { linha: DRELinha; negativo?: boolean }) {
  const isZero = linha.valor === 0;
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/40 last:border-0">
      <div className="flex items-center gap-1.5 pl-5">
        <span className={cn("text-sm", isZero ? "text-gray-700" : "text-gray-400")}>
          {linha.label}
        </span>
        {linha.estimativa && (
          <span title={linha.nota || "Estimativa — atualizar mensalmente"}>
            <Info size={11} className="text-gray-700 hover:text-gray-500 cursor-help" />
          </span>
        )}
      </div>
      <span className={cn(
        "text-sm tabular-nums",
        isZero
          ? "text-gray-700"
          : negativo
          ? "text-red-400/80"
          : "text-gray-300"
      )}>
        {isZero
          ? "—"
          : negativo
          ? `(${formatCurrency(linha.valor)})`
          : formatCurrency(linha.valor)}
      </span>
    </div>
  );
}

function DRESectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider pt-4 pb-1">
      {label}
    </div>
  );
}

interface DRESumRowProps {
  label: string;
  valor: number;
  recBruta?: number;
  highlight?: boolean;
  separator?: boolean;
}

function DRESumRow({ label, valor, recBruta, highlight = false, separator = true }: DRESumRowProps) {
  const positive = valor >= 0;
  return (
    <div className={cn(
      "flex items-center justify-between py-3",
      separator && "border-t border-gray-700 mt-0.5",
      highlight && "mt-2 bg-gray-800/40 rounded-xl px-4 -mx-4 border border-gray-700/60"
    )}>
      <span className={cn("font-semibold", highlight ? "text-sm text-white" : "text-sm text-gray-200")}>
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className={cn(
          "font-bold tabular-nums",
          highlight ? "text-base" : "text-sm",
          positive ? "text-emerald-400" : "text-red-400"
        )}>
          {formatCurrency(valor)}
        </span>
        {recBruta !== undefined && recBruta > 0 && (
          <span className="text-xs text-gray-600 tabular-nums w-14 text-right">
            {pct(valor, recBruta)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FinancialPage() {
  const d = dreGerencial;

  const recBruta =
    d.receitaBruta.recorrente +
    d.receitaBruta.projetoSetup +
    d.receitaBruta.variavel +
    d.receitaBruta.extraordinaria;

  const totalDeducoes = d.deducoes.impostosTaxas.valor;
  const recLiquida = recBruta - totalDeducoes;

  const cd = d.custosDiretos;
  const totalCustosDiretos =
    cd.daniloFixo.valor + cd.daniloVariavel.valor + cd.encargosProvisos.valor +
    cd.deslocamentosVisitas.valor + cd.ferramentasDiretas.valor +
    cd.apoioOperacionalFreela.valor + cd.outrosCustosDiretos.valor;

  const margemBruta = recLiquida - totalCustosDiretos;

  const do_ = d.despesasOperacionais;
  const totalDespesasOp =
    do_.coordenacaoSupervisao.valor + do_.ferramentasCompartilhadas.valor +
    do_.administrativoRateado.valor + do_.desenvolvimentoProcessoBI.valor +
    do_.outrosOverheads.valor;

  const resultadoOperacional = margemBruta - totalDespesasOp;

  const ai = d.ajustesImputados;
  const totalAjustes = ai.custoFounderEstrategico.valor + ai.overheadExtra.valor;

  const ebitdaAjustado = resultadoOperacional - totalAjustes;

  const contasAtivas = miniPLContas.filter((c) => c.fee > 0);
  const totalFee        = miniPLContas.reduce((s, c) => s + c.fee,        0);
  const totalDanilo     = miniPLContas.reduce((s, c) => s + c.danilo,     0);
  const totalCogs       = miniPLContas.reduce((s, c) => s + c.cogs,       0);
  const totalFreelancer = miniPLContas.reduce((s, c) => s + c.freelancer, 0);
  const totalOpex       = miniPLContas.reduce((s, c) => s + c.opex,       0);
  const ebitdaMiniPL    = totalFee - totalDanilo - totalCogs - totalFreelancer - totalOpex;

  return (
    <PeriodFilterBar available={["mensal"]} label={d.mes}>
    <div className="page-content">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">DRE Gerencial · JACQES BU</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {d.mes} · {contasAtivas.length} contas ativas
          <span className="text-gray-700 ml-2">
            · <Info size={10} className="inline mr-0.5" />
            campos <Info size={10} className="inline mx-0.5 text-gray-700" /> são estimativas/rateios — revisar mensalmente
          </span>
        </p>
      </div>

      {/* ── KPI cards ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Receita Bruta",        valor: recBruta,            color: "text-emerald-400", pctVal: 100 },
          { label: "Margem Bruta",          valor: margemBruta,         color: margemBruta  >= 0 ? "text-emerald-400" : "text-red-400", pctVal: margemBruta },
          { label: "Resultado Operacional", valor: resultadoOperacional, color: resultadoOperacional >= 0 ? "text-emerald-400" : "text-red-400", pctVal: resultadoOperacional },
          { label: "EBITDA Ajustado",       valor: ebitdaAjustado,      color: ebitdaAjustado >= 0 ? "text-emerald-400" : "text-red-400", pctVal: ebitdaAjustado },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <div className={cn("text-xl font-bold tabular-nums", k.color)}>
              {formatCurrency(k.valor)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{k.label}</div>
            <div className="text-[10px] text-gray-700 mt-1 tabular-nums">
              {pct(k.pctVal, recBruta)} da Rec. Bruta
            </div>
          </div>
        ))}
      </div>

      {/* ── DRE Waterfall ─────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-white">DRE Gerencial — JACQES BU</h2>
          <span className="text-[10px] text-gray-700 flex items-center gap-1">
            <Info size={10} /> estimativa/rateio
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-4">{d.mes} · Valores em R$</p>

        {/* ─ 1. Receita Bruta ─ */}
        <DRESectionHeader label="Receita Bruta" />
        <DRELineItem linha={{ label: "Receita recorrente", valor: d.receitaBruta.recorrente }} />
        <DRELineItem linha={{ label: "Receita projeto/setup", valor: d.receitaBruta.projetoSetup }} />
        <DRELineItem linha={{ label: "Receita variável", valor: d.receitaBruta.variavel }} />
        <DRELineItem linha={{ label: "Receita extraordinária", valor: d.receitaBruta.extraordinaria }} />
        <DRESumRow label="= Receita Bruta" valor={recBruta} recBruta={recBruta} />

        {/* ─ 2. Deduções ─ */}
        <DRESectionHeader label="(-) Deduções" />
        <DRELineItem linha={d.deducoes.impostosTaxas} negativo />
        <DRESumRow label="= Receita Líquida" valor={recLiquida} recBruta={recBruta} />

        {/* ─ 3. Custos Diretos ─ */}
        <DRESectionHeader label="(-) Custos Diretos" />
        <DRELineItem linha={cd.daniloFixo} negativo />
        <DRELineItem linha={cd.daniloVariavel} negativo />
        <DRELineItem linha={cd.encargosProvisos} negativo />
        <DRELineItem linha={cd.deslocamentosVisitas} negativo />
        <DRELineItem linha={cd.ferramentasDiretas} negativo />
        <DRELineItem linha={cd.apoioOperacionalFreela} negativo />
        <DRELineItem linha={cd.outrosCustosDiretos} negativo />
        <DRESumRow label="= Margem Bruta" valor={margemBruta} recBruta={recBruta} />

        {/* ─ 4. Despesas Operacionais ─ */}
        <DRESectionHeader label="(-) Despesas Operacionais da BU" />
        <DRELineItem linha={do_.coordenacaoSupervisao} negativo />
        <DRELineItem linha={do_.ferramentasCompartilhadas} negativo />
        <DRELineItem linha={do_.administrativoRateado} negativo />
        <DRELineItem linha={do_.desenvolvimentoProcessoBI} negativo />
        <DRELineItem linha={do_.outrosOverheads} negativo />
        <DRESumRow label="= Resultado Operacional da BU" valor={resultadoOperacional} recBruta={recBruta} />

        {/* ─ 5. Ajustes Imputados ─ */}
        <DRESectionHeader label="(-) Ajustes Imputados" />
        <DRELineItem linha={ai.custoFounderEstrategico} negativo />
        <DRELineItem linha={ai.overheadExtra} negativo />
        <DRESumRow
          label="= EBITDA Ajustado / Contribuição Real da BU"
          valor={ebitdaAjustado}
          recBruta={recBruta}
          highlight
        />

        {/* Legenda */}
        <p className="mt-5 text-[10px] text-gray-700 flex items-center gap-1">
          <Info size={10} />
          Campos com <Info size={10} className="mx-0.5" /> são estimativas/rateios — confirmar mensalmente com a AWQ. Campos com valor — ainda não preenchidos.
        </p>
      </div>

      {/* ── Mini P&L por conta ────────────────────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-1">Mini P&L · Por Conta</h2>
        <p className="text-xs text-gray-500 mb-4">Fonte: Notion · {miniPLMes} · {contasAtivas.length} contas ativas</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="table-th">Conta</th>
                <th className="table-th text-right">FEE</th>
                <th className="table-th text-right">Danilo</th>
                <th className="table-th text-right">COGS</th>
                <th className="table-th text-right">OPEX</th>
                <th className="table-th text-right">Freelancer</th>
                <th className="table-th text-right">Resultado</th>
                <th className="table-th text-right">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {miniPLContas.map((c) => {
                const resultado = c.fee - c.danilo - c.cogs - c.opex - c.freelancer;
                const margem = c.fee > 0 ? (resultado / c.fee) * 100 : null;
                return (
                  <tr key={c.conta}>
                    <td className="table-td font-medium text-white">{c.conta}</td>
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
                    <td className="table-td text-right tabular-nums text-gray-400">
                      {c.freelancer > 0 ? formatCurrency(c.freelancer) : <span className="text-gray-700">—</span>}
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
                <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalDanilo)}</td>
                <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalCogs)}</td>
                <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalOpex)}</td>
                <td className="table-td text-right tabular-nums text-gray-400">{formatCurrency(totalFreelancer)}</td>
                <td className="table-td text-right tabular-nums text-emerald-400">{formatCurrency(ebitdaMiniPL)}</td>
                <td className="table-td text-right tabular-nums text-emerald-400">{pct(ebitdaMiniPL, totalFee)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-700 text-center">
        Fonte: Notion · DRE Gerencial · {d.mes}
      </p>

    </div>
    </PeriodFilterBar>
  );
}
