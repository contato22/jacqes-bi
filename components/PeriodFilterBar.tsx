"use client";

import { useState } from "react";
import { Calendar, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePeriod, type Period, MONTHS_2026 } from "@/contexts/PeriodContext";
import ComparativoPanel from "@/components/ComparativoPanel";

const PERIODS: { key: Period; label: string }[] = [
  { key: "diario",     label: "Diário"     },
  { key: "semanal",    label: "Semanal"    },
  { key: "mensal",     label: "Mensal"     },
  { key: "trimestral", label: "Trimestral" },
  { key: "anual",      label: "Anual"      },
];

interface Props {
  children: React.ReactNode;
  available?: Period[];
  defaultPeriod?: Period;
  label?: string;
}

function PeriodFilterBarUI({ children, available = ["mensal"], label }: Props) {
  const { period, setPeriod, selectedMonth, setSelectedMonth } = usePeriod();
  const [showComparativo, setShowComparativo] = useState(false);

  // No monthly view, data exists only if the selected month has data
  const hasData = period === "mensal"
    ? selectedMonth.hasData
    : available.includes(period);

  return (
    <>
      {/* ── Barra de período ─────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 py-3 border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Period tabs */}
          <div className="flex items-center gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                  period === p.key
                    ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
                    : available.includes(p.key)
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-400 hover:bg-gray-800/50",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Previsto × Realizado */}
            <button
              onClick={() => setShowComparativo((v) => !v)}
              className={cn(
                "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border",
                showComparativo
                  ? "bg-brand-600/20 text-brand-400 border-brand-500/20"
                  : "text-gray-500 border-gray-800 hover:text-gray-300 hover:bg-gray-800",
              )}
              title="Previsto × Realizado"
            >
              <BarChart2 size={12} />
              Previsto × Realizado
            </button>

            {/* Calendar label (non-mensal) */}
            {period !== "mensal" && label && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar size={11} />
                <span>{label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Month selector (visible only when Mensal is active) ──────── */}
        {period === "mensal" && (
          <div className="mt-2.5 flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {MONTHS_2026.map((m) => {
              const isSelected = selectedMonth.key === m.key;
              const isDisabled = m.future;

              return (
                <button
                  key={m.key}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setSelectedMonth(m)}
                  title={isDisabled ? `${m.fullLabel} — futuro` : m.hasData ? m.fullLabel : `${m.fullLabel} — sem dados`}
                  className={cn(
                    "relative flex-shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150",
                    isSelected
                      ? "bg-brand-600/20 text-brand-400 border border-brand-500/30"
                      : isDisabled
                      ? "text-gray-700 cursor-not-allowed"
                      : m.hasData
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent"
                      : "text-gray-600 hover:text-gray-500 hover:bg-gray-800/50 border border-transparent",
                  )}
                >
                  {m.label}
                  {/* dot indicator */}
                  {!isDisabled && (
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

            {/* Selected month label */}
            <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-600 pl-3">
              <Calendar size={11} />
              <span>{selectedMonth.fullLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Comparativo (colapsável) ────────────────────────────────────── */}
      {showComparativo && (
        <div className="px-8 pt-6">
          <ComparativoPanel />
        </div>
      )}

      {/* ── Conteúdo detalhado (apenas no período com dados) ───────────── */}
      {hasData ? (
        children
      ) : period === "mensal" ? (
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-700 border border-gray-800 rounded-lg p-3 bg-gray-900/50">
            <Calendar size={12} className="shrink-0" />
            <span>
              {selectedMonth.future
                ? <>{selectedMonth.fullLabel} ainda não chegou.</>
                : <>Sem dados para <span className="text-gray-500 font-medium">{selectedMonth.fullLabel}</span>. Dados disponíveis em Março 2026.</>
              }
            </span>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-700 border border-gray-800 rounded-lg p-3 bg-gray-900/50">
            <Calendar size={12} className="shrink-0" />
            <span>
              Dados históricos disponíveis apenas em{" "}
              <span className="text-gray-500 font-medium">Mensal (Março 2026)</span>.
              Novos períodos serão habilitados conforme os dados forem registrados.
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default function PeriodFilterBar(props: Props) {
  return <PeriodFilterBarUI {...props} />;
}
