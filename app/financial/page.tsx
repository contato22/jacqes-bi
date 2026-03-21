import { Database, ArrowRight, Info } from "lucide-react";

const plStructure = [
  { label: "Receita Bruta", indent: false, positive: true },
  { label: "CMV (Custo das Mercadorias Vendidas)", indent: true, positive: false },
  { label: "Lucro Bruto", indent: false, positive: true, divider: true },
  { label: "Despesas Operacionais", indent: true, positive: false },
  { label: "EBITDA", indent: false, positive: true, divider: true },
  { label: "Depreciação / Amortização", indent: true, positive: false },
  { label: "Resultado Líquido", indent: false, positive: true, divider: true, bold: true },
];

export default function FinancialPage() {
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Mini P&L · JACQES BU</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          JACQES ERP Financeiro · Estrutura pronta, aguardando lançamentos
        </p>
      </div>

      {/* Empty state callout */}
      <div className="card p-5 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <Info size={16} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-yellow-300 mb-1">
              Databases configurados — sem registros ainda
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              O ERP Financeiro da JACQES BU está estruturado no Notion com as databases de
              Contas a Receber e Contas a Pagar, mas ainda não possui lançamentos. Os dados
              aparecerão aqui assim que os primeiros registros forem adicionados.
            </p>
          </div>
        </div>
      </div>

      {/* How to fill */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={15} className="text-brand-400" />
          <h2 className="text-sm font-semibold text-white">Como preencher</h2>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-500/5 border border-brand-500/20">
          <div className="text-xs text-gray-300 flex-1">
            Acesse <span className="font-semibold text-brand-300">JACQES ERP Financeiro</span> no
            Notion e adicione registros nas databases{" "}
            <span className="font-medium text-white">Contas a Receber</span> e{" "}
            <span className="font-medium text-white">Contas a Pagar</span>.
          </div>
          <ArrowRight size={14} className="text-brand-400 shrink-0" />
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Página Notion: <span className="font-mono text-gray-500">326e9381f1758116aac7d99ee5847315</span>
        </p>
      </div>

      {/* P&L Structure Template */}
      <div className="card p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white">Estrutura do P&L</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Template — valores serão preenchidos quando os dados estiverem disponíveis
          </p>
        </div>

        <div className="space-y-0 divide-y divide-gray-800">
          {plStructure.map((row) => (
            <div
              key={row.label}
              className={`flex items-center justify-between py-2.5 ${
                row.divider ? "border-t border-gray-700 mt-1 pt-3" : ""
              }`}
            >
              <span
                className={`text-sm ${
                  row.bold
                    ? "font-bold text-white"
                    : row.indent
                    ? "text-gray-500 pl-4"
                    : "text-gray-300"
                }`}
              >
                {row.label}
              </span>
              <span
                className={`text-sm tabular-nums font-medium ${
                  row.bold
                    ? "font-bold text-gray-400"
                    : row.positive
                    ? "text-gray-500"
                    : "text-gray-600"
                }`}
              >
                —
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-800 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          <span className="text-xs text-gray-600">
            Dados serão atualizados automaticamente via Notion assim que disponíveis
          </span>
        </div>
      </div>

    </div>
  );
}
