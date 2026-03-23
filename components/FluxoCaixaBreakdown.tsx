"use client";

import { useState } from "react";
import { Database, Edit3, GitBranch, TrendingUp, TrendingDown, Info } from "lucide-react";
import { fluxoCaixaCategorias, fluxoCaixaMensal, type FluxoSubgrupo } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── types ────────────────────────────────────────────────────────────────────

type VisaoPeriodo = "mar" | "q1" | "anual";

const visaoLabels: Record<VisaoPeriodo, string> = {
  mar:   "Março 2026",
  q1:    "Q1 Acumulado",
  anual: "Projeção Anual",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function getReal(
  item: (typeof fluxoCaixaCategorias)[number],
  visao: VisaoPeriodo,
): number {
  if (visao === "mar")   return item.realMar;
  if (visao === "q1")    return item.realJan + item.realFev + item.realMar;
  return item.prevMensal * 12; // projeção anual = mensalidade × 12
}

function getPrev(
  item: (typeof fluxoCaixaCategorias)[number],
  visao: VisaoPeriodo,
): number {
  if (visao === "mar")   return item.prevMensal;
  if (visao === "q1")    return item.prevMensal * 3;
  return item.prevMensal * 12;
}

const fonteConfig = {
  notion:   { icon: Database,   cls: "text-emerald-600", label: "Notion" },
  derivado: { icon: GitBranch,  cls: "text-brand-600",   label: "Derivado" },
  manual:   { icon: Edit3,      cls: "text-orange-600",  label: "Manual" },
};

const subgrupoOrdem: FluxoSubgrupo[] = [
  "Receita de Serviços",
  "Receitas Extras",
  "Remuneração & RH",
  "Encargos & Provisões",
  "Ferramentas & Infraestrutura",
  "Impostos & Taxas",
  "Overhead & Estrutura",
  "Ajustes & Reconciliação",
];

function pctDiff(real: number, prev: number): string {
  if (!prev || real === 0) return "";
  const diff = ((real - prev) / prev) * 100;
  return (diff >= 0 ? "+" : "") + diff.toFixed(0) + "%";
}

// ─── subcomponents ────────────────────────────────────────────────────────────

function CategoriaRow({
  item,
  visao,
  isNegativo,
}: {
  item: (typeof fluxoCaixaCategorias)[number];
  visao: VisaoPeriodo;
  isNegativo: boolean;
}) {
  const real = getReal(item, visao);
  const prev = getPrev(item, visao);
  const isManualEmpty = real === 0 && item.fonte === "manual";
  const { icon: FonIcon, cls: fonCls } = fonteConfig[item.fonte];
  const diff = pctDiff(real, prev);
  const isUnder = real < prev;

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 py-2.5 border-b border-gray-800/30 last:border-0 hover:bg-gray-800/20 rounded transition-colors px-2 -mx-2",
        isManualEmpty && "opacity-60",
      )}
    >
      {/* label */}
      <div className="flex items-center gap-2 min-w-0">
        <span title={fonteConfig[item.fonte].label}>
          <FonIcon size={10} className={cn(fonCls, "shrink-0")} />
        </span>
        <span className={cn("text-sm truncate", isManualEmpty ? "text-gray-600" : "text-gray-300")}>
          {item.label}
        </span>
        {isManualEmpty && (
          <span className="text-[10px] text-orange-700 font-medium shrink-0">a preencher</span>
        )}
      </div>

      {/* previsto */}
      <span className="text-xs text-gray-600 tabular-nums text-right w-24">
        {prev > 0 ? formatCurrency(prev) : "—"}
      </span>

      {/* diff badge */}
      <span className={cn(
        "text-[10px] tabular-nums text-right w-12 font-medium",
        !diff ? "text-gray-800" : isUnder ? "text-red-500" : "text-emerald-500",
      )}>
        {diff || ""}
      </span>

      {/* realizado */}
      <span className={cn(
        "text-sm font-semibold tabular-nums text-right w-24",
        isManualEmpty
          ? "text-gray-700"
          : isNegativo
          ? "text-red-400"
          : "text-emerald-400",
      )}>
        {isManualEmpty ? "—" : formatCurrency(real)}
      </span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function FluxoCaixaBreakdown() {
  const [visao, setVisao] = useState<VisaoPeriodo>("mar");

  const entradas = fluxoCaixaCategorias.filter((c) => c.grupo === "entradas");
  const saidas   = fluxoCaixaCategorias.filter((c) => c.grupo === "saidas");

  // totals
  const totalEntradasReal = entradas.reduce((s, c) => s + getReal(c, visao), 0);
  const totalEntradasPrev = entradas.reduce((s, c) => s + getPrev(c, visao), 0);
  const totalSaidasReal   = saidas.reduce((s, c) => s + getReal(c, visao),   0);
  const totalSaidasPrev   = saidas.reduce((s, c) => s + getPrev(c, visao),   0);
  const saldoReal = totalEntradasReal - totalSaidasReal;
  const saldoPrev = totalEntradasPrev - totalSaidasPrev;

  // fluxo de caixa aggregated (from fluxoCaixaMensal for reconciliation reference)
  const fluxoMarReal = fluxoCaixaMensal.find((e) => e.periodo === "Mar");
  const reconciliacaoNota =
    visao === "mar" && fluxoMarReal
      ? `Fluxo caixa (consolidado): Entradas R$${fluxoMarReal.entradasReal.toLocaleString("pt-BR")} · Saídas R$${fluxoMarReal.saidasReal.toLocaleString("pt-BR")}`
      : null;

  // group saidas by subgrupo for display
  const saidasPorSubgrupo = subgrupoOrdem
    .filter((sg) => saidas.some((c) => c.subgrupo === sg))
    .map((sg) => ({
      subgrupo: sg,
      items: saidas.filter((c) => c.subgrupo === sg),
    }));

  return (
    <div className="card p-6 space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Fluxo de Caixa · Categorias Detalhadas
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Conectado diretamente ao DRE Gerencial · {visaoLabels[visao]}
          </p>
        </div>

        {/* period selector */}
        <div className="flex items-center bg-gray-800 rounded-lg p-0.5 gap-0.5 self-start shrink-0">
          {(["mar", "q1", "anual"] as VisaoPeriodo[]).map((v) => (
            <button
              key={v}
              onClick={() => setVisao(v)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                visao === v
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300",
              )}
            >
              {visaoLabels[v]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Entradas",
            real: totalEntradasReal,
            prev: totalEntradasPrev,
            color: "text-emerald-400",
          },
          {
            label: "Saídas",
            real: totalSaidasReal,
            prev: totalSaidasPrev,
            color: "text-red-400",
          },
          {
            label: "Saldo",
            real: saldoReal,
            prev: saldoPrev,
            color: saldoReal >= 0 ? "text-blue-400" : "text-red-400",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/40"
          >
            <div className={cn("text-base font-bold tabular-nums", k.color)}>
              {formatCurrency(k.real)}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">{k.label} realizadas</div>
            <div className="text-[10px] text-gray-700 mt-1 tabular-nums">
              prev: {formatCurrency(k.prev)}
            </div>
          </div>
        ))}
      </div>

      {/* column headers */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-2">
        <span>Categoria</span>
        <span className="w-24 text-right">Previsto</span>
        <span className="w-12 text-right">Δ</span>
        <span className="w-24 text-right">Realizado</span>
      </div>

      {/* ── ENTRADAS ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={13} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Entradas
          </span>
        </div>

        {["Receita de Serviços", "Receitas Extras"].map((sg) => {
          const items = entradas.filter((c) => c.subgrupo === sg);
          if (!items.length) return null;
          return (
            <div key={sg} className="mb-3">
              <div className="text-[10px] font-medium text-gray-600 uppercase tracking-widest mb-1 pl-2">
                {sg}
              </div>
              {items.map((item) => (
                <CategoriaRow key={item.id} item={item} visao={visao} isNegativo={false} />
              ))}
            </div>
          );
        })}

        {/* total entradas */}
        <div className="flex items-center justify-between py-2.5 border-t border-gray-700 mt-1 px-2">
          <span className="text-sm font-semibold text-gray-200">= Total Entradas</span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 tabular-nums w-24 text-right">
              {formatCurrency(totalEntradasPrev)}
            </span>
            <span className="w-12" />
            <span className="text-sm font-bold text-emerald-400 tabular-nums w-24 text-right">
              {formatCurrency(totalEntradasReal)}
            </span>
          </div>
        </div>
      </div>

      {/* ── SAÍDAS ────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={13} className="text-red-400" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Saídas
          </span>
        </div>

        {saidasPorSubgrupo.map(({ subgrupo, items }) => (
          <div key={subgrupo} className="mb-3">
            <div className="text-[10px] font-medium text-gray-600 uppercase tracking-widest mb-1 pl-2">
              {subgrupo}
            </div>
            {items.map((item) => (
              <CategoriaRow key={item.id} item={item} visao={visao} isNegativo={true} />
            ))}
          </div>
        ))}

        {/* total saídas */}
        <div className="flex items-center justify-between py-2.5 border-t border-gray-700 mt-1 px-2">
          <span className="text-sm font-semibold text-gray-200">= Total Saídas</span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 tabular-nums w-24 text-right">
              {formatCurrency(totalSaidasPrev)}
            </span>
            <span className="w-12" />
            <span className="text-sm font-bold text-red-400 tabular-nums w-24 text-right">
              {formatCurrency(totalSaidasReal)}
            </span>
          </div>
        </div>
      </div>

      {/* ── SALDO FINAL ──────────────────────────────────────────────────── */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-xl border",
        saldoReal >= 0
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-red-500/5 border-red-500/20",
      )}>
        <div>
          <div className="text-sm font-semibold text-white">= Saldo de Caixa</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Previsto: {formatCurrency(saldoPrev)}
          </div>
        </div>
        <div className={cn(
          "text-xl font-bold tabular-nums",
          saldoReal >= 0 ? "text-emerald-400" : "text-red-400",
        )}>
          {formatCurrency(saldoReal)}
        </div>
      </div>

      {/* reconciliation note */}
      {reconciliacaoNota && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
          <Info size={11} className="text-gray-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            {reconciliacaoNota} · A linha &ldquo;Diferença de caixa&rdquo; reconcilia os itens de timing
            (provisões, impostos antecipados, adiantamentos) entre o DRE Gerencial e o extrato bancário.
          </p>
        </div>
      )}

      {/* legend */}
      <div className="flex flex-wrap gap-4 text-[10px] text-gray-600 pt-2 border-t border-gray-800">
        <span className="flex items-center gap-1.5">
          <Database size={10} className="text-emerald-600" /> Direto do Notion
        </span>
        <span className="flex items-center gap-1.5">
          <GitBranch size={10} className="text-brand-600" /> Calculado/derivado
        </span>
        <span className="flex items-center gap-1.5">
          <Edit3 size={10} className="text-orange-600" /> Manual — preencher mensalmente
        </span>
      </div>
    </div>
  );
}
