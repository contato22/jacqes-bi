"use client";

import Header from "@/components/Header";
import {
  m4eScoreMensal,
  m4eScoreDimensions,
  m4eContasData,
  m4eMiniPLContas,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Target, Users,
  CheckCircle, AlertTriangle, Clock,
} from "lucide-react";

const statusColor: Record<string, string> = {
  "Saudável":    "badge-green",
  "Estável":     "badge-blue",
  "Em Atenção":  "badge-yellow",
  "Prospecção":  "badge",
};

const faseColor: Record<string, string> = {
  "Bom":                   "text-emerald-400",
  "Operador em Formação":  "text-yellow-400",
  "Abaixo da Linha":       "text-red-400",
};

export default function M4EPage() {
  const s = m4eScoreMensal;

  const totalFee     = m4eMiniPLContas.reduce((a, c) => a + c.fee, 0);
  const totalCustos  = m4eMiniPLContas.reduce((a, c) => a + c.danilo + c.cogs + c.opex, 0);
  const ebitda       = totalFee - totalCustos;
  const mrrPct       = s.mrrMeta > 0 ? (s.mrr / s.mrrMeta) * 100 : 0;
  const scorePct     = (s.scoreTotal / 100) * 100;

  return (
    <>
      <Header
        title="M4E — Visão Geral"
        subtitle="Metodologia & Frameworks · AWQ Group · Março 2026"
      />

      <div className="page-content">

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Score BU */}
          <div className="card p-5 border-yellow-500/20 bg-yellow-500/5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Score BU</div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white tabular-nums">{s.scoreTotal}</span>
              <span className="text-sm text-gray-500 mb-1">/ 100</span>
            </div>
            <div className="mt-2">
              <span className="badge badge-yellow text-[10px]">{s.status}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">{s.fase}</div>
          </div>

          {/* MRR */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">MRR</div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{formatCurrency(s.mrr)}</div>
            <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(mrrPct, 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-600 mt-1 tabular-nums">
              {mrrPct.toFixed(0)}% da meta · {formatCurrency(s.mrrMeta)}
            </div>
          </div>

          {/* Clientes */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Clientes</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white tabular-nums">{s.clientesAtivos}</span>
              <span className="text-sm text-gray-500 mb-1">ativos</span>
            </div>
            <div className="text-[10px] text-gray-600 mt-2">
              Churn mês: {s.churnMes} · {m4eContasData.filter(c => c.status === "Prospecção").length} em prospecção
            </div>
          </div>

          {/* EBITDA */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">EBITDA Mini P&L</div>
            <div className={cn("text-2xl font-bold tabular-nums", ebitda >= 0 ? "text-emerald-400" : "text-red-400")}>
              {formatCurrency(ebitda)}
            </div>
            <div className="text-[10px] text-gray-600 mt-2 tabular-nums">
              {totalFee > 0 ? ((ebitda / totalFee) * 100).toFixed(1) : 0}% margem
            </div>
          </div>
        </div>

        {/* ── Score Dimensões + Destaques ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Score por Dimensão */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Score por Dimensão — Março 2026</h2>
            <div className="space-y-3">
              {m4eScoreDimensions.map((d) => {
                const pct = (d.score / d.max) * 100;
                const color = pct >= 80 ? "bg-emerald-500" : pct >= 65 ? "bg-yellow-400" : "bg-red-400";
                return (
                  <div key={d.dimensao}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{d.dimensao}</span>
                      <span className="text-xs text-gray-500 tabular-nums">{d.score}/{d.max}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-200">Total</span>
              <span className="text-base font-bold text-white tabular-nums">{s.scoreTotal} / 100</span>
            </div>
          </div>

          {/* Destaques do mês */}
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Destaques · {s.mes}</h2>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={12} className="text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">Principal Avanço</span>
              </div>
              <p className="text-sm text-gray-300">{s.principalAvanco}</p>
            </div>

            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={12} className="text-red-400" />
                <span className="text-xs font-semibold text-red-400">Principal Falha</span>
              </div>
              <p className="text-sm text-gray-300">{s.principalFalha}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target size={12} className="text-brand-400" />
                <span className="text-xs font-semibold text-brand-400">Foco Próximo Mês</span>
              </div>
              <p className="text-sm text-gray-300">{s.focoProximoMes}</p>
            </div>

            <div className="pt-2 border-t border-gray-800 flex items-center gap-2">
              <span className="text-xs text-gray-600">Variável:</span>
              {s.variavelPaga
                ? <span className="badge badge-green">Paga</span>
                : <span className="badge badge-red">Não paga — meta 75 pts</span>}
            </div>
          </div>
        </div>

        {/* ── Carteira rápida ── */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Carteira M4E · {s.mes}</h2>
            <span className="text-xs text-gray-500">{m4eContasData.length} clientes</span>
          </div>
          <div className="space-y-2">
            {m4eContasData.map((c) => {
              const saude = c.saude ?? "Prospecção";
              const Icon = c.status === "Ativo" ? CheckCircle
                : c.status === "Onboarding" ? Clock
                : c.status === "Prospecção" ? Target
                : AlertTriangle;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-800/30 border border-gray-800/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={13} className={
                      c.status === "Ativo" ? "text-emerald-400" :
                      c.status === "Onboarding" ? "text-yellow-400" :
                      c.status === "Prospecção" ? "text-brand-400" : "text-red-400"
                    } />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{c.cliente}</div>
                      <div className="text-[10px] text-gray-600">{c.produto} · {c.segmento}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {c.scoreM4E !== null && (
                      <span className={cn("text-sm font-bold tabular-nums", faseColor[c.faseM4E ?? ""] ?? "text-gray-400")}>
                        {c.scoreM4E}/100
                      </span>
                    )}
                    <span className={`badge ${statusColor[saude] ?? "badge"} text-[10px]`}>{saude}</span>
                    <span className={cn("text-sm font-semibold tabular-nums", c.fee > 0 ? "text-emerald-400" : "text-gray-600")}>
                      {c.fee > 0 ? formatCurrency(c.fee) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
