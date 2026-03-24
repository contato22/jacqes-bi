"use client";

import { useState } from "react";
import {
  dreGerencial,
  miniPLContas,
  miniPLMes,
  contasReceber,
  contasPagar,
  inventarioData,
  fluxoAnualHistorico,
  fluxoAnualGrowth,
  type DRELinha,
  type ContaReceber,
  type ContaPagar,
  type InventarioItem,
  type FluxoAnualMes,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import FluxoCaixaChart from "@/components/FluxoCaixaChart";
import FluxoCaixaBreakdown from "@/components/FluxoCaixaBreakdown";
import {
  Database, Edit3, GitBranch, Calendar, TrendingUp, TrendingDown,
  Package, FileText, AlertTriangle, CheckCircle, Clock,
} from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";

type Tab = "dre" | "fluxo" | "minipl" | "ar_ap" | "estoque" | "anual";

// ── available months ──────────────────────────────────────────────────────────

const MESES = [
  { key: "jan", label: "Jan", fullLabel: "Janeiro 2026",   hasData: false },
  { key: "fev", label: "Fev", fullLabel: "Fevereiro 2026", hasData: false },
  { key: "mar", label: "Mar", fullLabel: "Março 2026",     hasData: true  },
  { key: "abr", label: "Abr", fullLabel: "Abril 2026",     hasData: false },
  { key: "mai", label: "Mai", fullLabel: "Maio 2026",      hasData: false },
  { key: "jun", label: "Jun", fullLabel: "Junho 2026",     hasData: false },
];

// ── inline month picker ───────────────────────────────────────────────────────

function MesPicker({
  selectedKey,
  onChange,
}: {
  selectedKey: string;
  onChange: (key: string) => void;
}) {
  const idx = MESES.findIndex((m) => m.key === selectedKey);
  const prev = idx > 0 ? MESES[idx - 1] : null;
  const next = idx < MESES.length - 1 ? MESES[idx + 1] : null;
  const current = MESES[idx];

  return (
    <div className="flex items-center gap-3 self-start">
      <div className="flex items-center bg-gray-800/60 border border-gray-700/50 rounded-lg p-0.5">
        {MESES.map((m) => {
          const isSelected = m.key === selectedKey;
          const isFuture = !m.hasData && m.key !== "mar";
          return (
            <button
              key={m.key}
              disabled={!m.hasData}
              title={m.hasData ? m.fullLabel : `${m.fullLabel} — sem dados`}
              onClick={() => m.hasData && onChange(m.key)}
              className={cn(
                "relative px-2.5 py-1.5 text-xs font-medium rounded-md transition-all",
                isSelected
                  ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                  : m.hasData
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  : "text-gray-700 cursor-not-allowed",
              )}
            >
              {m.label}
              {!isFuture && (
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                    m.hasData ? "bg-emerald-500" : "bg-gray-700",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600">
        <Calendar size={11} />
        <span>{current?.fullLabel ?? "—"}</span>
      </div>
    </div>
  );
}

// ── DRE helpers ───────────────────────────────────────────────────────────────

function pct(value: number, total: number) {
  if (!total) return "—";
  return ((value / total) * 100).toFixed(1) + "%";
}

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

// ── page ──────────────────────────────────────────────────────────────────────

export default function FinancialPage() {
  const [tab, setTab] = useState<Tab>("dre");
  const [mesSelecionado, setMesSelecionado] = useState("mar");

  const d = dreGerencial;

  const recBruta =
    d.receitaBruta.recorrente +
    d.receitaBruta.projetoSetup +
    d.receitaBruta.variavel +
    d.receitaBruta.extraordinaria;

  const totalDeducoes = d.deducoes.impostosTaxas.valor;
  const recLiquida = recBruta - totalDeducoes;

  // ── Custos Variáveis → Margem de Contribuição ────────────────────────────
  const cv = d.custosVariaveis;
  const totalCustosVariaveis =
    cv.daniloVariavel.valor + cv.ferramentasDiretas.valor +
    cv.apoioOperacionalFreela.valor + cv.deslocamentosVisitas.valor +
    cv.outrosCustosVariaveis.valor;
  const margemContribuicao = recLiquida - totalCustosVariaveis;
  const mcPct = recLiquida > 0 ? (margemContribuicao / recLiquida) * 100 : 0;

  // ── Custos Fixos → Margem Bruta ──────────────────────────────────────────
  const cf = d.custosFixos;
  const totalCustosFixos =
    cf.daniloFixo.valor + cf.encargosProvisos.valor + cf.outrosCustosFixos.valor;
  const margemBruta = margemContribuicao - totalCustosFixos;

  const do_ = d.despesasOperacionais;
  const totalDespesasOp =
    do_.coordenacaoSupervisao.valor + do_.ferramentasCompartilhadas.valor +
    do_.administrativoRateado.valor + do_.desenvolvimentoProcessoBI.valor +
    do_.outrosOverheads.valor;

  const resultadoOperacional = margemBruta - totalDespesasOp;

  const ai = d.ajustesImputados;
  const totalAjustes = ai.custoFounderEstrategico.valor + ai.overheadExtra.valor;

  const ebitdaAjustado = resultadoOperacional - totalAjustes;

  const contasAtivas   = miniPLContas.filter((c) => c.fee > 0);
  const totalFee       = miniPLContas.reduce((s, c) => s + c.fee,        0);
  const totalDanilo    = miniPLContas.reduce((s, c) => s + c.danilo,     0);
  const totalCogs      = miniPLContas.reduce((s, c) => s + c.cogs,       0);
  const totalFreelancer= miniPLContas.reduce((s, c) => s + c.freelancer, 0);
  const totalOpex      = miniPLContas.reduce((s, c) => s + c.opex,       0);
  const ebitdaMiniPL   = totalFee - totalDanilo - totalCogs - totalFreelancer - totalOpex;

  const mesObj = MESES.find((m) => m.key === mesSelecionado) ?? MESES[2];
  const semDados = !mesObj.hasData;

  const TABS: { id: Tab; label: string }[] = [
    { id: "dre",    label: "DRE Gerencial"  },
    { id: "fluxo",  label: "Fluxo de Caixa" },
    { id: "minipl", label: "Mini P&L"       },
    { id: "ar_ap",  label: "AR & AP"        },
    { id: "estoque", label: "Inventário"    },
    { id: "anual",  label: "Fluxo Anual"   },
  ];

  return (
    <div className="page-content">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-bold text-white">Financial · JACQES</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {contasAtivas.length} contas ativas ·{" "}
          <span className="text-orange-700 text-xs">
            campos <Edit3 size={10} className="inline" /> precisam ser preenchidos mensalmente
          </span>
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 border-b border-gray-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all",
              tab === t.id
                ? "text-brand-300 border-brand-400 bg-brand-600/10"
                : "text-gray-500 border-transparent hover:text-gray-200 hover:bg-gray-800/50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Per-tab month picker ── */}
      <div className="flex items-center justify-between gap-4 py-2">
        <MesPicker selectedKey={mesSelecionado} onChange={setMesSelecionado} />
        {semDados && (
          <span className="text-xs text-gray-600 flex items-center gap-1.5">
            <Calendar size={11} />
            Sem dados para {mesObj.fullLabel} — disponível em Março 2026
          </span>
        )}
      </div>

      {/* ── no-data state ── */}
      {semDados ? (
        <div className="flex items-center gap-2 text-xs text-gray-700 border border-gray-800 rounded-xl p-4 bg-gray-900/50">
          <Calendar size={13} className="shrink-0 text-gray-600" />
          <span>
            Sem dados financeiros para{" "}
            <span className="text-gray-500 font-medium">{mesObj.fullLabel}</span>. Dados
            disponíveis apenas em <span className="text-brand-400">Março 2026</span>.
          </span>
        </div>
      ) : (
        <>
          {/* ── Fluxo de Caixa tab ── */}
          {tab === "fluxo" && (
            <div className="space-y-4">
              <FluxoCaixaChart />
              <FluxoCaixaBreakdown />
            </div>
          )}

          {/* ── DRE tab ── */}
          {tab === "dre" && (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {[
                  { label: "Receita Bruta",         valor: recBruta,             color: "text-emerald-400",                                                              pctVal: 100                  },
                  { label: "MC — Margem Contribuição", valor: margemContribuicao, color: margemContribuicao >= 0 ? "text-blue-400"    : "text-red-400", pctVal: margemContribuicao, suffix: mcPct.toFixed(1) + "%" },
                  { label: "Margem Bruta",           valor: margemBruta,          color: margemBruta  >= 0 ? "text-emerald-400" : "text-red-400",                         pctVal: margemBruta          },
                  { label: "Resultado Operacional",  valor: resultadoOperacional, color: resultadoOperacional >= 0 ? "text-emerald-400" : "text-red-400",                  pctVal: resultadoOperacional },
                  { label: "EBITDA Ajustado",        valor: ebitdaAjustado,       color: ebitdaAjustado >= 0 ? "text-emerald-400" : "text-red-400",                        pctVal: ebitdaAjustado       },
                ].map((k) => (
                  <div key={k.label} className="card p-5">
                    <div className={cn("text-xl font-bold tabular-nums", k.color)}>
                      {formatCurrency(k.valor)}
                    </div>
                    {"suffix" in k && k.suffix && (
                      <div className="text-xs text-blue-400 font-semibold mt-0.5">{k.suffix}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{k.label}</div>
                    <div className="text-[10px] text-gray-700 mt-1 tabular-nums">
                      {pct(k.pctVal, recBruta)} da Rec. Bruta
                    </div>
                  </div>
                ))}
              </div>

              {/* DRE Waterfall */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-white">DRE Gerencial — JACQES</h2>
                  <div className="flex items-center gap-3 text-[10px] text-gray-600">
                    <span className="flex items-center gap-1"><Database size={9} className="text-emerald-600" /> Notion</span>
                    <span className="flex items-center gap-1"><GitBranch size={9} className="text-brand-600" /> Derivado</span>
                    <span className="flex items-center gap-1"><Edit3 size={9} className="text-orange-600" /> Manual</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  {d.mes} · Valores em R$ · campos{" "}
                  <span className="text-orange-700">a preencher</span> não existem na base — atualizar mensalmente em lib/data.ts
                </p>

                <DRESectionHeader label="Receita Bruta" />
                <DRELineItem linha={{ label: "Receita recorrente",    valor: d.receitaBruta.recorrente,    fonte: "notion",  nota: "" }} />
                <DRELineItem linha={{ label: "Receita projeto/setup", valor: d.receitaBruta.projetoSetup,  fonte: "manual",  nota: "" }} />
                <DRELineItem linha={{ label: "Receita variável",      valor: d.receitaBruta.variavel,      fonte: "manual",  nota: "" }} />
                <DRELineItem linha={{ label: "Receita extraordinária",valor: d.receitaBruta.extraordinaria,fonte: "manual",  nota: "" }} />
                <DRESumRow label="= Receita Bruta" valor={recBruta} recBruta={recBruta} />

                <DRESectionHeader label="(-) Deduções" />
                <DRELineItem linha={d.deducoes.impostosTaxas} negativo />
                <DRESumRow label="= Receita Líquida" valor={recLiquida} recBruta={recBruta} />

                <DRESectionHeader label="(-) Custos Variáveis Diretos" />
                <DRELineItem linha={cv.daniloVariavel} negativo />
                <DRELineItem linha={cv.ferramentasDiretas} negativo />
                <DRELineItem linha={cv.apoioOperacionalFreela} negativo />
                <DRELineItem linha={cv.deslocamentosVisitas} negativo />
                <DRELineItem linha={cv.outrosCustosVariaveis} negativo />
                <div className="flex items-center justify-between py-3 border-t border-blue-800/60 mt-0.5 bg-blue-900/10 rounded-xl px-4 -mx-4 border border-blue-700/30">
                  <div>
                    <span className="font-semibold text-sm text-blue-200">= Margem de Contribuição (MC)</span>
                    <span className="ml-3 text-xs text-blue-400 font-semibold">{mcPct.toFixed(1)}% da Rec. Líquida</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("font-bold tabular-nums text-base", margemContribuicao >= 0 ? "text-blue-300" : "text-red-400")}>
                      {formatCurrency(margemContribuicao)}
                    </span>
                    <span className="text-xs text-gray-600 tabular-nums w-14 text-right">
                      {pct(margemContribuicao, recBruta)}
                    </span>
                  </div>
                </div>

                <DRESectionHeader label="(-) Custos Fixos Diretos" />
                <DRELineItem linha={cf.daniloFixo} negativo />
                <DRELineItem linha={cf.encargosProvisos} negativo />
                <DRELineItem linha={cf.outrosCustosFixos} negativo />
                <DRESumRow label="= Margem Bruta" valor={margemBruta} recBruta={recBruta} />

                <DRESectionHeader label="(-) Despesas Operacionais da BU" />
                <DRELineItem linha={do_.coordenacaoSupervisao} negativo />
                <DRELineItem linha={do_.ferramentasCompartilhadas} negativo />
                <DRELineItem linha={do_.administrativoRateado} negativo />
                <DRELineItem linha={do_.desenvolvimentoProcessoBI} negativo />
                <DRELineItem linha={do_.outrosOverheads} negativo />
                <DRESumRow label="= Resultado Operacional da BU" valor={resultadoOperacional} recBruta={recBruta} />

                <DRESectionHeader label="(-) Ajustes Imputados" />
                <DRELineItem linha={ai.custoFounderEstrategico} negativo />
                <DRELineItem linha={ai.overheadExtra} negativo />
                <DRESumRow
                  label="= EBITDA Ajustado / Contribuição Real da BU"
                  valor={ebitdaAjustado}
                  recBruta={recBruta}
                  highlight
                />

                <div className="mt-5 pt-4 border-t border-gray-800 flex flex-wrap gap-4 text-[10px] text-gray-600">
                  <span className="flex items-center gap-1.5"><Database size={10} className="text-emerald-600" /> Direto do Notion Mini P&L</span>
                  <span className="flex items-center gap-1.5"><GitBranch size={10} className="text-brand-600" /> Calculado/derivado do Notion</span>
                  <span className="flex items-center gap-1.5"><Edit3 size={10} className="text-orange-600" /> Não existe na base — preencher mensalmente em <code className="bg-gray-800 px-1 rounded">lib/data.ts</code></span>
                </div>
              </div>
            </>
          )}

          {/* ── Mini P&L tab ── */}
          {tab === "minipl" && (
            <div className="space-y-4">

              {/* Mini P&L per account */}
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-white mb-1">Mini P&L · Por Conta</h2>
                <p className="text-xs text-gray-500 mb-4">
                  Fonte: Notion · {miniPLMes} · {contasAtivas.length} contas ativas
                </p>

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

              {/* Ponte com Fluxo de Caixa */}
              <div className="card p-6">
                <h2 className="text-sm font-semibold text-white mb-1">
                  Ponte Mini P&L → Fluxo de Caixa
                </h2>
                <p className="text-xs text-gray-500 mb-5">
                  Como os números do Mini P&L se conectam ao caixa — {d.mes}
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      label: "FEE recorrente",
                      tipo: "entrada",
                      valor: totalFee,
                      dreRef: "Receita Bruta → Entradas de caixa",
                      badge: "badge-green",
                      badgeLabel: "Notion",
                      nota: "Receita reconhecida = caixa recebido (regime de caixa)",
                    },
                    {
                      label: "Remuneração Danilo (fixo + variável)",
                      tipo: "saida",
                      valor: totalDanilo,
                      dreRef: "Custos Diretos → Saídas de caixa",
                      badge: "badge-red",
                      badgeLabel: "Notion",
                      nota: `Fixo R$2.000 + Variável R$484 = ${formatCurrency(totalDanilo)}`,
                    },
                    {
                      label: "COGS — Ferramentas diretas",
                      tipo: "saida",
                      valor: totalCogs,
                      dreRef: "Custos Diretos → Saídas de caixa",
                      badge: "badge-red",
                      badgeLabel: "Notion",
                      nota: "Ferramentas e plataformas diretas de entrega",
                    },
                    {
                      label: "Freelancer / Apoio operacional",
                      tipo: "saida",
                      valor: totalFreelancer,
                      dreRef: "Custos Diretos → Saídas de caixa",
                      badge: "badge-red",
                      badgeLabel: "Notion",
                      nota: "Apoio operacional externo faturado no mês",
                    },
                    {
                      label: "OPEX e overheads",
                      tipo: "saida",
                      valor: totalOpex,
                      dreRef: "Despesas Op. → Saídas de caixa",
                      badge: "badge text-orange-600 bg-orange-900/20",
                      badgeLabel: "Manual",
                      nota: totalOpex === 0 ? "Sem dados — preencher mensalmente" : `R$${totalOpex.toLocaleString("pt-BR")}`,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-start justify-between gap-4 p-3.5 rounded-xl border",
                        row.tipo === "entrada"
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : row.valor === 0 && row.badgeLabel === "Manual"
                          ? "bg-orange-500/5 border-orange-500/20 opacity-70"
                          : "bg-red-500/5 border-red-500/20",
                      )}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-200">{row.label}</span>
                          <span className={`badge text-[10px] ${row.badge}`}>{row.badgeLabel}</span>
                          {row.valor === 0 && row.badgeLabel === "Manual" && (
                            <span className="text-[10px] text-orange-700 font-medium">sem dados</span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-600">{row.dreRef}</div>
                        <div className="text-[10px] text-gray-700">{row.nota}</div>
                      </div>
                      <div className={cn(
                        "text-sm font-bold tabular-nums shrink-0",
                        row.tipo === "entrada" ? "text-emerald-400" : row.valor === 0 ? "text-gray-700" : "text-red-400",
                      )}>
                        {row.valor > 0
                          ? (row.tipo === "saida" ? `(${formatCurrency(row.valor)})` : formatCurrency(row.valor))
                          : "—"}
                      </div>
                    </div>
                  ))}

                  {/* EBITDA bridge */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 mt-2">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-white">
                        = EBITDA Mini P&L / Saldo projetado de caixa
                      </div>
                      <div className="text-xs text-gray-500">
                        FEE − Danilo − COGS − Freelancer − OPEX
                      </div>
                    </div>
                    <div className={cn(
                      "text-xl font-bold tabular-nums",
                      ebitdaMiniPL >= 0 ? "text-emerald-400" : "text-red-400",
                    )}>
                      {formatCurrency(ebitdaMiniPL)}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-700 mt-4 leading-relaxed">
                  Nota: itens com <span className="text-orange-700">sem dados</span> (impostos, encargos,
                  overhead) não estão refletidos no EBITDA Mini P&L mas existem no caixa real —
                  preencher mensalmente para reconciliação completa.
                </p>
              </div>

              <p className="text-xs text-gray-700 text-center">
                Fonte: Notion · Mini P&L · {d.mes}
              </p>
            </div>
          )}

          {/* ── AR & AP tab ── */}
          {tab === "ar_ap" && <ARAPTab />}

          {/* ── Inventário tab ── */}
          {tab === "estoque" && <EstoqueTab />}

          {/* ── Anual tab ── */}
          {tab === "anual" && (() => {
            // Build 12-month data connected to current DRE values
            const receitaMar = recBruta;  // from dreGerencial (live)
            const custosMar  = totalCustosVariaveis + totalCustosFixos;
            const meses: FluxoAnualMes[] = [
              ...fluxoAnualHistorico,
              { mes: "Mar", mesIdx: 3, tipo: "atual",     receita: receitaMar, custos: custosMar, resultado: receitaMar - custosMar },
              ...fluxoAnualGrowth.map((g, i) => {
                const rec = Math.round(receitaMar * g);
                const cus = Math.round(custosMar  * (1 + (g - 1) * 0.3));
                return { mes: ["Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][i], mesIdx: i + 4, tipo: "projetado" as const, receita: rec, custos: cus, resultado: rec - cus };
              }),
            ];

            // cumulative caixa from April (March ending = caixaAtual from awqBus JACQES)
            const caixaBase = 8000;
            let acum = caixaBase;
            const comCaixa = meses.map((m, idx) => {
              if (idx >= 3) { acum += m.resultado; return { ...m, caixaFim: acum }; }
              return { ...m, caixaFim: null };
            });

            const totalReceita = meses.reduce((s, m) => s + m.receita, 0);
            const totalCustos  = meses.reduce((s, m) => s + m.custos, 0);
            const totalResult  = meses.reduce((s, m) => s + m.resultado, 0);

            return (
              <div className="space-y-4">
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Receita Anual Projetada",  valor: totalReceita, color: "text-emerald-400" },
                    { label: "Custos Anuais Projetados", valor: totalCustos,  color: "text-red-400"     },
                    { label: "Resultado Anual",          valor: totalResult,  color: totalResult >= 0 ? "text-brand-400" : "text-red-400" },
                  ].map((k) => (
                    <div key={k.label} className="card p-5">
                      <div className={cn("text-xl font-bold tabular-nums", k.color)}>{formatCurrency(k.valor)}</div>
                      <div className="text-xs text-gray-500 mt-1">{k.label}</div>
                      <div className="text-[10px] text-gray-700 mt-0.5">Jan–Dez 2026</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="card p-5">
                  <h2 className="text-sm font-semibold text-white mb-1">Fluxo Anual · JACQES · 2026</h2>
                  <p className="text-xs text-gray-500 mb-4">
                    Jan–Fev histórico · Mar atual · Abr–Dez projetado
                  </p>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={comCaixa} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "8px", fontSize: 12 }}
                        formatter={(value: number, name: string) => [formatCurrency(value), name]}
                        labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                      />
                      <Bar dataKey="receita" name="Receita" radius={[4,4,0,0]}>
                        {comCaixa.map((m) => (
                          <Cell key={m.mes} fill={m.tipo === "atual" ? "#6366f1" : m.tipo === "historico" ? "#374151" : "#10b981"} fillOpacity={0.7} />
                        ))}
                      </Bar>
                      <Bar dataKey="custos" name="Custos" fill="#ef4444" fillOpacity={0.5} radius={[4,4,0,0]} />
                      <Line dataKey="resultado" name="Resultado" type="monotone" stroke="#818cf8" strokeWidth={2} dot={{ fill: "#818cf8", r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-600">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-600 inline-block" /> Histórico</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500 inline-block" /> Atual (Mar)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Projetado</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-brand-400 inline-block rounded" /> Resultado</span>
                  </div>
                </div>

                {/* Table */}
                <div className="card p-5">
                  <h2 className="text-sm font-semibold text-white mb-4">Detalhamento Mensal</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="table-th">Mês</th>
                          <th className="table-th">Tipo</th>
                          <th className="table-th text-right">Receita</th>
                          <th className="table-th text-right">Custos</th>
                          <th className="table-th text-right">Resultado</th>
                          <th className="table-th text-right">Margem</th>
                          <th className="table-th text-right">Caixa (fim)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {comCaixa.map((m) => {
                          const margem = m.receita > 0 ? (m.resultado / m.receita) * 100 : 0;
                          return (
                            <tr key={m.mes} className={m.tipo === "atual" ? "bg-brand-500/5" : ""}>
                              <td className="table-td font-semibold text-white">{m.mes}</td>
                              <td className="table-td">
                                <span className={cn("badge text-[10px]",
                                  m.tipo === "historico" ? "badge" :
                                  m.tipo === "atual" ? "badge-blue" : "badge-green"
                                )}>
                                  {m.tipo === "historico" ? "Histórico" : m.tipo === "atual" ? "Atual" : "Projetado"}
                                </span>
                              </td>
                              <td className="table-td text-right tabular-nums text-emerald-400">{formatCurrency(m.receita)}</td>
                              <td className="table-td text-right tabular-nums text-red-400">{formatCurrency(m.custos)}</td>
                              <td className={cn("table-td text-right tabular-nums font-semibold", m.resultado >= 0 ? "text-brand-400" : "text-red-400")}>
                                {formatCurrency(m.resultado)}
                              </td>
                              <td className={cn("table-td text-right tabular-nums", margem >= 60 ? "text-emerald-400" : margem >= 40 ? "text-yellow-400" : "text-red-400")}>
                                {margem.toFixed(1)}%
                              </td>
                              <td className="table-td text-right tabular-nums text-gray-400">
                                {m.caixaFim !== null ? formatCurrency(m.caixaFim) : <span className="text-gray-700">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-700 font-semibold">
                          <td className="table-td text-gray-500" colSpan={2}>TOTAL 2026</td>
                          <td className="table-td text-right tabular-nums text-emerald-400">{formatCurrency(totalReceita)}</td>
                          <td className="table-td text-right tabular-nums text-red-400">{formatCurrency(totalCustos)}</td>
                          <td className="table-td text-right tabular-nums text-brand-400">{formatCurrency(totalResult)}</td>
                          <td className="table-td text-right tabular-nums text-emerald-400">
                            {totalReceita > 0 ? ((totalResult / totalReceita) * 100).toFixed(1) + "%" : "—"}
                          </td>
                          <td className="table-td text-right text-gray-600">—</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

// ─── AR & AP Tab ──────────────────────────────────────────────────────────────

const statusARConfig: Record<ContaReceber["status"], { label: string; cls: string; icon: typeof CheckCircle }> = {
  recebido:      { label: "Recebido",       cls: "badge-green",                        icon: CheckCircle   },
  a_vencer:      { label: "A Vencer",       cls: "badge-yellow",                       icon: Clock         },
  vencido:       { label: "Vencido",        cls: "badge-red",                          icon: AlertTriangle },
  em_negociacao: { label: "Em Negociação",  cls: "badge badge-blue",                   icon: FileText      },
};

const statusAPConfig: Record<ContaPagar["status"], { label: string; cls: string }> = {
  pago:          { label: "Pago",           cls: "badge-green" },
  a_pagar:       { label: "A Pagar",        cls: "badge-yellow" },
  vencido:       { label: "Vencido",        cls: "badge-red"   },
  em_negociacao: { label: "Em Neg.",        cls: "badge-blue"  },
};

const catAPLabel: Record<ContaPagar["categoria"], string> = {
  remuneracao: "Remuneração",
  ferramentas: "Ferramentas",
  freela:      "Freela",
  impostos:    "Impostos",
  overhead:    "Overhead",
  outros:      "Outros",
};

function ARAPTab() {
  const totalAR      = contasReceber.reduce((s, r) => s + r.valor, 0);
  const totalARReceb = contasReceber.filter((r) => r.status === "recebido").reduce((s, r) => s + r.valor, 0);
  const totalARAberto= totalAR - totalARReceb;

  const totalAP     = contasPagar.reduce((s, p) => s + p.valor, 0);
  const totalAPPago = contasPagar.filter((p) => p.status === "pago").reduce((s, p) => s + p.valor, 0);
  const totalAPAberto= totalAP - totalAPPago;

  const saldoLiquido = totalARAberto - totalAPAberto;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-xs text-gray-500 font-medium">A Receber (aberto)</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">{formatCurrency(totalARAberto)}</div>
          <div className="text-[10px] text-gray-700 mt-1">Total emitido: {formatCurrency(totalAR)}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-xs text-gray-500 font-medium">A Pagar (aberto)</span>
          </div>
          <div className="text-xl font-bold text-red-400 tabular-nums">{formatCurrency(totalAPAberto)}</div>
          <div className="text-[10px] text-gray-700 mt-1">Total compromissado: {formatCurrency(totalAP)}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className={saldoLiquido >= 0 ? "text-blue-400" : "text-red-400"} />
            <span className="text-xs text-gray-500 font-medium">Saldo Líquido</span>
          </div>
          <div className={cn("text-xl font-bold tabular-nums", saldoLiquido >= 0 ? "text-blue-400" : "text-red-400")}>
            {formatCurrency(saldoLiquido)}
          </div>
          <div className="text-[10px] text-gray-700 mt-1">AR aberto − AP aberto</div>
        </div>
      </div>

      {/* Contas a Receber */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-1">Contas a Receber (AR)</h2>
        <p className="text-xs text-gray-500 mb-4">Março 2026 · {contasReceber.length} lançamentos</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="table-th">Conta</th>
                <th className="table-th">Descrição</th>
                <th className="table-th">Vencimento</th>
                <th className="table-th text-right">Valor</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contasReceber.map((r) => {
                const cfg = statusARConfig[r.status];
                const Icon = cfg.icon;
                return (
                  <tr key={r.id}>
                    <td className="table-td font-medium text-white">{r.conta}</td>
                    <td className="table-td text-gray-400 text-sm">{r.descricao}</td>
                    <td className="table-td text-gray-400 tabular-nums text-sm">
                      {new Date(r.vencimento).toLocaleDateString("pt-BR")}
                    </td>
                    <td className={cn("table-td text-right tabular-nums font-semibold",
                      r.status === "recebido" ? "text-emerald-400" : "text-gray-200"
                    )}>
                      {formatCurrency(r.valor)}
                    </td>
                    <td className="table-td">
                      <span className={`badge ${cfg.cls} flex items-center gap-1 w-fit`}>
                        <Icon size={9} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-700 font-semibold">
                <td className="table-td text-gray-500" colSpan={3}>TOTAL</td>
                <td className="table-td text-right tabular-nums text-emerald-400">{formatCurrency(totalAR)}</td>
                <td className="table-td">
                  <span className="text-[10px] text-gray-600">{formatCurrency(totalARReceb)} recebido</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Contas a Pagar */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-1">Contas a Pagar (AP)</h2>
        <p className="text-xs text-gray-500 mb-4">Março 2026 · {contasPagar.length} lançamentos</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="table-th">Fornecedor</th>
                <th className="table-th">Descrição</th>
                <th className="table-th">Categoria</th>
                <th className="table-th">Vencimento</th>
                <th className="table-th text-right">Valor</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contasPagar.map((p) => {
                const cfg = statusAPConfig[p.status];
                return (
                  <tr key={p.id}>
                    <td className="table-td font-medium text-white">{p.fornecedor}</td>
                    <td className="table-td text-gray-400 text-sm">{p.descricao}</td>
                    <td className="table-td">
                      <span className="badge">{catAPLabel[p.categoria]}</span>
                    </td>
                    <td className="table-td text-gray-400 tabular-nums text-sm">
                      {new Date(p.vencimento).toLocaleDateString("pt-BR")}
                    </td>
                    <td className={cn("table-td text-right tabular-nums font-semibold",
                      p.status === "pago" ? "text-gray-500" :
                      p.valor === 0      ? "text-gray-700" : "text-red-400"
                    )}>
                      {p.valor > 0 ? formatCurrency(p.valor) : <span className="text-gray-700 text-xs">a preencher</span>}
                    </td>
                    <td className="table-td">
                      <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-700 font-semibold">
                <td className="table-td text-gray-500" colSpan={4}>TOTAL</td>
                <td className="table-td text-right tabular-nums text-red-400">{formatCurrency(totalAP)}</td>
                <td className="table-td">
                  <span className="text-[10px] text-gray-600">{formatCurrency(totalAPPago)} pago</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Inventário / Estoque Tab ─────────────────────────────────────────────────

const categoriaLabel: Record<InventarioItem["categoria"], string> = {
  ferramenta_saas: "SaaS",
  ativo_digital:   "Ativo Digital",
  recurso_humano:  "RH",
  contrato:        "Contrato",
  outros:          "Outros",
};

const categoriaOrder: InventarioItem["categoria"][] = [
  "contrato", "recurso_humano", "ferramenta_saas", "ativo_digital", "outros",
];

const statusInvConfig: Record<InventarioItem["status"], { label: string; cls: string }> = {
  ativo:         { label: "Ativo",        cls: "badge-green"  },
  inativo:       { label: "Inativo",      cls: "badge"        },
  em_avaliacao:  { label: "Avaliação",    cls: "badge-yellow" },
  cancelar:      { label: "Cancelar",     cls: "badge-red"    },
};

function EstoqueTab() {
  const ativos  = inventarioData.filter((i) => i.status === "ativo");
  const totalMensal = ativos.reduce((s, i) => s + i.valorMensal, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-brand-400" />
            <span className="text-xs text-gray-500 font-medium">Itens Ativos</span>
          </div>
          <div className="text-xl font-bold text-brand-300 tabular-nums">{ativos.length}</div>
          <div className="text-[10px] text-gray-700 mt-1">de {inventarioData.length} no inventário</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-orange-400" />
            <span className="text-xs text-gray-500 font-medium">Custo Mensal (ativos)</span>
          </div>
          <div className="text-xl font-bold text-orange-400 tabular-nums">{formatCurrency(totalMensal)}</div>
          <div className="text-[10px] text-gray-700 mt-1">ferramentas + contratos + RH</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-500 font-medium">Em Avaliação</span>
          </div>
          <div className="text-xl font-bold text-yellow-400 tabular-nums">
            {inventarioData.filter((i) => i.status === "em_avaliacao").length}
          </div>
          <div className="text-[10px] text-gray-700 mt-1">itens para revisar</div>
        </div>
      </div>

      {/* Table grouped by category */}
      {categoriaOrder.map((cat) => {
        const items = inventarioData.filter((i) => i.categoria === cat);
        if (!items.length) return null;
        const totalCat = items.filter((i) => i.status === "ativo").reduce((s, i) => s + i.valorMensal, 0);
        return (
          <div key={cat} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">{categoriaLabel[cat]}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{items.length} itens</p>
              </div>
              {totalCat > 0 && (
                <span className="text-xs text-orange-400 tabular-nums font-medium">
                  {formatCurrency(totalCat)}/mês
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="table-th">Nome</th>
                    <th className="table-th">Descrição</th>
                    {cat === "contrato" && <th className="table-th">Conta</th>}
                    <th className="table-th">Responsável</th>
                    <th className="table-th text-right">R$/mês</th>
                    <th className="table-th">Renovação</th>
                    <th className="table-th">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {items.map((item) => {
                    const cfg = statusInvConfig[item.status];
                    return (
                      <tr key={item.id}>
                        <td className="table-td font-medium text-white">{item.nome}</td>
                        <td className="table-td text-gray-400 text-sm">{item.descricao}</td>
                        {cat === "contrato" && (
                          <td className="table-td text-gray-400 text-sm">{item.conta ?? "—"}</td>
                        )}
                        <td className="table-td text-gray-500 text-sm">{item.responsavel}</td>
                        <td className="table-td text-right tabular-nums text-sm text-gray-300">
                          {item.valorMensal > 0 ? formatCurrency(item.valorMensal) : <span className="text-gray-700">—</span>}
                        </td>
                        <td className="table-td text-gray-500 text-sm tabular-nums">
                          {item.renovacao
                            ? new Date(item.renovacao).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
                            : "—"}
                        </td>
                        <td className="table-td">
                          <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <p className="text-xs text-gray-700 text-center">
        Inventário · JACQES · {dreGerencial.mes} · preencher mensalmente
      </p>
    </div>
  );
}
