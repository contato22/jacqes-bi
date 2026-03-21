"use client";

import { usePeriod } from "@/contexts/PeriodContext";
import { comparativoPeriodos, type MetricaComparativa } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatValor(v: number, unidade: string): string {
  if (unidade === "R$") {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }
  if (unidade === "%") return `${v}%`;
  return `${v} ${unidade}`;
}

function MetricaRow({ m }: { m: MetricaComparativa }) {
  const ratio   = m.previsto > 0 ? m.realizado / m.previsto : 0;
  const pctBar  = Math.min(ratio * 100, 100);
  const over    = ratio > 1;
  const hit     = m.lowerIsBetter ? ratio <= 1 : ratio >= 1;
  const partial = !hit && ratio >= 0.7;

  const barColor = hit
    ? "bg-emerald-500"
    : partial
    ? "bg-yellow-500"
    : "bg-red-500";

  const statusColor = hit
    ? "text-emerald-400"
    : partial
    ? "text-yellow-400"
    : "text-red-400";

  const delta = m.realizado - m.previsto;
  const deltaSign = m.lowerIsBetter ? delta <= 0 : delta >= 0;

  return (
    <div className="py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        {/* Label */}
        <div className="min-w-0">
          <span className="text-sm text-gray-200 font-medium">{m.label}</span>
          {m.sublabel && (
            <span className="text-xs text-gray-600 ml-2">{m.sublabel}</span>
          )}
        </div>

        {/* Previsto vs Realizado */}
        <div className="flex items-center gap-4 shrink-0 text-right">
          <div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-0.5">Previsto</div>
            <div className="text-sm tabular-nums text-gray-500">
              {formatValor(m.previsto, m.unidade)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-0.5">Realizado</div>
            <div className={cn("text-sm font-semibold tabular-nums", statusColor)}>
              {formatValor(m.realizado, m.unidade)}
            </div>
          </div>
          <div className="w-16 text-right">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-0.5">Delta</div>
            <div className={cn(
              "flex items-center justify-end gap-0.5 text-xs font-medium tabular-nums",
              deltaSign ? "text-emerald-400" : "text-red-400"
            )}>
              {deltaSign
                ? <TrendingUp size={11} />
                : over && !m.lowerIsBetter
                ? <TrendingUp size={11} />
                : <TrendingDown size={11} />
              }
              {delta > 0 ? "+" : ""}{formatValor(delta, m.unidade)}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${pctBar}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-700">0</span>
        <span className={cn("text-[10px] font-medium", statusColor)}>
          {m.previsto > 0 ? `${Math.round(ratio * 100)}%` : "—"}
        </span>
      </div>
    </div>
  );
}

const categoriaLabel: Record<string, string> = {
  score:        "Score",
  financeiro:   "Financeiro",
  operacional:  "Operacional",
  sla:          "SLA & Relacionamento",
};

const categoriaOrder = ["score", "financeiro", "sla", "operacional"];

export default function ComparativoPanel() {
  const { period } = usePeriod();
  const data = comparativoPeriodos.find((p) => p.periodo === period);

  if (!data) return null;

  // Agrupa por categoria
  const grupos = categoriaOrder
    .map((cat) => ({
      cat,
      metricas: data.metricas.filter((m) => m.categoria === cat),
    }))
    .filter((g) => g.metricas.length > 0);

  // KPIs de resumo
  const total     = data.metricas.length;
  const atingidas = data.metricas.filter((m) => {
    const ratio = m.previsto > 0 ? m.realizado / m.previsto : 0;
    return m.lowerIsBetter ? ratio <= 1 : ratio >= 1;
  }).length;
  const parciais  = data.metricas.filter((m) => {
    const ratio = m.previsto > 0 ? m.realizado / m.previsto : 0;
    const hit   = m.lowerIsBetter ? ratio <= 1 : ratio >= 1;
    return !hit && ratio >= 0.7;
  }).length;

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="card-title">Previsto × Realizado</h2>
          <p className="card-subtitle">{data.label}</p>
        </div>
        {/* Summary pills */}
        <div className="flex items-center gap-2">
          <span className="badge badge-green">{atingidas} atingidas</span>
          {parciais > 0 && (
            <span className="badge badge-yellow">{parciais} parciais</span>
          )}
          {total - atingidas - parciais > 0 && (
            <span className="badge badge-red">{total - atingidas - parciais} abaixo</span>
          )}
        </div>
      </div>

      {/* Grupos */}
      <div className="space-y-6">
        {grupos.map(({ cat, metricas }) => (
          <div key={cat}>
            <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
              {categoriaLabel[cat]}
            </div>
            <div>
              {metricas.map((m) => (
                <MetricaRow key={m.id} m={m} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-5 pt-4 border-t border-gray-800 flex items-center gap-5 text-xs text-gray-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Atingido (≥ 100%)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          Parcial (70–99%)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Abaixo (&lt; 70%)
        </div>
      </div>
    </div>
  );
}
