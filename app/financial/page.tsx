"use client";

import { useState } from "react";
import { dreGerencial, miniPLContas, miniPLMes, type DRELinha } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import FluxoCaixaChart from "@/components/FluxoCaixaChart";
import { Database, Edit3, GitBranch } from "lucide-react";

type Tab = "dre" | "fluxo";

function pct(value: number, total: number) {
  if (!total) return "—";
  return ((value / total) * 100).toFixed(1) + "%";
}

// ── DRE helpers ───────────────────────────────────────────────────────────────

const fonteConfig = {
  notion:   { icon: Database,   cls: "text-emerald-600", title: "Direto do Notion Mini P&L" },
  derivado: { icon: GitBranch,  cls: "text-brand-600",   title: "Calculado a partir do Notion" },
  manual:   { icon: Edit3,      cls: "text-orange-600",  title: "Preencher mensalmente na base de dados" },
};

function DRELineItem({ linha, negativo = false }: { linha: DRELinha; negativo?: boolean }) {
  const isZero = linha.valor === 0;
  const isManualEmpty = isZero && linha.fonte === "manual";
  const { icon: FonIcon, cls: fonCls, title: fonTitle } = fonteConfig[linha.fonte];

  return (
    <div className={cn(
      "flex items-center justify-between py-2 border-b border-gray-800/30 last:border-0",
      isManualEmpty && "opacity-60"
    )}>
      <div className="flex items-center gap-1.5 pl-5">
        <span title={fonTitle}>
          <FonIcon size={10} className={fonCls} />
        </span>
        <span className={cn("text-sm", isManualEmpty ? "text-gray-600" : "text-gray-400")}>
          {linha.label}
        </span>
        {isManualEmpty && (
          <span className="text-[10px] text-orange-700 font-medium">a preencher</span>
        )}
      </div>
      <span className={cn(
        "text-sm tabular-nums",
        isManualEmpty
          ? "text-gray-700"
          : negativo
          ? "text-red-400/80"
          : "text-gray-300"
      )}>
        {isManualEmpty
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
  const [tab, setTab] = useState<Tab>("dre");
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
        <h1 className="text-xl font-bold text-white">Financial · JACQES BU</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {d.mes} · {contasAtivas.length} contas ativas ·{" "}
          <span className="text-orange-700 text-xs">
            campos marcados <Edit3 size={10} className="inline" /> precisam ser preenchidos mensalmente
          </span>
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 border-b border-gray-800">
        {([
          { id: "dre",   label: "DRE Gerencial"   },
          { id: "fluxo", label: "Fluxo de Caixa"  },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all",
              tab === t.id
                ? "text-brand-300 border-brand-400 bg-brand-600/10"
                : "text-gray-500 border-transparent hover:text-gray-200 hover:bg-gray-800/50"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Fluxo de Caixa tab ── */}
      {tab === "fluxo" && <FluxoCaixaChart />}

      {/* ── DRE tab ── */}
      {tab === "dre" && <>

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
          <div className="flex items-center gap-3 text-[10px] text-gray-600">
            <span className="flex items-center gap-1"><Database size={9} className="text-emerald-600" /> Notion</span>
            <span className="flex items-center gap-1"><GitBranch size={9} className="text-brand-600" /> Derivado</span>
            <span className="flex items-center gap-1"><Edit3 size={9} className="text-orange-600" /> Manual</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-4">{d.mes} · Valores em R$ · campos <span className="text-orange-700">a preencher</span> não existem na base — atualizar mensalmente em lib/data.ts</p>

        {/* ─ 1. Receita Bruta ─ */}
        <DRESectionHeader label="Receita Bruta" />
        <DRELineItem linha={{ label: "Receita recorrente",    valor: d.receitaBruta.recorrente,    fonte: "notion",  nota: "Notion Mini P&L · soma dos FEEs das contas" }} />
        <DRELineItem linha={{ label: "Receita projeto/setup", valor: d.receitaBruta.projetoSetup,  fonte: "manual",  nota: "Preencher mensalmente" }} />
        <DRELineItem linha={{ label: "Receita variável",      valor: d.receitaBruta.variavel,      fonte: "manual",  nota: "Preencher mensalmente" }} />
        <DRELineItem linha={{ label: "Receita extraordinária",valor: d.receitaBruta.extraordinaria,fonte: "manual",  nota: "Preencher mensalmente" }} />
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
        <div className="mt-5 pt-4 border-t border-gray-800 flex flex-wrap gap-4 text-[10px] text-gray-600">
          <span className="flex items-center gap-1.5"><Database size={10} className="text-emerald-600" /> Direto do Notion Mini P&L</span>
          <span className="flex items-center gap-1.5"><GitBranch size={10} className="text-brand-600" /> Calculado/derivado do Notion</span>
          <span className="flex items-center gap-1.5"><Edit3 size={10} className="text-orange-600" /> Não existe na base — preencher mensalmente em <code className="bg-gray-800 px-1 rounded">lib/data.ts</code></span>
        </div>
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

      </>}
    </div>
    </PeriodFilterBar>
  );
}
