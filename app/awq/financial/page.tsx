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
import Header from "@/components/Header";
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

const totalRevenue = awqBusinessUnits.reduce((s, bu) => s + bu.revenue, 0);
const totalExpenses = awqBusinessUnits.reduce((s, bu) => s + bu.expenses, 0);
const totalProfit = awqBusinessUnits.reduce((s, bu) => s + bu.profit, 0);
const consolidatedMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
const totalEmployees = awqBusinessUnits.reduce((s, bu) => s + bu.employees, 0);

const summaryStats = [
  { label: "Group Revenue", value: formatCurrency(totalRevenue, "USD", true), sub: "+16.2% YoY", positive: true },
  { label: "Group Profit", value: formatCurrency(totalProfit, "USD", true), sub: "+18.7% YoY", positive: true },
  { label: "Group Expenses", value: formatCurrency(totalExpenses, "USD", true), sub: "+9.4% YoY", positive: false },
  { label: "Consolidated Margin", value: `${consolidatedMargin}%`, sub: `${totalEmployees} employees`, positive: true },
];

const statusConfig = {
  ahead: { label: "Ahead", cls: "badge-green" },
  "on-track": { label: "On Track", cls: "badge-blue" },
  "at-risk": { label: "At Risk", cls: "badge-red" },
};

export default function AWQFinancialPage() {
  return (
    <>
      <Header
        title="AWQ Group · Financial"
        subtitle="Consolidated financial performance across all business units · FY 2025"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary KPIs */}
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

        {/* Business Unit Breakdown Table */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Business Unit Performance</h2>
            <p className="text-xs text-gray-500 mt-0.5">Annual P&L by business unit — FY 2025</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Business Unit
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Growth YoY
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Share
                  </th>
                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {awqBusinessUnits.map((bu, i) => {
                  const share = ((bu.revenue / totalRevenue) * 100).toFixed(1);
                  const st = statusConfig[bu.status];
                  return (
                    <tr
                      key={bu.id}
                      className={`border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors ${
                        i === awqBusinessUnits.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: bu.color }}
                          />
                          <div>
                            <div className="font-medium text-white">{bu.name}</div>
                            <div className="text-xs text-gray-500">{bu.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-white tabular-nums">
                        {formatCurrency(bu.revenue, "USD", true)}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-400 tabular-nums">
                        {formatCurrency(bu.expenses, "USD", true)}
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                        {formatCurrency(bu.profit, "USD", true)}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-300 tabular-nums">
                        {bu.margin.toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        <span className={bu.growth >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {formatPercent(bu.growth)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${share}%`, backgroundColor: bu.color }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs tabular-nums w-10 text-right">
                            {share}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`badge ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-700">
                  <td className="py-3 px-3 font-semibold text-white">Group Total</td>
                  <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                    {formatCurrency(totalRevenue, "USD", true)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-400 tabular-nums">
                    {formatCurrency(totalExpenses, "USD", true)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400 tabular-nums">
                    {formatCurrency(totalProfit, "USD", true)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-white tabular-nums">
                    {consolidatedMargin}%
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-400 tabular-nums">
                    +16.2%
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500 text-xs">100%</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Consolidated Monthly Chart */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">Consolidated Monthly Revenue vs Profit</h2>
            <p className="text-xs text-gray-500 mt-0.5">FY 2025 — all business units combined</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={awqConsolidatedRevenue}
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
              <Bar dataKey="revenue" name="revenue" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit" name="profit" fill="#22d3ee" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="expenses" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by BU — stacked bar */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">Revenue by Business Unit (Monthly)</h2>
            <p className="text-xs text-gray-500 mt-0.5">FY 2025 — stacked contribution per BU</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={awqConsolidatedRevenue}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
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
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "#6b7280", paddingTop: "12px" }}
              />
              <Bar dataKey="jacqes" name="JACQES" stackId="bu" fill="#6366f1" />
              <Bar dataKey="ventures" name="AWQ Ventures" stackId="bu" fill="#C9A84C" />
              <Bar dataKey="capital" name="AWQ Capital" stackId="bu" fill="#22d3ee" />
              <Bar dataKey="labs" name="AWQ Labs" stackId="bu" fill="#34d399" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Margin by BU */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Profit Margin by Business Unit</h2>
            <p className="text-xs text-gray-500 mt-0.5">Annual gross margin comparison — FY 2025</p>
          </div>
          <div className="space-y-4">
            {awqBusinessUnits.map((bu) => (
              <div key={bu.id} className="flex items-center gap-4">
                <div className="w-28 flex-shrink-0">
                  <div className="text-xs font-medium text-white">{bu.name}</div>
                  <div className="text-[10px] text-gray-500">{bu.description}</div>
                </div>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${bu.margin}%`, backgroundColor: bu.color }}
                  />
                </div>
                <div className="w-14 text-right text-sm font-semibold text-white tabular-nums">
                  {bu.margin.toFixed(1)}%
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 border-t border-gray-800 pt-4">
              <div className="w-28 flex-shrink-0">
                <div className="text-xs font-medium text-white">Consolidated</div>
                <div className="text-[10px] text-gray-500">AWQ Group</div>
              </div>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500"
                  style={{ width: `${consolidatedMargin}%` }}
                />
              </div>
              <div className="w-14 text-right text-sm font-bold text-white tabular-nums">
                {consolidatedMargin}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
