"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { awqBusinessUnits, awqConsolidatedRevenue } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-lg min-w-[160px]">
      <div className="text-xs font-semibold text-gray-500 mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span className="text-gray-500 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-gray-900">
            {formatCurrency(entry.value, "USD", true)}
          </span>
        </div>
      ))}
    </div>
  );
}

const totalRevenue = awqBusinessUnits.reduce((s, bu) => s + bu.revenue, 0);
const totalExpenses = awqBusinessUnits.reduce((s, bu) => s + bu.expenses, 0);
const totalProfit = awqBusinessUnits.reduce((s, bu) => s + bu.profit, 0);
const consolidatedMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
const totalEmployees = awqBusinessUnits.reduce((s, bu) => s + bu.employees, 0);

const summaryStats = [
  { label: "Receita do Grupo", value: formatCurrency(totalRevenue, "USD", true), sub: "+16.2% YoY", positive: true },
  { label: "Lucro Consolidado", value: formatCurrency(totalProfit, "USD", true), sub: "+18.7% YoY", positive: true },
  { label: "Despesas Totais", value: formatCurrency(totalExpenses, "USD", true), sub: "+9.4% YoY", positive: false },
  { label: "Margem Consolidada", value: `${consolidatedMargin}%`, sub: `${totalEmployees} colaboradores`, positive: true },
];

const statusConfig = {
  ahead: { label: "Acima da meta", cls: "bg-emerald-100 text-emerald-700" },
  "on-track": { label: "No prazo", cls: "bg-blue-100 text-blue-700" },
  "at-risk": { label: "Em risco", cls: "bg-red-100 text-red-700" },
};

export default function AWQFinancialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <h1 className="text-xl font-bold text-gray-900">Financial</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          AWQ Group · Consolidado de todas as Business Units · FY 2025
        </p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-2xl font-bold text-gray-900 tabular-nums">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              <div className={`text-xs font-medium mt-3 ${stat.positive ? "text-emerald-600" : "text-red-500"}`}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Business Unit Breakdown Table */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Desempenho por Business Unit</h2>
            <p className="text-xs text-gray-500 mt-0.5">P&L anual por unidade — FY 2025</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Unidade</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Receita</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Despesas</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lucro</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Margem</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cresc. YoY</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Share</th>
                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {awqBusinessUnits.map((bu, i) => {
                  const share = ((bu.revenue / totalRevenue) * 100).toFixed(1);
                  const st = statusConfig[bu.status];
                  return (
                    <tr
                      key={bu.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === awqBusinessUnits.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: bu.color }} />
                          <div>
                            <div className="font-medium text-gray-900">{bu.name}</div>
                            <div className="text-xs text-gray-400">{bu.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900 tabular-nums">{formatCurrency(bu.revenue, "USD", true)}</td>
                      <td className="py-3 px-3 text-right text-gray-500 tabular-nums">{formatCurrency(bu.expenses, "USD", true)}</td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-semibold tabular-nums">{formatCurrency(bu.profit, "USD", true)}</td>
                      <td className="py-3 px-3 text-right text-gray-700 tabular-nums">{bu.margin.toFixed(1)}%</td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        <span className={bu.growth >= 0 ? "text-emerald-600" : "text-red-500"}>{formatPercent(bu.growth)}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: bu.color }} />
                          </div>
                          <span className="text-gray-500 text-xs tabular-nums w-10 text-right">{share}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td className="py-3 px-3 font-semibold text-gray-900">Total do Grupo</td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900 tabular-nums">{formatCurrency(totalRevenue, "USD", true)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-500 tabular-nums">{formatCurrency(totalExpenses, "USD", true)}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 tabular-nums">{formatCurrency(totalProfit, "USD", true)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-900 tabular-nums">{consolidatedMargin}%</td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-600 tabular-nums">+16.2%</td>
                  <td className="py-3 px-3 text-right text-gray-400 text-xs">100%</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Consolidated Monthly Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900">Receita vs Lucro Mensal Consolidado</h2>
            <p className="text-xs text-gray-500 mt-0.5">FY 2025 — todas as business units combinadas</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={awqConsolidatedRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => new Intl.NumberFormat("en-US", { notation: "compact", style: "currency", currency: "USD", maximumFractionDigits: 1 }).format(v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="revenue" name="revenue" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit" name="profit" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="expenses" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by BU — stacked */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900">Receita por Business Unit (Mensal)</h2>
            <p className="text-xs text-gray-500 mt-0.5">FY 2025 — contribuição empilhada por BU</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={awqConsolidatedRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => new Intl.NumberFormat("en-US", { notation: "compact", style: "currency", currency: "USD", maximumFractionDigits: 1 }).format(v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#6b7280", paddingTop: "12px" }} />
              <Bar dataKey="jacqes" name="JACQES" stackId="bu" fill="#6366f1" />
              <Bar dataKey="ventures" name="AWQ Ventures" stackId="bu" fill="#C9A84C" />
              <Bar dataKey="capital" name="AWQ Capital" stackId="bu" fill="#22d3ee" />
              <Bar dataKey="labs" name="AWQ Labs" stackId="bu" fill="#34d399" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Margin by BU */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Margem de Lucro por Business Unit</h2>
            <p className="text-xs text-gray-500 mt-0.5">Comparativo anual de margem bruta — FY 2025</p>
          </div>
          <div className="space-y-4">
            {awqBusinessUnits.map((bu) => (
              <div key={bu.id} className="flex items-center gap-4">
                <div className="w-32 flex-shrink-0">
                  <div className="text-xs font-medium text-gray-900">{bu.name}</div>
                  <div className="text-[10px] text-gray-400">{bu.description}</div>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${bu.margin}%`, backgroundColor: bu.color }} />
                </div>
                <div className="w-14 text-right text-sm font-semibold text-gray-900 tabular-nums">
                  {bu.margin.toFixed(1)}%
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
              <div className="w-32 flex-shrink-0">
                <div className="text-xs font-medium text-gray-900">Consolidado</div>
                <div className="text-[10px] text-gray-400">AWQ Group</div>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${consolidatedMargin}%` }} />
              </div>
              <div className="w-14 text-right text-sm font-bold text-gray-900 tabular-nums">
                {consolidatedMargin}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
