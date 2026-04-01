import { regionData } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

const sectorEmoji: Record<string, string> = {
  "Bebidas & Alimentos": "🍺",
  "Tecnologia":          "💻",
  "Beleza & Lifestyle":  "✨",
  "Varejo":              "🛍️",
  "Finanças":            "💰",
};

const maxRevenue = Math.max(...regionData.map((r) => r.revenue));

export default function RegionTable() {
  return (
    <div className="card p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">Receita por Setor — Q1 2026</h2>
        <p className="text-xs text-gray-500 mt-0.5">MRR × 3 meses, derivado dos dados de clientes AWQ</p>
      </div>

      <div className="space-y-3">
        {regionData.map((sector) => {
          const pct = (sector.revenue / maxRevenue) * 100;
          return (
            <div key={sector.region} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>{sectorEmoji[sector.region] ?? "📊"}</span>
                  <span className="font-medium">{sector.region}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-right">
                  <span className="text-gray-400 tabular-nums">
                    {formatNumber(sector.customers)} {sector.customers === 1 ? "cliente" : "clientes"}
                  </span>
                  <span className="font-semibold text-white tabular-nums w-16">
                    {formatCurrency(sector.revenue, "BRL", true)}
                  </span>
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
