"use client";

import { TrendingUp, TrendingDown, Minus, DollarSign, Users, BarChart3, Briefcase } from "lucide-react";
import type { ConsolidatedMetricRecord } from "@/lib/types/canonical";
import { cn } from "@/lib/utils";

interface Props {
  current: ConsolidatedMetricRecord;
  previous?: ConsolidatedMetricRecord;
}

function formatBRL(value: number): string {
  if (value >= 1_000_000) return `R$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$${(value / 1_000).toFixed(0)}K`;
  return `R$${value.toFixed(0)}`;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

interface KPICardProps {
  label: string;
  value: string;
  subLabel?: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  accent: string;
}

function KPICard({ label, value, subLabel, delta, deltaLabel, icon, accent }: KPICardProps) {
  const hasDelta = delta !== undefined;
  const isPositive = hasDelta && delta > 0;
  const isNegative = hasDelta && delta < 0;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accent)}>
          {icon}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        {subLabel && <div className="text-xs text-gray-500 mt-0.5">{subLabel}</div>}
      </div>

      {hasDelta && (
        <div className="flex items-center gap-1.5">
          {isPositive && <TrendingUp size={13} className="text-emerald-400" />}
          {isNegative && <TrendingDown size={13} className="text-red-400" />}
          {!isPositive && !isNegative && <Minus size={13} className="text-gray-500" />}
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive && "text-emerald-400",
              isNegative && "text-red-400",
              !isPositive && !isNegative && "text-gray-500"
            )}
          >
            {isPositive ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          {deltaLabel && (
            <span className="text-xs text-gray-600">vs {deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function HoldingKPIGrid({ current, previous }: Props) {
  const revDelta = previous && previous.totalGrossRevenue > 0
    ? ((current.totalGrossRevenue - previous.totalGrossRevenue) / previous.totalGrossRevenue) * 100
    : undefined;

  const ebitdaDelta = previous && previous.totalEbitda > 0
    ? ((current.totalEbitda - previous.totalEbitda) / previous.totalEbitda) * 100
    : undefined;

  const activeBUs = Object.keys(current.byBU).length;
  const buRevenueShares = Object.entries(current.byBU)
    .sort((a, b) => (b[1]?.revenueShare ?? 0) - (a[1]?.revenueShare ?? 0));
  const topBU = buRevenueShares[0];

  const BU_LABELS: Record<string, string> = {
    jacqes: "JACQES",
    "caza-vision": "Caza Vision",
    "awq-venture": "AWQ Venture",
    "awq-holding": "AWQ Holding",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Receita Consolidada"
        value={formatBRL(current.totalGrossRevenue)}
        subLabel={`Líquida: ${formatBRL(current.totalNetRevenue)}`}
        delta={revDelta}
        deltaLabel="mês anterior"
        icon={<DollarSign size={15} className="text-white" />}
        accent="bg-brand-600/30"
      />

      <KPICard
        label="EBITDA Consolidado"
        value={formatBRL(current.totalEbitda)}
        subLabel={`Margem: ${formatPct(current.blendedEbitdaMargin)}`}
        delta={ebitdaDelta}
        deltaLabel="mês anterior"
        icon={<TrendingUp size={15} className="text-white" />}
        accent="bg-emerald-600/30"
      />

      <KPICard
        label="Margem Bruta"
        value={formatPct(current.blendedGrossMargin)}
        subLabel={`GP: ${formatBRL(current.totalGrossProfit)}`}
        icon={<BarChart3 size={15} className="text-white" />}
        accent="bg-purple-600/30"
      />

      <KPICard
        label="Portfólio AWQ Venture"
        value={`${current.portfolioCount} empresa${current.portfolioCount !== 1 ? "s" : ""}`}
        subLabel={current.portfolioRevenue > 0 ? `Rev: ${formatBRL(current.portfolioRevenue)}` : "Dados pendentes"}
        icon={<Briefcase size={15} className="text-white" />}
        accent="bg-amber-600/30"
      />

      {/* BU Revenue Breakdown row */}
      {buRevenueShares.length > 1 && (
        <div className="col-span-2 lg:col-span-4 card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Receita por Unidade de Negócio — {current.period}
            </span>
            <span className="text-xs text-gray-600">
              Total: {formatBRL(current.totalGrossRevenue)}
            </span>
          </div>
          <div className="space-y-3">
            {buRevenueShares.map(([buId, metrics]) => {
              if (!metrics) return null;
              return (
                <div key={buId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200">
                        {BU_LABELS[buId] ?? buId}
                      </span>
                      <span className="text-xs text-gray-500">
                        Margem: {formatPct(metrics.grossMargin)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {formatPct(metrics.revenueShare)}
                      </span>
                      <span className="font-semibold text-gray-200">
                        {formatBRL(metrics.grossRevenue)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all"
                      style={{ width: `${metrics.revenueShare}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget vs Actual */}
      {current.totalBudget > 0 && (
        <div className="col-span-2 lg:col-span-4 card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Budget vs Realizado — {current.period}
            </span>
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                current.totalVariancePercent >= 0
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              )}
            >
              {current.totalVariancePercent >= 0 ? "+" : ""}
              {current.totalVariancePercent.toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-600 mb-1">Budget</div>
              <div className="font-semibold text-gray-300">{formatBRL(current.totalBudget)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Realizado</div>
              <div className="font-semibold text-gray-300">{formatBRL(current.totalActual)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Variação</div>
              <div
                className={cn(
                  "font-semibold",
                  current.totalVariance >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {current.totalVariance >= 0 ? "+" : ""}
                {formatBRL(current.totalVariance)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
