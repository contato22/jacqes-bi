"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePeriod, type Period } from "@/contexts/PeriodContext";
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
  const { period, setPeriod } = usePeriod();
  const hasData = available.includes(period);

  return (
    <>
      {/* ── Barra de período ─────────────────────────────────────────────── */}
      <div className="px-8 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between gap-4 sticky top-0 z-10">
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

        {label && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar size={11} />
            <span>{label}</span>
          </div>
        )}
      </div>

      {/* ── Comparativo sempre visível ─────────────────────────────────── */}
      <div className="px-8 pt-6">
        <ComparativoPanel />
      </div>

      {/* ── Conteúdo detalhado (apenas no período com dados) ───────────── */}
      {hasData ? (
        children
      ) : (
        <div className="px-8 py-4">
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
