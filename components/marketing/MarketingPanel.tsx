"use client";

import { useState } from "react";
import { type MarketingCliente, type ContaData } from "@/lib/data";
import { saudeConfig } from "@/lib/colors";
import { cn } from "@/lib/utils";
import MarketingClienteView from "./MarketingClienteView";

interface Props {
  marketingData: MarketingCliente[];
  contasData: ContaData[];
}

export default function MarketingPanel({ marketingData, contasData }: Props) {
  const firstId = contasData[0]?.id ?? "1";
  const [selectedId, setSelectedId] = useState(firstId);

  const selectedMarketing = marketingData.find((m) => m.contaId === selectedId);
  const selectedConta     = contasData.find((c) => c.id === selectedId);

  return (
    <div className="space-y-5">
      {/* ── client selector ── */}
      <div className="card p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {contasData.map((conta) => {
            const saude = saudeConfig[conta.saude] ?? { dot: "bg-gray-500", badge: "badge" };
            const active = selectedId === conta.id;
            return (
              <button
                key={conta.id}
                onClick={() => setSelectedId(conta.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0",
                  active
                    ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                )}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${saude.dot}`} />
                {conta.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── marketing view ── */}
      {selectedMarketing && selectedConta ? (
        <MarketingClienteView
          cliente={selectedMarketing}
          nomeCliente={selectedConta.nome}
        />
      ) : (
        <div className="card p-8 text-center">
          <p className="text-sm text-gray-500">Dados de marketing não encontrados para este cliente.</p>
        </div>
      )}
    </div>
  );
}
