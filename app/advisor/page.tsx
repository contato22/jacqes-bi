import Header from "@/components/Header";
import {
  getBusinessUnitKPIs,
  getBusinessUnitFinancialView,
  getBusinessUnitCustomers,
} from "@/lib/awq/selectors/bu";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Briefcase } from "lucide-react";

const BU_ID = "advisor" as const;

export default function AdvisorPage() {
  const kpis = getBusinessUnitKPIs(BU_ID);
  const financial = getBusinessUnitFinancialView(BU_ID);
  const customers = getBusinessUnitCustomers(BU_ID);

  const enterpriseClients = customers.filter((c) => c.segment === "Enterprise");
  const activeEnterpriseClients = enterpriseClients.filter((c) => c.status === "active").length;
  const atRiskEnterpriseClients = enterpriseClients.filter((c) => c.status === "at-risk").length;

  return (
    <>
      <Header title="Advisor" subtitle="Business Unit · Financial Advisory" />

      <div className="px-8 py-6 space-y-6">
        {/* BU Scope Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scope: Advisor only · Dados isolados por BU
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.slice(0, 4).map((kpi) => {
            const delta =
              kpi.previous_value > 0
                ? ((kpi.value - kpi.previous_value) / kpi.previous_value) * 100
                : 0;
            const isPositive = delta >= 0;

            // AuM KPI: always render as currency
            const isAuM =
              kpi.kpi_key === "aum" ||
              kpi.label.toLowerCase().includes("aum") ||
              kpi.label.toLowerCase().includes("assets under management");

            const displayValue =
              isAuM || kpi.unit === "currency"
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
          {/* Financial Summary */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Financial Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Revenue</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatCurrency(financial.totalRevenue, "USD", true)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Expenses</span>
                <span className="text-sm font-medium text-red-400 tabular-nums">
                  {formatCurrency(financial.totalExpenses, "USD", true)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Net Profit</span>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    financial.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(financial.totalProfit, "USD", true)}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Gross Margin</span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {financial.grossMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Enterprise Clients Summary */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Enterprise Clients</h2>
              <span className="badge badge-blue ml-auto">Enterprise only</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Enterprise Clients</span>
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatNumber(enterpriseClients.length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active</span>
                <span className="text-sm font-medium text-emerald-400 tabular-nums">
                  {formatNumber(activeEnterpriseClients)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">At-Risk</span>
                <span className="text-sm font-medium text-yellow-400 tabular-nums">
                  {formatNumber(atRiskEnterpriseClients)}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">All Clients (all segments)</span>
                <span className="text-sm font-medium text-gray-300 tabular-nums">
                  {formatNumber(customers.length)}
                </span>
              </div>
            </div>

            {/* Enterprise client list */}
            {enterpriseClients.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Enterprise roster
                </p>
                <div className="space-y-1.5">
                  {enterpriseClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <Users size={12} className="text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-200">{client.name}</span>
                        <span className="text-xs text-gray-500">{client.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums text-gray-400">
                          {formatCurrency(client.ltv, "USD", true)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full ${
                            client.status === "active"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : client.status === "at-risk"
                              ? "bg-yellow-500/15 text-yellow-400"
                              : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {client.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
