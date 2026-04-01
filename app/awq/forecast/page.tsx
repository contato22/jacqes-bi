import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { awqStore } from "@/lib/awq/mockData";

export default function AWQForecastPage() {
  const forecasts = awqStore.forecasts;
  const totalRevForecast = forecasts.reduce((s, f) => s + f.revenue_forecast, 0);
  const totalExpForecast = forecasts.reduce((s, f) => s + f.expense_forecast, 0);
  const totalProfitForecast = totalRevForecast - totalExpForecast;

  const confidenceStyles = {
    high: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <>
      <Header title="Forecast" subtitle="AWQ Group · Revenue & Expense Forecast" />

      <div className="px-8 py-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {[
            { label: "Total Forecast Revenue", value: formatCurrency(totalRevForecast), color: "text-emerald-400" },
            { label: "Total Forecast Expenses", value: formatCurrency(totalExpForecast), color: "text-red-400" },
            { label: "Total Profit Forecast", value: formatCurrency(totalProfitForecast), color: "text-brand-400" },
          ].map((m) => (
            <div key={m.label} className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
              <p className={cn("text-2xl font-bold tabular-nums mt-1", m.color)}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Forecast Table */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Forecast by BU</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["BU", "Period", "Revenue Forecast", "Expense Forecast", "Profit Forecast", "Margin", "Confidence"].map((h) => (
                    <th key={h} className="text-left pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forecasts.map((f) => {
                  const profit = f.revenue_forecast - f.expense_forecast;
                  const margin = f.revenue_forecast > 0 ? (profit / f.revenue_forecast) * 100 : 0;
                  return (
                    <tr key={f.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3 pr-4 text-white font-medium capitalize">{f.business_unit_id}</td>
                      <td className="py-3 pr-4 text-gray-400 tabular-nums font-mono text-xs">{f.period}</td>
                      <td className="py-3 pr-4 text-emerald-400 tabular-nums">{formatCurrency(f.revenue_forecast)}</td>
                      <td className="py-3 pr-4 text-red-400 tabular-nums">{formatCurrency(f.expense_forecast)}</td>
                      <td className="py-3 pr-4 text-brand-400 tabular-nums font-semibold">{formatCurrency(profit)}</td>
                      <td className="py-3 pr-4 text-gray-300 tabular-nums">{margin.toFixed(1)}%</td>
                      <td className="py-3">
                        <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium border", confidenceStyles[f.confidence])}>
                          {f.confidence}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-800/40">
                  <td className="py-3 pr-4 text-white font-semibold" colSpan={2}>Group Total</td>
                  <td className="py-3 pr-4 text-emerald-400 font-semibold tabular-nums">{formatCurrency(totalRevForecast)}</td>
                  <td className="py-3 pr-4 text-red-400 font-semibold tabular-nums">{formatCurrency(totalExpForecast)}</td>
                  <td className="py-3 pr-4 text-brand-400 font-semibold tabular-nums">{formatCurrency(totalProfitForecast)}</td>
                  <td className="py-3 pr-4 text-gray-300 tabular-nums">
                    {((totalProfitForecast / totalRevForecast) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
