"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Bot,
  X,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Code2,
  Database,
  Terminal,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetTask {
  id: string;
  title: string;
  type: string;
  status: "pending" | "running" | "completed" | "failed";
  priority: string;
  updatedAt: string;
}

interface WidgetData {
  connected: boolean;
  bu: string;
  runningCount: number;
  pendingCount: number;
  recentTasks: WidgetTask[];
  checkedAt: string;
}

const POLL_INTERVAL = 10_000; // 10s

const TYPE_ICON: Record<string, React.ReactNode> = {
  autocode: <Code2 size={11} />,
  report: <Database size={11} />,
  alert: <AlertTriangle size={11} />,
  settings: <Settings2 size={11} />,
  data_sync: <Database size={11} />,
  custom: <Terminal size={11} />,
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-yellow-500",
  running: "bg-brand-400 animate-pulse",
  completed: "bg-emerald-500",
  failed: "bg-red-500",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock size={11} className="text-yellow-500" />,
  running: <Loader2 size={11} className="text-brand-400 animate-spin" />,
  completed: <CheckCircle2 size={11} className="text-emerald-500" />,
  failed: <X size={11} className="text-red-500" />,
};

// Simulate an agent message feed
const AGENT_MESSAGES = [
  "Monitorando clientes em risco…",
  "12 enterprise accounts em observação",
  "Aguardando instrução de autocode APAC",
  "Health check concluído — sistema estável",
  "Dados sincronizados com AWQ Group",
];

export default function OpenClawNotification() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<WidgetData | null>(null);
  const [messageIdx, setMessageIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const fetchWidget = useCallback(async () => {
    try {
      const res = await fetch("/api/agent/widget");
      if (res.ok) setData(await res.json());
    } catch {
      // silently ignore — widget is non-critical
    }
  }, []);

  useEffect(() => {
    fetchWidget();
    const poll = setInterval(fetchWidget, POLL_INTERVAL);
    return () => clearInterval(poll);
  }, [fetchWidget]);

  // Rotate agent message every 4s
  useEffect(() => {
    const t = setInterval(() => {
      setMessageIdx((i) => (i + 1) % AGENT_MESSAGES.length);
    }, 4_000);
    return () => clearInterval(t);
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Expanded panel */}
      {open && (
        <div className="w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-brand-400" />
              <span className="text-xs font-semibold text-white">
                OpenClaw Agent
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-gray-300 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {/* Live message ticker */}
          <div className="px-4 py-2.5 bg-brand-500/5 border-b border-gray-800 flex items-center gap-2">
            <Loader2 size={11} className="text-brand-400 animate-spin flex-shrink-0" />
            <span className="text-[11px] text-gray-400 truncate transition-all duration-500">
              {AGENT_MESSAGES[messageIdx]}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-px bg-gray-800 border-b border-gray-800">
            <div className="bg-gray-900 px-4 py-2.5 text-center">
              <div className="text-base font-bold text-brand-400">
                {data?.runningCount ?? "—"}
              </div>
              <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                Executando
              </div>
            </div>
            <div className="bg-gray-900 px-4 py-2.5 text-center">
              <div className="text-base font-bold text-yellow-400">
                {data?.pendingCount ?? "—"}
              </div>
              <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                Na fila
              </div>
            </div>
          </div>

          {/* Recent tasks */}
          <div className="px-4 py-3 space-y-2.5">
            <div className="text-[9px] text-gray-600 uppercase tracking-widest">
              Atividade recente
            </div>
            {data?.recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0", STATUS_DOT[task.status])} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-300 truncate leading-tight">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-gray-600">{TYPE_ICON[task.type]}</span>
                    <span className="text-[9px] text-gray-600">{task.type}</span>
                    <span className="text-gray-700">·</span>
                    {STATUS_ICON[task.status]}
                    <span className="text-[9px] text-gray-600">{task.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-800 flex items-center justify-between">
            <span className="text-[9px] text-gray-700">
              {data
                ? `Atualizado ${new Date(data.checkedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : "Conectando…"}
            </span>
            <Link
              href="/agent"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-[10px] text-brand-400 hover:text-brand-300 transition-colors"
            >
              Ver painel
              <ChevronRight size={10} />
            </Link>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div className="flex items-center gap-2">
        {/* Dismiss */}
        {!open && (
          <button
            onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Fechar"
          >
            <X size={10} />
          </button>
        )}

        {/* Main toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 pl-3 pr-3.5 h-9 rounded-full border shadow-lg transition-all duration-200",
            open
              ? "bg-brand-600 border-brand-500 text-white shadow-brand-900/40"
              : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white shadow-black/40"
          )}
        >
          <span className="relative flex-shrink-0">
            <Bot size={15} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-gray-900 animate-pulse" />
          </span>
          <span className="text-xs font-medium">OpenClaw</span>
          {!open && data && data.runningCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-500 text-[9px] font-bold text-white">
              {data.runningCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
