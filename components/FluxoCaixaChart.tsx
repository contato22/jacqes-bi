"use client";

import { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { fluxoCaixaMensal, fluxoCaixaSemanal, type FluxoCaixaEntry } from "@/lib/data";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  if (v === 0) return "R$ 0";
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1).replace(".", ",")}k`;
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

function fmtFull(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── custom tooltip ───────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const map: Record<string, { label: string; sign: number }> = {
    entradasPrev: { label: "Entradas previstas",  sign: 1  },
    entradasReal: { label: "Entradas realizadas", sign: 1  },
    saidasPrev:   { label: "Saídas previstas",    sign: -1 },
    saidasReal:   { label: "Saídas realizadas",   sign: -1 },
    saldoPrev:    { label: "Saldo previsto",       sign: 1  },
    saldoReal:    { label: "Saldo realizado",      sign: 1  },
  };

  // separate bars and lines
  const bars  = payload.filter((p) => ["entradasPrev","entradasReal","saidasPrev","saidasReal"].includes(p.dataKey));
  const lines = payload.filter((p) => ["saldoPrev","saldoReal"].includes(p.dataKey));

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl shadow-black/50 text-xs min-w-[200px]">
      <div className="text-gray-400 font-semibold mb-2">{label}</div>
      {bars.map((p) => {
        const cfg = map[p.dataKey];
        if (!cfg || p.value === 0) return null;
        return (
          <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
            <span style={{ color: p.color }}>{cfg.label}</span>
            <span className="font-semibold text-white tabular-nums">{fmtFull(Math.abs(p.value))}</span>
          </div>
        );
      })}
      {lines.length > 0 && <div className="border-t border-gray-800 my-2" />}
      {lines.map((p) => {
        const cfg = map[p.dataKey];
        if (!cfg || p.value === 0) return null;
        return (
          <div key={p.dataKey} className="flex justify-between gap-4">
            <span style={{ color: p.color }}>{cfg.label}</span>
            <span className={`font-bold tabular-nums ${p.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {fmtFull(p.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── derived dataset ──────────────────────────────────────────────────────────

function buildChartData(entries: FluxoCaixaEntry[]) {
  return entries.map((e) => ({
    ...e,
    saldoPrev: e.entradasPrev - e.saidasPrev,
    saldoReal: e.entradasReal > 0 ? e.entradasReal - e.saidasReal : null,
  }));
}

// ─── component ────────────────────────────────────────────────────────────────

type Granularidade = "semanal" | "mensal";

export default function FluxoCaixaChart() {
  const [gran, setGran] = useState<Granularidade>("mensal");

  const raw   = gran === "mensal" ? fluxoCaixaMensal : fluxoCaixaSemanal;
  const data  = buildChartData(raw);

  const totalEntradasReal = raw.reduce((s, e) => s + e.entradasReal, 0);
  const totalSaidasReal   = raw.reduce((s, e) => s + e.saidasReal,   0);
  const saldoAtual        = totalEntradasReal - totalSaidasReal;

  const totalEntradasPrev = raw.reduce((s, e) => s + e.entradasPrev, 0);
  const totalSaidasPrev   = raw.reduce((s, e) => s + e.saidasPrev,   0);
  const saldoPrevTotal    = totalEntradasPrev - totalSaidasPrev;

  return (
    <div className="card p-6">
      {/* ── header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Fluxo de Caixa · Previsto × Realizado</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {gran === "mensal" ? "Jan–Jun 2026 · barras = volumes · linhas = saldo" : "Março 2026 · visão semanal"}
          </p>
        </div>

        {/* granularidade selector */}
        <div className="flex items-center bg-gray-800 rounded-lg p-0.5 gap-0.5 self-start shrink-0">
          {(["semanal", "mensal"] as Granularidade[]).map((g) => (
            <button
              key={g}
              onClick={() => setGran(g)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                gran === g
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Entradas realizadas",
            value: fmt(totalEntradasReal),
            prev: fmt(totalEntradasPrev),
            color: "text-emerald-400",
          },
          {
            label: "Saídas realizadas",
            value: fmt(totalSaidasReal),
            prev: fmt(totalSaidasPrev),
            color: "text-red-400",
          },
          {
            label: "Saldo atual",
            value: fmt(saldoAtual),
            prev: fmt(saldoPrevTotal),
            color: saldoAtual >= 0 ? "text-blue-400" : "text-red-400",
          },
        ].map((k) => (
          <div key={k.label} className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/40">
            <div className={`text-base font-bold tabular-nums ${k.color}`}>{k.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{k.label}</div>
            <div className="text-[10px] text-gray-700 mt-1">prev: {k.prev}</div>
          </div>
        ))}
      </div>

      {/* ── chart ── */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} barGap={2} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="periodo"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="bars"
            tickFormatter={fmt}
            tick={{ fill: "#4b5563", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <YAxis
            yAxisId="saldo"
            orientation="right"
            tickFormatter={fmt}
            tick={{ fill: "#4b5563", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine yAxisId="bars" y={0} stroke="#374151" />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 16 }}
            formatter={(value) => (
              <span style={{ color: "#9ca3af" }}>{value}</span>
            )}
          />

          {/* entradas */}
          <Bar yAxisId="bars" dataKey="entradasPrev" name="Entradas previstas"  fill="#064e3b" opacity={0.7} radius={[3,3,0,0]} />
          <Bar yAxisId="bars" dataKey="entradasReal" name="Entradas realizadas" fill="#10b981" opacity={0.9} radius={[3,3,0,0]} />

          {/* saídas */}
          <Bar yAxisId="bars" dataKey="saidasPrev"   name="Saídas previstas"    fill="#450a0a" opacity={0.7} radius={[3,3,0,0]} />
          <Bar yAxisId="bars" dataKey="saidasReal"   name="Saídas realizadas"   fill="#ef4444" opacity={0.9} radius={[3,3,0,0]} />

          {/* saldo lines */}
          <Line
            yAxisId="saldo"
            type="monotone"
            dataKey="saldoPrev"
            name="Saldo previsto"
            stroke="#6b7280"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          <Line
            yAxisId="saldo"
            type="monotone"
            dataKey="saldoReal"
            name="Saldo realizado"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ r: 3, fill: "#60a5fa", strokeWidth: 0 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* ── legenda de cores ── */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-emerald-900 inline-block" />Entradas prev.</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-emerald-500 inline-block" />Entradas real.</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-red-950 inline-block" />Saídas prev.</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-red-500 inline-block" />Saídas real.</span>
        <span className="flex items-center gap-1.5"><span className="w-6 border-t border-dashed border-gray-500 inline-block" />Saldo previsto</span>
        <span className="flex items-center gap-1.5"><span className="w-6 border-t-2 border-blue-400 inline-block" />Saldo realizado</span>
      </div>
    </div>
  );
}
