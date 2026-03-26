"use client";

import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Zap,
  Database,
  Settings2,
  Code2,
  AlertTriangle,
  Play,
  ChevronRight,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { taskStore, autocodeStore, agentSettings } from "@/lib/agent";
import { cn } from "@/lib/utils";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock size={14} className="text-yellow-500" />,
  running: <Loader2 size={14} className="text-brand-400 animate-spin" />,
  completed: <CheckCircle2 size={14} className="text-emerald-500" />,
  failed: <XCircle size={14} className="text-red-500" />,
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  running: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PRIORITY_BADGE: Record<string, string> = {
  low: "text-gray-500",
  medium: "text-blue-400",
  high: "text-orange-400",
  critical: "text-red-400 font-semibold",
};

const TASK_TYPE_ICON: Record<string, React.ReactNode> = {
  autocode: <Code2 size={13} />,
  report: <Database size={13} />,
  alert: <AlertTriangle size={13} />,
  settings: <Settings2 size={13} />,
  data_sync: <Database size={13} />,
  custom: <Terminal size={13} />,
};

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/agent/status",
    description: "Verifica status de conexão e capacidades do agente",
  },
  {
    method: "GET",
    path: "/api/agent/data",
    description: "Acesso completo a todos os dados BI (KPIs, receita, clientes…)",
  },
  {
    method: "GET",
    path: "/api/agent/tasks",
    description: "Lista tarefas; filtre com ?status= e ?type=",
  },
  {
    method: "POST",
    path: "/api/agent/tasks",
    description: "Cria nova tarefa na fila de execução",
  },
  {
    method: "PATCH",
    path: "/api/agent/tasks",
    description: "Atualiza status/resultado de uma tarefa existente",
  },
  {
    method: "GET",
    path: "/api/agent/settings",
    description: "Lê configurações do agente OpenClaw",
  },
  {
    method: "PUT",
    path: "/api/agent/settings",
    description: "Atualiza configurações do agente (autocode, monitoring, acesso)",
  },
  {
    method: "GET",
    path: "/api/agent/autocode",
    description: "Lista artefatos de código gerados automaticamente",
  },
  {
    method: "POST",
    path: "/api/agent/autocode",
    description: "Submete instrução de autocode ao agente",
  },
  {
    method: "PATCH",
    path: "/api/agent/autocode",
    description: "Marca artefato como aplicado à plataforma",
  },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400",
  POST: "bg-brand-500/10 text-brand-400",
  PUT: "bg-blue-500/10 text-blue-400",
  PATCH: "bg-orange-500/10 text-orange-400",
  DELETE: "bg-red-500/10 text-red-400",
};

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "autocode" | "api">(
    "tasks"
  );

  const runningTasks = taskStore.filter((t) => t.status === "running").length;
  const pendingTasks = taskStore.filter((t) => t.status === "pending").length;
  const completedTasks = taskStore.filter((t) => t.status === "completed").length;

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot size={20} className="text-brand-400" />
            OpenClaw Agent
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Agente autônomo com acesso full à BU JACQES — gestão 24/7
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Conectado</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Acesso",
            value: "Full",
            sub: "BU JACQES",
            icon: <ShieldCheck size={16} className="text-brand-400" />,
            color: "brand",
          },
          {
            label: "Em execução",
            value: runningTasks,
            sub: "tarefas ativas",
            icon: <Loader2 size={16} className="text-blue-400" />,
            color: "blue",
          },
          {
            label: "Pendentes",
            value: pendingTasks,
            sub: "na fila",
            icon: <Clock size={16} className="text-yellow-400" />,
            color: "yellow",
          },
          {
            label: "Concluídas",
            value: completedTasks,
            sub: "esta semana",
            icon: <CheckCircle2 size={16} className="text-emerald-400" />,
            color: "emerald",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-[11px] text-gray-600 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Capabilities */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          Capacidades ativas
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Leitura de dados", icon: <Database size={11} /> },
            { label: "Escrita de configurações", icon: <Settings2 size={11} /> },
            { label: "Execução de tarefas", icon: <Play size={11} /> },
            { label: "Autocode", icon: <Code2 size={11} /> },
            { label: "Gestão de relatórios", icon: <Zap size={11} /> },
            { label: "Controle de alertas", icon: <AlertTriangle size={11} /> },
            { label: "Gestão da plataforma", icon: <Terminal size={11} /> },
          ].map((cap) => (
            <span
              key={cap.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[11px]"
            >
              {cap.icon}
              {cap.label}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 flex gap-1">
        {(["tasks", "autocode", "api"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            )}
          >
            {tab === "tasks" && "Tarefas"}
            {tab === "autocode" && "Autocode"}
            {tab === "api" && "API Reference"}
          </button>
        ))}
      </div>

      {/* Tab: Tasks */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          {taskStore.map((task) => (
            <div
              key={task.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-4"
            >
              <div className="mt-0.5">{STATUS_ICON[task.status]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">
                    {task.title}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border",
                      STATUS_BADGE[task.status]
                    )}
                  >
                    {task.status}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-widest",
                      PRIORITY_BADGE[task.priority]
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                {task.result && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <ChevronRight size={11} />
                    {task.result}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <span className="flex items-center gap-1 text-[10px] text-gray-600">
                  {TASK_TYPE_ICON[task.type]}
                  {task.type}
                </span>
                <div className="text-[10px] text-gray-700 mt-1">
                  {task.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Autocode */}
      {activeTab === "autocode" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Autocode{" "}
              <span
                className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-xs border",
                  agentSettings.autocode.enabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                )}
              >
                {agentSettings.autocode.enabled ? "ativo" : "desativado"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                Auto-apply:{" "}
                <span className={agentSettings.autocode.autoApply ? "text-emerald-400" : "text-gray-600"}>
                  {agentSettings.autocode.autoApply ? "on" : "off"}
                </span>
              </span>
              <span>
                Aprovação:{" "}
                <span className={agentSettings.autocode.approvalRequired ? "text-yellow-400" : "text-gray-600"}>
                  {agentSettings.autocode.approvalRequired ? "obrigatória" : "não"}
                </span>
              </span>
            </div>
          </div>

          {autocodeStore.map((artifact) => (
            <div
              key={artifact.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-brand-400" />
                  <span className="text-sm font-medium text-white">
                    {artifact.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 font-mono">
                    {artifact.language}
                  </span>
                  {artifact.appliedAt ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <CheckCircle2 size={10} /> aplicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-yellow-500">
                      <Clock size={10} /> pendente
                    </span>
                  )}
                </div>
              </div>
              <pre className="px-4 py-3 text-xs text-gray-300 overflow-x-auto font-mono bg-gray-950 leading-relaxed">
                {artifact.code}
              </pre>
              <div className="px-4 py-2 border-t border-gray-800 flex justify-between text-[10px] text-gray-600">
                <span>Gerado: {new Date(artifact.generatedAt).toLocaleString("pt-BR")}</span>
                <span>{artifact.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: API Reference */}
      {activeTab === "api" && (
        <div className="space-y-3">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-xs text-yellow-400">
            Todos os endpoints exigem{" "}
            <code className="bg-gray-800 px-1 rounded">
              Authorization: Bearer &lt;OPENCLAW_API_KEY&gt;
            </code>
          </div>

          {API_ENDPOINTS.map((ep) => (
            <div
              key={ep.method + ep.path}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-4"
            >
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded font-mono w-12 text-center flex-shrink-0",
                  METHOD_COLOR[ep.method]
                )}
              >
                {ep.method}
              </span>
              <code className="text-xs text-gray-300 font-mono flex-shrink-0">
                {ep.path}
              </code>
              <span className="text-xs text-gray-500 flex-1">{ep.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
