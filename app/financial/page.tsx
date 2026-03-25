"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Header from "@/components/Header";
import { revenueData, channelData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 shadow-xl shadow-black/40 min-w-[160px]">
      <div className="text-xs font-semibold text-gray-400 mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span className="text-gray-400 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-white">
            {formatCurrency(entry.value, "USD", true)}
          </span>
        </div>
      ))}
    </div>
  );
}

const summaryCards = [
  {
    label: "Receita Total",
    value: "$4,82M",
    delta: "+14,6% YoY",
    positive: true,
    icon: DollarSign,
    color: "brand",
  },
  {
    label: "Lucro Líquido",
    value: "$3,24M",
    delta: "+21,3% YoY",
    positive: true,
    icon: TrendingUp,
    color: "emerald",
  },
  {
    label: "Despesas Totais",
    value: "$1,58M",
    delta: "+8,2% YoY",
    positive: false,
    icon: TrendingDown,
    color: "red",
  },
  {
    label: "Margem Bruta",
    value: "67,4%",
    delta: "+4,3pp YoY",
    positive: true,
    icon: Percent,
    color: "purple",
  },
];

const marginData = revenueData.map((d) => ({
  month: d.month,
  margem: parseFloat(((d.profit / d.revenue) * 100).toFixed(1)),
}));

const totalRevenue = channelData.reduce((s, c) => s + c.revenue, 0);

export default function FinancialPage() {
  return (
    <>
      <Header
        title="Financial"
        subtitle="Demonstrativo financeiro completo — receitas, despesas e margens · FY 2025"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      card.color === "brand"
                        ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                        : card.color === "emerald"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : card.color === "red"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">{card.value}</div>
                <div className="text-sm text-gray-500 mt-1">{card.label}</div>
                <div
                  className={`text-xs font-medium mt-3 ${
                    card.positive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {card.delta}
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue vs Expenses bar */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">
              Receita vs. Lucro vs. Despesas Mensais
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">FY 2025 — comparativo mensal agrupado</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueData}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
              barGap={4}
              barCategoryGap="30%"
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
                tickFormatter={(v) =>
                  new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 1,
                  }).format(v)
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="revenue" name="Receita" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit" name="Lucro" fill="#22d3ee" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="Despesas" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 justify-center">
            {[
              { label: "Receita", color: "bg-brand-500" },
              { label: "Lucro", color: "bg-cyan-400" },
              { label: "Despesas", color: "bg-amber-400" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-xs text-gray-400">
                <span className={`w-3 h-2 rounded-sm inline-block ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Margin progression + channel breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Margin line */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Evolução da Margem Bruta</h2>
              <p className="text-xs text-gray-500 mt-0.5">Percentual mês a mês — FY 2025</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={marginData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
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
                  domain={[60, 75]}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Margem"]}
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="margem"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel revenue */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Receita por Canal</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Participação no total de {formatCurrency(totalRevenue, "USD", true)}
              </p>
            </div>
            <div className="space-y-3">
              {channelData
                .sort((a, b) => b.revenue - a.revenue)
                .map((c) => {
                  const pct = ((c.revenue / totalRevenue) * 100).toFixed(1);
                  return (
                    <div key={c.channel}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-300 font-medium">{c.channel}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">{pct}%</span>
                          <span className="text-white font-semibold tabular-nums">
                            {formatCurrency(c.revenue, "USD", true)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
