// ─── AWQ Venture — Portfolio Page ─────────────────────────────────────────────
// Server Component. Mostra todas as empresas do portfólio AWQ Venture.
// Enerdy é alimentada diretamente pelo banco Notion configurado.
// Empresas sem base configurada exibem card com dados estruturais apenas.

import Header from "@/components/Header";
import {
  Building2,
  TrendingUp,
  Zap,
  DollarSign,
  Activity,
  Users,
  BarChart3,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { FinancialRecord, UnitEconomicsRecord, NormalizationResult } from "@/lib/data-sources";

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface EnerdyData {
  financial: NormalizationResult<FinancialRecord> | null;
  unitEconomics: NormalizationResult<UnitEconomicsRecord> | null;
}

// ─── Fetch Enerdy ─────────────────────────────────────────────────────────────

async function fetchEnerdyData(): Promise<EnerdyData> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const ttl  = parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10);

  try {
    const res = await fetch(`${base}/api/notion/awq-venture/portfolio`, {
      next: { revalidate: ttl },
    });
    if (!res.ok) return { financial: null, unitEconomics: null };
    const data = await res.json();
    return {
      financial:     data?.enerdy?.financial     ?? null,
      unitEconomics: data?.enerdy?.unitEconomics ?? null,
    };
  } catch {
    return { financial: null, unitEconomics: null };
  }
}

// ─── Helpers de extração ──────────────────────────────────────────────────────

function latestFinancial(data: NormalizationResult<FinancialRecord> | null): FinancialRecord | null {
  if (!data?.records?.length) return null;
  return [...data.records]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .at(0) ?? null;
}

function latestUnitEcon(data: NormalizationResult<UnitEconomicsRecord> | null): UnitEconomicsRecord | null {
  if (!data?.records?.length) return null;
  return [...data.records]
    .sort((a, b) => (b.month ?? "").localeCompare(a.month ?? ""))
    .at(0) ?? null;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function MetricTile({
  label, value, sub, positive,
}: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-bold text-white tabular-nums">{value}</div>
      {sub && (
        <div className={`text-[10px] font-medium ${positive === false ? "text-red-400" : "text-emerald-400"}`}>
          {sub}
        </div>
      )}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Live · Notion
    </span>
  );
}

function PendingBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 bg-gray-800 border border-gray-700 rounded-full px-2 py-0.5">
      <Clock size={10} />
      {label}
    </span>
  );
}

// ─── Card Enerdy ─────────────────────────────────────────────────────────────

