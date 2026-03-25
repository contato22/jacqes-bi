import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import { Building2, TrendingUp, Users, Globe } from "lucide-react";

const buCards = [
  {
    id: "jacqes",
    name: "JACQES",
    description: "Business Intelligence & Analytics Platform",
    status: "Active",
    statusColor: "badge-green",
    href: "/",
  },
  {
    id: "caza-vision",
    name: "Caza Vision",
    description: "Real Estate Intelligence & Market Data",
    status: "Active",
    statusColor: "badge-green",
    href: "#",
  },
  {
    id: "awq-venture",
    name: "AWQ Venture",
    description: "Venture Capital & Portfolio Management",
    status: "Active",
    statusColor: "badge-green",
    href: "#",
  },
];

const groupKpis = [
  {
    id: "g1",
    label: "Total Revenue",
    value: "R$ 4.2M",
    change: 12.4,
    trend: "up" as const,
    icon: "revenue",
    color: "blue",
  },
  {
    id: "g2",
    label: "Business Units",
    value: "3",
    change: 0,
    trend: "neutral" as const,
    icon: "users",
    color: "purple",
  },
  {
    id: "g3",
    label: "Active Users",
    value: "1,842",
    change: 8.7,
    trend: "up" as const,
    icon: "customers",
    color: "green",
  },
  {
    id: "g4",
    label: "YoY Growth",
    value: "31.2%",
    change: 5.1,
    trend: "up" as const,
    icon: "growth",
    color: "amber",
  },
];

export default function AWQGroupPage() {
  return (
    <>
      <Header
        title="AWQ Group"
        subtitle="Visão Geral do Grupo · Todas as Business Units · March 2026"
      />

      <div className="px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {groupKpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi as any} />
          ))}
        </div>

        {/* Business Units */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-4">Business Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buCards.map((bu) => (
              <div key={bu.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-500/20 flex items-center justify-center">
                    <Building2 size={16} className="text-brand-400" />
                  </div>
                  <span className={`badge ${bu.statusColor}`}>{bu.status}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{bu.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{bu.description}</div>
                </div>
                <a
                  href={bu.href}
                  className="mt-auto text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
                >
                  Ver dashboard
                  <Globe size={11} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Group info */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white">
              AW
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AWQ Group</div>
              <div className="text-xs text-gray-500">admin@awqgroup.com</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            AWQ Group é um conglomerado de empresas de tecnologia e inovação,
            operando nas verticais de Business Intelligence, Real Estate e Venture Capital.
            Esta plataforma consolida os dados de todas as Business Units em uma visão unificada.
          </p>
        </div>
      </div>
    </>
  );
}
