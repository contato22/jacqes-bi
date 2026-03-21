"use client";

import Header from "@/components/Header";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import ScoreChart from "@/components/RevenueChart";
import AccountHealthChart from "@/components/CustomerSegmentChart";
import AlertBanner from "@/components/AlertBanner";
import { alerts, scoreMensal, contasData, slaData, followUpData } from "@/lib/data";
import { TrendingDown, TrendingUp, AlertOctagon, Target, ChevronRight, Clock, Minus, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const criticosCount = alerts.filter((a) => a.criticidade === "critico").length;
const alertsOrdenados = [
  ...alerts.filter((a) => a.criticidade === "critico"),
  ...alerts.filter((a) => a.criticidade === "atencao"),
  ...alerts.filter((a) => a.criticidade === "informativo"),
];

const totalPendenciasVencidas = contasData.reduce((s, c) => s + c.pendenciasVencidas, 0);
const totalPendenciasCriticas = contasData.reduce((s, c) => s + c.pendenciasCriticas, 0);
const totalPendencias = contasData.reduce((s, c) => s + c.pendencias, 0);
const contaAltoRisco = contasData.find((c) => c.risco === "Alto");
const tatiSimoes = contasData.find((c) => c.nome === "Tati Simões");
const contasAltoRiscoCount = contasData.filter((c) => c.risco === "Alto").length;
const slaContasSemContato = slaData.porConta.filter((c) => c.diasSemContato >= 7).length;
const followUpTaxa = Math.round((followUpData.realizados / followUpData.totalPrevistos) * 100);

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Visão Geral"
        subtitle="Danilo · CS & Operações · AWQ Group · Março 2026"
      />

      <PeriodFilterBar available={["mensal"]} label="Março 2026">
        <div className="px-8 py-6 space-y-6">

          {/* Bloco 1 — KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* Card 1 — Score Geral */}
            <div className="card p-5 border-yellow-500/20 bg-yellow-500/5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Score Geral
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white tabular-nums">
                  {scoreMensal.scoreTotal}
                </span>
                <span className="text-sm text-gray-500 mb-1">/ 100</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="badge badge-yellow text-[10px]">🟡 Amarelo</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{scoreMensal.fase}</div>
            </div>

            {/* Card 2 — Gap para Variável */}
            <div className="card p-5 border-red-500/20">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Gap para Variável
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-red-400 tabular-nums">
                  −{scoreMensal.gapParaVariavel}
                </span>
                <span className="text-sm text-gray-500 mb-1">pts</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Meta: 75 pts</div>
              <div className="text-[10px] text-gray-600 mt-1.5">
                {scoreMensal.dimensoesGap.map((d) => `${d.dimensao} −${d.gap}`).join(" · ")}
              </div>
            </div>

            {/* Card 3 — Risco Crítico */}
            <div className="card p-5 border-red-500/20">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Contas em Risco Crítico
              </div>
              <div className="text-3xl font-bold text-red-400 tabular-nums">
                {contasAltoRiscoCount}
              </div>
              {contaAltoRisco && (
                <>
                  <div className="text-xs text-gray-300 mt-1.5 font-medium">
                    {contaAltoRisco.nome}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {contaAltoRisco.motivoRisco ?? "—"}
                  </div>
                </>
              )}
            </div>

            {/* Card 4 — Pendências Vencidas */}
            <div className="card p-5 border-orange-500/20">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Pendências Vencidas
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-orange-400 tabular-nums">
                  {totalPendenciasVencidas}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                de {totalPendencias} pendências
              </div>
              <div className="text-[10px] text-red-400 mt-0.5 font-medium">
                {totalPendenciasCriticas} críticas
              </div>
            </div>
          </div>

          {/* Bloco 2 — Score Potencial + SLA Quick */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* Card esquerdo — Score Atual vs Potencial */}
            <div className="card p-5">
              <div className="mb-1">
                <h2 className="text-sm font-semibold text-white">Score Atual vs Potencial</h2>
                <p className="text-xs text-gray-500 mt-0.5">Se corrigir as pendências críticas</p>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Atual</span>
                    <span className="text-yellow-400 font-semibold tabular-nums">
                      {scoreMensal.scoreTotal} / 100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${scoreMensal.scoreTotal}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Potencial</span>
                    <span className="text-brand-400 font-semibold tabular-nums">
                      {scoreMensal.scorePotencial} / 100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-400"
                      style={{ width: `${scoreMensal.scorePotencial}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-brand-500/5 border border-brand-500/20">
                <p className="text-xs text-brand-300">
                  Corrigindo{" "}
                  {scoreMensal.dimensoesGap
                    .map((d) => `${d.dimensao} (+${d.gap})`)
                    .join(" e ")}{" "}
                  = {scoreMensal.scorePotencial} pts = variável desbloqueada
                </p>
              </div>
              <div className="mt-3 space-y-1.5">
                {scoreMensal.dimensoesGap.map((d) => (
                  <div key={d.dimensao} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{d.dimensao}</span>
                    <span className="text-red-400 font-medium">−{d.gap} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card direito — SLA Rápido */}
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">SLA de Atendimento</h2>
                <p className="text-xs text-gray-500 mt-0.5">Março 2026 · Visão geral</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Tempo médio</div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {slaData.tempoMedioRespostaH}h
                  </div>
                  <div className="text-[10px] text-gray-600">meta: &lt; 24h</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">No prazo</div>
                  <div className={cn("text-xl font-bold tabular-nums", slaData.percentualNoPrazo >= 90 ? "text-emerald-400" : slaData.percentualNoPrazo >= 70 ? "text-yellow-400" : "text-red-400")}>
                    {slaData.percentualNoPrazo}%
                  </div>
                  <div className="text-[10px] text-gray-600">meta: 90%</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Vencidas</div>
                  <div className={cn("text-xl font-bold tabular-nums", slaData.mensagensVencidas > 0 ? "text-red-400" : "text-emerald-400")}>
                    {slaData.mensagensVencidas} msgs
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Sem contato 7+ dias</div>
                  <div className={cn("text-xl font-bold tabular-nums", slaContasSemContato > 0 ? "text-orange-400" : "text-emerald-400")}>
                    {slaContasSemContato} contas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 3 — Score chart + Account health */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <ScoreChart />
            </div>
            <AccountHealthChart />
          </div>

          {/* Bloco 4 — Principal conta crítica + Alertas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* Card esquerdo — Principal Conta em Risco */}
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">Principal Conta em Risco</h2>
              </div>

              {tatiSimoes && (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-white">{tatiSimoes.nome}</div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="badge badge-red">Sensível</span>
                        <span className="badge badge-red">Risco Alto</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <TrendingDown size={16} />
                      <span className="text-xs font-medium">Piorando</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-gray-800">
                      <span className="text-gray-500">Motivo do risco</span>
                      <span className="text-gray-300 font-medium">{tatiSimoes.motivoRisco}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-800">
                      <span className="text-gray-500">Pendências vencidas</span>
                      <span className="text-red-400 font-bold">{tatiSimoes.pendenciasVencidas}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-800">
                      <span className="text-gray-500">Pendências críticas</span>
                      <span className="text-red-400 font-bold">{tatiSimoes.pendenciasCriticas}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-800">
                      <span className="text-gray-500">Gestão Danilo</span>
                      <span className="badge badge-yellow text-[10px]">{tatiSimoes.gestaoRiscoDanilo}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 flex items-start gap-2">
                    <ChevronRight size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-0.5">
                        Próxima ação
                      </div>
                      <div className="text-xs text-gray-300">
                        Definir plano de ação com owner e prazo
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Card direito — Alertas */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Alertas</h2>
                <span className="badge badge-red">{criticosCount} críticos</span>
              </div>
              <div className="space-y-3">
                {alertsOrdenados
                  .filter((a) => a.criticidade === "critico" || a.criticidade === "atencao")
                  .map((alert, idx, arr) => {
                    const prevCrit = idx > 0 ? arr[idx - 1].criticidade : null;
                    const showSep = prevCrit === "critico" && alert.criticidade === "atencao";
                    return (
                      <div key={alert.id}>
                        {showSep && (
                          <div className="flex items-center gap-2 py-1">
                            <div className="flex-1 h-px bg-gray-800" />
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                              Atenção
                            </span>
                            <div className="flex-1 h-px bg-gray-800" />
                          </div>
                        )}
                        <AlertBanner alert={alert} />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Bloco 5 — Condição para próxima variável + Follow-up */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* Card esquerdo — Para desbloquear variável */}
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">
                  Para desbloquear variável em Abril
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Faltaram {scoreMensal.gapParaVariavel} pts em Março · Meta: 75+
                </p>
              </div>

              <div className="p-3 rounded-lg bg-brand-500/5 border border-brand-500/20 mb-3">
                <p className="text-xs text-brand-300 font-medium">
                  Destaque:{" "}
                  {scoreMensal.dimensoesGap
                    .map((d) => `Corrigir ${d.dimensao} (+${d.gap})`)
                    .join(" e ")}
                </p>
              </div>

              <div className="space-y-2">
                {scoreMensal.condicaoProximaFase.map((cond) => (
                  <div key={cond} className="flex items-start gap-2.5">
                    <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-400">{cond}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card direito — Follow-up Overview */}
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">Follow-ups — Março 2026</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Previstos</div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {followUpData.totalPrevistos}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Realizados</div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums">
                    {followUpData.realizados}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Vencidos</div>
                  <div className={cn("text-xl font-bold tabular-nums", followUpData.vencidos > 0 ? "text-red-400" : "text-emerald-400")}>
                    {followUpData.vencidos}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Sem fechamento</div>
                  <div className={cn("text-xl font-bold tabular-nums", followUpData.totalSemFechamento > 0 ? "text-orange-400" : "text-emerald-400")}>
                    {followUpData.totalSemFechamento}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">
                    Taxa: {followUpData.realizados}/{followUpData.totalPrevistos}
                  </span>
                  <span className={cn("font-semibold", followUpTaxa >= 90 ? "text-emerald-400" : followUpTaxa >= 70 ? "text-yellow-400" : "text-red-400")}>
                    {followUpTaxa}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", followUpTaxa >= 90 ? "bg-emerald-400" : followUpTaxa >= 70 ? "bg-yellow-400" : "bg-red-400")}
                    style={{ width: `${followUpTaxa}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 6 — Retrospectiva + Autonomia + Foco */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Card — Retrospectiva */}
            <div className="card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Retrospectiva — Março 2026</h2>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <span className="text-emerald-400 text-base shrink-0">✓</span>
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 mb-0.5">
                      Principal Avanço
                    </div>
                    <div className="text-sm text-gray-300">{scoreMensal.principalAvanco}</div>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <span className="text-red-400 text-base shrink-0">✗</span>
                  <div>
                    <div className="text-xs font-semibold text-red-400 mb-0.5">
                      Principal Falha
                    </div>
                    <div className="text-sm text-gray-300">{scoreMensal.principalFalha}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card — Índice de Autonomia */}
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">Índice de Autonomia</h2>
                <p className="text-xs text-gray-500 mt-0.5">Escala 1–5</p>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-white tabular-nums">
                  {scoreMensal.autonomiaIndex}
                </span>
                <span className="text-lg text-gray-500 mb-1">/ 5</span>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                Toca rotinas, ainda precisa de direção frequente
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{ width: `${(scoreMensal.autonomiaIndex / 5) * 100}%` }}
                />
              </div>

              <div className="p-2.5 rounded-lg bg-gray-800/60 border border-gray-700">
                <p className="text-[10px] text-gray-500">
                  Fase atual:{" "}
                  <span className="text-gray-300">{scoreMensal.fase}</span>
                  {" — "}índice 4+ para subir
                </p>
              </div>
            </div>

            {/* Card — Foco do Próximo Mês */}
            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                  🎯
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                    Foco do Próximo Mês
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    {scoreMensal.focoProximoMes}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </PeriodFilterBar>
    </>
  );
}
