import Header from "@/components/Header";
import {
  DollarSign, Users,
  Activity, Zap,
} from "lucide-react";

const GROUP_KPIS = [
  {
    label: "Receita Consolidada",
    value: "$4.82M",
    sub: "YTD · Março 2026",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Clientes no Grupo",
    value: "3.847",
    sub: "Base ativa JACQES",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Margem Média",
    value: "67.4%",
    sub: "Grupo consolidado",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const ACTIVITY = [
  { label: "JACQES atingiu margem de 67.4% em Março", time: "Hoje", type: "success" },
  { label: "3.847 clientes ativos na base JACQES", time: "Atualizado", type: "info" },
  { label: "Q1 2026 — receita superou meta em 8.3%", time: "Março 2026", type: "success" },
];

export default function AwqGroupPage() {
  return (
    <>
      <Header
        title="AWQ Group"
        subtitle="Visão geral consolidada do grupo · Março 2026"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Group KPIs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {GROUP_KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="card p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={kpi.color} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  <div className="text-xs font-medium text-gray-400 mt-0.5">{kpi.label}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{kpi.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity */}
        <div className="card p-5 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-awq-gold" />
            <h2 className="text-sm font-semibold text-white">Atividade do Grupo</h2>
          </div>
          <div className="space-y-3">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  item.type === "success" ? "bg-emerald-500" :
                  item.type === "warn" ? "bg-amber-500" : "bg-brand-500"
                }`} />
                <div>
                  <div className="text-xs text-gray-300">{item.label}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
