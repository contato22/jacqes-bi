"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PERIODS = [
  { key: "diario",     label: "Diário"      },
  { key: "semanal",    label: "Semanal"     },
  { key: "mensal",     label: "Mensal"      },
  { key: "trimestral", label: "Trimestral"  },
  { key: "anual",      label: "Anual"       },
] as const;

type Period = (typeof PERIODS)[number]["key"];

interface Props {
  children: React.ReactNode;
  /** Períodos com dados reais disponíveis (os demais mostram empty state) */
  available?: Period[];
  defaultPeriod?: Period;
  label?: string; // ex: "Março 2026"
}

export default function PeriodFilterBar({
  children,
  available = ["mensal"],
  defaultPeriod = "mensal",
  label,
}: Props) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const hasData = available.includes(period);

  return (
    <>
      {/* ── Barra de período ───────────────────────────────────────────────── */}
      <div className="px-8 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between gap-4">
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
                  : "text-gray-700 hover:text-gray-500 hover:bg-gray-800/50 cursor-pointer",
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

      {/* ── Conteúdo ───────────────────────────────────────────────────────── */}
      {hasData ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8">
          <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <Calendar size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Sem dados para o período{" "}
              <span className="text-gray-400">
                {PERIODS.find((p) => p.key === period)?.label.toLowerCase()}
              </span>
            </p>
            <p className="text-xs text-gray-700 mt-1">
              Os dados disponíveis são mensais · Março 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
}
