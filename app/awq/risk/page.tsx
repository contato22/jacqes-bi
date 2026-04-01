import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  getHoldingRiskOverview,
  getHoldingBURanking,
} from "@/lib/awq/selectors/holding";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export default function AWQRiskPage() {
  const risk = getHoldingRiskOverview();
  const ranking = getHoldingBURanking();

  const atRiskBUs = ranking.filter((bu) => bu.growth < 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Risk" subtitle="AWQ Group · Risk Overview" />

      <main className="flex-1 p-8 space-y-8">

        {/* Risk Score Badge */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Group Risk Score
          </h2>
          <div className="card p-6">
            <div className="flex items-center gap-6">
              <div className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold",
                risk.riskScore === "high" ? "bg-red-900/40 text-red-400 border border-red-800/50" :
                risk.riskScore === "medium" ? "bg-amber-900/40 text-amber-400 border border-amber-800/50" :
                "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50"
              )}>
                {risk.riskScore === "high" ? <AlertTriangle size={24} /> :
                 risk.riskScore === "medium" ? <ShieldAlert size={24} /> :
                 <CheckCircle size={24} />}
                <span>{risk.riskScore.toUpperCase()} RISK</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Overdue Receivables</p>
                  <p className="text-white font-semibold tabular-nums">{risk.overdueReceivables.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Overdue Payables</p>
                  <p className="text-white font-semibold tabular-nums">{risk.overduePayables.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">At-Risk Customers</p>
                  <p className="text-white font-semibold tabular-nums">{risk.atRiskCustomers.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Exposure</p>
                  <p className="text-red-400 font-semibold tabular-nums">{formatCurrency(risk.totalExposure)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overdue Receivables */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Overdue Receivables
          </h2>
          {risk.overdueReceivables.length === 0 ? (
            <div className="card p-6 text-center text-gray-500">No overdue receivables.</div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Due Date</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {risk.overdueReceivables.map((rec) => (
                    <tr key={rec.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{rec.id}</td>
                      <td className="px-4 py-3 text-gray-300 capitalize">{rec.business_unit_id}</td>
                      <td className="px-4 py-3 text-gray-400">{rec.customer_id}</td>
                      <td className="px-4 py-3 text-right text-red-400 font-semibold tabular-nums">{formatCurrency(rec.amount)}</td>
                      <td className="px-4 py-3 text-gray-400">{rec.due_date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/40 text-red-400">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* At-Risk Customers */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            At-Risk Customers
          </h2>
          {risk.atRiskCustomers.length === 0 ? (
            <div className="card p-6 text-center text-gray-500">No at-risk customers.</div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Company</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Segment</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">LTV</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Last Order</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {risk.atRiskCustomers.map((c) => (
                    <tr key={c.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-gray-400">{c.company}</td>
                      <td className="px-4 py-3 text-gray-400 capitalize">{c.business_unit_id}</td>
                      <td className="px-4 py-3 text-gray-400">{c.segment}</td>
                      <td className="px-4 py-3 text-right text-amber-400 tabular-nums">{formatCurrency(c.ltv)}</td>
                      <td className="px-4 py-3 text-gray-500">{c.last_order}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-900/40 text-amber-400">
                          at-risk
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* At-Risk BUs */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            BU Growth Watchlist
          </h2>
          {atRiskBUs.length === 0 ? (
            <div className="card p-6 flex items-center gap-3 text-emerald-400">
              <CheckCircle size={18} />
              <span className="text-sm">All business units are showing positive growth.</span>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">BU Name</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Sector</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Growth %</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Margin %</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskBUs.map((bu) => (
                    <tr key={bu.id} className="border-b border-gray-800/60 bg-red-950/10 hover:bg-red-950/20 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{bu.name}</td>
                      <td className="px-4 py-3 text-gray-400">{bu.sector}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">{formatCurrency(bu.totalRevenue)}</td>
                      <td className="px-4 py-3 text-right text-red-400 font-semibold tabular-nums">{formatPercent(bu.growth)}</td>
                      <td className="px-4 py-3 text-right text-gray-300 tabular-nums">{formatPercent(bu.margin)}</td>
                      <td className="px-4 py-3 text-right text-gray-400 tabular-nums">{formatNumber(bu.employees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* All BUs reference */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            All BUs — Growth Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {ranking.map((bu) => (
              <div key={bu.id} className={cn(
                "card p-4 border",
                bu.growth < 0 ? "border-red-800/40" : bu.growth > 10 ? "border-emerald-800/40" : "border-gray-800"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium text-sm">{bu.name}</p>
                  <span className={cn(
                    "text-xs font-semibold tabular-nums",
                    bu.growth >= 0 ? "text-emerald-400" : "text-red-400"
                  )}>
                    {bu.growth >= 0 ? "▲" : "▼"} {formatPercent(Math.abs(bu.growth))}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">{bu.sector}</p>
                <p className="text-gray-300 text-sm tabular-nums mt-2">{formatCurrency(bu.totalRevenue)}</p>
                <p className="text-gray-500 text-xs tabular-nums">Margin: {formatPercent(bu.margin)}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
