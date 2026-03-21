import Header from "@/components/Header";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import { contasData } from "@/lib/data";
import { saudeConfig, riscoConfig, oportunidadeConfig, tendenciaConfig } from "@/lib/colors";
import { Briefcase, AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

const saudavelCount = contasData.filter((c) => c.saude === "Saudável").length;
const atencaoCount = contasData.filter(
  (c) => c.saude === "Estável com Atenção"
).length;
const sensivelCount = contasData.filter(
  (c) => c.saude === "Sensível" || c.saude === "Em Risco"
).length;
const totalPendencias = contasData.reduce((s, c) => s + c.pendencias, 0);
const totalPendenciasCriticas = contasData.reduce((s, c) => s + c.pendenciasCriticas, 0);

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function CarteiraPage() {
  return (
    <>
      <Header
        title="Carteira"
        subtitle="Contas & Carteira — saúde, risco e oportunidade por cliente"
      />

      <PeriodFilterBar available={["mensal"]} label="Março 2026">
      <div className="px-8 py-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {contasData.length}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Contas Ativas
              </div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {saudavelCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Saudáveis</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {atencaoCount + sensivelCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Atenção / Risco
              </div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {totalPendencias}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Pendências Totais
              </div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertOctagon size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {totalPendenciasCriticas}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Pendências Críticas
              </div>
            </div>
          </div>
        </div>

        {/* Accounts table */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Briefcase size={14} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Contas & Carteira</h2>
              <p className="text-xs text-gray-500">Situação completa por conta — fonte: Notion</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {[
                    "Conta",
                    "Segmento",
                    "Saúde",
                    "Tendência",
                    "Risco",
                    "Motivo Risco",
                    "Oportunidade",
                    "Pendências",
                    "Pend. Vencidas",
                    "Pend. Críticas",
                    "Responsividade",
                    "Gestão Danilo",
                    "Última Visita",
                    "Próxima Visita",
                    "Dono Ação",
                  ].map((h) => (
                    <th key={h} className="table-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contasData.map((conta) => {
                  const saude = saudeConfig[conta.saude];
                  const riscoClass = riscoConfig[conta.risco];
                  const oportunidadeClass =
                    oportunidadeConfig[conta.oportunidade];

                  return (
                    <tr
                      key={conta.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${saude?.dot}`}
                          />
                          <div>
                            <div className="font-medium text-gray-200 whitespace-nowrap">
                              {conta.nome}
                            </div>
                            <div
                              className="text-[10px] text-gray-600 max-w-[200px] truncate"
                              title={conta.observacoes}
                            >
                              {conta.observacoes}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">
                        {conta.segmento}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${saude?.badge}`}>
                          {conta.saude}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          {conta.tendencia === "subindo" ? (
                            <TrendingUp size={14} className="text-emerald-400" />
                          ) : conta.tendencia === "descendo" ? (
                            <TrendingDown size={14} className="text-red-400" />
                          ) : (
                            <Minus size={14} className="text-gray-400" />
                          )}
                          <span className={`text-xs ${tendenciaConfig[conta.tendencia].color}`}>
                            {tendenciaConfig[conta.tendencia].label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${riscoClass}`}>
                          {conta.risco}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs text-gray-400">
                          {conta.motivoRisco ?? "—"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${oportunidadeClass}`}>
                          {conta.oportunidade}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            conta.pendencias >= 4
                              ? "text-red-400"
                              : conta.pendencias >= 2
                              ? "text-yellow-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {conta.pendencias}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span
                          className={cn(
                            "badge",
                            conta.pendenciasVencidas > 0 ? "badge-red" : "badge-green"
                          )}
                        >
                          {conta.pendenciasVencidas}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        {conta.pendenciasCriticas > 0 ? (
                          <span className="badge badge-red">
                            {conta.pendenciasCriticas}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={cn(
                            "badge",
                            conta.responsividadeCliente === "Alta"
                              ? "badge-green"
                              : conta.responsividadeCliente === "Média"
                              ? "badge-yellow"
                              : "badge-red"
                          )}
                        >
                          {conta.responsividadeCliente}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={cn(
                            "badge",
                            conta.gestaoRiscoDanilo === "Boa"
                              ? "badge-green"
                              : conta.gestaoRiscoDanilo === "Média"
                              ? "badge-yellow"
                              : "badge-red"
                          )}
                        >
                          {conta.gestaoRiscoDanilo}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs tabular-nums">
                        {formatDate(conta.ultimaVisita)}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs tabular-nums">
                        {formatDate(conta.proximaVisita)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`badge text-[10px] ${
                            conta.donoProximaAcao === "Danilo"
                              ? "badge-blue"
                              : "badge-yellow"
                          }`}
                        >
                          {conta.donoProximaAcao}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </PeriodFilterBar>
    </>
  );
}
