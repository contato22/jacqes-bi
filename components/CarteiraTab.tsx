// Compact carteira table for embedding inside other pages as a second tab.
// Pure display — no state. Receives no props; reads contasData directly.

import Link from "next/link";
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { contasData } from "@/lib/data";
import { saudeConfig, riscoConfig, oportunidadeConfig, tendenciaConfig } from "@/lib/colors";
import { cn } from "@/lib/utils";

export default function CarteiraTab() {
  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {contasData.map((c) => {
          const saude = saudeConfig[c.saude];
          return (
            <div key={c.id} className="card p-4 flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${saude?.dot}`} />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-200 truncate">{c.nome}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{c.saude}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Visão Rápida — Contas & Carteira</h3>
          <Link
            href="/customers"
            className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            <ExternalLink size={11} />
            Ver completo
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {["Conta","Saúde","Tendência","Risco","Oportunidade","Pendências","Dono Ação"].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contasData.map((conta) => {
                const saude    = saudeConfig[conta.saude];
                const risco    = riscoConfig[conta.risco];
                const opClass  = oportunidadeConfig[conta.oportunidade];
                const tend     = tendenciaConfig[conta.tendencia];
                return (
                  <tr key={conta.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${saude?.dot}`} />
                        <span className="font-medium text-gray-200 whitespace-nowrap">{conta.nome}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge ${saude?.badge}`}>{conta.saude}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        {conta.tendencia === "subindo"  ? <TrendingUp   size={13} className="text-emerald-400" />
                        : conta.tendencia === "descendo" ? <TrendingDown size={13} className="text-red-400" />
                        : <Minus size={13} className="text-gray-400" />}
                        <span className={cn("text-xs", tend.color)}>{tend.label}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><span className={`badge ${risco}`}>{conta.risco}</span></td>
                    <td className="py-3 pr-4"><span className={`badge ${opClass}`}>{conta.oportunidade}</span></td>
                    <td className="py-3 pr-4 text-center">
                      <span className={cn("text-sm font-bold tabular-nums",
                        conta.pendencias >= 4 ? "text-red-400" : conta.pendencias >= 2 ? "text-yellow-400" : "text-emerald-400"
                      )}>
                        {conta.pendencias}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={cn("badge text-[10px]",
                        conta.donoProximaAcao === "Danilo" ? "badge-blue" : "badge-yellow"
                      )}>
                        {conta.donoProximaAcao}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
