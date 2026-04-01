// ─── JACQES BI — Overview Dashboard ──────────────────────────────────────────
// Server Component: fetches normalised data from Notion at render time.
// Falls back to static mock data when Notion is not yet configured (dev/demo).

import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import RevenueChart from "@/components/RevenueChart";
import CustomerSegmentChart from "@/components/CustomerSegmentChart";
import TopProductsTable from "@/components/TopProductsTable";
import RegionTable from "@/components/RegionTable";
import AlertBanner from "@/components/AlertBanner";
import { kpis, alerts } from "@/lib/data";
import type { KPI } from "@/lib/data";

// ─── Derive KPIs from live financial data (if available) ─────────────────────
// When Notion is connected, the kpi values will be derived from the last
// fetched period. Until then we fall back to the mock kpis from lib/data.

async function getLiveKPIs(): Promise<KPI[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/notion/jacqes/financial`,
      { next: { revalidate: parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10) } }
    );

    if (!res.ok) return kpis; // fallback

    const data = await res.json();
    if (!data?.records?.length) return kpis; // no records yet → mock

    // ── Map the latest month's financial record to KPI cards ─────────────────
    // Sort descending by date and take the most recent record.
    const sorted = [...data.records].sort(
      (a: { date: string }, b: { date: string }) =>
        (b.date ?? "").localeCompare(a.date ?? "")
    );
    const latest = sorted[0];

    // Replace the two revenue/margin KPIs; keep other mock KPIs intact.
    return kpis.map((kpi) => {
      if (kpi.id === "revenue" && latest.netRevenue != null) {
        return { ...kpi, value: latest.netRevenue };
      }
      if (kpi.id === "margin" && latest.grossProfit != null && latest.netRevenue) {
        return {
          ...kpi,
          value: parseFloat(((latest.grossProfit / latest.netRevenue) * 100).toFixed(1)),
        };
      }
      return kpi;
    });
  } catch {
    // Notion not configured yet — use mock data silently
    return kpis;
  }
}

export default async function DashboardPage() {
  const liveKPIs = await getLiveKPIs();

  return (
    <>
      <Header
        title="Overview"
        subtitle="JACQES · Business Intelligence Dashboard · March 2026"
      />

      <div className="px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {liveKPIs.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <CustomerSegmentChart />
        </div>

        {/* Products & Alerts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <TopProductsTable />
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Alerts</h2>
                <span className="badge badge-red">{alerts.length} active</span>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Region table */}
        <RegionTable />
      </div>
    </>
  );
}
