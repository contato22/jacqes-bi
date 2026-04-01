// ─── CAZA VISION — Unit Economics ─────────────────────────────────────────────
// Métricas derivadas das 3 bases reais:
//  - Ticket médio por tipo de projeto
//  - Receita por cliente
//  - Orçamento vs. Receita real
//  - Margem média mensal (do banco Financeiro)

import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchAll3, deriveUnitEconomics } from '@/lib/caza-vision/fetcher'
import { formatBRL, formatMargin, marginColorClass } from '@/lib/caza-vision/utils'

export default async function UnitEconomicsPage() {
  const { projetos, financeiro, clientes } = await fetchAll3()

  const worstStatus = [projetos, financeiro].find(
    (r) => r.status === 'api_error' || r.status === 'no_credentials'
  )?.status ?? projetos.status

  const metrics = deriveUnitEconomics(projetos.data, financeiro.data)

  return (
    <>
      <Header title='Unit Economics' subtitle='CAZA VISION · Métricas por unidade' />
      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={worstStatus}
          errorMessage={projetos.errorMessage ?? financeiro.errorMessage}
          fetchedAt={projetos.fetchedAt}
        />

        {(projetos.data.length > 0 || financeiro.data.length > 0) && (
          <>
            {/* Margem média */}
            {metrics.margemMediaMeses !== null && (
              <div className='card p-5 flex items-center gap-4'>
                <BarChart3 size={22} className={marginColorClass(metrics.margemMediaMeses)} />
                <div>
                  <div className={`text-3xl font-bold tabular-nums ${marginColorClass(metrics.margemMediaMeses)}`}>
                    {formatMargin(metrics.margemMediaMeses)}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>Margem Média Mensal (Financeiro)</div>
                </div>
              </div>
            )}

            {/* Ticket médio por tipo */}
            {metrics.ticketMedioPorTipo.length > 0 && (
              <div className='card p-6'>
                <h2 className='text-sm font-semibold text-white mb-1'>Ticket Médio por Tipo de Projeto</h2>
                <p className='text-xs text-gray-500 mb-5'>Média de Valor por categoria</p>
                <div className='space-y-3'>
                  {metrics.ticketMedioPorTipo.map((row) => {
                    const max = metrics.ticketMedioPorTipo[0].mediaValor
                    const pct = max > 0 ? (row.mediaValor / max) * 100 : 0
                    return (
                      <div key={row.tipo} className='flex items-center gap-3'>
                        <div className='text-xs text-gray-400 w-40 shrink-0 truncate'>{row.tipo}</div>
                        <div className='flex-1 h-5 bg-gray-800 rounded overflow-hidden'>
                          <div
                            className='h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded flex items-center px-2'
                            style={{ width: `${pct}%` }}
                          >
                            {pct > 30 && (
                              <span className='text-[10px] font-semibold text-white'>{formatBRL(row.mediaValor, true)}</span>
                            )}
                          </div>
                        </div>
                        {pct <= 30 && (
                          <span className='text-xs text-gray-400 tabular-nums w-20 shrink-0'>{formatBRL(row.mediaValor, true)}</span>
                        )}
                        <span className='text-xs text-gray-600 w-10 text-right shrink-0'>{row.count}p</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Receita por cliente */}
            {metrics.ticketMedioPorCliente.length > 0 && (
              <div className='card p-6'>
                <h2 className='text-sm font-semibold text-white mb-1'>Volume por Cliente</h2>
                <p className='text-xs text-gray-500 mb-5'>Receita total acumulada por cliente</p>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-gray-800'>
                        {['Cliente', 'Projetos', 'Receita Total'].map((h) => (
                          <th key={h} className='text-left pb-3 pr-6 text-[10px] font-semibold text-gray-600 uppercase tracking-wider'>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.ticketMedioPorCliente.map((row) => (
                        <tr key={row.cliente} className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'>
                          <td className='py-3 pr-6 font-medium text-gray-200'>{row.cliente}</td>
                          <td className='py-3 pr-6 text-gray-400 tabular-nums'>{row.count}</td>
                          <td className='py-3 text-white font-semibold tabular-nums'>{formatBRL(row.totalValor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orçamento vs Receita */}
            {metrics.orcamentoVsReceita.length > 0 && (
              <div className='card p-6'>
                <h2 className='text-sm font-semibold text-white mb-1'>Orçamento vs. Receita Real</h2>
                <p className='text-xs text-gray-500 mb-5'>Diferença entre o orçado e o realizado por mês</p>
                <div className='space-y-2'>
                  {metrics.orcamentoVsReceita.map((row) => (
                    <div key={row.mes} className='flex items-center gap-3'>
                      <div className='text-xs text-gray-500 w-14 text-right shrink-0'>{row.mes}</div>
                      <div className='flex-1 grid grid-cols-2 gap-1'>
                        <div className='text-right text-xs text-gray-400 tabular-nums self-center'>
                          {formatBRL(row.orcamento, true)}
                        </div>
                        <div className='text-xs text-white tabular-nums self-center'>
                          {formatBRL(row.receita, true)}
                        </div>
                      </div>
                      <div className={`text-xs font-semibold tabular-nums w-16 text-right shrink-0 flex items-center gap-1 justify-end ${row.diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {row.diff >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {row.diff >= 0 ? '+' : ''}{formatBRL(row.diff, true)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-3 flex items-center gap-4 text-[10px] text-gray-600'>
                  <span>Orc. (esq.) vs. Receita (dir.)</span>
                </div>
              </div>
            )}

            {/* Budget dos clientes ativos */}
            {clientes.data.filter((c) => c.status === 'Ativo' && c.budgetAnual).length > 0 && (
              <div className='card p-6'>
                <h2 className='text-sm font-semibold text-white mb-1'>Budget Anual — Clientes Ativos</h2>
                <p className='text-xs text-gray-500 mb-5'>Budget declarado no cadastro de cliente</p>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-gray-800'>
                        {['Cliente', 'Tipo', 'Segmento', 'Budget Anual'].map((h) => (
                          <th key={h} className='text-left pb-3 pr-6 text-[10px] font-semibold text-gray-600 uppercase tracking-wider'>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.data
                        .filter((c) => c.status === 'Ativo')
                        .sort((a, b) => (b.budgetAnual ?? 0) - (a.budgetAnual ?? 0))
                        .map((c) => (
                        <tr key={c.id} className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'>
                          <td className='py-3 pr-6 font-medium text-gray-200'>{c.nome}</td>
                          <td className='py-3 pr-6'>
                            {c.tipo ? (
                              <span className='badge badge-blue'>{c.tipo}</span>
                            ) : <span className='text-gray-700'>—</span>}
                          </td>
                          <td className='py-3 pr-6 text-gray-400 text-xs'>{c.segmento ?? '—'}</td>
                          <td className='py-3 text-white font-semibold tabular-nums'>
                            {c.budgetAnual ? formatBRL(c.budgetAnual, true) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
