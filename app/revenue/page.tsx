"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Header from "@/components/Header";
import { scoreMensal, scoreDimensions } from "@/lib/data";

const thresholdBands = [
  { range: "95–100", label: "Owner em Formação", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { range: "85–94", label: "Operador Sólido", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { range: "75–84", label: "Bom Nível", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { range: "60–74", label: "Operação Mínima", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { range: "0–59", label: "Abaixo do Esperado", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
];

const summaryStats = [
  {
    label: "Score Total",
    value: `${scoreMensal.scoreTotal} / 100`,
    sub: scoreMensal.status,
    highlight: true,
  },
  {
    label: "Visitas",
    value: `${scoreMensal.visitasRealizadas} / ${scoreMensal.visitasPrevistas}`,
    sub: `${Math.round((scoreMensal.visitasRealizadas / scoreMensal.visitasPrevistas) * 100)}% concluídas`,
    highlight: false,
  },
  {
    label: "Contas Acompanhadas",
    value: `${scoreMensal.contasSobAcompanhamento}`,
    sub: `mais saudável: ${scoreMensal.contaMaisSaudavel}`,
    highlight: false,
  },
  {
    label: "Variável",
    value: scoreMensal.variavelPaga ? "✓ Paga" : "✗ Não paga",
    sub: scoreMensal.variavelPaga ? "Threshold atingido" : "Score abaixo de 75 pts",
    highlight: false,
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl min-w-[130px]">
      <div className="text-xs font-semibold text-gray-400 mb-1">{label}</div>
      <div className="text-sm font-bold text-white">
        {payload[0].value} / 20 pts
      </div>
    </div>
  );
}

export default function DesempenhoPage() {
  const radarData = scoreDimensions.map((d) => ({
    dimensao: d.dimensao,
    score: d.score,
    fullMark: d.max,
  }));

  return (
    <>
      <Header
        title="Desempenho"
        subtitle="Score detalhado e evolução operacional — Março 2026"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="text-2xl font-bold text-white tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              <div className="text-xs font-medium mt-3 text-gray-500">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Radar chart + thresholds */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 card p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-white">
                Radar de Performance
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Cobertura por dimensão — máx. 20 pts por eixo
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis
                  dataKey="dimensao"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Threshold bands */}
          <div className="card p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-white">
                Faixas de Performance
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Modelo de score — 100 pts total
              </p>
            </div>
            <div className="space-y-2">
              {thresholdBands.map((band) => {
                const isActive =
                  scoreMensal.scoreTotal >= parseInt(band.range.split("–")[0]);
                const isCurrent =
                  band.label === (
                    scoreMensal.scoreTotal >= 95
                      ? "Owner em Formação"
                      : scoreMensal.scoreTotal >= 85
                      ? "Operador Sólido"
                      : scoreMensal.scoreTotal >= 75
                      ? "Bom Nível"
                      : scoreMensal.scoreTotal >= 60
                      ? "Operação Mínima"
                      : "Abaixo do Esperado"
                  );
                return (
                  <div
                    key={band.range}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCurrent
                        ? band.bg
                        : "bg-gray-800/30 border-gray-800"
                    }`}
                  >
                    <div>
                      <div
                        className={`text-xs font-semibold ${
                          isCurrent ? band.color : "text-gray-500"
                        }`}
                      >
                        {band.label}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] opacity-70">← atual</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs tabular-nums ${
                        isCurrent ? band.color : "text-gray-600"
                      }`}
                    >
                      {band.range}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Score dimension detail */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">
              Detalhamento por Dimensão
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Pontuação e progresso — cada dimensão vale 20 pts
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {scoreDimensions.map((d) => {
              const pct = (d.score / d.max) * 100;
              return (
                <div
                  key={d.dimensao}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-xs font-semibold text-white">
                    {d.score}
                    <span className="text-gray-600 font-normal">/{d.max}</span>
                  </div>
                  <div className="w-full h-20 bg-gray-800 rounded-md overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-md transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-600 text-center">
                    {d.dimensao}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Retrospectiva */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">
              Retrospectiva — Março 2026
            </h2>
            <div className="flex gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-emerald-400 shrink-0">✓</span>
              <div>
                <div className="text-xs font-semibold text-emerald-400 mb-0.5">
                  Principal Avanço
                </div>
                <div className="text-sm text-gray-300">
                  {scoreMensal.principalAvanco}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <span className="text-red-400 shrink-0">✗</span>
              <div>
                <div className="text-xs font-semibold text-red-400 mb-0.5">
                  Principal Falha
                </div>
                <div className="text-sm text-gray-300">
                  {scoreMensal.principalFalha}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-3">
              Foco do Próximo Mês
            </h2>
            <div className="text-sm text-gray-300 leading-relaxed">
              {scoreMensal.focoProximoMes}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <span className="text-xs text-gray-600">Fase atual:</span>
              <span className="badge badge-blue text-[10px]">
                {scoreMensal.fase}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
