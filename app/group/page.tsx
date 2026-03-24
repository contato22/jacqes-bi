"use client";

import Link from "next/link";
import { awqBus, awqGroupMeta, type AWQBuCard } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  ArrowRight, TrendingUp, Users, Zap, Building2,
  Lock, CheckCircle, Construction,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

const statusConfig: Record<AWQBuCard["status"], { label: string; icon: typeof CheckCircle; cls: string }> = {
  ativo:          { label: "Ativo",          icon: CheckCircle,  cls: "badge-green" },
  em_construcao:  { label: "Em Construção",  icon: Construction, cls: "badge-yellow" },
  prospeccao:     { label: "Prospecção",     icon: TrendingUp,   cls: "badge-blue" },
  inativo:        { label: "Inativo",        icon: Lock,         cls: "badge" },
};

const saudeColor: Record<string, string> = {
  "Saudável":      "text-emerald-400",
  "Estável":       "text-blue-400",
  "Em Atenção":    "text-yellow-400",
  "Em Construção": "text-gray-600",
};

const corRing: Record<string, string> = {
  brand:   "ring-brand-500/30 hover:ring-brand-500/60",
  emerald: "ring-emerald-500/30 hover:ring-emerald-500/60",
  purple:  "ring-purple-500/30 hover:ring-purple-500/60",
  blue:    "ring-blue-500/30 hover:ring-blue-500/60",
};

const corAccent: Record<string, string> = {
  brand:   "text-brand-400",
  emerald: "text-emerald-400",
  purple:  "text-purple-400",
  blue:    "text-blue-400",
};

const corBg: Record<string, string> = {
  brand:   "bg-brand-500/10",
  emerald: "bg-emerald-500/10",
  purple:  "bg-purple-500/10",
  blue:    "bg-blue-500/10",
};

// ── BU Card ────────────────────────────────────────────────────────────────────

function BUCard({ bu }: { bu: AWQBuCard }) {
  const isActive = bu.status === "ativo";
  const st = statusConfig[bu.status];
  const StatusIcon = st.icon;
  const mrrPct = bu.mrrMeta > 0 ? Math.min((bu.mrr / bu.mrrMeta) * 100, 100) : 0;

  const cardContent = (
    <div
      className={cn(
        "card p-6 flex flex-col gap-4 ring-2 transition-all duration-200",
        corRing[bu.cor],
        isActive ? "card-hover cursor-pointer" : "opacity-75",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", corBg[bu.cor])}>
            <Building2 size={18} className={corAccent[bu.cor]} />
          </div>
          <div>
            <div className="font-bold text-white text-sm">{bu.nome}</div>
            <div className="text-xs text-gray-500">{bu.tag}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`badge ${st.cls} flex items-center gap-1`}>
            <StatusIcon size={9} />
            {st.label}
          </span>
          {bu.saude && (
            <span className={cn("text-[10px] font-medium", saudeColor[bu.saude])}>
              {bu.saude}
            </span>
          )}
        </div>
      </div>

      {/* Descrição */}
      <p className="text-xs text-gray-500 leading-relaxed">{bu.descricao}</p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800/40 rounded-lg p-3">
          <div className={cn("text-base font-bold tabular-nums", isActive ? corAccent[bu.cor] : "text-gray-700")}>
            {isActive ? formatCurrency(bu.mrr) : "—"}
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">MRR atual</div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-3">
          <div className={cn("text-base font-bold tabular-nums", isActive ? "text-gray-200" : "text-gray-700")}>
            {isActive ? bu.contas : "—"}
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">Contas</div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-3">
          <div className={cn("text-base font-bold tabular-nums", isActive && bu.scoreCS !== null ? (bu.scoreCS >= 75 ? "text-emerald-400" : "text-yellow-400") : "text-gray-700")}>
            {isActive && bu.scoreCS !== null ? `${bu.scoreCS}/100` : "—"}
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">Score CS</div>
        </div>
      </div>

      {/* MRR Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-600">MRR vs Meta</span>
          <span className="text-[10px] text-gray-500 tabular-nums">
            {isActive ? `${mrrPct.toFixed(0)}%` : "—"}
          </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", isActive ? corAccent[bu.cor].replace("text-", "bg-") : "bg-gray-700")}
            style={{ width: `${mrrPct}%` }}
          />
        </div>
        <div className="text-[10px] text-gray-700 mt-1">
          Meta: {formatCurrency(bu.mrrMeta)}/mês
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-800/60">
        <span className="text-[10px] text-gray-600">Responsável: {bu.responsavel}</span>
        {isActive ? (
          <span className={cn("flex items-center gap-1 text-xs font-medium", corAccent[bu.cor])}>
            Acessar <ArrowRight size={12} />
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-gray-700">
            <Lock size={10} /> Em breve
          </span>
        )}
      </div>
    </div>
  );

  if (isActive && bu.href !== "#") {
    return <Link href={bu.href}>{cardContent}</Link>;
  }
  return <div>{cardContent}</div>;
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function GroupPage() {
  const mrrPct = awqGroupMeta.mrrMeta > 0
    ? (awqGroupMeta.mrrTotal / awqGroupMeta.mrrMeta) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Top bar ── */}
      <div className="border-b border-gray-800 bg-gray-900/95 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-awq-gold to-amber-600 flex items-center justify-center shadow-lg">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">AWQ Group</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Plataforma Central</div>
            </div>
          </div>
          <div className="text-[10px] text-gray-600">{awqGroupMeta.mesReferencia}</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Hero ── */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Plataforma AWQ Group</h1>
          <p className="text-sm text-gray-500">
            Todas as BUs, plataformas e operações do grupo em um único lugar.
          </p>
        </div>

        {/* ── Group KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "MRR Total",       value: formatCurrency(awqGroupMeta.mrrTotal),   sub: `de ${formatCurrency(awqGroupMeta.mrrMeta)} meta`,  color: "text-emerald-400" },
            { label: "BUs Ativas",      value: String(awqGroupMeta.busAtivas),           sub: `de ${awqGroupMeta.busTotal} no grupo`,              color: "text-brand-400"   },
            { label: "Contas Geridas",  value: String(awqGroupMeta.contasTotal),         sub: "carteira ativa",                                    color: "text-blue-400"    },
            { label: "Cobertura MRR",   value: `${mrrPct.toFixed(0)}%`,                 sub: "da meta do grupo",                                  color: mrrPct >= 80 ? "text-emerald-400" : "text-yellow-400" },
          ].map((k) => (
            <div key={k.label} className="card p-5">
              <div className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</div>
              <div className="text-xs text-gray-500 mt-1">{k.label}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── BU Grid ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={14} className="text-gray-500" />
            <h2 className="text-sm font-semibold text-white">
              Business Units — {awqGroupMeta.busTotal} plataformas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {awqBus.map((bu) => (
              <BUCard key={bu.id} bu={bu} />
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <p className="text-[11px] text-gray-700 text-center pb-4">
          AWQ Group · Plataforma Central · {awqGroupMeta.mesReferencia} ·
          BUs em construção estarão disponíveis conforme onboarding
        </p>
      </div>
    </div>
  );
}
