import Header from "@/components/Header";
import { getBusinessUnitCustomers } from "@/lib/awq/selectors/bu";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BU_ID = "jacqes" as const;

function StatusBadge({ status }: { status: "active" | "at-risk" | "churned" }) {
  const styles = {
    active: "badge-green",
    "at-risk": "badge-yellow",
    churned: "badge-red",
  };
  const labels = {
    active: "Active",
    "at-risk": "At Risk",
    churned: "Churned",
  };
  return <span className={cn("badge", styles[status])}>{labels[status]}</span>;
}

function SegmentBadge({ segment }: { segment: string }) {
  const styles: Record<string, string> = {
    Enterprise: "badge-blue",
    SMB: "badge-green",
    Startup: "badge-yellow",
    Individual: "bg-gray-500/15 text-gray-400 badge",
  };
  return (
    <span className={cn("badge", segment === "Individual" ? "" : styles[segment])}>
      {segment}
    </span>
  );
}

export default function JacqesCustomersPage() {
  const customers = getBusinessUnitCustomers(BU_ID);

  const activeCount = customers.filter((c) => c.status === "active").length;
  const atRiskCount = customers.filter((c) => c.status === "at-risk").length;
  const churnedCount = customers.filter((c) => c.status === "churned").length;

  const summaryCards = [
    { label: "Total", value: customers.length, color: "text-white" },
    { label: "Active", value: activeCount, color: "text-emerald-400" },
    { label: "At-Risk", value: atRiskCount, color: "text-yellow-400" },
    { label: "Churned", value: churnedCount, color: "text-red-400" },
  ];

  return (
    <>
      <Header title="Customers" subtitle="JACQES · Customer Directory" />

      <div className="px-8 py-6 space-y-6">
        {/* BU Scope Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scope: JACQES only · Dados isolados por BU
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="card p-5 space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {card.label}
              </p>
              <p className={`text-3xl font-semibold tabular-nums ${card.color}`}>
                {formatNumber(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Customer Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Customer Directory</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {customers.length} customers · JACQES only
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    LTV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Last Order
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
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-100 font-medium">
                      {customer.name}
                    </td>
                    <td className="px-6 py-3 text-gray-400">{customer.company}</td>
                    <td className="px-6 py-3">
                      <SegmentBadge segment={customer.segment} />
                    </td>
                    <td className="px-6 py-3 text-right text-gray-200 tabular-nums">
                      {formatCurrency(customer.ltv, "USD", true)}
                    </td>
                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                      {customer.last_order}
                    </td>
                    <td className="px-6 py-3 text-gray-400">{customer.country}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={customer.status} />
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
