import { scoreDimensions, scoreMensal } from "@/lib/data";
import { dimensionColors, getScoreThreshold } from "@/lib/colors";

function getCurrentThreshold(score: number) {
  return getScoreThreshold(score);
}

export default function ScoreDimensionsPanel() {
  const current = getCurrentThreshold(scoreMensal.scoreTotal);

  return (
    <div className="card p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">Score por Dimensão</h2>
        <p className="text-xs text-gray-500 mt-0.5">Progresso de cada eixo — máx. 20 pts</p>
      </div>

      {/* Total score banner */}
      <div className="mb-5 p-4 rounded-xl bg-gray-800/60 border border-gray-700 flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-white tabular-nums">
            {scoreMensal.scoreTotal}
            <span className="text-base text-gray-500 font-normal"> / 100</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${current.color}`}>
            {current.label}
          </div>
        </div>
        <div className="text-right text-xs text-gray-600 space-y-0.5">
          <div>Fase: <span className="text-gray-400">{scoreMensal.fase}</span></div>
          <div>Status: <span className="text-gray-400">{scoreMensal.status}</span></div>
          <div className={scoreMensal.variavelPaga ? "text-emerald-400" : "text-red-400"}>
            Variável: {scoreMensal.variavelPaga ? "✓ Paga" : "✗ Não paga"}
          </div>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {scoreDimensions.map((dim) => {
          const pct = (dim.score / dim.max) * 100;
          const color = dimensionColors[dim.dimensao] ?? "#6366f1";
          return (
            <div key={dim.dimensao} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">
                  {dim.dimensao}
                </span>
                <span className="text-xs tabular-nums text-gray-400">
                  <span className="font-semibold text-white">{dim.score}</span>
                  {" / "}
                  {dim.max}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
