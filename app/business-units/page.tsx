import Header from "@/components/Header";
import BUCard from "@/components/BUCard";
import { businessUnits } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface PageProps {
  searchParams: { bu?: string };
}

export default function BusinessUnitsPage({ searchParams }: PageProps) {
  const activeBuId = searchParams.bu ?? null;
  const activeBU = businessUnits.find((b) => b.id === activeBuId) ?? null;

  const totalRevenue = businessUnits.reduce((s, bu) => s + bu.revenue, 0);
  const totalCustomers = businessUnits.reduce((s, bu) => s + bu.customers, 0);
  const avgMargin =
    businessUnits.reduce((s, bu) => s + bu.margin, 0) / businessUnits.length;

  const summaryStats = [
    { label: "Business Units", value: String(businessUnits.length), sub: "unidades ativas" },
    { label: "Receita Combinada", value: formatCurrency(totalRevenue, "USD", true), sub: "FY 2026" },
    { label: "Total Clientes", value: formatNumber(totalCustomers), sub: "em todas as BUs" },
    { label: "Margem Média", value: `${avgMargin.toFixed(1)}%`, sub: "margem bruta" },
  ];

  return (
    <>
      <Header
        title={activeBU ? activeBU.name : "Business Units"}
        subtitle={
          activeBU
            ? `${activeBU.description} · Clique na BU para ver a sessão completa`
            : "AWQ Group · Clique em uma BU para expandir a sessão completa"
        }
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
            <h2 className="text-sm font-semibold text-white">
              {activeBU ? `BU Selecionada · ${activeBU.name}` : "Todas as Business Units"}
            </h2>
            <span className="text-xs text-gray-500">
              Clique em uma BU para ver a sessão completa
            </span>
          </div>

          <div className="space-y-3">
            {businessUnits.map((bu) => (
              <BUCard
                key={bu.id}
                bu={bu}
                defaultExpanded={bu.id === activeBuId}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
