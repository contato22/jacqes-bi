// ─── CAZA VISION — Relatórios ──────────────────────────────────────────────────
// Relatórios automáticos gerados a partir das 3 bases reais:
//  - Resumo executivo (projetos + financeiro + clientes)
//  - Receita por mês (barra)
//  - Top clientes por volume
//  - Meses destaque (melhor receita, melhor margem)

import { FileText, TrendingUp, Users, AlertCircle, Star } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchAll3, deriveOverviewMetrics } from '@/lib/caza-vision/fetcher'
import { formatBRL, formatMargin, marginColorClass } from '@/lib/caza-vision/utils'

// ── Report card wrapper ────────────────────────────────────────────────────────

function ReportCard({
  icon, title, description, children,
}: {
  icon:        React.ReactNode
  title:       string
  description: string
  children?:   React.ReactNode
}) {
  return (
    <div className='card p-6'>
      <div className='flex items-start gap-3 mb-5'>
        <div className='w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0'>
          {icon}
        </div>
        <div>
          <h3 className='text-sm font-semibold text-white'>{title}</h3>
          <p className='text-xs text-gray-500 mt-0.5'>{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function RelatoriosPage() {
  const { projetos, financeiro, clientes } = await fetchAll3()

  const worstStatus = [projetos, financeiro, clientes].some((r) => r.status === 'empty') ? 'empty' : 'ok'

  const m = deriveOverviewMetrics(projetos.data, financeiro.data, clientes.data)

  // Meses com receita, ordenados
  const mesesComReceita = financeiro.data.filter((mes) => mes.receita > 0)

  // Top clientes por volume
  const clienteMap = new Map<string, number>()
  for (const p of projetos.data) {
    if (!p.cliente || p.valor === null) continue
    clienteMap.set(p.cliente, (clienteMap.get(p.cliente) ?? 0) + p.valor)
  }
  const topClientes = Array.from(clienteMap.entries())
    .map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  // Melhor e pior mês por receita
  const mesesSorted = [...mesesComReceita].sort((a, b) => b.receita - a.receita)
  const bestMes  = mesesSorted[0] ?? null
  const worstMes = mesesSorted.at(-1) ?? null

  // Melhor margem
  const mesesComMargem = mesesComReceita.filter((mes) => mes.margem !== null)
  const bestMargem = mesesComMargem.length > 0
    ? mesesComMargem.reduce((best, mes) => (mes.margem! > best.margem! ? mes : best))
    : null

  const hasAnyData = projetos.data.length > 0 || financeiro.data.length > 0

  return (
    <>
      <Header title='Relatórios' subtitle='CAZA VISION · Relatórios automáticos' />
      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={worstStatus}
          fetchedAt={projetos.fetchedAt}
        />

        {hasAnyData && (
          <>
            {/* Resumo Executivo */}
            <ReportCard
              icon={<FileText size={16} className='text-brand-400' />}
              title='Resumo Executivo'
              description='Visão consolidada da BU CAZA VISION'
            >
              <div className='grid grid-cols-2 xl:grid-cols-4 gap-3'>
                {[
                  { label: 'Total de Projetos',  value: String(m.totalProjetos),                           color: 'text-white' },
                  { label: 'Em Andamento',        value: String(m.projetosAtivos),                          color: 'text-brand-400' },
                  { label: 'Clientes Ativos',     value: String(m.clientesAtivos),                          color: 'text-emerald-400' },
                  { label: 'Receita YTD',         value: m.receitaYTD > 0 ? formatBRL(m.receitaYTD, true) : '—', color: 'text-white' },
                  { label: 'Despesas YTD',        value: m.despesasYTD > 0 ? formatBRL(m.despesasYTD, true) : '—', color: 'text-red-400' },
                  { label: 'Lucro YTD',           value: m.receitaYTD > 0 ? formatBRL(m.lucroYTD, true) : '—', color: m.lucroYTD >= 0 ? 'text-emerald-400' : 'text-red-400' },
                  { label: 'Margem Média',        value: formatMargin(m.margemMedia),                       color: marginColorClass(m.margemMedia) },
                  { label: 'Ticket Médio',        value: m.ticketMedio !== null ? formatBRL(m.ticketMedio, true) : '—', color: 'text-white' },
                ].map((row) => (
                  <div key={row.label} className='bg-gray-800/50 rounded-xl p-3'>
                    <div className='text-[10px] text-gray-500 uppercase tracking-wider mb-1'>{row.label}</div>
                    <div className={`text-lg font-bold tabular-nums ${row.color}`}>{row.value}</div>
                  </div>
                ))}
              </div>
            </ReportCard>

            {/* Receita por mês */}
            {mesesComReceita.length > 0 && (
              <ReportCard
                icon={<TrendingUp size={16} className='text-emerald-400' />}
                title='Receita por Mês'
                description={`Evolução mensal · ${mesesComReceita.length} meses com movimento`}
              >
                <div className='space-y-3'>
                  {mesesComReceita.map((mes) => {
                    const max = Math.max(...mesesComReceita.map((x) => x.receita))
                    const pct = max > 0 ? (mes.receita / max) * 100 : 0
                    return (
                      <div key={mes.id} className='flex items-center gap-3'>
                        <div className='text-xs text-gray-500 w-14 text-right shrink-0'>{mes.mes}</div>
                        <div className='flex-1 h-5 bg-gray-800 rounded overflow-hidden'>
                          <div
                            className='h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded flex items-center px-2'
                            style={{ width: `${pct}%` }}
                          >
                            {pct > 25 && (
                              <span className='text-[10px] font-semibold text-white'>{formatBRL(mes.receita, true)}</span>
                            )}
                          </div>
                        </div>
                        {pct <= 25 && (
                          <span className='text-xs text-gray-400 tabular-nums w-20 shrink-0'>{formatBRL(mes.receita, true)}</span>
                        )}
                        <span className={`text-xs tabular-nums w-14 text-right shrink-0 ${marginColorClass(mes.margem)}`}>
                          {formatMargin(mes.margem)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </ReportCard>
            )}

            {/* Top clientes */}
            {topClientes.length > 0 && (
              <ReportCard
                icon={<Users size={16} className='text-purple-400' />}
                title='Top Clientes por Volume'
                description='Receita acumulada por cliente (projetos com valor)'
              >
                <div className='space-y-3'>
                  {topClientes.map((row, i) => {
                    const max = topClientes[0].total
                    const pct = max > 0 ? (row.total / max) * 100 : 0
                    return (
                      <div key={row.cliente} className='flex items-center gap-3'>
                        <div className='text-[10px] text-gray-600 w-4 text-right shrink-0'>{i + 1}</div>
                        <div className='text-xs text-gray-400 w-36 shrink-0 truncate'>{row.cliente}</div>
                        <div className='flex-1 h-4 bg-gray-800 rounded overflow-hidden'>
                          <div
                            className='h-full bg-gradient-to-r from-purple-800 to-purple-500 rounded'
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className='text-xs text-gray-300 tabular-nums w-20 text-right shrink-0'>
                          {formatBRL(row.total, true)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </ReportCard>
            )}

            {/* Destaques */}
            {(bestMes || bestMargem) && (
              <ReportCard
                icon={<Star size={16} className='text-amber-400' />}
                title='Destaques'
                description='Meses com melhor e pior desempenho'
              >
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  {bestMes && (
                    <div className='bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4'>
                      <div className='text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-2'>Maior Receita</div>
                      <div className='text-base font-bold text-white'>{bestMes.mes}</div>
                      <div className='text-sm text-emerald-400 mt-1 tabular-nums'>{formatBRL(bestMes.receita)}</div>
                    </div>
                  )}
                  {worstMes && worstMes !== bestMes && (
                    <div className='bg-gray-800/50 border border-gray-700 rounded-xl p-4'>
                      <div className='text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2'>Menor Receita</div>
                      <div className='text-base font-bold text-white'>{worstMes.mes}</div>
                      <div className='text-sm text-gray-400 mt-1 tabular-nums'>{formatBRL(worstMes.receita)}</div>
                    </div>
                  )}
                  {bestMargem && (
                    <div className='bg-brand-500/5 border border-brand-500/20 rounded-xl p-4'>
                      <div className='text-[10px] font-semibold text-brand-400 uppercase tracking-widest mb-2'>Melhor Margem</div>
                      <div className='text-base font-bold text-white'>{bestMargem.mes}</div>
                      <div className={`text-sm mt-1 tabular-nums ${marginColorClass(bestMargem.margem)}`}>
                        {formatMargin(bestMargem.margem)}
                      </div>
                    </div>
                  )}
                </div>
                {!bestMargem && (
                  <div className='mt-3 flex items-center gap-2 text-xs text-gray-600'>
                    <AlertCircle size={12} className='shrink-0' />
                    Destaque de margem indisponível — preencha Despesas no banco Financeiro
                  </div>
                )}
              </ReportCard>
            )}
          </>
        )}

      </div>
    </>
  )
}
