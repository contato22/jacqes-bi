// ─── CAZA VISION — Relatórios ──────────────────────────────────────────────────
// Shows auto-generated reports from real data when available.
// Falls back to structured empty state (with schema requirements) when
// data is missing — never uses mock data.

import { FileText, TrendingUp, FolderOpen, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { RelatoriosEmptyState } from '@/components/caza-vision/EmptyState'
import {
  fetchCazaVisionRecords,
  deriveFinancialMonths,
  deriveOverviewMetrics,
} from '@/lib/caza-vision/fetcher'
import {
  formatBRL,
  formatMargin,
  marginColorClass,
} from '@/lib/caza-vision/utils'

// ── Report card ────────────────────────────────────────────────────────────────

function ReportCard({
  icon,
  title,
  description,
  children,
}: {
  icon:        React.ReactNode
  title:       string
  description: string
  children?:   React.ReactNode
}) {
  return (
    <div className='card p-6'>
      <div className='flex items-start gap-3 mb-4'>
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
  const result  = await fetchCazaVisionRecords()
  const months  = deriveFinancialMonths(result.data)
  const metrics = deriveOverviewMetrics(result.data)

  const hasData = result.data.length > 0
  const hasFinancialData = months.some((m) => m.receita > 0)

  // If no credentials or API error, show quality banner + empty state
  if (!hasData) {
    return (
      <>
        <Header title='Relatórios' subtitle='CAZA VISION · Relatórios automáticos' />
        <div className='px-8 py-6 space-y-6'>
          <DataQualityBanner
            status={result.status}
            errorMessage={result.errorMessage}
            fetchedAt={result.fetchedAt}
          />
          {(result.status === 'ok' || result.status === 'empty') && (
            <div className='flex justify-center'>
              <RelatoriosEmptyState />
            </div>
          )}
        </div>
      </>
    )
  }

  // ── Best / worst month ────────────────────────────────────────────────────
  const monthsSorted = [...months].sort((a, b) => b.receita - a.receita)
  const bestMonth  = monthsSorted[0]
  const worstMonth = monthsSorted[monthsSorted.length - 1]

  // Month with best margin (only those with expense data)
  const monthsWithMargin = months.filter((m) => m.margem !== null)
  const bestMarginMonth = monthsWithMargin.length > 0
    ? monthsWithMargin.reduce((best, m) => (m.margem! > best.margem! ? m : best))
    : null

  return (
    <>
      <Header
        title='Relatórios'
        subtitle='CAZA VISION · Relatórios gerados automaticamente da base real'
      />

      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={result.status}
          errorMessage={result.errorMessage}
          flags={result.missingFields}
          recordsTotal={result.recordsTotal}
          recordsValid={result.recordsValid}
          recordsDiscarded={result.recordsDiscarded}
          fetchedAt={result.fetchedAt}
        />

        {/* Report: Resumo Executivo */}
        <ReportCard
          icon={<FileText size={16} className='text-brand-400' />}
          title='Resumo Executivo'
          description='Visão consolidada da BU CAZA VISION'
        >
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-gray-800/50 rounded-lg p-3'>
              <div className='text-xs text-gray-500'>Total de Projetos</div>
              <div className='text-xl font-bold text-white mt-1'>{metrics.totalProjetos}</div>
            </div>
            <div className='bg-gray-800/50 rounded-lg p-3'>
              <div className='text-xs text-gray-500'>Receita Total</div>
              <div className='text-xl font-bold text-white mt-1'>
                {metrics.receitaTotal > 0 ? formatBRL(metrics.receitaTotal, true) : '—'}
              </div>
            </div>
            <div className='bg-gray-800/50 rounded-lg p-3'>
              <div className='text-xs text-gray-500'>Projetos Recebidos</div>
              <div className='text-xl font-bold text-emerald-400 mt-1'>
                {metrics.projetosRecebidos}
                <span className='text-xs text-gray-500 ml-1 font-normal'>
                  / {metrics.totalProjetos}
                </span>
              </div>
            </div>
            <div className='bg-gray-800/50 rounded-lg p-3'>
              <div className='text-xs text-gray-500'>Margem Média</div>
              <div className={`text-xl font-bold mt-1 ${marginColorClass(metrics.margemMedia)}`}>
                {formatMargin(metrics.margemMedia)}
              </div>
            </div>
          </div>
        </ReportCard>

        {/* Report: Receita por Competência */}
        {hasFinancialData && (
          <ReportCard
            icon={<TrendingUp size={16} className='text-emerald-400' />}
            title='Receita por Competência'
            description='Evolução da receita mês a mês'
          >
            <div className='space-y-2'>
              {months.map((m, i) => {
                const maxReceita = Math.max(...months.map((x) => x.receita))
                const pct = maxReceita > 0 ? (m.receita / maxReceita) * 100 : 0
                return (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='text-xs text-gray-500 w-20 text-right shrink-0'>
                      {m.competencia}
                    </div>
                    <div className='flex-1 h-5 bg-gray-800 rounded overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-brand-700 to-brand-500 rounded transition-all flex items-center px-2'
                        style={{ width: `${pct}%` }}
                      >
                        {pct > 30 && (
                          <span className='text-[10px] text-white font-semibold'>
                            {formatBRL(m.receita, true)}
                          </span>
                        )}
                      </div>
                    </div>
                    {pct <= 30 && (
                      <div className='text-xs text-gray-400 tabular-nums w-20 shrink-0'>
                        {formatBRL(m.receita, true)}
                      </div>
                    )}
                    <div className='text-xs text-gray-600 w-6 shrink-0'>
                      {m.projetosCount}p
                    </div>
                  </div>
                )
              })}
            </div>
          </ReportCard>
        )}

        {/* Report: Destaques */}
        <ReportCard
          icon={<FolderOpen size={16} className='text-amber-400' />}
          title='Destaques por Competência'
          description='Meses com melhor e pior desempenho'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {bestMonth && (
              <div className='bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4'>
                <div className='text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-2'>
                  Maior Receita
                </div>
                <div className='text-lg font-bold text-white'>{bestMonth.competencia}</div>
                <div className='text-sm text-emerald-400 mt-1 tabular-nums'>
                  {formatBRL(bestMonth.receita)}
                </div>
                <div className='text-xs text-gray-600 mt-1'>
                  {bestMonth.projetosCount} projeto(s)
                </div>
              </div>
            )}
            {worstMonth && worstMonth !== bestMonth && (
              <div className='bg-gray-800/50 border border-gray-800 rounded-lg p-4'>
                <div className='text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2'>
                  Menor Receita
                </div>
                <div className='text-lg font-bold text-white'>{worstMonth.competencia}</div>
                <div className='text-sm text-gray-400 mt-1 tabular-nums'>
                  {formatBRL(worstMonth.receita)}
                </div>
                <div className='text-xs text-gray-600 mt-1'>
                  {worstMonth.projetosCount} projeto(s)
                </div>
              </div>
            )}
            {bestMarginMonth && (
              <div className='bg-brand-500/5 border border-brand-500/20 rounded-lg p-4'>
                <div className='text-[10px] font-semibold text-brand-400 uppercase tracking-widest mb-2'>
                  Melhor Margem
                </div>
                <div className='text-lg font-bold text-white'>
                  {bestMarginMonth.competencia}
                </div>
                <div className={`text-sm mt-1 tabular-nums ${marginColorClass(bestMarginMonth.margem)}`}>
                  {formatMargin(bestMarginMonth.margem)}
                </div>
              </div>
            )}
          </div>

          {!bestMarginMonth && (
            <div className='mt-3 flex items-center gap-2 text-xs text-gray-600'>
              <AlertCircle size={12} />
              Destaque de margem indisponível — preencha Alimentação e Gasolina na base
            </div>
          )}
        </ReportCard>

      </div>
    </>
  )
}
