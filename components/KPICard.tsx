import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  MapPin,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { KPI } from "@/lib/data";
import { cn, formatNumber } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  MapPin,
  AlertCircle,
  TrendingUp,
  TrendingDown,
};

const colorMap: Record<string, string> = {
  brand: "text-brand-400 bg-brand-500/10 border-brand-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
};

function formatValue(kpi: KPI): string {
  if (kpi.unit === "percent") return `${kpi.value.toFixed(1)}%`;
  return formatNumber(kpi.value) + (kpi.suffix ?? "");
}

interface KPICardProps {
  kpi: KPI;
}

export default function KPICard({ kpi }: KPICardProps) {
  const Icon = iconMap[kpi.icon] ?? TrendingUp;
  const delta =
    kpi.previousValue !== 0
      ? ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100
      : 0;
  const isPositive = kpi.lowerIsBetter ? delta <= 0 : delta >= 0;
  const colorClasses = colorMap[kpi.color] ?? colorMap.brand;
  const diff = kpi.value - kpi.previousValue;

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center",
            colorClasses
          )}
        >
          <Icon size={18} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            isPositive
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-red-400 bg-red-500/10"
          )}
        >
          {isPositive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {Math.abs(delta).toFixed(1)}%
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-white tabular-nums">
          {formatValue(kpi)}
        </div>
        <div className="text-sm text-gray-500">{kpi.label}</div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <span className="text-xs text-gray-600">
          {kpi.comparisonLabel ?? "vs prev period"}:{" "}
          <span
            className={cn(
              "font-medium",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {diff >= 0 ? "+" : ""}
            {kpi.unit === "percent"
              ? `${diff.toFixed(1)}pp`
              : formatNumber(diff)}
          </span>
        </span>
      </div>
    </div>
  );
}
