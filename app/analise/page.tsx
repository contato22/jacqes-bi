"use client";

import { useState } from "react";
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import { contasData, scoreMensal, scoreDimensions, alerts } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─── Derivações automáticas dos dados ─────────────────────────────────────────

const TODAY = new Date("2026-03-19");
const WEEK_END = new Date("2026-03-25");

function daysDiff(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

const riscoScore: Record<string, number> = { Alto: 3, Médio: 2, Baixo: 1 };
const saudeScore: Record<string, number> = {
  Sensível: 3,
  "Em Risco": 3,
  "Estável com Atenção": 2,
  Saudável: 0,
};

const urgencyConfig = [
  { min: 7, label: "Crítico", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", dot: "bg-red-400" },
  { min: 4, label: "Atenção", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", dot: "bg-yellow-400" },
  { min: 0, label: "Normal", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
];

function getUrgency(score: number) {
  return urgencyConfig.find((u) => score >= u.min) ?? urgencyConfig[urgencyConfig.length - 1];
}

const priorityQueue = contasData
  .map((c) => {
    const pendScore = c.pendencias >= 5 ? 3 : c.pendencias >= 3 ? 2 : c.pendencias > 0 ? 1 : 0;
    const total = riscoScore[c.risco] + saudeScore[c.saude] + pendScore;
    return { ...c, urgencyScore: total };
  })
  .sort((a, b) => b.urgencyScore - a.urgencyScore);

const visitasEstaSemana = contasData
  .filter((c) => {
    if (!c.proximaVisita) return false;
    const diff = daysDiff(c.proximaVisita);
    return diff >= 0 && diff <= 7;
  })
  .sort((a, b) => daysDiff(a.proximaVisita!) - daysDiff(b.proximaVisita!));

const nextThreshold =
  scoreMensal.scoreTotal >= 95 ? null :
  scoreMensal.scoreTotal >= 85 ? { pts: 95, label: "Owner em Formação" } :
  scoreMensal.scoreTotal >= 75 ? { pts: 85, label: "Operador Sólido" } :
  scoreMensal.scoreTotal >= 60 ? { pts: 75, label: "Bom Nível" } :
  { pts: 60, label: "Operação Mínima" };

const weakestDimension = [...scoreDimensions].sort(
  (a, b) => a.score / a.max - b.score / b.max
)[0];

// ─── Checklist semanal ─────────────────────────────────────────────────────────

const CHECKLIST = [
  { id: "c1", text: "Atualizar dados de todas as contas no Notion", category: "operação" },
  { id: "c2", text: "Fechar / resolver pendências da Conta 04 (meta: reduzir de 5 para 3)", category: "urgente" },
  { id: "c3", text: "Preparar pauta para visita Conta 04 — 22/03", category: "visita" },
  { id: "c4", text: "Preparar pauta para visita JACQES — 25/03", category: "visita" },
  { id: "c5", text: "Preencher relatório pós-visita pendente", category: "urgente" },
  { id: "c6", text: "Follow-up AWQ - Agência (alinhamento de expectativas)", category: "atendimento" },
  { id: "c7", text: "Reagendar as 2 visitas não realizadas do mês", category: "urgente" },
  { id: "c8", text: "Criar pelo menos 1 ativo de processo (checklist de visita)", category: "processo" },
];

const categoryStyle: Record<string, string> = {
  urgente: "text-red-400",
  visita: "text-blue-400",
  operação: "text-brand-400",
  atendimento: "text-emerald-400",
  processo: "text-purple-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalisePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / CHECKLIST.length) * 100);

  return (
    <>
      <Header
        title="Análise Recorrente"
        subtitle="Briefing semanal gerado automaticamente — 19 a 25 de março 2026"
      />

      <div className="page-content">

        {/* ── Status banner ── */}
        <div className="card p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tabular-nums">
                {scoreMensal.scoreTotal}
              </span>
              <span className="text-gray-500 text-sm">/ 100</span>
              <span className="text-base ml-1">🟡</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-sm text-gray-400">
              Fase: <span className="text-gray-200 font-medium">{scoreMensal.fase}</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-sm text-gray-400">
              Meta da variável:{" "}
              <span className="text-red-400 font-semibold">{scoreMensal.scorePotencial} pts</span>
              <span className="text-gray-600 ml-1">(faltam {scoreMensal.gapParaVariavel} pts)</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-sm text-gray-400">
              Alertas ativos:{" "}
              <span className="text-red-400 font-semibold">
                {alerts.filter((a) => a.type === "error" || a.type === "warning").length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RefreshCw size={12} />
            Gerado em 19/03/2026
          </div>
        </div>

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coluna esquerda (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Agenda da Semana */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <CalendarClock size={15} className="text-brand-400" />
                <h2 className="text-sm font-semibold text-white">Agenda da Semana</h2>
                <span className="badge badge-blue ml-auto">
                  {visitasEstaSemana.length} visita{visitasEstaSemana.length !== 1 ? "s" : ""}
                </span>
              </div>

              {visitasEstaSemana.length === 0 ? (
                <div className="text-sm text-gray-600 py-4 text-center">
                  Nenhuma visita programada para esta semana.
                </div>
              ) : (
                <div className="space-y-3">
                  {visitasEstaSemana.map((conta) => {
                    const diff = daysDiff(conta.proximaVisita!);
                    const urgency = getUrgency(riscoScore[conta.risco] + saudeScore[conta.saude]);
                    return (
                      <div
                        key={conta.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border",
                          urgency.bg
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full shrink-0", urgency.dot)} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">
                            {conta.nome}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {conta.segmento} · {conta.pendencias} pendência{conta.pendencias !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-white tabular-nums">
                            {formatShortDate(conta.proximaVisita!)}
                          </div>
                          <div className={cn("text-xs font-medium", urgency.color)}>
                            {diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : `Daqui ${diff} dias`}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <span className={cn("badge text-[10px]", urgency.color.replace("text-", "badge-").replace("-400", ""))}>
                            {urgency.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Próxima semana preview */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
                  Próxima semana
                </div>
                <div className="space-y-1">
                  {contasData
                    .filter((c) => {
                      if (!c.proximaVisita) return false;
                      const d = daysDiff(c.proximaVisita);
                      return d > 7 && d <= 14;
                    })
                    .map((c) => (
                      <div key={c.id} className="flex items-center gap-2 text-xs text-gray-500">
                        <ArrowRight size={10} />
                        <span>{c.nome}</span>
                        <span className="text-gray-700">—</span>
                        <span className="tabular-nums">{formatShortDate(c.proximaVisita!)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Fila de Prioridades */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={15} className="text-yellow-400" />
                <h2 className="text-sm font-semibold text-white">Fila de Prioridades</h2>
                <span className="text-[10px] text-gray-600 ml-auto">ordenado por urgência</span>
              </div>

              <div className="space-y-2">
                {priorityQueue.map((conta, idx) => {
                  const urgency = getUrgency(conta.urgencyScore);
                  return (
                    <div
                      key={conta.id}
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-800/40 border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200 truncate">
                            {conta.nome}
                          </span>
                          <span className={cn("badge text-[10px]", urgency.label === "Crítico" ? "badge-red" : urgency.label === "Atenção" ? "badge-yellow" : "badge-green")}>
                            {urgency.label}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">
                          {conta.observacoes}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs text-gray-500">
                        <div className="text-right">
                          <div className={cn("font-semibold tabular-nums", conta.pendencias >= 4 ? "text-red-400" : conta.pendencias >= 2 ? "text-yellow-400" : "text-emerald-400")}>
                            {conta.pendencias}
                          </div>
                          <div className="text-gray-700 text-[10px]">pend.</div>
                        </div>
                        <div className="text-right">
                          <div className={cn("font-semibold", conta.risco === "Alto" ? "text-red-400" : conta.risco === "Médio" ? "text-yellow-400" : "text-emerald-400")}>
                            {conta.risco}
                          </div>
                          <div className="text-gray-700 text-[10px]">risco</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Análise de Score */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Target size={15} className="text-brand-400" />
                <h2 className="text-sm font-semibold text-white">Análise de Score</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Gap para próxima faixa */}
                <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
                  <div className="text-xs text-gray-500 mb-1">Próxima faixa</div>
                  {nextThreshold ? (
                    <>
                      <div className="text-lg font-bold text-white">
                        +{nextThreshold.pts - scoreMensal.scoreTotal} pts
                      </div>
                      <div className="text-xs text-brand-400 mt-0.5 font-medium">
                        para &ldquo;{nextThreshold.label}&rdquo;
                      </div>
                    </>
                  ) : (
                    <div className="text-lg font-bold text-emerald-400">Máximo atingido</div>
                  )}
                </div>

                {/* Dimensão mais fraca */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="text-xs text-gray-500 mb-1">Dimensão mais fraca</div>
                  <div className="text-lg font-bold text-white">{weakestDimension.dimensao}</div>
                  <div className="text-xs text-red-400 mt-0.5 font-medium">
                    {weakestDimension.score}/{weakestDimension.max} pts (
                    {Math.round((weakestDimension.score / weakestDimension.max) * 100)}%)
                  </div>
                </div>
              </div>

              {/* Dimensões com progress */}
              <div className="space-y-2.5">
                {scoreDimensions.map((d) => {
                  const pct = (d.score / d.max) * 100;
                  const isWeak = d.dimensao === weakestDimension.dimensao;
                  return (
                    <div key={d.dimensao}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">{d.dimensao}</span>
                          {isWeak && (
                            <TrendingDown size={11} className="text-red-400" />
                          )}
                        </div>
                        <span className="text-xs tabular-nums text-gray-500">
                          <span className={cn("font-semibold", isWeak ? "text-red-400" : "text-white")}>
                            {d.score}
                          </span>/{d.max}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", isWeak ? "bg-red-500" : "bg-brand-500")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna direita (1/3) */}
          <div className="space-y-6">

            {/* Checklist Semanal */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">Checklist Semanal</h2>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{doneCount} de {CHECKLIST.length} concluídas</span>
                  <span className={cn("font-semibold", pct === 100 ? "text-emerald-400" : pct >= 50 ? "text-yellow-400" : "text-gray-400")}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-300", pct === 100 ? "bg-emerald-500" : "bg-brand-500")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                {CHECKLIST.map((item) => {
                  const done = !!checked[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-800/60 transition-colors text-left group"
                    >
                      {done ? (
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle size={15} className="text-gray-700 group-hover:text-gray-500 shrink-0 mt-0.5 transition-colors" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={cn("text-xs leading-relaxed", done ? "line-through text-gray-600" : "text-gray-300")}>
                          {item.text}
                        </span>
                        <div className={cn("text-[10px] font-semibold mt-0.5 uppercase tracking-wide", categoryStyle[item.category])}>
                          {item.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alertas ativos */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-yellow-400" />
                <h2 className="text-sm font-semibold text-white">Alertas Ativos</h2>
              </div>
              <div className="space-y-2.5">
                {alerts.map((alert) => {
                  const isError = alert.type === "error";
                  const isWarn = alert.type === "warning";
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex gap-2.5 p-3 rounded-lg border text-xs",
                        isError ? "bg-red-500/5 border-red-500/20 text-red-400" :
                        isWarn ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-400" :
                        "bg-blue-500/5 border-blue-500/20 text-blue-400"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isError ? <AlertTriangle size={12} /> : isWarn ? <AlertTriangle size={12} /> : <TrendingUp size={12} />}
                      </div>
                      <div>
                        <div className="font-semibold">{alert.title}</div>
                        <div className="opacity-70 mt-0.5 leading-relaxed">{alert.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Próxima análise */}
            <div className="card p-5">
              <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
                Próxima análise
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                  <RefreshCw size={15} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">26 de março, 2026</div>
                  <div className="text-xs text-gray-500 mt-0.5">Semana 26 Mar – 01 Abr</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-600 leading-relaxed">
                O briefing é gerado automaticamente com base nos dados do Notion a cada início de semana.
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
