import Header from "@/components/Header";
import {
  getBusinessUnitFinancialView,
  getBusinessUnitKPIs,
} from "@/lib/awq/selectors/bu";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react";

const BU_ID = "jacqes" as const;

export default function JacqesRevenuePage() {
  const financial = getBusinessUnitFinancialView(BU_ID);
  const kpis = getBusinessUnitKPIs(BU_ID);

  const summaryCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(financial.totalRevenue, "USD", true),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Profit",
      value: formatCurrency(financial.totalProfit, "USD", true),
      icon: financial.totalProfit >= 0 ? TrendingUp : TrendingDown,
      color: financial.totalProfit >= 0 ? "text-emerald-400" : "text-red-400",
      bg: financial.totalProfit >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(financial.totalExpenses, "USD", true),
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Gross Margin",
      value: `${financial.grossMargin.toFixed(1)}%`,
      icon: Percent,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  const monthlyRows = financial.monthly.map((row) => {
    const margin = row.revenue > 0 ? ((row.profit / row.revenue) * 100) : 0;
    return { ...row, margin };
  });

  return (
    <>
      <Header title="Revenue" subtitle="JACQES · Revenue Analytics" />

      <div className="px-8 py-6 space-y-6">
        {/* BU Scope Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scope: JACQES only · Dados isolados por BU
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <div className={`p-1.5 rounded-lg ${card.bg}`}>
                    <Icon size={14} className={card.color} />
                  </div>
                </div>
                <p className={`text-2xl font-semibold tabular-nums ${card.color}`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Monthly P&L Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Monthly P&amp;L</h2>
            <p className="text-xs text-gray-500 mt-0.5">12-month breakdown · JACQES only</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Period
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Margin %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {monthlyRows.slice(0, 12).map((row, idx) => (
                  <tr key={`${row.period}-${idx}`} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-gray-300">{row.period}</td>
                    <td className="px-6 py-3 text-right text-gray-200 tabular-nums">
                      {formatCurrency(row.revenue, "USD", true)}
                    </td>
                    <td className="px-6 py-3 text-right text-red-400 tabular-nums">
                      {formatCurrency(row.expenses, "USD", true)}
                    </td>
                    <td
                      className={`px-6 py-3 text-right tabular-nums font-medium ${
                        row.profit >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(row.profit, "USD", true)}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          row.margin >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {row.margin >= 0 ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        {row.margin.toFixed(1)}%
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
