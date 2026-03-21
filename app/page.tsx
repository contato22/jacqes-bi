import Header from "@/components/Header";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import KPICard from "@/components/KPICard";
import ScoreChart from "@/components/RevenueChart";
import AccountHealthChart from "@/components/CustomerSegmentChart";
import ContasTable from "@/components/TopProductsTable";
import ScoreDimensionsPanel from "@/components/RegionTable";
import AlertBanner from "@/components/AlertBanner";
import { kpis, alerts, scoreMensal } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Visão Geral"
        subtitle="Danilo · CS & Operações · AWQ Group · Março 2026"
      />

      <PeriodFilterBar available={["mensal"]} label="Março 2026">
      <div className="px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Score chart + Account health */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ScoreChart />
          </div>
          <AccountHealthChart />
        </div>

        {/* Accounts table + Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ContasTable />
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Alertas</h2>
                <span className="badge badge-red">{alerts.length} ativos</span>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Insights row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Principal Avanço / Falha */}
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">
              Retrospectiva — Março 2026
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-emerald-400 text-base shrink-0">✓</span>
                <div>
                  <div className="text-xs font-semibold text-emerald-400 mb-0.5">
                    Principal Avanço
                  </div>
                  <div className="text-sm text-gray-300">
                    {scoreMensal.principalAvanco}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <span className="text-red-400 text-base shrink-0">✗</span>
                <div>
                  <div className="text-xs font-semibold text-red-400 mb-0.5">
                    Principal Falha
                  </div>
                  <div className="text-sm text-gray-300">
                    {scoreMensal.principalFalha}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score dimensions panel */}
          <ScoreDimensionsPanel />
        </div>

        {/* Foco do próximo mês */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              🎯
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                Foco do Próximo Mês
              </div>
              <div className="text-sm text-gray-300 leading-relaxed">
                {scoreMensal.focoProximoMes}
              </div>
            </div>
          </div>
        </div>
      </div>
      </PeriodFilterBar>
    </>
  );
}
