import { contasData } from "@/lib/data";

const saudeConfig = {
  Saudável: { label: "Saudável", classes: "badge-green" },
  "Estável com Atenção": { label: "Estável", classes: "badge-yellow" },
  Sensível: { label: "Sensível", classes: "badge-red" },
  "Em Risco": { label: "Em Risco", classes: "badge-red" },
};

const riscoConfig = {
  Baixo: { label: "Baixo", classes: "badge-green" },
  Médio: { label: "Médio", classes: "badge-yellow" },
  Alto: { label: "Alto", classes: "badge-red" },
};

const oportunidadeConfig = {
  "Sem Oportunidade": { label: "—", classes: "badge-blue" },
  Leve: { label: "Leve", classes: "badge-blue" },
  Média: { label: "Média", classes: "badge-yellow" },
  Forte: { label: "Forte", classes: "badge-green" },
};

export default function ContasTable() {
  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Contas & Carteira</h2>
          <p className="text-xs text-gray-500 mt-0.5">Saúde, risco e oportunidade por conta</p>
        </div>
      </div>

      {/* ── Desktop table ─────────────────────────────────────────────────────── */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 px-3 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-800">
          <span>Conta</span>
          <span className="text-right">Saúde</span>
          <span className="text-right">Risco</span>
          <span className="text-right">Oportun.</span>
          <span className="text-right">Pend.</span>
        </div>

        {contasData.map((conta, idx) => {
          const saude       = saudeConfig[conta.saude];
          const risco       = riscoConfig[conta.risco];
          const oportunidade = oportunidadeConfig[conta.oportunidade];
          return (
            <div
              key={conta.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 px-3 py-3 items-center hover:bg-gray-800/50 rounded-lg transition-colors cursor-default"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">{conta.nome}</div>
                  <div className="text-xs text-gray-600">{conta.segmento}</div>
                </div>
              </div>
              <div className="flex justify-end"><span className={`badge text-[10px] ${saude.classes}`}>{saude.label}</span></div>
              <div className="flex justify-end"><span className={`badge text-[10px] ${risco.classes}`}>{risco.label}</span></div>
              <div className="flex justify-end"><span className={`badge text-[10px] ${oportunidade.classes}`}>{oportunidade.label}</span></div>
              <div className={`text-sm font-semibold text-right tabular-nums ${conta.pendencias >= 4 ? "text-red-400" : conta.pendencias >= 2 ? "text-yellow-400" : "text-emerald-400"}`}>
                {conta.pendencias}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile cards ──────────────────────────────────────────────────────── */}
      <div className="sm:hidden space-y-2">
        {contasData.map((conta, idx) => {
          const saude       = saudeConfig[conta.saude];
          const risco       = riscoConfig[conta.risco];
          const oportunidade = oportunidadeConfig[conta.oportunidade];
          return (
            <div key={conta.id} className="flex flex-col gap-2 px-3 py-3 rounded-lg bg-gray-800/40 border border-gray-800">
              {/* Row 1: name + pending count */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-200 truncate">{conta.nome}</div>
                    <div className="text-[10px] text-gray-600">{conta.segmento}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold tabular-nums shrink-0 ${conta.pendencias >= 4 ? "text-red-400" : conta.pendencias >= 2 ? "text-yellow-400" : "text-emerald-400"}`}>
                  {conta.pendencias} pend.
                </div>
              </div>
              {/* Row 2: badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`badge text-[10px] ${saude.classes}`}>{saude.label}</span>
                <span className={`badge text-[10px] ${risco.classes}`}>Risco {risco.label}</span>
                <span className={`badge text-[10px] ${oportunidade.classes}`}>Oport. {oportunidade.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
