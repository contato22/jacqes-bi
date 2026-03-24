import Header from "@/components/Header";
import BUCard from "@/components/BUCard";
import { businessUnits } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function BusinessUnitsPage() {
  const totalRevenue = businessUnits.reduce((s, bu) => s + bu.revenue, 0);
  const totalCustomers = businessUnits.reduce((s, bu) => s + bu.customers, 0);
  const avgMargin =
    businessUnits.reduce((s, bu) => s + bu.margin, 0) / businessUnits.length;

  const summaryStats = [
    { label: "Business Units", value: String(businessUnits.length), sub: "active units" },
    { label: "Combined Revenue", value: formatCurrency(totalRevenue, "USD", true), sub: "FY 2026" },
    { label: "Total Customers", value: formatNumber(totalCustomers), sub: "across all BUs" },
    { label: "Avg. Gross Margin", value: `${avgMargin.toFixed(1)}%`, sub: "blended margin" },
  ];

  return (
    <>
      <Header
        title="Business Units"
        subtitle="Performance overview — click a BU to expand the full session breakdown"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              <div className="text-xs font-medium text-gray-600 mt-3">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* BU list */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Business Units</h2>
            <span className="text-xs text-gray-500">Click a BU to view session details</span>
          </div>
          <div className="space-y-3">
            {businessUnits.map((bu) => (
              <BUCard key={bu.id} bu={bu} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
