"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import { revenueData, channelData, topProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill?: string; stroke?: string }>;
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
          <span className="font-semibold text-white">
            {formatCurrency(entry.value, "USD", true)}
          </span>
        </div>
      ))}
    </div>
  );
}

const conversionData = channelData.map((c) => ({
  canal: c.channel.split(" ")[0],
  conversoes: c.conversions,
  receita: c.revenue,
  taxa: parseFloat(((c.conversions / c.sessions) * 100).toFixed(2)),
}));

export default function AnalisePage() {
  return (
    <>
      <Header
        title="Análise"
        subtitle="Exploração de dados, tendências e insights de canais · FY 2025"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Revenue area chart */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">Evolução de Receita e Lucro</h2>
            <p className="text-xs text-gray-500 mt-0.5">Tendência acumulada — FY 2025</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                    currency: "USD",
                    maximumFractionDigits: 1,
                  }).format(v)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Receita"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#gradRevenue)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Lucro"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#gradProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Receita por Canal de Aquisição</h2>
              <p className="text-xs text-gray-500 mt-0.5">Contribuição de receita por canal</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={conversionData}
                margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="canal"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      style: "currency",
                      currency: "USD",
                    }).format(v)
                  }
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v, "USD", true), "Receita"]}
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="receita" name="Receita" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion rate table */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Taxa de Conversão por Canal</h2>
              <p className="text-xs text-gray-500 mt-0.5">Sessões, conversões e taxa percentual</p>
            </div>
            <div className="space-y-0">
              {channelData.map((c) => {
                const taxa = ((c.conversions / c.sessions) * 100).toFixed(2);
                const taxaNum = parseFloat(taxa);
                return (
                  <div
                    key={c.channel}
                    className="flex items-center gap-4 py-2.5 border-b border-gray-800/50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-200">{c.channel}</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {c.sessions.toLocaleString("pt-BR")} sessões
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">{taxa}%</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {c.conversions.toLocaleString("pt-BR")} conv.
                      </div>
                    </div>
                    <div className="w-20">
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                          style={{ width: `${Math.min((taxaNum / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product analysis */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Análise de Produtos</h2>
            <p className="text-xs text-gray-500 mt-0.5">Receita, unidades e crescimento por SKU</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Produto", "Categoria", "Receita", "Unidades", "Crescimento", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-200">{p.name}</td>
                    <td className="py-3 pr-4">
                      <span className="badge badge-blue">{p.category}</span>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-white tabular-nums">
                      {formatCurrency(p.revenue, "USD", true)}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 tabular-nums">
                      {p.units.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          p.growth > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {p.growth > 0 ? "+" : ""}
                        {p.growth}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`badge ${
                          p.status === "trending"
                            ? "badge-green"
                            : p.status === "stable"
                            ? "badge-blue"
                            : "badge-red"
                        }`}
                      >
                        {p.status === "trending"
                          ? "Em Alta"
                          : p.status === "stable"
                          ? "Estável"
                          : "Em Queda"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
