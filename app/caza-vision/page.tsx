// ─── CAZA VISION — Visão Geral ─────────────────────────────────────────────────
// Server component: fetches directly from Notion, no client-side secrets.
// All metrics are derived from the real database — no mock fallback.

import {
  FolderOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  BarChart2,
  AlertTriangle,
} from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import {
  fetchCazaVisionRecords,
  deriveOverviewMetrics,
  deriveFinancialMonths,
} from '@/lib/caza-vision/fetcher'
import {
  formatBRL,
  formatMargin,
  marginColorClass,
  formatCompetencia,
} from '@/lib/caza-vision/utils'

// ── KPI card ───────────────────────────────────────────────────────────────────

interface KPICardProps {
  label:      string
  value:      string
  sub?:       string
  subColor?:  string
  icon:       React.ReactNode
  accent:     string
  unavailable?: boolean
}

function KPICard({ label, value, sub, subColor = 'text-gray-500', icon, accent, unavailable }: KPICardProps) {
  return (
    <div className='card p-5 flex items-center gap-4'>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className='flex-1 min-w-0'>
        <div className={`text-2xl font-bold tabular-nums ${unavailable ? 'text-gray-600' : 'text-white'}`}>
          {value}
        </div>
        <div className='text-xs text-gray-500 mt-0.5'>{label}</div>
        {sub && (
          <div className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</div>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function CazaVisionOverviewPage() {
  const result  = await fetchCazaVisionRecords()
  const metrics = deriveOverviewMetrics(result.data)
  const months  = deriveFinancialMonths(result.data)

  const allFlags = [
    ...metrics.dataQualityFlags,
    ...result.missingFields,
  ]

  return (
    <>
      <Header
        title='Visão Geral'
        subtitle='CAZA VISION · Business Unit Overview'
      />

      <div className='px-8 py-6 space-y-6'>

        {/* Data quality / connection banner */}
        <DataQualityBanner
          status={result.status}
          errorMessage={result.errorMessage}
          flags={allFlags}
          recordsTotal={result.recordsTotal}
          recordsValid={result.recordsValid}
          recordsDiscarded={result.recordsDiscarded}
          fetchedAt={result.fetchedAt}
        />

        {/* KPI Row */}
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <KPICard
            label='Total de Projetos'
            value={String(metrics.totalProjetos)}
            icon={<FolderOpen size={18} className='text-amber-400' />}
            accent='bg-amber-500/10 border border-amber-500/20'
          />
          <KPICard
            label='Projetos Recebidos'
            value={String(metrics.projetosRecebidos)}
            sub={
              metrics.totalProjetos > 0
                ? `${((metrics.projetosRecebidos / metrics.totalProjetos) * 100).toFixed(0)}% do total`
                : undefined
            }
            subColor='text-emerald-400'
            icon={<CheckCircle size={18} className='text-emerald-400' />}
            accent='bg-emerald-500/10 border border-emerald-500/20'
          />
          <KPICard
            label='Projetos Pendentes'
            value={String(metrics.projetosPendentes)}
            icon={<Clock size={18} className='text-yellow-400' />}
            accent='bg-yellow-500/10 border border-yellow-500/20'
          />
          <KPICard
            label='Receita Total'
            value={metrics.receitaTotal > 0 ? formatBRL(metrics.receitaTotal, true) : '—'}
            icon={<DollarSign size={18} className='text-brand-400' />}
            accent='bg-brand-500/10 border border-brand-500/20'
            unavailable={metrics.receitaTotal === 0}
          />
        </div>

        {/* Secondary KPIs */}
        <div className='grid grid-cols-2 xl:grid-cols-3 gap-4'>
          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>
              Despesas Totais
            </div>
            <div className={`text-3xl font-bold mt-2 tabular-nums ${metrics.despesasTotal === null ? 'text-gray-600' : 'text-white'}`}>
              {metrics.despesasTotal !== null ? formatBRL(metrics.despesasTotal, true) : '—'}
            </div>
            {metrics.despesasTotal === null && (
              <p className='text-xs text-gray-600 mt-1'>Campos de despesa não preenchidos</p>
            )}
          </div>

          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>
              Lucro Total
            </div>
            <div className={`text-3xl font-bold mt-2 tabular-nums ${metrics.lucroTotal === null ? 'text-gray-600' : metrics.lucroTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {metrics.lucroTotal !== null ? formatBRL(metrics.lucroTotal, true) : '—'}
            </div>
            {metrics.lucroTotal === null && (
              <p className='text-xs text-gray-600 mt-1'>Depende de dados de despesa</p>
            )}
          </div>

          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>
              Margem Média
            </div>
            <div className={`text-3xl font-bold mt-2 tabular-nums ${marginColorClass(metrics.margemMedia)}`}>
              {formatMargin(metrics.margemMedia)}
            </div>
            {metrics.margemMedia === null && (
              <p className='text-xs text-gray-600 mt-1'>Indisponível sem dados de despesa</p>
            )}
          </div>
        </div>

        {/* Ticket Médio highlight */}
        {metrics.ticketMedio !== null && (
          <div className='card p-5 flex items-center justify-between'>
            <div>
              <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>
                Ticket Médio por Projeto
              </div>
              <div className='text-3xl font-bold text-white mt-1 tabular-nums'>
                {formatBRL(metrics.ticketMedio)}
              </div>
            </div>
            <TrendingUp size={32} className='text-brand-500/30' />
          </div>
        )}

        {/* Monthly breakdown table */}
        {months.length > 0 && (
          <div className='card p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='text-sm font-semibold text-white'>
                  Receita por Competência
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>
                  Agrupado por período de competência da base real
                </p>
              </div>
              <BarChart2 size={16} className='text-gray-600' />
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-800'>
                    {['Competência', 'Projetos', 'Receita', 'Despesas', 'Lucro', 'Margem'].map((h) => (
                      <th
                        key={h}
                        className='text-left pb-3 pr-6 text-[10px] font-semibold text-gray-600 uppercase tracking-wider'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {months.map((m, i) => (
                    <tr
                      key={i}
                      className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'
                    >
                      <td className='py-3 pr-6 font-medium text-gray-200'>
                        {m.competencia}
                      </td>
                      <td className='py-3 pr-6 text-gray-400 tabular-nums'>
                        {m.projetosCount}
                      </td>
                      <td className='py-3 pr-6 text-white tabular-nums font-semibold'>
                        {formatBRL(m.receita)}
                      </td>
                      <td className='py-3 pr-6 text-gray-400 tabular-nums'>
                        {m.totalDespesas > 0 ? formatBRL(m.totalDespesas) : '—'}
                      </td>
                      <td className={`py-3 pr-6 tabular-nums font-semibold ${m.totalDespesas > 0 ? (m.lucro >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-600'}`}>
                        {m.totalDespesas > 0 ? formatBRL(m.lucro) : '—'}
                      </td>
                      <td className={`py-3 tabular-nums font-semibold ${marginColorClass(m.margem)}`}>
                        {formatMargin(m.margem)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state when no records */}
        {result.status !== 'no_credentials' && result.status !== 'api_error' && result.data.length === 0 && (
          <div className='card p-10 text-center'>
            <AlertTriangle size={24} className='text-gray-600 mx-auto mb-3' />
            <p className='text-sm text-gray-500'>
              Nenhum projeto encontrado na base da CAZA VISION.
            </p>
            <p className='text-xs text-gray-600 mt-1'>
              Verifique se o CAZA_VISION_DB_ID aponta para a base correta.
            </p>
          </div>
        )}

      </div>
    </>
  )
}
