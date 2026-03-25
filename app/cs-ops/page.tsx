import Header from "@/components/Header";
import { customers, alerts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { HeartPulse, ShieldCheck, AlertTriangle, UserX, MessageSquare } from "lucide-react";

const activeCount = customers.filter((c) => c.status === "active").length;
const atRiskCount = customers.filter((c) => c.status === "at-risk").length;
const churnedCount = customers.filter((c) => c.status === "churned").length;
const healthScore = Math.round((activeCount / customers.length) * 100);

const healthItems = [
  {
    customer: "Nexus Corp",
    contact: "Sarah Mitchell",
    score: 94,
    nps: 72,
    lastTouch: "2026-03-18",
    risk: "low",
    segment: "Enterprise",
  },
  {
    customer: "EuroVenture GmbH",
    contact: "Lena Hoffmann",
    score: 91,
    nps: 68,
    lastTouch: "2026-03-17",
    risk: "low",
    segment: "Enterprise",
  },
  {
    customer: "Shibuya Solutions",
    contact: "Yuki Tanaka",
    score: 87,
    nps: 61,
    lastTouch: "2026-03-16",
    risk: "low",
    segment: "Enterprise",
  },
  {
    customer: "Zenith Digital",
    contact: "James Okafor",
    score: 79,
    nps: 54,
    lastTouch: "2026-03-14",
    risk: "low",
    segment: "SMB",
  },
  {
    customer: "Baltic Systems",
    contact: "Nina Volkov",
    score: 74,
    nps: 47,
    lastTouch: "2026-03-10",
    risk: "medium",
    segment: "SMB",
  },
  {
    customer: "AfricaTech Hub",
    contact: "Kwame Asante",
    score: 42,
    nps: 28,
    lastTouch: "2026-01-22",
    risk: "high",
    segment: "SMB",
  },
  {
    customer: "Stellar Labs",
    contact: "Amara Patel",
    score: 38,
    nps: 21,
    lastTouch: "2026-02-28",
    risk: "high",
    segment: "Startup",
  },
  {
    customer: "LatamScale",
    contact: "Diego Ramirez",
    score: 12,
    nps: 8,
    lastTouch: "2025-11-30",
    risk: "churned",
    segment: "Startup",
  },
];

const riskConfig = {
  low: { label: "Saudável", classes: "badge-green" },
  medium: { label: "Atenção", classes: "badge-yellow" },
  high: { label: "Crítico", classes: "badge-red" },
  churned: { label: "Perdido", classes: "badge-red" },
};

const openTasks = [
  { title: "QBR agendado — Nexus Corp", due: "2026-03-28", priority: "high", owner: "Ana S." },
  { title: "Follow-up risco — AfricaTech Hub", due: "2026-03-25", priority: "critical", owner: "Carlos M." },
  { title: "Onboarding — Baltic Systems (feature nova)", due: "2026-03-27", priority: "medium", owner: "Ana S." },
  { title: "NPS survey follow-up — Stellar Labs", due: "2026-03-26", priority: "high", owner: "Diego R." },
  { title: "Renovação de contrato — EuroVenture GmbH", due: "2026-04-01", priority: "medium", owner: "Carlos M." },
];

export default function CsOpsPage() {
  return (
    <>
      <Header
        title="CS Ops"
        subtitle="Customer Success Operations — saúde, retenção e tarefas abertas"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HeartPulse size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{healthScore}%</div>
              <div className="text-xs text-gray-500 mt-0.5">Score de Saúde Geral</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Clientes Saudáveis</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{atRiskCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Em Risco de Churn</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <UserX size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{churnedCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Churned (30 dias)</div>
            </div>
          </div>
        </div>

        {/* Health table + Tasks */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Health table */}
          <div className="xl:col-span-2 card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Health Score por Cliente</h2>
              <p className="text-xs text-gray-500 mt-0.5">Score composto: uso, NPS, engajamento</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Cliente", "Segmento", "Score", "NPS", "Último Contato", "Risco"].map((h) => (
                      <th
                        key={h}
                        className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {healthItems.map((item) => {
                    const risk = riskConfig[item.risk as keyof typeof riskConfig];
                    return (
                      <tr
                        key={item.customer}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-200">{item.customer}</div>
                          <div className="text-xs text-gray-600">{item.contact}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`badge ${
                              item.segment === "Enterprise"
                                ? "badge-blue"
                                : item.segment === "SMB"
                                ? "badge-green"
                                : "badge-yellow"
                            }`}
                          >
                            {item.segment}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 70
                                    ? "bg-emerald-500"
                                    : item.score >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span
                              className={`text-xs font-semibold tabular-nums ${
                                item.score >= 70
                                  ? "text-emerald-400"
                                  : item.score >= 40
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {item.score}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-400 tabular-nums">{item.nps}</td>
                        <td className="py-3 pr-4 text-gray-400 tabular-nums text-xs">
                          {formatDate(item.lastTouch)}
                        </td>
                        <td className="py-3">
                          <span className={`badge ${risk.classes}`}>{risk.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Open tasks */}
          <div className="card p-6">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Tarefas Abertas</h2>
                <span className="badge badge-red">{openTasks.length}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ações de CS em andamento</p>
            </div>
            <div className="space-y-3">
              {openTasks.map((task) => (
                <div
                  key={task.title}
                  className="p-3 rounded-lg bg-gray-800/50 border border-gray-800"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare
                      size={14}
                      className={
                        task.priority === "critical"
                          ? "text-red-400 mt-0.5 shrink-0"
                          : task.priority === "high"
                          ? "text-yellow-400 mt-0.5 shrink-0"
                          : "text-gray-500 mt-0.5 shrink-0"
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-200 leading-snug">
                        {task.title}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-600">{task.owner}</span>
                        <span className="text-[10px] text-gray-600">
                          {formatDate(task.due)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts section */}
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Alertas de CS</h2>
            <p className="text-xs text-gray-500 mt-0.5">Sinais de atenção da plataforma</p>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3.5 rounded-lg border ${
                  alert.type === "warning"
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : alert.type === "error"
                    ? "bg-red-500/5 border-red-500/20"
                    : alert.type === "success"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-brand-500/5 border-brand-500/20"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    alert.type === "warning"
                      ? "bg-yellow-400"
                      : alert.type === "error"
                      ? "bg-red-400"
                      : alert.type === "success"
                      ? "bg-emerald-400"
                      : "bg-brand-400"
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-white">{alert.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
