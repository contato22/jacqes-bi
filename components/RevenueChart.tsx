"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { scoreDimensions, scoreMensal } from "@/lib/data";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const score = payload.find((p) => p.name === "score")?.value ?? 0;
  const max = 20;
  const pct = ((score / max) * 100).toFixed(0);
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 shadow-xl shadow-black/40 min-w-[140px]">
      <div className="text-xs font-semibold text-gray-400 mb-2">{label}</div>
      <div className="text-sm font-bold text-white">
        {score} / {max} pts
      </div>
      <div className="text-xs text-gray-500 mt-1">{pct}% atingido</div>
    </div>
  );
}

const dimensionColors: Record<string, string> = {
  Atendimento: "#6366f1",
  "Operação": "#22d3ee",
  Visitas: "#22c55e",
  Risco: "#f59e0b",
  Processo: "#ec4899",
};

export default function ScoreChart() {
  const chartData = scoreDimensions.map((d) => ({
    dimensao: d.dimensao,
    score: d.score,
    remaining: d.max - d.score,
  }));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-white">Score por Dimensão</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Março 2026 — 5 dimensões × 20 pts cada
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
          <span className="text-xl font-bold text-white tabular-nums">
            {scoreMensal.scoreTotal}
          </span>
          <span className="text-xs text-gray-500">/ 100</span>
          <span className="text-sm ml-1">🟡</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />
          <XAxis
            dataKey="dimensao"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 20]}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar
            dataKey="score"
            name="score"
            radius={[3, 3, 0, 0]}
            stackId="a"
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.dimensao}
                fill={dimensionColors[entry.dimensao] ?? "#6366f1"}
              />
            ))}
          </Bar>
          <Bar
            dataKey="remaining"
            name="remaining"
            fill="#1f2937"
            radius={[3, 3, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
