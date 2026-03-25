import Header from "@/components/Header";
import { customers, customerSegments, regionData } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, TrendingUp, Star, AlertTriangle } from "lucide-react";

const totalLTV = customers.reduce((sum, c) => sum + c.ltv, 0);
const activeCustomers = customers.filter((c) => c.status === "active");
const atRiskCustomers = customers.filter((c) => c.status === "at-risk");
const activeLTV = activeCustomers.reduce((sum, c) => sum + c.ltv, 0);
const topCustomers = [...customers].sort((a, b) => b.ltv - a.ltv).slice(0, 5);

const segmentStats = [
  { name: "Enterprise", count: customers.filter((c) => c.segment === "Enterprise").length, color: "brand" },
  { name: "SMB", count: customers.filter((c) => c.segment === "SMB").length, color: "emerald" },
  { name: "Startup", count: customers.filter((c) => c.segment === "Startup").length, color: "yellow" },
];

export default function CarteiraPage() {
  return (
    <>
      <Header
        title="Carteira"
        subtitle="Gestão de portfólio de clientes, LTV e distribuição por segmento"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {formatCurrency(totalLTV, "USD", true)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">LTV Total da Carteira</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {formatCurrency(activeLTV, "USD", true)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">LTV Clientes Ativos</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Star size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {formatCurrency(Math.round(totalLTV / customers.length), "USD", true)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">LTV Médio por Cliente</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">{atRiskCustomers.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Clientes em Risco</div>
            </div>
          </div>
        </div>

        {/* Segments + Region */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Segment breakdown */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Distribuição por Segmento</h2>
              <p className="text-xs text-gray-500 mt-0.5">Participação de cada segmento na carteira</p>
            </div>
            <div className="space-y-4">
              {customerSegments.map((seg) => (
                <div key={seg.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-300 font-medium">{seg.name}</span>
                    <span className="text-white font-semibold tabular-nums">{seg.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Region breakdown */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Receita por Região</h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribuição geográfica da carteira</p>
            </div>
            <div className="space-y-3">
              {regionData.map((r) => (
                <div
                  key={r.region}
                  className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-200">{r.region}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{r.customers} clientes</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white tabular-nums">
                      {formatCurrency(r.revenue, "USD", true)}
                    </div>
                    <div className="text-xs text-emerald-400 mt-0.5">+{r.growth}% YoY</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top clients table */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Top Clientes por LTV</h2>
            <p className="text-xs text-gray-500 mt-0.5">Principais contas por valor de ciclo de vida</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["#", "Cliente", "Empresa", "Segmento", "LTV", "Último Pedido", "Status"].map((h) => (
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
                {topCustomers.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-gray-600 font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-medium text-gray-200">{c.name}</div>
                          <div className="text-xs text-gray-600">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{c.company}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`badge ${
                          c.segment === "Enterprise"
                            ? "badge-blue"
                            : c.segment === "SMB"
                            ? "badge-green"
                            : "badge-yellow"
                        }`}
                      >
                        {c.segment}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-white tabular-nums">
                      {formatCurrency(c.ltv, "USD", true)}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 tabular-nums">{formatDate(c.lastOrder)}</td>
                    <td className="py-3">
                      <span
                        className={`badge ${
                          c.status === "active"
                            ? "badge-green"
                            : c.status === "at-risk"
                            ? "badge-yellow"
                            : "badge-red"
                        }`}
                      >
                        {c.status === "active" ? "Ativo" : c.status === "at-risk" ? "Em Risco" : "Perdido"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
