"use client";

import { awqBus } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Video, TrendingUp, Users, DollarSign } from "lucide-react";

const bu = awqBus.find((b) => b.id === "cazavision")!;

export default function CazaVisionPage() {
  const mrrPct = bu.mrrMeta > 0 ? (bu.mrr / bu.mrrMeta) * 100 : 0;

  return (
    <div className="page-content">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Caza Vision · Visão Geral</h1>
        <p className="text-sm text-gray-500 mt-0.5">Produtora de Conteúdo · AWQ Group</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "MRR",           value: formatCurrency(bu.mrr),   icon: DollarSign, color: "text-purple-400" },
          { label: "Projetos Ativos", value: String(bu.contas),     icon: Video,      color: "text-purple-400" },
          { label: "Meta MRR",      value: formatCurrency(bu.mrrMeta), icon: TrendingUp, color: "text-gray-400" },
          { label: "Cobertura",     value: mrrPct.toFixed(0) + "%", icon: Users,      color: mrrPct >= 80 ? "text-emerald-400" : "text-yellow-400" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={k.color} />
                <span className="text-xs text-gray-500">{k.label}</span>
              </div>
              <div className={`text-xl font-bold tabular-nums ${k.color}`}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* MRR Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">MRR vs Meta</h2>
          <span className="text-xs text-purple-400 font-semibold tabular-nums">{mrrPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(mrrPct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-600">
          <span>{formatCurrency(bu.mrr)} atual</span>
          <span>Meta: {formatCurrency(bu.mrrMeta)}</span>
        </div>
      </div>

      {/* Description */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-2">Sobre</h2>
        <p className="text-sm text-gray-400 leading-relaxed">{bu.descricao}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-green">Ativo</span>
          <span className="badge">Produtora</span>
          <span className="badge">AWQ Group</span>
        </div>
      </div>
    </div>
  );
}
