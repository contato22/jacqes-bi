import { dreGerencial, miniPLContas, miniPLMes } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import { Info } from "lucide-react";

function pct(value: number, total: number) {
  if (!total) return "—";
  return ((value / total) * 100).toFixed(1) + "%";
}

// ── DRE helpers ──────────────────────────────────────────────────────────────

interface DRERowProps {
  label: string;
  valor: number;
  estimativa?: boolean;
  nota?: string;
  indent?: boolean;
  negativo?: boolean; // render as (valor) in red
}

function DRERow({ label, valor, estimativa, nota, indent = false, negativo = false }: DRERowProps) {
  if (valor === 0 && negativo) return null; // hide zero-cost rows
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-800/40 last:border-0">
      <div className={cn("flex items-center gap-1.5", indent && "pl-5")}>
        <span className="text-sm text-gray-400">{label}</span>
        {estimativa && (
          <span title={nota || "Estimativa — atualizar mensalmente"}>
            <Info size={11} className="text-gray-600 hover:text-gray-400 cursor-help" />
          </span>
        )}
      </div>
      <span className={cn("text-sm tabular-nums", negativo ? "text-red-400/80" : "text-gray-300")}>
        {negativo ? `(${formatCurrency(valor)})` : formatCurrency(valor)}
      </span>
    </div>
  );
}

interface DRESumRowProps {
  label: string;
  valor: number;
  pctOfRec?: number;
  highlight?: boolean;
}