function EnerdyCard({ fin, ue }: { fin: FinancialRecord | null; ue: UnitEconomicsRecord | null }) {
  const hasFinancial = fin !== null;
  const hasUE        = ue  !== null;

  return (
    <div className="card border-amber-500/20 bg-gray-900 overflow-hidden">
      {/* Header do card */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo / ícone da empresa */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Zap size={22} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Enerdy</h2>
              <span className="badge bg-amber-500/15 text-amber-400">Ativo</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Energia · Portfólio AWQ Venture</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasFinancial ? <LiveBadge /> : <PendingBadge label="Aguardando dados" />}
        </div>
      </div>

      {/* Financeiro — período mais recente */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={13} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Resultado Financeiro
          </span>
          {fin?.month && (
            <span className="text-[10px] text-gray-600">· {fin.month}</span>
          )}
        </div>

        {hasFinancial ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
            <MetricTile
              label="Receita Bruta"
              value={formatCurrency(fin!.grossRevenue ?? fin!.netRevenue ?? 0, "BRL", true)}
            />
            <MetricTile
              label="Receita Líquida"
              value={formatCurrency(fin!.netRevenue ?? 0, "BRL", true)}
            />
            <MetricTile
              label="EBITDA"
              value={formatCurrency(fin!.ebitda ?? 0, "BRL", true)}
              positive={fin!.ebitda !== null && fin!.ebitda >= 0}
            />
            <MetricTile
              label="Fluxo de Caixa"
              value={formatCurrency(fin!.cashFlow ?? 0, "BRL", true)}
              positive={fin!.cashFlow !== null && fin!.cashFlow >= 0}
            />
            {fin!.cogs !== null && (
              <MetricTile
                label="COGS"
                value={formatCurrency(fin!.cogs, "BRL", true)}
              />
            )}
            {fin!.grossProfit !== null && (
              <MetricTile
                label="Lucro Bruto"
                value={formatCurrency(fin!.grossProfit, "BRL", true)}
                positive={fin!.grossProfit >= 0}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-4 text-gray-600">
            <BarChart3 size={16} />
            <span className="text-sm">Dados financeiros carregando…</span>
            <span className="text-xs">Verifique as variáveis de ambiente e o mapeamento de campos.</span>
          </div>
        )}
      </div>

      {/* Unit Economics */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={13} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Unit Economics
          </span>
          {ue?.month && (
            <span className="text-[10px] text-gray-600">· {ue.month}</span>
          )}
        </div>

        {hasUE ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-5">
            {ue!.mrr !== null && (
              <MetricTile label="MRR" value={formatCurrency(ue!.mrr, "BRL", true)} />
            )}
            {ue!.arr !== null && (
              <MetricTile label="ARR" value={formatCurrency(ue!.arr, "BRL", true)} />
            )}
            {ue!.churnRate !== null && (
              <MetricTile
                label="Churn Rate"
                value={`${ue!.churnRate.toFixed(1)}%`}
                positive={ue!.churnRate < 3}
              />
            )}
            {ue!.ltv !== null && (
              <MetricTile label="LTV" value={formatCurrency(ue!.ltv, "BRL", true)} />
            )}
            {ue!.ltvCacRatio !== null && (
              <MetricTile
                label="LTV/CAC"
                value={`${ue!.ltvCacRatio.toFixed(1)}x`}
                positive={ue!.ltvCacRatio >= 3}
              />
            )}
            {ue!.paybackMonths !== null && (
              <MetricTile label="Payback" value={`${ue!.paybackMonths}m`} />
            )}
            {ue!.nrr !== null && (
              <MetricTile
                label="NRR"
                value={`${ue!.nrr.toFixed(1)}%`}
                positive={ue!.nrr >= 100}
              />
            )}
            {ue!.nps !== null && (
              <MetricTile
                label="NPS"
                value={String(ue!.nps)}
                positive={ue!.nps >= 40}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-4 text-gray-600">
            <Activity size={16} />
            <span className="text-sm">Unit economics carregando…</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Placeholder para empresas futuras ───────────────────────────────────────

function FutureCompanySlot() {
  return (
    <div className="card border-dashed border-gray-700 flex items-center justify-center p-8 text-center gap-3">
      <Building2 size={20} className="text-gray-700" />
      <div>
        <div className="text-sm font-medium text-gray-600">Nova empresa</div>
        <div className="text-xs text-gray-700 mt-0.5">
          Configure o ID da base no .env.local
        </div>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function AWQVenturePage() {
  const { financial, unitEconomics } = await fetchEnerdyData();

  const fin = latestFinancial(financial);
  const ue  = latestUnitEcon(unitEconomics);

  const totalRecordsLoaded =
    (financial?.records?.length ?? 0) + (unitEconomics?.records?.length ?? 0);
  const isLive = totalRecordsLoaded > 0;

  return (
    <>
      <Header
        title="AWQ Venture"
        subtitle="Portfólio de empresas investidas · Visão consolidada"
      />

      <div className="px-8 py-6 space-y-6">

        {/* Indicador de fonte */}
        {isLive && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {totalRecordsLoaded} registros carregados · base Enerdy · Notion
          </div>
        )}

        {/* KPIs do portfólio */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building2 size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-gray-500 mt-0.5">Empresa Ativa</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {fin?.netRevenue != null
                  ? formatCurrency(fin.netRevenue, "BRL", true)
                  : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Receita Líquida (último período)</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {ue?.mrr != null ? formatCurrency(ue.mrr, "BRL", true) : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">MRR (último período)</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ArrowUpRight size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {ue?.ltvCacRatio != null ? `${ue.ltvCacRatio.toFixed(1)}x` : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">LTV/CAC</div>
            </div>
          </div>
        </div>

        {/* Seção: Empresas do Portfólio */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-white">Empresas do Portfólio</h2>
            <span className="badge bg-amber-500/15 text-amber-400">1 ativa</span>
          </div>

          <div className="space-y-4">
            {/* Enerdy — base conectada */}
            <EnerdyCard fin={fin} ue={ue} />

            {/* Slot para próxima empresa */}
            <FutureCompanySlot />
          </div>
        </div>

      </div>
    </>
  );
}
