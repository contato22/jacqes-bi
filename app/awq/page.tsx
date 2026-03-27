import { TrendingUp, Building2, Users, DollarSign, ArrowUpRight, Landmark } from "lucide-react";
import Link from "next/link";
import { awqBusinessUnits } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/utils";

const totalRevenue = awqBusinessUnits.reduce((s, bu) => s + bu.revenue, 0);
const totalProfit = awqBusinessUnits.reduce((s, bu) => s + bu.profit, 0);
const totalEmployees = awqBusinessUnits.reduce((s, bu) => s + bu.employees, 0);
const consolidatedMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

const kpis = [
  {
    label: "Receita Total do Grupo",
    value: formatCurrency(totalRevenue, "USD", true),
    sub: "+16.2% YoY",
    positive: true,
    icon: DollarSign,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Lucro Consolidado",
    value: formatCurrency(totalProfit, "USD", true),
    sub: "+18.7% YoY",
    positive: true,
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Business Units",
    value: String(awqBusinessUnits.length),
    sub: "Unidades ativas",
    positive: true,
    icon: Building2,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Colaboradores",
    value: String(totalEmployees),
    sub: `Margem: ${consolidatedMargin}%`,
    positive: true,
    icon: Users,
    color: "bg-cyan-50 text-cyan-600",
  },
];

const buColors: Record<string, string> = {
  BU001: "bg-indigo-600",
  BU002: "bg-amber-500",
  BU003: "bg-cyan-500",
  BU004: "bg-emerald-500",
};

const buInitials: Record<string, string> = {
  BU001: "JQ",
  BU002: "AV",
  BU003: "AC",
  BU004: "AL",
};

const buHrefs: Record<string, string> = {
  BU001: "/awq/jacqes",
  BU002: "/awq/venture",
  BU003: "/awq/capital",
  BU004: "/awq/labs",
};

const statusLabel: Record<string, { label: string; cls: string }> = {
  ahead: { label: "Acima da meta", cls: "bg-emerald-100 text-emerald-700" },
  "on-track": { label: "No prazo", cls: "bg-blue-100 text-blue-700" },
  "at-risk": { label: "Em risco", cls: "bg-red-100 text-red-700" },
};

export default function AWQOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Visão Geral</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              AWQ Group · Plataforma Central · Março 2026
            </p>
          </div>
          <Link
            href="/awq/financial"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Landmark size={14} />
            Ver Financial
          </Link>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 tabular-nums">
                      {kpi.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{kpi.label}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className={`text-xs font-medium mt-3 ${kpi.positive ? "text-emerald-600" : "text-red-500"}`}>
                  {kpi.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Units */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Business Units</h2>
              <p className="text-xs text-gray-500 mt-0.5">Desempenho por unidade — FY 2025</p>
            </div>
            <Link
              href="/awq/financial"
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Ver Financial consolidado
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {awqBusinessUnits.map((bu) => {
              const st = statusLabel[bu.status];
              const share = ((bu.revenue / totalRevenue) * 100).toFixed(1);
              return (
                <div
                  key={bu.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${buColors[bu.id]}`}
                  >
                    {buInitials[bu.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{bu.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{bu.description}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-gray-900 tabular-nums">
                      {formatCurrency(bu.revenue, "USD", true)}
                    </div>
                    <div className="text-xs text-gray-400 tabular-nums">
                      {formatPercent(bu.growth)} · {share}% do grupo
                    </div>
                  </div>
                  <div className="w-20 hidden lg:block">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
