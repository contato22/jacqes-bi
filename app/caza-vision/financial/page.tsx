// ─── CAZA VISION — Financial ───────────────────────────────────────────────────
// Aggregates real Notion data by competência (billing period).
// No demo data — if credentials are missing or fields incomplete, page shows
// structured warnings instead of fallback numbers.

import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import {
  fetchCazaVisionRecords,
  deriveFinancialMonths,
} from '@/lib/caza-vision/fetcher'
import {
  formatBRL,
  formatMargin,
  marginColorClass,
} from '@/lib/caza-vision/utils'
import type { FinancialMonth } from '@/lib/caza-vision/types'

// ── Summary card ───────────────────────────────────────────────────────────────

function FinancialCard({
  label,
  value,
  sub,
  colorClass = 'text-white',
  accent,
}: {
  label:       string
  value:       string
  sub?:        string
  colorClass?: string
  accent:      string
}) {
  return (
    <div className='card p-5'>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
        <DollarSign size={16} className={colorClass} />
      </div>
      <div className={`text-2xl font-bold tabular-nums ${colorClass}`}>{value}</div>
      <div className='text-xs text-gray-500 mt-1'>{label}</div>
      {sub && <div className='text-xs text-gray-600 mt-0.5'>{sub}</div>}
    </div>
  )
}

// ── Month row ──────────────────────────────────────────────────────────────────

