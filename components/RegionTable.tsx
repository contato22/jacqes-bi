import { regionData } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const sectorEmoji: Record<string, string> = {
  "Bebidas & Alimentos": "🍺",
  "Tecnologia": "💻",
  "Beleza & Lifestyle": "✨",
  "Varejo": "🛍️",
  "Finanças": "💰",
};

const maxRevenue = Math.max(...regionData.map((r) => r.revenue));

export default function RegionTable() {
  return (
    <div className="card p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">Performance por Setor</h2>
        <p className="text-xs text-gray-500 mt-0.5">Receita Q1 2026 por setor de atuação</p>
      </div>

      <div className="space-y-3">
        {regionData.map((region) => {
          const pct = (region.revenue / maxRevenue) * 100;
          const isNegative = region.growth < 0;
          return (
            <div key={region.region} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>{sectorEmoji[region.region] ?? "📊"}</span>
                  <span className="font-medium">{region.region}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-right">
                  <span className="text-gray-400 tabular-nums">
                    {formatNumber(region.customers)} {region.customers === 1 ? "cliente" : "clientes"}
                  </span>
                  <span className="font-semibold text-white tabular-nums w-16">
                    {formatCurrency(region.revenue, "BRL", true)}
                  </span>
                  <div className={`flex items-center gap-1 w-12 justify-end ${isNegative ? "text-red-400" : "text-emerald-400"}`}>
                    {isNegative ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                    <span className="font-semibold">{Math.abs(region.growth)}%</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
