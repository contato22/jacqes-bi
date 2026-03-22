"use client";

import { createContext, useContext, useState } from "react";

export type Period = "diario" | "semanal" | "mensal" | "trimestral" | "anual";

export interface MonthOption {
  key: string;        // "2026-03"
  label: string;      // "Mar"
  fullLabel: string;  // "Março 2026"
  hasData: boolean;
  future: boolean;
}

export const MONTHS_2026: MonthOption[] = [
  { key: "2026-01", label: "Jan", fullLabel: "Janeiro 2026",   hasData: false, future: false },
  { key: "2026-02", label: "Fev", fullLabel: "Fevereiro 2026", hasData: false, future: false },
  { key: "2026-03", label: "Mar", fullLabel: "Março 2026",     hasData: true,  future: false },
  { key: "2026-04", label: "Abr", fullLabel: "Abril 2026",     hasData: false, future: true  },
  { key: "2026-05", label: "Mai", fullLabel: "Maio 2026",      hasData: false, future: true  },
  { key: "2026-06", label: "Jun", fullLabel: "Junho 2026",     hasData: false, future: true  },
  { key: "2026-07", label: "Jul", fullLabel: "Julho 2026",     hasData: false, future: true  },
  { key: "2026-08", label: "Ago", fullLabel: "Agosto 2026",    hasData: false, future: true  },
  { key: "2026-09", label: "Set", fullLabel: "Setembro 2026",  hasData: false, future: true  },
  { key: "2026-10", label: "Out", fullLabel: "Outubro 2026",   hasData: false, future: true  },
  { key: "2026-11", label: "Nov", fullLabel: "Novembro 2026",  hasData: false, future: true  },
  { key: "2026-12", label: "Dez", fullLabel: "Dezembro 2026",  hasData: false, future: true  },
];

interface PeriodContextValue {
  period: Period;
  setPeriod: (p: Period) => void;
  selectedMonth: MonthOption;
  setSelectedMonth: (m: MonthOption) => void;
}

export const PeriodContext = createContext<PeriodContextValue>({
  period: "mensal",
  setPeriod: () => {},
  selectedMonth: MONTHS_2026[2],
  setSelectedMonth: () => {},
});

export function usePeriod() {
  return useContext(PeriodContext);
}

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<Period>("mensal");
  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(MONTHS_2026[2]); // Março 2026

  return (
    <PeriodContext.Provider value={{ period, setPeriod, selectedMonth, setSelectedMonth }}>
      {children}
    </PeriodContext.Provider>
  );
}
