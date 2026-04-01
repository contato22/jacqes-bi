import { topProducts } from "@/lib/data";

const statusConfig = {
  trending: { label: "Alta",     classes: "badge-green" },
  stable:   { label: "Estável",  classes: "badge-blue"  },
  declining:{ label: "Queda",    classes: "badge-red"   },
};

export default function TopProductsTable() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Serviços por Margem</h2>
          <p className="text-xs text-gray-500 mt-0.5">Margem bruta por tipo de serviço (fonte: AWQ)</p>
        </div>
      </div>

      <div className="space-y-0">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-3 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-800">
          <span>Serviço</span>
          <span className="text-right">Margem</span>
          <span className="text-right w-24">Barra</span>
          <span className="text-right">Status</span>
        </div>

        {topProducts.map((product, idx) => {
          const status = statusConfig[product.status];

          return (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-3 py-3 items-center hover:bg-gray-800/50 rounded-lg transition-colors cursor-default"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-600">{product.category}</div>
                </div>
              </div>

              <div className="text-sm font-semibold text-white text-right tabular-nums">
                {product.margin}%
              </div>

              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                  style={{ width: `${product.margin}%` }}
                />
              </div>

              <div className="flex justify-end">
                <span className={`badge text-[10px] ${status.classes}`}>
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
