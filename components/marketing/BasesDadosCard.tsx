"use client";

import { useState } from "react";
import {
  Database, BarChart2, Megaphone, Mail, Users,
  FileSpreadsheet, Globe, MessageSquare,
  RefreshCw, CheckCircle2, AlertCircle, Plug,
} from "lucide-react";
import { type BaseDados } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICONE_MAP = {
  Database:        Database,
  BarChart2:       BarChart2,
  Megaphone:       Megaphone,
  Mail:            Mail,
  Users:           Users,
  FileSpreadsheet: FileSpreadsheet,
  Globe:           Globe,
  MessageSquare:   MessageSquare,
} as const;

type SyncState = "idle" | "syncing" | "done" | "error";

function formatSync(iso: string | null): string {
  if (!iso) return "Nunca sincronizado";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function statusBadge(s: BaseDados["status"]) {
  if (s === "conectado")       return "badge-green";
  if (s === "manual")          return "badge-yellow";
  return "badge text-gray-600 bg-gray-800/60";
}

function statusLabel(s: BaseDados["status"]) {
  if (s === "conectado")       return "Conectado";
  if (s === "manual")          return "Manual";
  return "Não configurado";
}

interface Props {
  bases: BaseDados[];
}

export default function BasesDadosCard({ bases }: Props) {
  const [syncState, setSyncState] = useState<Record<string, SyncState>>({});
  const [mensagens, setMensagens] = useState<Record<string, string>>({});

  function handleSync(base: BaseDados) {
    if (syncState[base.id] === "syncing") return;

    setSyncState((s) => ({ ...s, [base.id]: "syncing" }));
    setMensagens((m) => ({ ...m, [base.id]: "" }));

    const delay = 1200 + Math.random() * 800;

    setTimeout(() => {
      if (base.status === "nao_configurado") {
        setSyncState((s) => ({ ...s, [base.id]: "error" }));
        setMensagens((m) => ({ ...m, [base.id]: "Fonte não configurada. Solicite ao administrador." }));
      } else if (base.acaoAtualizar === "none") {
        setSyncState((s) => ({ ...s, [base.id]: "error" }));
        setMensagens((m) => ({ ...m, [base.id]: "Atualização automática indisponível para esta fonte." }));
      } else if (base.status === "manual") {
        setSyncState((s) => ({ ...s, [base.id]: "done" }));
        setMensagens((m) => ({ ...m, [base.id]: "Dados importados. Revisão manual necessária para validação." }));
      } else {
        setSyncState((s) => ({ ...s, [base.id]: "done" }));
        setMensagens((m) => ({ ...m, [base.id]: "Dados atualizados com sucesso." }));
      }
    }, delay);
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Plug size={14} className="text-brand-400" />
        <h3 className="text-sm font-semibold text-white">Bases de Dados Disponíveis</h3>
        <span className="ml-1 text-[10px] text-gray-600">— fontes configuradas para este cliente</span>
      </div>

      <div className="space-y-2">
        {bases.map((base) => {
          const Icon = ICONE_MAP[base.icone];
          const state = syncState[base.id] ?? "idle";
          const msg   = mensagens[base.id] ?? "";

          return (
            <div
              key={base.id}
              className={cn(
                "rounded-xl border p-3.5 transition-colors",
                base.status === "conectado"       && "border-gray-700/60 bg-gray-800/30",
                base.status === "manual"          && "border-yellow-900/30 bg-yellow-950/10",
                base.status === "nao_configurado" && "border-gray-800/60 bg-gray-900/40 opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                {/* left */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    base.status === "conectado"  ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                    : base.status === "manual"   ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                    : "bg-gray-800 border border-gray-700 text-gray-600"
                  )}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-200">{base.fonte}</span>
                      <span className={`badge ${statusBadge(base.status)}`}>{statusLabel(base.status)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{base.descricao}</p>
                    <p className="text-[10px] text-gray-700 mt-1">
                      Última atualização: {formatSync(base.ultimaSincronizacao)}
                    </p>
                    {msg && (
                      <p className={cn(
                        "text-[11px] mt-1.5 font-medium",
                        state === "done"  ? "text-emerald-400" : "text-red-400"
                      )}>
                        {msg}
                      </p>
                    )}
                  </div>
                </div>

                {/* action button */}
                <button
                  onClick={() => handleSync(base)}
                  disabled={state === "syncing"}
                  title="Atualizar dados desta fonte"
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    state === "syncing"
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : state === "done"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : state === "error"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : base.status === "nao_configurado"
                      ? "bg-gray-800 text-gray-600 border border-gray-700 hover:border-gray-600"
                      : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {state === "syncing" ? (
                    <><RefreshCw size={12} className="animate-spin" /> Atualizando…</>
                  ) : state === "done" ? (
                    <><CheckCircle2 size={12} /> Atualizado</>
                  ) : state === "error" ? (
                    <><AlertCircle size={12} /> Erro</>
                  ) : (
                    <><RefreshCw size={12} /> Atualizar</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
