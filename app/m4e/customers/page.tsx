"use client";

import Header from "@/components/Header";
import { m4eContasData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  CheckCircle, Clock, Target, AlertTriangle,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";

const saudeConfig: Record<string, { cls: string }> = {
  "Saudável":    { cls: "badge-green"  },
  "Estável":     { cls: "badge-blue"   },
  "Em Atenção":  { cls: "badge-yellow" },
  "Prospecção":  { cls: "badge"        },
};

const statusIcon = {
  "Ativo":       CheckCircle,
  "Onboarding":  Clock,
  "Prospecção":  Target,
  "Churned":     AlertTriangle,
};

const statusCor: Record<string, string> = {
  "Ativo":       "text-emerald-400",
  "Onboarding":  "text-yellow-400",
  "Prospecção":  "text-brand-400",
  "Churned":     "text-red-400",
};

const faseColor: Record<string, string> = {
  "Bom":                   "text-emerald-400",
  "Operador em Formação":  "text-yellow-400",
  "Abaixo da Linha":       "text-red-400",
};

const opConfig: Record<string, string> = {
  "Forte":              "badge-green",
  "Média":              "badge-blue",
  "Leve":               "badge-yellow",
  "Sem Oportunidade":   "badge",
};

export default function M4ECustomersPage() {
  const ativos   = m4eContasData.filter((c) => c.status === "Ativo" || c.status === "Onboarding");
  const totalMRR = ativos.reduce((s, c) => s + c.fee, 0);
  const avgScore = ativos.filter((c) => c.scoreM4E !== null)
    .reduce((s, c, _, arr) => s + (c.scoreM4E ?? 0) / arr.length, 0);

  return (
    <>
      <Header
        title="M4E — Carteira"
        subtitle="Clientes ativos, onboardings e prospecções · Março 2026"
      />

      <div className="page-content">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="text-xs text-gray-500 mb-1">Clientes Ativos</div>
            <div className="text-2xl font-bold text-white tabular-nums">{ativos.length}</div>
            <div className="text-[10px] text-gray-600 mt-1">de {m4eContasData.length} total</div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-gray-500 mb-1">MRR Ativo</div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{formatCurrency(totalMRR)}</div>
            <div className="text-[10px] text-gray-600 mt-1">contratos vigentes</div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-gray-500 mb-1">Score Médio M4E</div>
            <div className={cn("text-2xl font-bold tabular-nums",
              avgScore >= 75 ? "text-emerald-400" : avgScore >= 60 ? "text-yellow-400" : "text-red-400"
            )}>
              {avgScore > 0 ? avgScore.toFixed(0) : "—"}/100
            </div>
            <div className="text-[10px] text-gray-600 mt-1">clientes com score</div>
          </div>
        </div>

        {/* Carteira detalhada */}
        <div className="space-y-3">
          {m4eContasData.map((c) => {
            const Icon = statusIcon[c.status] ?? Target;
            const pendTotalIcon = c.pendencias > 3 ? TrendingDown : c.pendencias > 1 ? Minus : TrendingUp;
            const PendIcon = pendTotalIcon;

            return (
              <div key={c.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                  {/* Left: identity */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      c.status === "Ativo" ? "bg-emerald-500/10" :
                      c.status === "Onboarding" ? "bg-yellow-500/10" :
                      c.status === "Prospecção" ? "bg-brand-500/10" : "bg-red-500/10"
                    )}>
                      <Icon size={16} className={statusCor[c.status]} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{c.cliente}</span>
                        <span className={`badge ${saudeConfig[c.saude ?? ""]?.cls ?? "badge"}`}>{c.saude}</span>
                        <span className="badge">{c.produto}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.segmento} · Resp: {c.responsavel}</div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{c.observacoes}</p>
                    </div>
                  </div>

                  {/* Right: metrics */}
                  <div className="grid grid-cols-3 gap-3 sm:w-auto w-full">
                    <div className="text-center">
                      <div className={cn("text-sm font-bold tabular-nums",
                        c.scoreM4E !== null
                          ? faseColor[c.faseM4E ?? ""] ?? "text-gray-400"
                          : "text-gray-600"
                      )}>
                        {c.scoreM4E !== null ? `${c.scoreM4E}/100` : "—"}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">Score M4E</div>
                      {c.faseM4E && (
                        <div className="text-[9px] text-gray-700 truncate">{c.faseM4E}</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={cn("text-sm font-bold tabular-nums",
                        c.fee > 0 ? "text-emerald-400" : "text-gray-600"
                      )}>
                        {c.fee > 0 ? formatCurrency(c.fee) : "—"}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">FEE/mês</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <PendIcon size={11} className={
                          c.pendencias > 3 ? "text-red-400" :
                          c.pendencias > 1 ? "text-yellow-400" : "text-emerald-400"
                        } />
                        <span className={cn("text-sm font-bold tabular-nums",
                          c.pendencias > 3 ? "text-red-400" :
                          c.pendencias > 1 ? "text-yellow-400" : "text-emerald-400"
                        )}>
                          {c.pendencias}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">Pendências</div>
                    </div>
                  </div>
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/40 flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-[10px] text-gray-600">
                    {c.inicioCiclo && (
                      <span>Início: {new Date(c.inicioCiclo).toLocaleDateString("pt-BR")}</span>
                    )}
                    {c.proximaRevisao && (
                      <span>Próxima revisão: {new Date(c.proximaRevisao).toLocaleDateString("pt-BR")}</span>
                    )}
                  </div>
                  <span className={`badge ${opConfig[c.oportunidade] ?? "badge"} text-[10px]`}>
                    {c.oportunidade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
