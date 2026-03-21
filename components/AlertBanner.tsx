import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Alert } from "@/lib/data";
import { cn } from "@/lib/utils";

const alertConfig = {
  warning: {
    Icon: AlertTriangle,
    classes: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
    dot: "bg-yellow-400",
  },
  info: {
    Icon: Info,
    classes: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    dot: "bg-blue-400",
  },
  success: {
    Icon: CheckCircle,
    classes: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    dot: "bg-emerald-400",
  },
  error: {
    Icon: XCircle,
    classes: "border-red-500/30 bg-red-500/5 text-red-400",
    dot: "bg-red-400",
  },
};

const criticidadeConfig = {
  critico: { label: "Crítico", badge: "bg-red-500/20 text-red-400 border border-red-500/30" },
  atencao: { label: "Atenção", badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" },
  informativo: { label: "Informativo", badge: "bg-gray-500/20 text-gray-400 border border-gray-500/30" },
};

const statusConfig = {
  aberto: { dot: "bg-red-400", label: "Aberto" },
  em_andamento: { dot: "bg-yellow-400", label: "Em andamento" },
  resolvido: { dot: "bg-emerald-400", label: "Resolvido" },
};

interface AlertBannerProps {
  alert: Alert;
}

export default function AlertBanner({ alert }: AlertBannerProps) {
  const config = alertConfig[alert.type];
  const { Icon } = config;
  const crit = criticidadeConfig[alert.criticidade];
  const stat = statusConfig[alert.status];

  function formatPrazo(prazo?: string) {
    if (!prazo) return null;
    const [year, month, day] = prazo.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className={cn("flex items-start gap-3 p-3.5 rounded-lg border", config.classes)}>
      <Icon size={15} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold">{alert.title}</div>
          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0", crit.badge)}>
            {crit.label}
          </span>
        </div>
        <div className="text-xs opacity-75 mt-0.5 leading-relaxed">{alert.message}</div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] opacity-60">
            Owner: <span className="font-medium opacity-100">{alert.owner}</span>
          </span>
          {alert.prazo && (
            <>
              <span className="text-[10px] opacity-40">·</span>
              <span className="text-[10px] opacity-60">
                Prazo: <span className="font-medium opacity-100">{formatPrazo(alert.prazo)}</span>
              </span>
            </>
          )}
          <span className="text-[10px] opacity-40">·</span>
          <span className="flex items-center gap-1 text-[10px] opacity-60">
            <span className={cn("w-1.5 h-1.5 rounded-full inline-block", stat.dot)} />
            {stat.label}
          </span>
        </div>
      </div>
    </div>
  );
}
