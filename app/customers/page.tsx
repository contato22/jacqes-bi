import Header from "@/components/Header";
import { customers } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UserCheck, UserX, AlertTriangle, Users, Clock } from "lucide-react";

const statusConfig = {
  Ativo: {
    label: "Ativo",
    classes: "badge-green",
    Icon: UserCheck,
  },
  "Em Proposta": {
    label: "Em Proposta",
    classes: "badge-yellow",
    Icon: AlertTriangle,
  },
  Convertido: {
    label: "Convertido",
    classes: "badge-blue",
    Icon: Clock,
  },
  Perdido: {
    label: "Perdido",
    classes: "badge-red",
    Icon: UserX,
  },
};

const tipoConfig: Record<string, string> = {
  Marca: "badge-blue",
  Agência: "badge-green",
  Empresa: "badge-blue",
  Startup: "badge-yellow",
};

const ativoCount = customers.filter((c) => c.status === "Ativo").length;
const propostaCount = customers.filter((c) => c.status === "Em Proposta").length;
const perdidoCount = customers.filter((c) => c.status === "Perdido").length;
const totalBudget = customers.reduce((sum, c) => sum + c.budgetAnual, 0);

export default function CustomersPage() {
  return (
    <>
      <Header
        title="Clientes"
        subtitle="Carteira de clientes Caza Vision · via Notion"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Users size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{customers.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total Clientes</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{ativoCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Ativos</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{propostaCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Em Proposta</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <UserX size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{perdidoCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Perdidos</div>
            </div>
          </div>
        </div>

        {/* Total Budget */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Budget Anual Total da Carteira
            </div>
            <div className="text-3xl font-bold text-white mt-1 tabular-nums">
              {formatCurrency(totalBudget)}
            </div>
          </div>
          <div className="text-xs text-gray-600 text-right">
            <div>Média por cliente</div>
            <div className="text-lg font-bold text-gray-300 mt-1">
              {formatCurrency(Math.round(totalBudget / customers.length))}
            </div>
          </div>
        </div>

        {/* Customer table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Diretório de Clientes</h2>
              <p className="text-xs text-gray-500 mt-0.5">Fonte: Caza Vision — Clientes (Notion)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Cliente", "Segmento", "Tipo", "Budget Anual", "Desde", "Telefone", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const status = statusConfig[c.status];
                  const tipoClass = tipoConfig[c.tipo] ?? "badge-blue";

                  return (
                    <tr
                      key={c.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {c.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">{c.name}</div>
                            <div className="text-xs text-gray-600">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{c.segmento}</td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${tipoClass}`}>{c.tipo}</span>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-white tabular-nums">
                        {formatCurrency(c.budgetAnual, "BRL", true)}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 tabular-nums">
                        {formatDate(c.desde)}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs font-mono">
                        {c.telefone}
                      </td>
                      <td className="py-3">
                        <span className={`badge ${status.classes}`}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
