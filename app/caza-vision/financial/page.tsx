// ─── CAZA VISION — Financial ───────────────────────────────────────────────────
// Lê diretamente do banco Caza Vision — Financeiro.
// Campos: Mês, Receita, Orçamento, Despesas, Lucro.

import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchFinanceiro } from '@/lib/caza-vision/fetcher'
import { formatBRL, formatMargin, marginColorClass } from '@/lib/caza-vision/utils'

export default async function FinancialPage() {
  const result = await fetchFinanceiro()
  const meses  = result.data

  const comReceita   = meses.filter((m) => m.receita > 0)
  const receitaTotal = meses.reduce((s, m) => s + m.receita,   0)
  const despTotal    = meses.reduce((s, m) => s + m.despesas,  0)
  const lucroTotal   = meses.reduce((s, m) => s + m.lucro,     0)
  const orcTotal     = meses.reduce((s, m) => s + m.orcamento, 0)

  const margens        = comReceita.filter((m) => m.margem !== null).map((m) => m.margem!)
  const margemGlobal   = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : null
  const margemMedia    = margens.length > 0 ? margens.reduce((a, b) => a + b, 0) / margens.length : null

  return (
    <>
      <Header title='Financial' subtitle='CAZA VISION · Resultado financeiro mensal' />
      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={result.status}
          fetchedAt={result.fetchedAt}
        />

        {meses.length > 0 && (
          <>
            {/* Summary row */}
            <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
              {[
                { label: 'Receita Total', value: formatBRL(receitaTotal, true), color: 'text-brand-400', accent: 'bg-brand-500/10 border border-brand-500/20' },
                { label: 'Orçamento Total', value: formatBRL(orcTotal, true), color: 'text-gray-300', accent: 'bg-gray-800 border border-gray-700' },
                { label: 'Despesas Totais', value: despTotal > 0 ? formatBRL(despTotal, true) : '—', color: 'text-red-400', accent: 'bg-red-500/10 border border-red-500/20' },
                { label: 'Lucro Total', value: receitaTotal > 0 ? formatBRL(lucroTotal, true) : '—', color: lucroTotal >= 0 ? 'text-emerald-400' : 'text-red-400', accent: 'bg-emerald-500/10 border border-emerald-500/20' },
              ].map((c) => (
                <div key={c.label} className='card p-5'>
                  <div className={`text-2xl font-bold tabular-nums ${c.color}`}>{c.value}</div>
                  <div className='text-xs text-gray-500 mt-1'>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Margin summary */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='card p-5 flex items-center gap-4'>
                <TrendingUp size={20} className={marginColorClass(margemGlobal)} />
                <div>
                  <div className={`text-2xl font-bold tabular-nums ${marginColorClass(margemGlobal)}`}>
                    {formatMargin(margemGlobal)}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>Margem Global (acumulada)</div>
                </div>
              </div>
              <div className='card p-5 flex items-center gap-4'>
                <TrendingDown size={20} className={marginColorClass(margemMedia)} />
                <div>
                  <div className={`text-2xl font-bold tabular-nums ${marginColorClass(margemMedia)}`}>
                    {formatMargin(margemMedia)}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>Margem Média Mensal</div>
                </div>
              </div>
            </div>

            {/* Monthly table */}
            <div className='card p-6'>
              <div className='mb-5 flex items-center justify-between'>
                <div>
                  <h2 className='text-sm font-semibold text-white'>Resultado Mensal</h2>
                  <p className='text-xs text-gray-500 mt-0.5'>
                    Fonte: Caza Vision — Financeiro · {meses.length} meses
                  </p>
                </div>
                <DollarSign size={15} className='text-gray-600' />
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-gray-800'>
                      {['Mês', 'Receita', 'Orçamento', 'Despesas', 'Lucro', 'Margem'].map((h) => (
                        <th key={h} className='text-left pb-3 pr-6 text-[10px] font-semibold text-gray-600 uppercase tracking-wider'>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {meses.map((m) => (
                      <tr key={m.id} className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'>
                        <td className='py-3 pr-6 font-medium text-gray-200'>{m.mes}</td>
                        <td className='py-3 pr-6 text-white tabular-nums font-semibold'>
                          {m.receita > 0 ? formatBRL(m.receita) : <span className='text-gray-700'>—</span>}
                        </td>
                        <td className='py-3 pr-6 text-gray-400 tabular-nums'>
                          {m.orcamento > 0 ? formatBRL(m.orcamento) : <span className='text-gray-700'>—</span>}
                        </td>
                        <td className='py-3 pr-6 text-red-400 tabular-nums'>
                          {m.despesas > 0 ? formatBRL(m.despesas) : <span className='text-gray-700'>—</span>}
                        </td>
                        <td className={`py-3 pr-6 tabular-nums font-semibold ${m.receita > 0 ? (m.lucro >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-700'}`}>
                          {m.receita > 0 ? formatBRL(m.lucro) : '—'}
                        </td>
                        <td className={`py-3 tabular-nums font-semibold ${marginColorClass(m.margem)}`}>
                          {formatMargin(m.margem)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {meses.length > 1 && (
                    <tfoot>
                      <tr className='border-t-2 border-gray-700'>
                        <td className='pt-3 pr-6 text-[10px] font-bold text-gray-400 uppercase'>Total</td>
                        <td className='pt-3 pr-6 text-white font-bold tabular-nums'>{formatBRL(receitaTotal)}</td>
                        <td className='pt-3 pr-6 text-gray-400 font-bold tabular-nums'>{orcTotal > 0 ? formatBRL(orcTotal) : '—'}</td>
                        <td className='pt-3 pr-6 text-red-400 font-bold tabular-nums'>{despTotal > 0 ? formatBRL(despTotal) : '—'}</td>
                        <td className={`pt-3 pr-6 font-bold tabular-nums ${lucroTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{receitaTotal > 0 ? formatBRL(lucroTotal) : '—'}</td>
                        <td className={`pt-3 font-bold tabular-nums ${marginColorClass(margemGlobal)}`}>{formatMargin(margemGlobal)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {despTotal === 0 && receitaTotal > 0 && (
                <div className='mt-4 pt-4 border-t border-gray-800 flex items-start gap-2 text-xs text-gray-600'>
                  <AlertCircle size={12} className='mt-0.5 shrink-0' />
                  Campo Despesas zerado em todos os meses. Preencha no Notion para calcular margem real.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
