"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import { revenueData, kpis } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const performanceMetrics = [
  { label: "Receita Total", value: "$4,82M", delta: "+14,6%", positive: true },
  { label: "Clientes Ativos", value: "3.847", delta: "+9,5%", positive: true },
  { label: "Pedidos Mensais", value: "12.394", delta: "+9,9%", positive: true },
  { label: "Margem Bruta", value: "67,4%", delta: "+4,3pp", positive: true },
  { label: "Churn Rate", value: "2,1%", delta: "-0,4pp", positive: true },
  { label: "NPS Médio", value: "52", delta: "-3 pts", positive: false },
  { label: "CAC Médio", value: "$83", delta: "-12,4%", positive: true },
  { label: "LTV Médio", value: "$157K", delta: "+7,8%", positive: true },
];

const monthlyGrowth = revenueData.map((d, i) => ({
  month: d.month,
  crescimento:
    i === 0
      ? 0
      : parseFloat(
          (((d.revenue - revenueData[i - 1].revenue) / revenueData[i - 1].revenue) * 100).toFixed(
            1
          )
        ),
  margem: parseFloat(((d.profit / d.revenue) * 100).toFixed(1)),
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 shadow-xl shadow-black/40 min-w-[140px]">
      <div className="text-xs font-semibold text-gray-400 mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <span className="text-gray-400 capitalize">{entry.name}</span>
          <span className="font-semibold text-white">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function DesempenhoPage() {
  return (
    <>
      <Header
        title="Desempenho"
        subtitle="Indicadores-chave de performance e evolução mensal · Março 2026"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Metric grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {performanceMetrics.map((m) => (
            <div key={m.label} className="card p-5">
              <div className="text-2xl font-bold text-white tabular-nums">{m.value}</div>
              <div className="text-sm text-gray-500 mt-1">{m.label}</div>
              <div
                className={`flex items-center gap-1 text-xs font-medium mt-3 ${
                  m.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {m.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.delta} vs. ano anterior
              </div>
            </div>
          ))}
        </div>

        {/* Growth & margin chart */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">
              Crescimento de Receita vs. Margem Bruta
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Variação percentual mensal — FY 2025
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={monthlyGrowth}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="crescimento"
                name="Crescimento"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="margem"
                name="Margem"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={{ fill: "#22d3ee", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-0.5 bg-brand-500 inline-block rounded" />
              Crescimento de Receita
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block rounded" />
              Margem Bruta
            </div>
          </div>
        </div>

        {/* Target vs actual */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Meta vs. Realizado — Q1 2026</h2>
            <p className="text-xs text-gray-500 mt-0.5">Atingimento de objetivos trimestrais</p>
          </div>
          <div className="space-y-5">
            {[
              { label: "Receita", target: "$4,45M", actual: "$4,82M", pct: 108.3, positive: true },
              { label: "Novos Clientes", target: "420", actual: "387", pct: 92.1, positive: false },
              { label: "Retenção", target: "88%", actual: "91,4%", pct: 103.9, positive: true },
              { label: "NPS", target: "58", actual: "52", pct: 89.7, positive: false },
              { label: "Margem Bruta", target: "65%", actual: "67,4%", pct: 103.7, positive: true },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-300 font-medium">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Meta: {row.target}</span>
                    <span className="text-white font-semibold">{row.actual}</span>
                    <span
                      className={`font-bold tabular-nums ${
                        row.positive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {row.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      row.positive
                        ? "bg-gradient-to-r from-brand-600 to-emerald-500"
                        : "bg-gradient-to-r from-brand-600 to-amber-500"
                    }`}
                    style={{ width: `${Math.min(row.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
