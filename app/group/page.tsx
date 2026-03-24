"use client";

import Link from "next/link";
import { awqBus, awqGroupMeta, type AWQBuCard } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap, Lock } from "lucide-react";

// ── Color maps ────────────────────────────────────────────────────────────────

const corAccent: Record<string, string> = {
  brand:   "text-brand-400",
  emerald: "text-emerald-400",
  purple:  "text-purple-400",
  blue:    "text-blue-400",
};

const corBg: Record<string, string> = {
  brand:   "bg-brand-500\/10",
  emerald: "bg-emerald-500\/10",
  purple:  "bg-gray-800\/40",
  blue:    "bg-blue-500\/10",
};

const statusLabel: Record<AWQBuCard["status"], string> = {
  ativo:         "Ativo",
  em_construcao: "Em construção",
  prospeccao:    "Prospecção",
  inativo:       "Inativo",
};

const statusCls: Record<AWQBuCard["status"], string> = {
  ativo:         "badge-green",
  em_construcao: "badge-yellow",
  prospeccao:    "badge-blue",
  inativo:       "badge",
};

// ── BU Row ────────────────────────────────────────────────────────────────────

function BURow({ bu }: { bu: AWQBuCard }) {
  const isActive = bu.status === "ativo";

  const inner = (
    <div
      className={cn(
        "card card-hover flex items-center gap-4 px-5 py-4 group",
        !isActive && "opacity-60 cursor-default",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          corBg[bu.cor],
        )}
      >
        <Zap size={15} className={isActive ? corAccent[bu.cor] : "text-gray-600"} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="card-title text-sm font-semibold">{bu.nome}</span>
          <span className={`badge ${statusCls[bu.status]} text-[10px]`}>
            {statusLabel[bu.status]}
          </span>
        </div>
        <p className="card-subtitle text-xs mt-0.5 truncate">{bu.tag}</p>
      </div>

      {/* CTA */}
      <div className="shrink-0 ml-2">
        {isActive ? (
          <ArrowRight
            size={15}
            className={cn(
              "transition-transform duration-150 group-hover:translate-x-0.5",
              corAccent[bu.cor],
            )}
          />
        ) : (
          <Lock size={13} className="text-gray-600" />
        )}
      </div>
    </div>
  );

  if (isActive && bu.href !== "#") {
    return <Link href={bu.href} className="block">{inner}</Link>;
  }
  return inner;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GroupPage() {
  const busAtivas  = awqBus.filter((b) => b.status === "ativo").length;
  const busTotais  = awqBus.length;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Header bar ── */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900\/95 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-awq-gold flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">AWQ Group</span>
          </div>
          <span className="text-[11px] text-gray-600 tabular-nums">
            {awqGroupMeta.mesReferencia}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-xl mx-auto px-6 py-14 space-y-12">

        {/* Hero */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Plataforma AWQ
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {busAtivas} de {busTotais} unidades ativas.
            Selecione uma BU para acessar o painel.
          </p>
        </div>

        {/* BU list */}
        <div className="space-y-2">
          {awqBus.map((bu) => (
            <BURow key={bu.id} bu={bu} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-[11px] text-gray-700 text-center pb-2">
          AWQ Group · {awqGroupMeta.mesReferencia}
        </p>
      </div>
    </div>
  );
}
