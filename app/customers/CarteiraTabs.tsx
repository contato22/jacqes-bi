"use client";

import { useState } from "react";
import { Briefcase, TrendingUp, AlertTriangle, Clock, AlertOctagon, TrendingDown, Minus } from "lucide-react";
import { type ContaData, type MarketingCliente } from "@/lib/data";
import { saudeConfig, riscoConfig, oportunidadeConfig, tendenciaConfig } from "@/lib/colors";
import { cn } from "@/lib/utils";
import MarketingPanel from "@/components/marketing/MarketingPanel";

type Tab = "carteira" | "marketing";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

interface Props {
  contasData: ContaData[];
  marketingData: MarketingCliente[];
  saudavelCount: number;
  atencaoRiscoCount: number;
  totalPendencias: number;
  totalPendenciasCriticas: number;
}

export default function CarteiraTabs({
  contasData, marketingData,
  saudavelCount, atencaoRiscoCount,
  totalPendencias, totalPendenciasCriticas,
}: Props) {
  const [tab, setTab] = useState<Tab>("carteira");

  return (
    <div className="space-y-5">
      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { icon: Briefcase,    bg: "bg-brand-500/10",   border: "border-brand-500/20",   text: "text-brand-400",   value: contasData.length, label: "Contas Ativas"      },
          { icon: TrendingUp,   bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", value: saudavelCount,      label: "Saudáveis"          },
          { icon: AlertTriangle,bg: "bg-yellow-500/10",  border: "border-yellow-500/20",  text: "text-yellow-400",  value: atencaoRiscoCount,  label: "Atenção / Risco"    },
          { icon: Clock,        bg: "bg-red-500/10",     border: "border-red-500/20",     text: "text-red-400",     value: totalPendencias,    label: "Pendências Totais"  },
          { icon: AlertOctagon, bg: "bg-red-500/10",     border: "border-red-500/20",     text: "text-red-400",     value: totalPendenciasCriticas, label: "Pend. Críticas" },
        ].map((k) => (
          <div key={k.label} className="card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${k.bg} border ${k.border} flex items-center justify-center ${k.text} shrink-0`}>
              <k.icon size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{k.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 border-b border-gray-800 pb-0">
        {([
          { id: "carteira",  label: "Carteira"  },
          { id: "marketing", label: "Marketing" },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all",
              tab === t.id
                ? "text-brand-300 border-brand-400 bg-brand-600/10"
                : "text-gray-500 border-transparent hover:text-gray-200 hover:bg-gray-800/50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {tab === "carteira" && (
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Briefcase size={14} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Contas & Carteira</h2>
              <p className="text-xs text-gray-500">Situação completa por conta — fonte: Notion</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {[
                    "Conta","Segmento","Saúde","Tendência","Risco","Motivo Risco",
                    "Oportunidade","Pendências","Pend. Vencidas","Pend. Críticas",
                    "Responsividade","Gestão Danilo","Última Visita","Próxima Visita","Dono Ação",
                  ].map((h) => <th key={h} className="table-th">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {contasData.map((conta) => {
                  const saude         = saudeConfig[conta.saude];
                  const riscoClass    = riscoConfig[conta.risco];
                  const opClass       = oportunidadeConfig[conta.oportunidade];
                  const tendConfig    = tendenciaConfig[conta.tendencia];
                  return (
                    <tr key={conta.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${saude?.dot}`} />
                          <div>
                            <div className="font-medium text-gray-200 whitespace-nowrap">{conta.nome}</div>
                            <div className="text-[10px] text-gray-600 max-w-[200px] truncate" title={conta.observacoes || undefined}>
                              {conta.observacoes || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{conta.segmento}</td>
                      <td className="py-3 pr-4"><span className={`badge ${saude?.badge}`}>{conta.saude}</span></td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          {conta.tendencia === "subindo"  ? <TrendingUp   size={14} className="text-emerald-400" />
                          : conta.tendencia === "descendo" ? <TrendingDown size={14} className="text-red-400" />
                          : <Minus size={14} className="text-gray-400" />}
                          <span className={`text-xs ${tendConfig.color}`}>{tendConfig.label}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4"><span className={`badge ${riscoClass}`}>{conta.risco}</span></td>
                      <td className="py-3 pr-4"><span className="text-xs text-gray-400">{conta.motivoRisco ?? "—"}</span></td>
                      <td className="py-3 pr-4"><span className={`badge ${opClass}`}>{conta.oportunidade}</span></td>
                      <td className="py-3 pr-4 text-center">
                        <span className={`text-sm font-bold tabular-nums ${conta.pendencias >= 4 ? "text-red-400" : conta.pendencias >= 2 ? "text-yellow-400" : "text-emerald-400"}`}>
                          {conta.pendencias}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className={cn("badge", conta.pendenciasVencidas > 0 ? "badge-red" : "badge-green")}>
                          {conta.pendenciasVencidas}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        {conta.pendenciasCriticas > 0
                          ? <span className="badge badge-red">{conta.pendenciasCriticas}</span>
                          : <span className="text-xs text-gray-600">—</span>}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn("badge",
                          conta.responsividadeCliente === "Alta"  ? "badge-green"
                          : conta.responsividadeCliente === "Média" ? "badge-yellow" : "badge-red"
                        )}>
                          {conta.responsividadeCliente}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn("badge",
                          conta.gestaoRiscoDanilo === "Boa"   ? "badge-green"
                          : conta.gestaoRiscoDanilo === "Média" ? "badge-yellow" : "badge-red"
                        )}>
                          {conta.gestaoRiscoDanilo}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs tabular-nums">{formatDate(conta.ultimaVisita)}</td>
                      <td className="py-3 pr-4 text-gray-400 text-xs tabular-nums">{formatDate(conta.proximaVisita)}</td>
                      <td className="py-3">
                        <span className={`badge text-[10px] ${conta.donoProximaAcao === "Danilo" ? "badge-blue" : "badge-yellow"}`}>
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
      )}

      {tab === "marketing" && (
        <MarketingPanel marketingData={marketingData} contasData={contasData} />
      )}
    </div>
  );
}
