import Header from "@/components/Header";
import {
  getBusinessUnitKPIs,
  getBusinessUnitFinancialView,
  getBusinessUnitCustomers,
} from "@/lib/awq/selectors/bu";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Building2 } from "lucide-react";

const BU_ID = "awq-venture" as const;

export default function AwqVenturePage() {
  const kpis = getBusinessUnitKPIs(BU_ID);
  const financial = getBusinessUnitFinancialView(BU_ID);
  // In AWQ Venture scope, "customers" represent portfolio companies
  const portfolioCompanies = getBusinessUnitCustomers(BU_ID);

  const activePortfolio = portfolioCompanies.filter((c) => c.status === "active").length;
  const atRiskPortfolio = portfolioCompanies.filter((c) => c.status === "at-risk").length;
  const exitedPortfolio = portfolioCompanies.filter((c) => c.status === "churned").length;

  return (
    <>
      <Header title="AWQ Venture" subtitle="Business Unit · Venture Capital" />

      <div className="px-8 py-6 space-y-6">
        {/* BU Scope Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scope: AWQ Venture only · Dados isolados por BU
          </span>
        </div>

        {/* KPI Cards — Portfolio Value, Realised Returns, Portfolio Companies, Portfolio IRR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.slice(0, 4).map((kpi) => {
            const delta =
              kpi.previous_value > 0
                ? ((kpi.value - kpi.previous_value) / kpi.previous_value) * 100
                : 0;
            const isPositive = delta >= 0;

            const displayValue =
              kpi.unit === "currency"
                ? formatCurrency(kpi.value, "USD", true)
                : kpi.unit === "percent"
                ? `${kpi.value.toFixed(1)}%`
                : formatNumber(kpi.value, true);

            return (
              <div key={kpi.id} className="card p-5 space-y-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className="text-2xl font-semibold text-white tabular-nums">
                  {displayValue}
                </p>
                <div
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  <span className="tabular-nums">
                    {isPositive ? "+" : ""}
                    {delta.toFixed(1)}% vs prev
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Financial Summary — Realised Returns = Revenue */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Financial Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Realised Returns</span>
                <span className="text-sm font-medium text-emerald-400 tabular-nums">
                  {formatCurrency(financial.totalRevenue, "USD", true)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Operating Expenses</span>
                <span className="text-sm font-medium text-red-400 tabular-nums">
                  {formatCurrency(financial.totalExpenses, "USD", true)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Net Result</span>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    financial.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(financial.totalProfit, "USD", true)}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Return Margin</span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {financial.grossMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-white">Portfolio Overview</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Companies</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatNumber(portfolioCompanies.length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active</span>
                <span className="text-sm font-medium text-emerald-400 tabular-nums">
                  {formatNumber(activePortfolio)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">At-Risk</span>
                <span className="text-sm font-medium text-yellow-400 tabular-nums">
                  {formatNumber(atRiskPortfolio)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Exited</span>
                <span className="text-sm font-medium text-gray-400 tabular-nums">
                  {formatNumber(exitedPortfolio)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Companies Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Building2 size={15} className="text-gray-400" />
            <div>
              <h2 className="text-sm font-semibold text-white">Portfolio Companies</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {portfolioCompanies.length} companies · AWQ Venture scope only
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Investment Value (LTV)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {portfolioCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-100 font-medium">
                      {company.company}
                    </td>
                    <td className="px-6 py-3 text-gray-400">{company.name}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`badge ${
                          company.segment === "Enterprise"
                            ? "badge-blue"
                            : company.segment === "Startup"
                            ? "badge-yellow"
                            : company.segment === "SMB"
                            ? "badge-green"
                            : "bg-gray-500/15 text-gray-400"
                        }`}
                      >
                        {company.segment}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-gray-200 tabular-nums font-medium">
                      {formatCurrency(company.ltv, "USD", true)}
                    </td>
                    <td className="px-6 py-3 text-gray-400">{company.country}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`badge ${
                          company.status === "active"
                            ? "badge-green"
                            : company.status === "at-risk"
                            ? "badge-yellow"
                            : "badge-red"
                        }`}
                      >
                        {company.status === "churned" ? "Exited" : company.status === "active" ? "Active" : "At-Risk"}
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
