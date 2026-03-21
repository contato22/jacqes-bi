"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { plData } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function brlCompact(value: number) {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return brl(value);
}

// ─── Cálculos do P&L ──────────────────────────────────────────────────────────

const totalReceitas = plData.receitas.reduce((s, i) => s + i.valor, 0);
const totalDespesas = plData.despesas.reduce((s, i) => s + i.valor, 0);
const resultado     = totalReceitas - totalDespesas;
const margem        = totalReceitas > 0 ? (resultado / totalReceitas) * 100 : 0;

const totalFixo     = plData.despesas.filter((d) => d.categoria === "Fixo").reduce((s, i) => s + i.valor, 0);
const totalVariavel = plData.despesas.filter((d) => d.categoria === "Variável").reduce((s, i) => s + i.valor, 0);

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, color, icon: Icon, trend,
}: {
  label: string;
  value: string;
  sub?: string;
  color: "green" | "red" | "blue" | "yellow";
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}) {
  const colors = {
    green:  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400", text: "text-emerald-400" },
    red:    { bg: "bg-red-500/10",     border: "border-red-500/20",     icon: "text-red-400",     text: "text-red-400"     },
    blue:   { bg: "bg-brand-500/10",   border: "border-brand-500/20",   icon: "text-brand-400",   text: "text-brand-400"   },
    yellow: { bg: "bg-yellow-500/10",  border: "border-yellow-500/20",  icon: "text-yellow-400",  text: "text-yellow-400"  },
  }[color];

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", colors.bg, `border ${colors.border}`)}>
          <Icon size={16} className={colors.icon} />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium flex items-center gap-0.5",
            trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-gray-500",
          )}>
            {trend === "up"      ? <ArrowUpRight size={13} />   :
             trend === "down"    ? <ArrowDownRight size={13} /> :
                                   <Minus size={13} />}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-white tracking-tight">{value}</p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Tooltip customizado ──────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {brl(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function FinancialPage() {
  // Dados para o gráfico de barras comparativo
  const chartData = [
    { label: "Receitas",  valor: totalReceitas, fill: "#22c55e" },
    { label: "Despesas",  valor: totalDespesas, fill: "#ef4444" },
    { label: "Resultado", valor: resultado,      fill: resultado >= 0 ? "#6366f1" : "#f97316" },
  ];

  // Dados para o gráfico de despesas por item
  const despesasChart = plData.despesas
    .sort((a, b) => b.valor - a.valor)
    .map((d) => ({ label: d.label, valor: d.valor }));

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mini P&L</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            JACQES ERP Financeiro · {plData.mes}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
          <div className={cn("w-1.5 h-1.5 rounded-full", resultado >= 0 ? "bg-emerald-400" : "bg-red-400")} />
          <span className="text-xs text-gray-400">
            {resultado >= 0 ? "Resultado positivo" : "Resultado negativo"}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          label="Receita Total"
          value={brlCompact(totalReceitas)}
          sub={`${plData.receitas.length} fontes de renda`}
          color="green"
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          label="Despesas Total"
          value={brlCompact(totalDespesas)}
          sub={`Fixo ${brlCompact(totalFixo)} · Variável ${brlCompact(totalVariavel)}`}
          color="red"
          icon={TrendingDown}
          trend="down"
        />
        <KPICard
          label="Resultado Líquido"
          value={brlCompact(resultado)}
          sub={resultado >= 0 ? "Superávit do período" : "Déficit do período"}
          color={resultado >= 0 ? "blue" : "yellow"}
          icon={DollarSign}
          trend={resultado >= 0 ? "up" : "down"}
        />
        <KPICard
          label="Margem Líquida"
          value={`${margem.toFixed(1)}%`}
          sub="Resultado / Receita"
          color={margem >= 20 ? "green" : margem >= 0 ? "yellow" : "red"}
          icon={Percent}
          trend={margem >= 20 ? "up" : "neutral"}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Visão geral */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Visão Geral</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => brlCompact(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Despesas por item */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Despesas por Item</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={despesasChart} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => brlCompact(v)}
              />
              <YAxis
                dataKey="label"
                type="category"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={115}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" fill="#ef4444" fillOpacity={0.75} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DRE Mini */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Receitas */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">Receitas</h2>
            <span className="text-sm font-bold text-emerald-400">{brl(totalReceitas)}</span>
          </div>
          <div className="space-y-3">
            {plData.receitas.map((item) => {
              const pct = (item.valor / totalReceitas) * 100;
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      {item.categoria && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.categoria}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white">{brl(item.valor)}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600">{pct.toFixed(1)}% da receita</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Despesas */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">Despesas</h2>
            <span className="text-sm font-bold text-red-400">{brl(totalDespesas)}</span>
          </div>
          <div className="space-y-3">
            {plData.despesas
              .sort((a, b) => b.valor - a.valor)
              .map((item) => {
                const pct = (item.valor / totalDespesas) * 100;
                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{item.label}</span>
                        {item.categoria && (
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border",
                            item.categoria === "Fixo"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-orange-500/10 text-orange-400 border-orange-500/20",
                          )}>
                            {item.categoria}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white">{brl(item.valor)}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-red-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600">{pct.toFixed(1)}% das despesas</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* DRE resumida */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">DRE Simplificada</h2>
        <div className="space-y-0 divide-y divide-gray-800">

          <div className="flex justify-between py-2.5">
            <span className="text-sm text-gray-400">Receita Bruta</span>
            <span className="text-sm font-semibold text-emerald-400">{brl(totalReceitas)}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-sm text-gray-400">Despesas Fixas</span>
            <span className="text-sm font-medium text-red-400">– {brl(totalFixo)}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-sm text-gray-400">Despesas Variáveis</span>
            <span className="text-sm font-medium text-red-400">– {brl(totalVariavel)}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-sm text-gray-500">Total Despesas</span>
            <span className="text-sm text-red-400">– {brl(totalDespesas)}</span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-sm font-bold text-white">Resultado Líquido</span>
            <span className={cn(
              "text-sm font-bold",
              resultado >= 0 ? "text-emerald-400" : "text-red-400",
            )}>
              {resultado >= 0 ? "" : "– "}{brl(Math.abs(resultado))}
            </span>
          </div>

          <div className="flex justify-between py-2.5 bg-gray-800/50 px-3 rounded-lg mt-1">
            <span className="text-xs text-gray-500">Margem Líquida</span>
            <span className={cn(
              "text-xs font-bold",
              margem >= 20 ? "text-emerald-400" : margem >= 0 ? "text-yellow-400" : "text-red-400",
            )}>
              {margem.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
