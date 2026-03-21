"use client";

import { createContext, useContext, useState } from "react";

export type Period = "diario" | "semanal" | "mensal" | "trimestral" | "anual";

interface PeriodContextValue {
  period: Period;
  setPeriod: (p: Period) => void;
}

export const PeriodContext = createContext<PeriodContextValue>({
  period: "mensal",
  setPeriod: () => {},
});

export function usePeriod() {
  return useContext(PeriodContext);
}

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<Period>("mensal");
  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
}
