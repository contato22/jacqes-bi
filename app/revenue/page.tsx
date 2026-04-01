"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import { revenueData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 shadow-xl shadow-black/40 min-w-[140px]">
      <div className="text-xs font-semibold text-gray-400 mb-2">{label} 2026</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span className="text-gray-400 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-white">
            {formatCurrency(entry.value, "BRL", true)}
          </span>
        </div>
      ))}
    </div>
  );
}

// Valores diretos do DRE AWQ — sem projeções
const summaryStats = [
  { label: "Receita Bruta Q1",    value: "R$4,82M", sub: "+3,1% vs orçamento",  positive: true  },
  { label: "Receita Líquida Q1",  value: "R$4,34M", sub: "margem bruta 59,9%",  positive: true  },
  { label: "EBITDA Q1",           value: "R$867K",  sub: "19,9% margem · −11,1% vs plano", positive: false },
  { label: "Lucro Líquido Q1",    value: "R$518K",  sub: "margem líquida 11,9%", positive: true  },
];

export default function RevenuePage() {
  return (
    <>
      <Header
        title="Receita"
        subtitle="DRE Q1 2026 — dados reais AWQ Group"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              <div
                className={`text-xs font-medium mt-3 ${
                  stat.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">Receita Bruta · CMV · Lucro Bruto</h2>
            <p className="text-xs text-gray-500 mt-0.5">Q1 2026 — dados reais (CMV e Lucro calculados proporcionalmente do DRE)</p>
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
                  new Intl.NumberFormat("pt-BR", {
                    notation: "compact",
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 1,
                  }).format(v)
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="revenue"  name="Receita Bruta"  fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit"   name="Lucro Bruto"    fill="#22d3ee" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="CMV"            fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Margin progression */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Progressão da Margem Bruta</h2>
            <p className="text-xs text-gray-500 mt-0.5">Lucro Bruto / Receita Bruta por mês</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {revenueData.map((d) => {
              const margin = ((d.profit / d.revenue) * 100).toFixed(1);
              const pct = parseFloat(margin);
              return (
                <div key={d.month} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-white">{margin}%</div>
                  <div className="w-full h-16 bg-gray-800 rounded-md overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-md transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-600">{d.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
