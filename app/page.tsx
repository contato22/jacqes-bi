import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import RevenueChart from "@/components/RevenueChart";
import CustomerSegmentChart from "@/components/CustomerSegmentChart";
import TopProductsTable from "@/components/TopProductsTable";
import RegionTable from "@/components/RegionTable";
import AlertBanner from "@/components/AlertBanner";
import { kpis, alerts } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Overview"
        subtitle="JACQES — Business Intelligence · Março 2026"
      />

      <div className="px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Revenue chart + Customer Segments */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <CustomerSegmentChart />
        </div>

        {/* Top Products + Region */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TopProductsTable />
          <RegionTable />
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </>
  );
}