function DRESumRow({ label, valor, pctOfRec, highlight = false }: DRESumRowProps) {
  const positive = valor >= 0;
  return (
    <div className={cn(
      "flex items-center justify-between py-3 border-t border-gray-700 mt-1",
      highlight && "bg-gray-800/30 rounded-lg px-3 -mx-3"
    )}>
      <span className={cn("text-sm font-bold", highlight ? "text-white" : "text-gray-200")}>{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-bold tabular-nums", positive ? "text-emerald-400" : "text-red-400")}>
          {formatCurrency(valor)}
        </span>
        {pctOfRec !== undefined && (
          <span className="text-xs text-gray-600 tabular-nums">
            {pct(valor, pctOfRec)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FinancialPage() {
  const d = dreGerencial;

  // ── Receita Bruta ─────────────────────────────────────────────────────────
  const recBruta =
    d.receitaBruta.recorrente +
    d.receitaBruta.projetoSetup +
    d.receitaBruta.variavel +
    d.receitaBruta.extraordinaria;

  // ── Deduções ─────────────────────────────────────────────────────────────
  const totalDeducoes = d.deducoes.impostosTaxas.valor;
  const recLiquida = recBruta - totalDeducoes;

  // ── Custos Diretos ────────────────────────────────────────────────────────
  const cd = d.custosDiretos;
  const totalCustosDiretos =
    cd.daniloFixo.valor +
    cd.daniloVariavel.valor +
    cd.encargosProvisos.valor +
    cd.deslocamentosVisitas.valor +
    cd.ferramentasDiretas.valor +
    cd.apoioOperacionalFreela.valor +
    cd.outrosCustosDiretos.valor;

  const margemBruta = recLiquida - totalCustosDiretos;

  // ── Despesas Operacionais ─────────────────────────────────────────────────
  const do_ = d.despesasOperacionais;
  const totalDespesasOp =
    do_.coordenacaoSupervisao.valor +
    do_.ferramentasCompartilhadas.valor +
    do_.administrativoRateado.valor +
    do_.desenvolvimentoProcessoBI.valor +
    do_.outrosOverheads.valor;

  const resultadoOperacional = margemBruta - totalDespesasOp;

  // ── Ajustes Imputados ─────────────────────────────────────────────────────
  const ai = d.ajustesImputados;
  const totalAjustes = ai.custoFounderEstrategico.valor + ai.overheadExtra.valor;

  const ebitdaAjustado = resultadoOperacional - totalAjustes;

  // ── Mini P&L por conta (mantido como detalhe de suporte) ─────────────────
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
          {d.mes} · {contasAtivas.length} contas ativas ·{" "}
          <span className="text-gray-600">
            <Info size={10} className="inline mr-0.5" />
            campos com estimativa são rateios — atualizar mensalmente
          </span>
        </p>
      </div>

      {/* ── KPI Summary ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Receita Bruta",         valor: recBruta,           color: "text-emerald-400" },
          { label: "Margem Bruta",           valor: margemBruta,        color: margemBruta  >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Resultado Operacional",  valor: resultadoOperacional,color: resultadoOperacional >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "EBITDA Ajustado",        valor: ebitdaAjustado,     color: ebitdaAjustado >= 0 ? "text-emerald-400" : "text-red-400" },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <div className={cn("text-xl font-bold tabular-nums", k.color)}>
              {formatCurrency(k.valor)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{k.label}</div>
            <div className="text-[10px] text-gray-700 mt-1 tabular-nums">
              {pct(k.valor, recBruta)} da Rec. Bruta
            </div>
          </div>
        ))}
      </div>

      {/* ── DRE Gerencial — Waterfall ─────────────────────────────────────────── */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-white mb-1">DRE Gerencial — JACQES BU</h2>
        <p className="text-xs text-gray-600 mb-5">{d.mes} · Valores em R$ · * = estimativa/rateio</p>

        {/* 1. Receita Bruta */}
        <div className="mb-1">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Receita Bruta
          </div>
          {d.receitaBruta.recorrente > 0 && (
            <DRERow label="Recorrente (FEE mensal)" valor={d.receitaBruta.recorrente} indent />
          )}
          {d.receitaBruta.projetoSetup > 0 && (
            <DRERow label="Projeto / Setup" valor={d.receitaBruta.projetoSetup} indent />
          )}
          {d.receitaBruta.variavel > 0 && (
            <DRERow label="Variável / Performance" valor={d.receitaBruta.variavel} indent />
          )}
          {d.receitaBruta.extraordinaria > 0 && (
            <DRERow label="Extraordinária" valor={d.receitaBruta.extraordinaria} indent />
          )}
          <DRESumRow label="= Receita Bruta" valor={recBruta} />
        </div>

        {/* 2. Deduções */}
        <div className="mt-4 mb-1">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Deduções
          </div>
          <DRERow
            label={d.deducoes.impostosTaxas.label}
            valor={d.deducoes.impostosTaxas.valor}
            estimativa={d.deducoes.impostosTaxas.estimativa}
            nota={d.deducoes.impostosTaxas.nota}
            indent
            negativo
          />
          <DRESumRow label="= Receita Líquida" valor={recLiquida} pctOfRec={recBruta} />
        </div>

        {/* 3. Custos Diretos */}
        <div className="mt-4 mb-1">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Custos Diretos
          </div>
          {[cd.daniloFixo, cd.daniloVariavel, cd.encargosProvisos, cd.deslocamentosVisitas, cd.ferramentasDiretas, cd.apoioOperacionalFreela, cd.outrosCustosDiretos].map((linha) => (
            <DRERow key={linha.label} label={linha.label} valor={linha.valor} estimativa={linha.estimativa} nota={linha.nota} indent negativo />
          ))}
          <DRESumRow label="= Margem Bruta" valor={margemBruta} pctOfRec={recBruta} />
        </div>

        {/* 4. Despesas Operacionais */}
        <div className="mt-4 mb-1">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Despesas Operacionais da BU
          </div>
          {[do_.coordenacaoSupervisao, do_.ferramentasCompartilhadas, do_.administrativoRateado, do_.desenvolvimentoProcessoBI, do_.outrosOverheads].map((linha) => (
            linha.valor > 0 ? (
              <DRERow key={linha.label} label={linha.label} valor={linha.valor} estimativa={linha.estimativa} nota={linha.nota} indent negativo />
            ) : null
          ))}
          <DRESumRow label="= Resultado Operacional da BU" valor={resultadoOperacional} pctOfRec={recBruta} />
        </div>

        {/* 5. Ajustes Imputados */}
        <div className="mt-4 mb-1">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Ajustes Imputados
          </div>
          {[ai.custoFounderEstrategico, ai.overheadExtra].map((linha) => (
            linha.valor > 0 ? (
              <DRERow key={linha.label} label={linha.label} valor={linha.valor} estimativa={linha.estimativa} nota={linha.nota} indent negativo />
            ) : null
          ))}
          <DRESumRow label="= EBITDA Ajustado / Contribuição Real da BU" valor={ebitdaAjustado} pctOfRec={recBruta} highlight />
        </div>

        {/* Legenda estimativas */}
        <p className="mt-5 text-[10px] text-gray-700 flex items-center gap-1">
          <Info size={10} />
          Campos marcados com * são rateios ou estimativas — devem ser revisados e confirmados mensalmente com a AWQ.
        </p>
      </div>

      {/* ── Mini P&L por conta (detalhe de suporte) ───────────────────────────── */}
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

      {/* ── Composição do Custo Direto ────────────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Composição do Custo Direto</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Danilo (fixo+var+enc.)", valor: cd.daniloFixo.valor + cd.daniloVariavel.valor + cd.encargosProvisos.valor, color: "bg-brand-500" },
            { label: "Ferramentas diretas",    valor: cd.ferramentasDiretas.valor,       color: "bg-yellow-500" },
            { label: "Freelancer",             valor: cd.apoioOperacionalFreela.valor,   color: "bg-purple-500" },
            { label: "Outros diretos",         valor: cd.deslocamentosVisitas.valor + cd.outrosCustosDiretos.valor, color: "bg-cyan-500" },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{item.label}</span>
                <span className="tabular-nums">{pct(item.valor, totalCustosDiretos)}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: totalCustosDiretos > 0 ? `${(item.valor / totalCustosDiretos) * 100}%` : "0%" }}
                />
              </div>
              <div className="text-xs text-gray-500 tabular-nums">{formatCurrency(item.valor)}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-700 text-center">
        Fonte: Notion · DRE Gerencial · {d.mes} · * campos com estimativa
      </p>

    </div>
    </PeriodFilterBar>
  );
}
