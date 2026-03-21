"use client";

import Header from "@/components/Header";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { slaData, followUpData, processoAtivos, contasData } from "@/lib/data";
import { cn } from "@/lib/utils";

const contasSemContato = slaData.porConta.filter(
  (c) => c.diasSemContato > slaData.contasSemContatoDias
).length;

export default function CSOpsPage() {
  return (
    <>
      <Header
        title="CS Ops"
        subtitle="SLA · Follow-ups · Processos · Março 2026"
      />

      <div className="px-8 py-6 space-y-8">

        {/* ─── SLA Block ─────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">SLA de Atendimento</h2>
            <p className="text-xs text-gray-500 mt-0.5">Tempo de resposta e cobertura de contato</p>
          </div>

          {/* SLA KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Tempo médio de resposta */}
            <div className="card p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                slaData.tempoMedioRespostaH > 12
                  ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              )}>
                <Clock size={18} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold tabular-nums",
                  slaData.tempoMedioRespostaH > 12 ? "text-yellow-400" : "text-white"
                )}>
                  {slaData.tempoMedioRespostaH}h
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Tempo médio de resposta</div>
              </div>
            </div>

            {/* % no prazo */}
            <div className="card p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                slaData.percentualNoPrazo >= 80
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : slaData.percentualNoPrazo >= 60
                  ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              )}>
                <CheckCircle size={18} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold tabular-nums",
                  slaData.percentualNoPrazo >= 80
                    ? "text-emerald-400"
                    : slaData.percentualNoPrazo >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
                )}>
                  {slaData.percentualNoPrazo}%
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Respostas no prazo</div>
              </div>
            </div>

            {/* Mensagens vencidas */}
            <div className="card p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                slaData.mensagensVencidas > 0
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              )}>
                <XCircle size={18} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold tabular-nums",
                  slaData.mensagensVencidas > 0 ? "text-red-400" : "text-white"
                )}>
                  {slaData.mensagensVencidas}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Mensagens vencidas</div>
              </div>
            </div>

            {/* Contas sem contato >7d */}
            <div className="card p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                contasSemContato > 0
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              )}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold tabular-nums",
                  contasSemContato > 0 ? "text-red-400" : "text-white"
                )}>
                  {contasSemContato}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Contas sem contato {">"}7d</div>
              </div>
            </div>
          </div>

          {/* SLA por conta table */}
          <div className="card p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">SLA por Conta</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Conta", "Dias sem contato", "Tempo médio resp.", "Pendências vencidas"].map((h) => (
                      <th
                        key={h}
                        className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slaData.porConta.map((item) => (
                    <tr key={item.conta} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-200">{item.conta}</td>
                      <td className="py-3 pr-4">
                        <span className={cn(
                          "badge",
                          item.diasSemContato > 7 ? "badge-red" : "badge-green"
                        )}>
                          {item.diasSemContato}d
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn(
                          "text-sm tabular-nums font-medium",
                          item.tempoMedioRespostaH > 24
                            ? "text-red-400"
                            : item.tempoMedioRespostaH > 12
                            ? "text-yellow-400"
                            : "text-emerald-400"
                        )}>
                          {item.tempoMedioRespostaH}h
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "badge",
                          item.pendenciasVencidas > 0 ? "badge-red" : "badge-green"
                        )}>
                          {item.pendenciasVencidas}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── Follow-ups Block ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Follow-ups</h2>
            <p className="text-xs text-gray-500 mt-0.5">Previstos, realizados e vencidos no mês</p>
          </div>

          {/* Follow-up KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-xs text-gray-500">Previstos</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {followUpData.totalPrevistos}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-xs text-gray-500">Realizados</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                {followUpData.totalRealizados}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={14} className="text-red-400" />
                <span className="text-xs text-gray-500">Vencidos</span>
              </div>
              <div className="text-2xl font-bold text-red-400 tabular-nums">
                {followUpData.totalVencidos}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-yellow-400" />
                <span className="text-xs text-gray-500">Sem retorno cliente</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400 tabular-nums">
                {followUpData.totalSemRetorno}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-orange-400" />
                <span className="text-xs text-gray-500">Sem fechamento de ciclo</span>
              </div>
              <div className="text-2xl font-bold text-orange-400 tabular-nums">
                {followUpData.totalSemFechamento}
              </div>
            </div>
          </div>

          {/* Follow-up por conta table */}
          <div className="card p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Follow-up por Conta</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Conta", "Previstos", "Realizados", "Vencidos", "Sem Retorno", "Sem Fechamento"].map((h) => (
                      <th
                        key={h}
                        className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {followUpData.porConta.map((item) => (
                    <tr key={item.conta} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-200">{item.conta}</td>
                      <td className="py-3 pr-4 text-gray-400 tabular-nums">{item.previstos}</td>
                      <td className="py-3 pr-4">
                        <span className={cn("tabular-nums font-medium", item.realizados === item.previstos ? "text-emerald-400" : "text-yellow-400")}>
                          {item.realizados}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn("tabular-nums font-medium", item.vencidos > 0 ? "text-red-400" : "text-gray-500")}>
                          {item.vencidos}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn("tabular-nums font-medium", item.semRetorno > 0 ? "text-yellow-400" : "text-gray-500")}>
                          {item.semRetorno}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn("tabular-nums font-medium", item.semFechamento > 0 ? "text-orange-400" : "text-gray-500")}>
                          {item.semFechamento}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── Aging de Pendências ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Aging de Pendências</h2>
            <p className="text-xs text-gray-500 mt-0.5">Pendências abertas por conta e nível de urgência</p>
          </div>

          <div className="card p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Conta", "Pendências", "Saúde", "Urgência"].map((h) => (
                      <th
                        key={h}
                        className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contasData.map((conta) => {
                    const urgencia =
                      conta.pendencias >= 4
                        ? { label: "Crítico", cls: "badge-red" }
                        : conta.pendencias >= 2
                        ? { label: "Atenção", cls: "badge-yellow" }
                        : { label: "OK", cls: "badge-green" };

                    const saudeCls =
                      conta.saude === "Saudável"
                        ? "badge-green"
                        : conta.saude === "Estável com Atenção"
                        ? "badge-yellow"
                        : "badge-red";

                    return (
                      <tr key={conta.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 pr-4 font-medium text-gray-200">{conta.nome}</td>
                        <td className="py-3 pr-4">
                          <span className={cn(
                            "text-sm font-bold tabular-nums",
                            conta.pendencias >= 4
                              ? "text-red-400"
                              : conta.pendencias >= 2
                              ? "text-yellow-400"
                              : "text-emerald-400"
                          )}>
                            {conta.pendencias}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`badge ${saudeCls}`}>{conta.saude}</span>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${urgencia.cls}`}>{urgencia.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── Processo & Ativos ─────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Processo & Ativos</h2>
            <p className="text-xs text-gray-500 mt-0.5">Produção de ativos operacionais no mês</p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {processoAtivos.checklistsCriados}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Checklists criados</div>
              </div>
            </div>

            <div className="card p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                processoAtivos.sopsCriados === 0
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              )}>
                <FileText size={18} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold tabular-nums",
                  processoAtivos.sopsCriados === 0 ? "text-red-400" : "text-white"
                )}>
                  {processoAtivos.sopsCriados}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">SOPs criados</div>
              </div>
            </div>

            <div className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Users size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {processoAtivos.templatesCriados}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Templates criados</div>
              </div>
            </div>

            <div className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {processoAtivos.melhorasImplementadas}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Melhorias implementadas</div>
              </div>
            </div>

            <div className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {processoAtivos.padroesReaproveitaveis}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Padrões reaproveitáveis</div>
              </div>
            </div>

            <div className="card p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                processoAtivos.iaEmAtivo === 0
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              )}>
                <Zap size={18} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold tabular-nums",
                  processoAtivos.iaEmAtivo === 0 ? "text-red-400" : "text-white"
                )}>
                  {processoAtivos.iaEmAtivo}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">IA em ativo</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
