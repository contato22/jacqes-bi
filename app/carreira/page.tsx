"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, Star, BookOpen,
  DollarSign, Target, CheckCircle, Clock, Lock,
  ChevronRight, Circle, Award, Zap, Users,
} from "lucide-react";
import Header from "@/components/Header";
import { carreiraData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

// ─── helpers ──────────────────────────────────────────────────────────────────

const okrStatusConfig = {
  on_track: { label: "No prazo",  badge: "badge-green",  icon: CheckCircle },
  at_risk:  { label: "Em risco",  badge: "badge-yellow", icon: Clock       },
  behind:   { label: "Atrasado",  badge: "badge-red",    icon: TrendingDown},
  futuro:   { label: "Futuro",    badge: "badge text-gray-600 bg-gray-800", icon: Circle },
} as const;

const estudoStatusConfig = {
  em_andamento: { label: "Em andamento", badge: "badge-blue"  },
  concluido:    { label: "Concluído",    badge: "badge-green" },
  planejado:    { label: "Planejado",    badge: "badge text-gray-500 bg-gray-800" },
} as const;

const milestoneStatusConfig = {
  concluido:    { dot: "bg-emerald-400", color: "text-gray-500 line-through", linea: "bg-emerald-500"  },
  em_andamento: { dot: "bg-brand-400",   color: "text-white font-medium",     linea: "bg-brand-500"    },
  proximo:      { dot: "bg-yellow-400",  color: "text-gray-400",              linea: "bg-yellow-500/40"},
  futuro:       { dot: "bg-gray-700",    color: "text-gray-600",              linea: "bg-gray-800"     },
} as const;

const habilidadeAreaConfig = {
  tecnica:    { label: "Técnica",    color: "bg-cyan-500"   },
  soft:       { label: "Soft Skill", color: "bg-pink-500"   },
  gestao:     { label: "Gestão",     color: "bg-brand-500"  },
  marketing:  { label: "Marketing",  color: "bg-orange-500" },
} as const;

function SectionCard({ title, icon: Icon, iconColor = "text-brand-400", iconBg = "bg-brand-500/10 border-brand-500/20", children }: {
  title: string; icon: React.ElementType; iconColor?: string; iconBg?: string; children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-7 h-7 rounded-lg ${iconBg} border flex items-center justify-center ${iconColor} shrink-0`}>
          <Icon size={13} />
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarreiraPage() {
  const d = carreiraData;
  const [activeOKR, setActiveOKR] = useState(0);

  const gapVariavel   = d.receita.variavelScoreMin - d.scoreAtual;
  const scorePct      = (d.scoreAtual / 100) * 100;
  const vestingPct    = d.receita.vestingProgresso;

  return (
    <>
      <Header
        title="Modo Carreira"
        subtitle={`${d.nomeCompleto} · ${d.cargo} · ${d.empresa}`}
      />

      <div className="page-content">

        {/* ── Status hero ── */}
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-wrap">
              {/* Score ring (simulated) */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                    <circle cx="40" cy="40" r="30" stroke="#1f2937" strokeWidth="8" fill="none" />
                    <circle
                      cx="40" cy="40" r="30"
                      stroke="#6366f1"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 30}`}
                      strokeDashoffset={`${2 * Math.PI * 30 * (1 - scorePct / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white tabular-nums">{d.scoreAtual}</span>
                    <span className="text-[9px] text-gray-600">/100</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">Score atual</span>
              </div>

              <div className="h-16 w-px bg-gray-800 hidden sm:block" />

              <div className="space-y-1">
                <div className="text-xs text-gray-500">Estágio</div>
                <div className="text-lg font-bold text-white">{d.estagioAtual}</div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-yellow">{d.scoreAtual} pts</span>
                  <ChevronRight size={12} className="text-gray-600" />
                  <span className="badge badge-blue">{d.receita.variavelScoreMin} pts = variável</span>
                </div>
              </div>

              <div className="h-16 w-px bg-gray-800 hidden xl:block" />

              <div className="space-y-1">
                <div className="text-xs text-gray-500">Variável mensal</div>
                <div className={cn("text-lg font-bold", d.receita.variavelStatus === "paga" ? "text-emerald-400" : "text-red-400")}>
                  {d.receita.variavelStatus === "paga"
                    ? `+ ${formatCurrency(d.receita.variavelMeta)}`
                    : `− ${formatCurrency(d.receita.variavelMeta)}`}
                </div>
                <div className="text-[11px] text-gray-600">
                  {d.receita.variavelStatus === "paga"
                    ? "Threshold atingido"
                    : `Faltam ${gapVariavel} pts para desbloquear`}
                </div>
              </div>

              <div className="h-16 w-px bg-gray-800 hidden xl:block" />

              <div className="space-y-1">
                <div className="text-xs text-gray-500">Vesting · {d.receita.vestingContaAncora}</div>
                <div className="text-lg font-bold text-white">{vestingPct}%</div>
                <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vestingPct}%` }} />
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-gray-600 leading-relaxed max-w-xs">
              {d.notasCarreira}
            </div>
          </div>
        </div>

        {/* ── Receita & Plano de Evolução ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Receita */}
          <SectionCard title="Receita & Compensação" icon={DollarSign} iconColor="text-emerald-400" iconBg="bg-emerald-500/10 border-emerald-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-800/40 border border-gray-700/30">
                <div className="text-sm text-gray-400">Fixo mensal</div>
                <div className="text-sm font-bold text-white tabular-nums">{formatCurrency(d.receita.fixoMensal)}</div>
              </div>
              <div className={cn(
                "flex items-center justify-between p-3.5 rounded-xl border",
                d.receita.variavelStatus === "paga"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-red-500/5 border-red-500/20"
              )}>
                <div className="space-y-0.5">
                  <div className="text-sm text-gray-400">Variável (meta score ≥ {d.receita.variavelScoreMin})</div>
                  <div className={cn("text-[11px] font-medium", d.receita.variavelStatus === "paga" ? "text-emerald-400" : "text-red-400")}>
                    {d.receita.variavelStatus === "paga" ? "Desbloqueada ✓" : `Bloqueada — faltam ${gapVariavel} pts`}
                  </div>
                </div>
                <div className={cn("text-sm font-bold tabular-nums", d.receita.variavelStatus === "paga" ? "text-emerald-400" : "text-red-400")}>
                  {formatCurrency(d.receita.variavelMeta)}
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-800/40 border border-gray-700/30">
                <div className="text-sm text-gray-400">Projeção anual (fixo)</div>
                <div className="text-sm font-bold text-gray-300 tabular-nums">{formatCurrency(d.receita.projecaoAnualBase)}</div>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20">
                <div className="space-y-0.5">
                  <div className="text-sm text-gray-400">Projeção anual (fixo + variável)</div>
                  <div className="text-[11px] text-brand-400 font-medium">meta: score ≥ 75 todo mês</div>
                </div>
                <div className="text-sm font-bold text-brand-300 tabular-nums">{formatCurrency(d.receita.projecaoAnualComVariavel)}</div>
              </div>

              {/* Vesting */}
              <div className="pt-2 border-t border-gray-800">
                <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Vesting · {d.receita.vestingContaAncora}</div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${vestingPct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums">{vestingPct}%</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{d.receita.vestingDescricao}</p>
              </div>
            </div>
          </SectionCard>

          {/* Plano de evolução */}
          <SectionCard title="Plano de Evolução" icon={TrendingUp} iconColor="text-brand-400" iconBg="bg-brand-500/10 border-brand-500/20">
            <div className="space-y-2">
              {d.estagios.map((e) => (
                <div
                  key={e.titulo}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    e.isCurrent
                      ? "bg-brand-500/10 border-brand-500/30"
                      : "bg-gray-800/30 border-gray-800"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {e.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1" />}
                      <span className={cn("text-sm font-semibold", e.isCurrent ? "text-brand-300" : "text-gray-400")}>
                        {e.titulo}
                        {e.isCurrent && <span className="ml-2 text-[10px] text-brand-500 font-normal">← atual</span>}
                      </span>
                    </div>
                    <span className={cn("text-[10px] tabular-nums shrink-0", e.isCurrent ? "text-brand-400" : "text-gray-600")}>
                      {e.scoreMin}{e.scoreMax ? `–${e.scoreMax}` : "+"} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">{e.descricao}</p>
                  <div className="flex flex-wrap gap-1">
                    {e.beneficios.map((b) => (
                      <span key={b} className={cn("badge text-[10px]", e.isCurrent ? "badge-blue" : "badge text-gray-600 bg-gray-800")}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── OKRs ── */}
        <SectionCard title="OKRs & Metas" icon={Target}>
          {/* OKR selector */}
          <div className="flex gap-2 mb-5">
            {d.okrs.map((okr, i) => (
              <button
                key={i}
                onClick={() => setActiveOKR(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  activeOKR === i
                    ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                    : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                )}
              >
                {okr.trimestre}
              </button>
            ))}
          </div>

          {d.okrs[activeOKR] && (
            <div>
              <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                <Target size={13} className="text-brand-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-200">{d.okrs[activeOKR].objetivo}</span>
              </div>

              <div className="space-y-2.5">
                {d.okrs[activeOKR].keyResults.map((kr) => {
                  const cfg = okrStatusConfig[kr.status] ?? okrStatusConfig.on_track;
                  const Icon = cfg.icon;
                  return (
                    <div key={kr.descricao} className="bg-gray-800/30 rounded-xl p-3.5 border border-gray-800">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-2">
                          <Icon size={12} className={cn("mt-0.5 shrink-0",
                            kr.status === "on_track" ? "text-emerald-400"
                            : kr.status === "at_risk" ? "text-yellow-400"
                            : kr.status === "behind" ? "text-red-400"
                            : "text-gray-600"
                          )} />
                          <span className="text-xs text-gray-300 leading-relaxed">{kr.descricao}</span>
                        </div>
                        <span className={`badge shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-5">
                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full",
                              kr.progresso >= 70 ? "bg-emerald-500"
                              : kr.progresso >= 40 ? "bg-yellow-500"
                              : "bg-red-500"
                            )}
                            style={{ width: `${kr.progresso}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-600 shrink-0 tabular-nums">
                          {kr.atual} / {kr.meta}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Estudos + Habilidades ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Estudos */}
          <SectionCard title="Estudos & Certificações" icon={BookOpen} iconColor="text-purple-400" iconBg="bg-purple-500/10 border-purple-500/20">
            <div className="space-y-2.5">
              {d.estudos.map((e) => {
                const { badge, label } = estudoStatusConfig[e.status];
                return (
                  <div key={e.curso} className="p-3.5 rounded-xl bg-gray-800/30 border border-gray-800">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-200 leading-tight">{e.curso}</span>
                      <span className={`badge shrink-0 ${badge}`}>{label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 mb-1.5">
                      <span>{e.plataforma}</span>
                      <span>·</span>
                      <span>{e.area}</span>
                      {e.cargaHoras && <><span>·</span><span>{e.cargaHoras}h</span></>}
                      {e.prazo && <><span>·</span><span>{e.prazo.split("-").reverse().join("/")}</span></>}
                    </div>
                    {e.progresso !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full",
                              e.progresso === 100 ? "bg-emerald-500"
                              : e.progresso >= 50 ? "bg-brand-500"
                              : "bg-gray-600"
                            )}
                            style={{ width: `${e.progresso}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-600 tabular-nums">{e.progresso}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Mapa de habilidades */}
          <SectionCard title="Mapa de Habilidades" icon={Star} iconColor="text-yellow-400" iconBg="bg-yellow-500/10 border-yellow-500/20">
            <div className="space-y-3">
              {d.habilidades.map((h) => {
                const areaCfg = habilidadeAreaConfig[h.area];
                return (
                  <div key={h.nome}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300">{h.nome}</span>
                        <span className={cn("badge text-[9px]", `${areaCfg.color}/10 text-${areaCfg.color.replace("bg-", "")}-400`)} style={{ fontSize: "9px" }}>
                          {areaCfg.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 tabular-nums">{h.nivel}/{h.meta}</span>
                    </div>
                    {/* Level dots */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: h.meta }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 flex-1 rounded-full",
                            i < h.nivel ? areaCfg.color : "bg-gray-800"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Legenda</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(habilidadeAreaConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", cfg.color)} />
                    <span className="text-[10px] text-gray-600">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Milestones timeline ── */}
        <SectionCard title="Linha do Tempo — Milestones de Carreira" icon={Award} iconColor="text-orange-400" iconBg="bg-orange-500/10 border-orange-500/20">
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-800" />

            <div className="space-y-3 relative">
              {d.milestones.map((m, i) => {
                const cfg = milestoneStatusConfig[m.status];
                return (
                  <div key={i} className="flex items-start gap-4 pl-1">
                    <div className={cn("w-6 h-6 rounded-full border-2 border-gray-950 flex items-center justify-center shrink-0 relative z-10", cfg.dot)}>
                      {m.status === "concluido"    && <CheckCircle size={10} className="text-gray-950" />}
                      {m.status === "em_andamento" && <Zap size={9} className="text-white" />}
                      {m.status === "proximo"      && <ChevronRight size={9} className="text-gray-900" />}
                      {m.status === "futuro"       && <Lock size={8} className="text-gray-600" />}
                    </div>
                    <div className={cn("flex-1 pb-3", i < d.milestones.length - 1 && "border-b border-gray-800/40")}>
                      <div className="flex items-start justify-between gap-2">
                        <span className={cn("text-sm", cfg.color)}>{m.titulo}</span>
                        <span className="text-[10px] text-gray-600 tabular-nums shrink-0">
                          {m.prazo.split("-").reverse().join("/")}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{m.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* ── Mentores + nota ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Rede & Mentores" icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-500/10 border-cyan-500/20">
            <div className="space-y-2.5">
              {d.mentores.map((m) => (
                <div key={m.nome} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                    {m.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{m.nome}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{m.relacao} · {m.area}</div>
                  </div>
                </div>
              ))}
              <div className="text-[11px] text-gray-600 leading-relaxed pt-1">
                Expandir rede: participar de grupos CS, eventos de growth e comunidades de operações em 2026.
              </div>
            </div>
          </SectionCard>

          <div className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target size={13} className="text-red-400" />
                <h2 className="text-sm font-semibold text-white">Foco Imediato</h2>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{d.notasCarreira}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Próximo threshold</span>
                <div className="flex items-center gap-2">
                  <span className="badge badge-yellow tabular-nums">{d.scoreAtual} pts</span>
                  <ChevronRight size={12} className="text-gray-600" />
                  <span className="badge badge-green tabular-nums">{d.receita.variavelScoreMin} pts</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full"
                  style={{ width: `${(d.scoreAtual / d.receita.variavelScoreMin) * 100}%` }}
                />
              </div>
              <div className="text-right text-[10px] text-gray-600 mt-1">
                {gapVariavel > 0 ? `Faltam ${gapVariavel} pts para desbloquear a variável` : "Variável desbloqueada!"}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
