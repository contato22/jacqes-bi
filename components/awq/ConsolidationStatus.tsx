"use client";

import { CheckCircle2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ConsolidationMeta } from "@/lib/types/canonical";
import { cn } from "@/lib/utils";

interface Props {
  meta: ConsolidationMeta;
}

const BU_LABELS: Record<string, string> = {
  jacqes: "JACQES",
  "caza-vision": "Caza Vision",
  "awq-venture": "AWQ Venture",
  "awq-holding": "AWQ Holding",
};

export default function ConsolidationStatus({ meta }: Props) {
  const [expanded, setExpanded] = useState(false);

  const failedSources = meta.sources.filter((s) => s.status === "failed");
  const partialSources = meta.sources.filter((s) => s.status === "partial");
  const successSources = meta.sources.filter((s) => s.status === "success");

  const overallStatus =
    failedSources.length === meta.sources.length
      ? "error"
      : failedSources.length > 0 || partialSources.length > 0
      ? "warning"
      : "success";

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        overallStatus === "success"
          ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
          : overallStatus === "warning"
          ? "bg-amber-950/30 border-amber-800/40 text-amber-300"
          : "bg-red-950/30 border-red-800/40 text-red-300"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {overallStatus === "success" && <CheckCircle2 size={14} />}
          {overallStatus === "warning" && <AlertTriangle size={14} />}
          {overallStatus === "error" && <XCircle size={14} />}
          <span className="font-semibold">
            {overallStatus === "success" && "Consolidação completa"}
            {overallStatus === "warning" && meta.partialData
              ? "Dados parciais — algumas fontes falharam"
              : "Conflitos detectados"}
            {overallStatus === "error" && "Todas as fontes falharam"}
          </span>
          <span className="text-xs opacity-60">
            {new Date(meta.consolidatedAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-3">
          <StatPill label="Registros" value={meta.stats.totalOutputRecords} />
          {meta.stats.dedupedCount > 0 && (
            <StatPill label="Dedup" value={meta.stats.dedupedCount} variant="amber" />
          )}
          {meta.stats.reconciledCount > 0 && (
            <StatPill label="Reconciliados" value={meta.stats.reconciledCount} variant="blue" />
          )}
          {meta.stats.conflictCount > 0 && (
            <StatPill label="Conflitos" value={meta.stats.conflictCount} variant="red" />
          )}

          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-current/20 space-y-2">
          {/* Source breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {meta.sources.map((source) => (
              <SourceRow key={`${source.buId}-${source.sourceSystem}`} source={source} />
            ))}
          </div>

          {/* Warnings */}
          {meta.warnings.length > 0 && (
            <div className="mt-2 space-y-1">
              {meta.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs opacity-80">
                  <Info size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-xs opacity-70 pt-1">
            <span>Input: {meta.stats.totalInputRecords}</span>
            <span>Output: {meta.stats.totalOutputRecords}</span>
            <span>Deduped: {meta.stats.dedupedCount}</span>
            <span>Reconciliados: {meta.stats.reconciledCount}</span>
            <span>Conflitos: {meta.stats.conflictCount}</span>
            <span>Fontes com falha: {meta.stats.failedSourceCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "amber" | "blue" | "red";
}) {
  if (value === 0) return null;
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium",
        variant === "default" && "bg-white/10",
        variant === "amber" && "bg-amber-500/20 text-amber-200",
        variant === "blue" && "bg-blue-500/20 text-blue-200",
        variant === "red" && "bg-red-500/20 text-red-200"
      )}
    >
      {value} {label}
    </span>
  );
}

function SourceRow({ source }: { source: ConsolidationMeta["sources"][0] }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {source.status === "success" && <CheckCircle2 size={11} className="text-emerald-400" />}
      {source.status === "partial" && <AlertTriangle size={11} className="text-amber-400" />}
      {source.status === "failed" && <XCircle size={11} className="text-red-400" />}
      <span className="font-medium">{BU_LABELS[source.buId] ?? source.buId}</span>
      <span className="opacity-50">({source.sourceSystem})</span>
      <span className="opacity-60">{source.recordCount} reg.</span>
      {source.error && (
        <span className="text-red-300 truncate max-w-[120px]" title={source.error}>
          — {source.error}
        </span>
      )}
    </div>
  );
}
