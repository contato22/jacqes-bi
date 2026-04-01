/**
 * AWQ Holding Dashboard — /awq
 *
 * This page consumes the consolidation layer and renders a full holding-level
 * view of the AWQ Group ecosystem:
 *   - Consolidated KPIs (revenue, EBITDA, margins)
 *   - Revenue breakdown by BU
 *   - Budget vs Actual consolidated
 *   - Mini P&L per BU
 *   - Portfolio companies (AWQ Venture)
 *   - Cross-BU customers
 *   - Consolidation observability panel
 */

import { getAwqConsolidatedData } from "@/lib/fetchers/awq-consolidated";
import { buildMiniPL, getLatestMetric } from "@/lib/consolidation/group-metrics";
import { buildCrossBUClientView } from "@/lib/consolidation/join";
import Header from "@/components/Header";
import HoldingKPIGrid from "@/components/awq/HoldingKPIGrid";
import BUBreakdownTable from "@/components/awq/BUBreakdownTable";
import ConsolidationStatus from "@/components/awq/ConsolidationStatus";

const CURRENT_YEAR = 2026;

export default async function AWQPage() {
  // Fetch and consolidate all BU data server-side
  const payload = await getAwqConsolidatedData({
    granularity: "monthly",
  });

  const {
    financials,
    customers,
    portfolio,
    consolidatedMetrics,
    meta,
  } = payload;

  // Derive latest metrics
  const latestMetric = getLatestMetric(consolidatedMetrics);
  const prevMetric = consolidatedMetrics
    .filter((m) => m.granularity === "monthly")
    .sort((a, b) => b.year * 100 + (b.month ?? 0) - (a.year * 100 + (a.month ?? 0)))[1];

  // Mini P&L for latest month
  const latestMonth = latestMetric?.month ?? 3;
  const miniPL = buildMiniPL(financials.data, { year: CURRENT_YEAR, month: latestMonth });

  // Cross-BU client view
  const crossBUClients = buildCrossBUClientView(customers.data).filter(
    (c) => c.totalBUs > 1
  );

  // Active portfolio companies
  const portfolioCompanies = portfolio.data;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header title="AWQ Group — Consolidado Holding" />

      <main className="flex-1 px-6 py-6 space-y-6 max-w-[1600px]">
        {/* Consolidation observability panel */}
        <ConsolidationStatus meta={meta} />

        {/* Holding KPIs */}
        {latestMetric && (
          <section>
            <SectionTitle
              title="KPIs Consolidados"
              subtitle={`Período: ${latestMetric.period} • ${Object.keys(latestMetric.byBU).length} unidades ativas`}
            />
            <HoldingKPIGrid current={latestMetric} previous={prevMetric} />
          </section>
        )}

        {/* Mini P&L */}
        {miniPL.length > 0 && (
          <section>
            <SectionTitle
              title="Mini P&L por Unidade"
              subtitle={`Referência: ${CURRENT_YEAR}-${String(latestMonth).padStart(2, "0")}`}
            />
            <BUBreakdownTable
              rows={miniPL}
              period={`${CURRENT_YEAR}-${String(latestMonth).padStart(2, "0")}`}
            />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Companies */}
          <section>
            <SectionTitle
              title="Portfólio AWQ Venture"
              subtitle={`${portfolioCompanies.length} empresa${portfolioCompanies.length !== 1 ? "s" : ""} no portfólio`}
            />
            <div className="card divide-y divide-gray-800">
              {portfolioCompanies.map((company) => (
                <div key={company.id} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-100">{company.companyName}</span>
                        <DealTypeBadge type={company.dealType} />
                        <StageBadge stage={company.stage} />
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {company.sector}
                        {company.subSector ? ` · ${company.subSector}` : ""}
                        {company.cnpj ? ` · CNPJ: ${company.cnpj}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-200">
                        {company.equityPercent != null
                          ? `${company.equityPercent}% equity`
                          : "—"}
                      </div>
                      {company.currentValuation != null && (
                        <div className="text-xs text-gray-500">
                          Val: {formatBRL(company.currentValuation)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    {company.latestRevenue != null && (
                      <Metric label="Receita/mês" value={formatBRL(company.latestRevenue)} />
                    )}
                    {company.latestMrr != null && (
                      <Metric label="MRR" value={formatBRL(company.latestMrr)} />
                    )}
                    {company.latestHeadcount != null && (
                      <Metric label="Headcount" value={`${company.latestHeadcount} pessoas`} />
                    )}
                    {company.investmentDate && (
                      <Metric label="Inv. desde" value={company.investmentDate} />
                    )}
                  </div>

                  {/* Aliases (for identity transparency) */}
                  {company.aliases.length > 1 && (
                    <div className="mt-2 text-[10px] text-gray-600">
                      Aliases: {company.aliases.join(" · ")}
                    </div>
                  )}
                </div>
              ))}

              {portfolioCompanies.length === 0 && (
                <div className="px-5 py-8 text-center text-gray-600 text-sm">
                  Nenhuma empresa no portfólio carregada.
                </div>
              )}
            </div>
          </section>

          {/* Cross-BU Customers */}
          <section>
            <SectionTitle
              title="Clientes Compartilhados entre BUs"
              subtitle={`${crossBUClients.length} cliente${crossBUClients.length !== 1 ? "s" : ""} presente${crossBUClients.length !== 1 ? "s" : ""} em múltiplas unidades`}
            />
            <div className="card divide-y divide-gray-800">
              {crossBUClients.map((view) => (
                <div key={view.clientCanonicalId} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-gray-100">{view.clientName}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {view.appearances.map((a) => (
                          <BUBadge key={a.ownerBU} buId={a.ownerBU} />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-200">
                        LTV: {formatBRL(view.totalLtv)}
                      </div>
                      {view.totalMrr > 0 && (
                        <div className="text-xs text-gray-500">
                          MRR: {formatBRL(view.totalMrr)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-600">
                    ID canônico: {view.clientCanonicalId}
                  </div>
                </div>
              ))}

              {crossBUClients.length === 0 && (
                <div className="px-5 py-8 text-center text-gray-600 text-sm">
                  Nenhum cliente compartilhado detectado entre BUs.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Revenue trend (simplified — all BUs) */}
        <section>
          <SectionTitle
            title="Série Histórica — Receita por BU"
            subtitle="12 meses rolling"
          />
          <RevenueHistoryTable metrics={consolidatedMetrics.filter((m) => m.granularity === "monthly").slice(-12)} />
        </section>
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-semibold text-gray-100">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function formatBRL(value: number): string {
  if (value >= 1_000_000) return `R$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$${(value / 1_000).toFixed(0)}K`;
  return `R$${value.toFixed(0)}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-600">{label}: </span>
      <span className="text-gray-300 font-medium">{value}</span>
    </div>
  );
}

const DEAL_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  equity: { label: "Equity", color: "bg-blue-500/20 text-blue-300" },
  "media-for-equity": { label: "Media 4 Equity", color: "bg-purple-500/20 text-purple-300" },
  debt: { label: "Dívida", color: "bg-orange-500/20 text-orange-300" },
  mixed: { label: "Misto", color: "bg-gray-500/20 text-gray-300" },
};

function DealTypeBadge({ type }: { type: string }) {
  const config = DEAL_TYPE_LABELS[type] ?? { label: type, color: "bg-gray-700 text-gray-400" };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

const STAGE_LABELS: Record<string, string> = {
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "series-a": "Série A",
  "series-b": "Série B",
  growth: "Growth",
  mature: "Maduro",
};

function StageBadge({ stage }: { stage: string }) {
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-700/60 text-gray-400">
      {STAGE_LABELS[stage] ?? stage}
    </span>
  );
}

const BU_BADGE_COLORS: Record<string, string> = {
  jacqes: "bg-brand-500/20 text-brand-300",
  "caza-vision": "bg-cyan-500/20 text-cyan-300",
  "awq-venture": "bg-amber-500/20 text-amber-300",
  "awq-holding": "bg-purple-500/20 text-purple-300",
};

const BU_NAMES: Record<string, string> = {
  jacqes: "JACQES",
  "caza-vision": "Caza Vision",
  "awq-venture": "AWQ Venture",
  "awq-holding": "AWQ Holding",
};

function BUBadge({ buId }: { buId: string }) {
  const color = BU_BADGE_COLORS[buId] ?? "bg-gray-700 text-gray-400";
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${color}`}>
      {BU_NAMES[buId] ?? buId}
    </span>
  );
}

import type { ConsolidatedMetricRecord } from "@/lib/types/canonical";

function RevenueHistoryTable({ metrics }: { metrics: ConsolidatedMetricRecord[] }) {
  if (metrics.length === 0) {
    return (
      <div className="card px-5 py-8 text-center text-gray-600 text-sm">
        Dados históricos insuficientes.
      </div>
    );
  }

  const BU_KEYS = ["jacqes", "caza-vision", "awq-venture"] as const;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left px-5 py-3 text-gray-500 font-medium uppercase tracking-wide">Período</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium uppercase tracking-wide">JACQES</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium uppercase tracking-wide">Caza Vision</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium uppercase tracking-wide">AWQ Venture</th>
            <th className="text-right px-5 py-3 text-gray-400 font-semibold uppercase tracking-wide">Total</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.period} className="border-b border-gray-800/40 hover:bg-gray-800/20">
              <td className="px-5 py-2.5 text-gray-400 font-medium">{m.period}</td>
              {BU_KEYS.map((buId) => (
                <td key={buId} className="px-4 py-2.5 text-right text-gray-400 font-mono">
                  {m.byBU[buId] ? formatBRL(m.byBU[buId]!.grossRevenue) : "—"}
                </td>
              ))}
              <td className="px-5 py-2.5 text-right text-gray-200 font-semibold font-mono">
                {formatBRL(m.totalGrossRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