function MonthRow({ m }: { m: FinancialMonth }) {
  const hasDespesas = m.totalDespesas > 0

  return (
    <tr className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'>
      <td className='py-3 pr-6 font-medium text-gray-200 whitespace-nowrap'>
        {m.competencia}
        {m.dataQualityFlags.length > 0 && (
          <span
            className='ml-1.5 text-yellow-500'
            title={m.dataQualityFlags[0]}
          >
            ⚠
          </span>
        )}
      </td>
      <td className='py-3 pr-6 text-gray-400 tabular-nums'>{m.projetosCount}</td>
      <td className='py-3 pr-6 text-white tabular-nums font-semibold'>
        {formatBRL(m.receita)}
      </td>
      <td className='py-3 pr-6 text-gray-400 tabular-nums'>
        {m.alimentacao > 0 ? formatBRL(m.alimentacao) : <span className='text-gray-700'>—</span>}
      </td>
      <td className='py-3 pr-6 text-gray-400 tabular-nums'>
        {m.gasolina > 0 ? formatBRL(m.gasolina) : <span className='text-gray-700'>—</span>}
      </td>
      <td className='py-3 pr-6 tabular-nums'>
        {hasDespesas ? (
          <span className='text-gray-300'>{formatBRL(m.totalDespesas)}</span>
        ) : (
          <span className='text-gray-700'>—</span>
        )}
      </td>
      <td className={`py-3 pr-6 tabular-nums font-semibold ${hasDespesas ? (m.lucro >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-700'}`}>
        {hasDespesas ? formatBRL(m.lucro) : '—'}
      </td>
      <td className={`py-3 tabular-nums font-semibold ${marginColorClass(m.margem)}`}>
        {formatMargin(m.margem)}
      </td>
    </tr>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function FinancialPage() {
  const result  = await fetchCazaVisionRecords()
  const months  = deriveFinancialMonths(result.data)

  // Top-line aggregates across all months
  const totalReceita    = months.reduce((s, m) => s + m.receita, 0)
  const totalAlimentacao = months.reduce((s, m) => s + m.alimentacao, 0)
  const totalGasolina   = months.reduce((s, m) => s + m.gasolina, 0)
  const totalDespesas   = months.reduce((s, m) => s + m.totalDespesas, 0)
  const totalLucro      = totalReceita - totalDespesas
  const hasAnyDespesas  = totalDespesas > 0
  const margemGlobal    = totalReceita > 0 && hasAnyDespesas
    ? (totalLucro / totalReceita) * 100
    : null

  const allFlags = [
    ...result.missingFields,
    ...months.flatMap((m) => m.dataQualityFlags),
  ]

  return (
    <>
      <Header
        title='Financial'
        subtitle='CAZA VISION · Resultado financeiro por competência'
      />

      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={result.status}
          errorMessage={result.errorMessage}
          flags={[...new Set(allFlags)]}
          recordsTotal={result.recordsTotal}
          recordsValid={result.recordsValid}
          recordsDiscarded={result.recordsDiscarded}
          fetchedAt={result.fetchedAt}
        />

        {/* Top-line summary */}
        {result.data.length > 0 && (
          <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
            <FinancialCard
              label='Receita Total'
              value={totalReceita > 0 ? formatBRL(totalReceita, true) : '—'}
              accent='bg-brand-500/10 border border-brand-500/20'
              colorClass='text-brand-400'
            />
            <FinancialCard
              label='Despesas Totais'
              value={hasAnyDespesas ? formatBRL(totalDespesas, true) : '—'}
              sub={!hasAnyDespesas ? 'Campos Alimentação/Gasolina não preenchidos' : undefined}
              accent='bg-red-500/10 border border-red-500/20'
              colorClass={hasAnyDespesas ? 'text-red-400' : 'text-gray-600'}
            />
            <FinancialCard
              label='Lucro Total'
              value={hasAnyDespesas ? formatBRL(totalLucro, true) : '—'}
              accent={hasAnyDespesas ? (totalLucro >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20') : 'bg-gray-800 border border-gray-700'}
              colorClass={hasAnyDespesas ? (totalLucro >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-600'}
            />
            <div className='card p-5'>
              <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>
                Margem Global
              </div>
              <div className={`text-2xl font-bold mt-2 tabular-nums ${marginColorClass(margemGlobal)}`}>
                {formatMargin(margemGlobal)}
              </div>
              {margemGlobal === null && (
                <p className='text-xs text-gray-700 mt-1'>Indisponível sem despesas</p>
              )}
            </div>
          </div>
        )}

        {/* Despesas breakdown */}
        {hasAnyDespesas && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='card p-5 flex items-center gap-4'>
              <div className='w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0'>
                <TrendingDown size={16} className='text-orange-400' />
              </div>
              <div>
                <div className='text-xl font-bold text-orange-300 tabular-nums'>
                  {formatBRL(totalAlimentacao)}
                </div>
                <div className='text-xs text-gray-500 mt-0.5'>Alimentação (total)</div>
              </div>
            </div>
            <div className='card p-5 flex items-center gap-4'>
              <div className='w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0'>
                <TrendingDown size={16} className='text-yellow-400' />
              </div>
              <div>
                <div className='text-xl font-bold text-yellow-300 tabular-nums'>
                  {formatBRL(totalGasolina)}
                </div>
                <div className='text-xs text-gray-500 mt-0.5'>Gasolina (total)</div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly detail table */}
        {months.length > 0 ? (
          <div className='card p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='text-sm font-semibold text-white'>
                  Resultado por Competência
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>
                  Agrupado por campo COMPETÊNCIA da base real
                </p>
              </div>
              <TrendingUp size={16} className='text-gray-600' />
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-800'>
                    {[
                      'Competência',
                      'Projetos',
                      'Receita',
                      'Alimentação',
                      'Gasolina',
                      'Total Despesas',
                      'Lucro',
                      'Margem',
                    ].map((h) => (
                      <th
                        key={h}
                        className='text-left pb-3 pr-6 text-[10px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {months.map((m, i) => (
                    <MonthRow key={i} m={m} />
                  ))}
                </tbody>
                {/* Totals row */}
                {months.length > 1 && (
                  <tfoot>
                    <tr className='border-t-2 border-gray-700'>
                      <td className='pt-3 pr-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>
                        Total
                      </td>
                      <td className='pt-3 pr-6 text-gray-400 tabular-nums'>
                        {months.reduce((s, m) => s + m.projetosCount, 0)}
                      </td>
                      <td className='pt-3 pr-6 text-white tabular-nums font-bold'>
                        {formatBRL(totalReceita)}
                      </td>
                      <td className='pt-3 pr-6 text-gray-400 tabular-nums'>
                        {totalAlimentacao > 0 ? formatBRL(totalAlimentacao) : '—'}
                      </td>
                      <td className='pt-3 pr-6 text-gray-400 tabular-nums'>
                        {totalGasolina > 0 ? formatBRL(totalGasolina) : '—'}
                      </td>
                      <td className='pt-3 pr-6 tabular-nums'>
                        {hasAnyDespesas ? <span className='text-gray-300 font-semibold'>{formatBRL(totalDespesas)}</span> : '—'}
                      </td>
                      <td className={`pt-3 pr-6 tabular-nums font-bold ${hasAnyDespesas ? (totalLucro >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-700'}`}>
                        {hasAnyDespesas ? formatBRL(totalLucro) : '—'}
                      </td>
                      <td className={`pt-3 tabular-nums font-bold ${marginColorClass(margemGlobal)}`}>
                        {formatMargin(margemGlobal)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {!hasAnyDespesas && (
              <div className='mt-4 pt-4 border-t border-gray-800 flex items-start gap-2 text-xs text-gray-600'>
                <AlertCircle size={12} className='mt-0.5 shrink-0' />
                <span>
                  Os campos <strong className='text-gray-500'>Alimentação</strong> e <strong className='text-gray-500'>Gasolina</strong> não estão preenchidos na base.
                  Adicione despesas nos registros do Notion para calcular lucro e margem reais.
                </span>
              </div>
            )}
          </div>
        ) : (
          result.status !== 'no_credentials' && result.status !== 'api_error' && (
            <div className='card p-10 text-center'>
              <DollarSign size={24} className='text-gray-600 mx-auto mb-3' />
              <p className='text-sm text-gray-500'>
                Nenhum dado financeiro encontrado.
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                Verifique se a base tem registros com campo COMPETÊNCIA preenchido.
              </p>
            </div>
          )
        )}

      </div>
    </>
  )
}
