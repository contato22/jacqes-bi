// ─── CAZA VISION — Visão Geral ─────────────────────────────────────────────────

import { FolderOpen, FolderCheck, Users, TrendingUp, DollarSign, BarChart2, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchAll3, deriveOverviewMetrics } from '@/lib/caza-vision/fetcher'
import { formatBRL, formatMargin, marginColorClass } from '@/lib/caza-vision/utils'

function KPI({
  label, value, sub, subColor = 'text-gray-500',
  accent, icon,
}: {
  label: string; value: string; sub?: string; subColor?: string
  accent: string; icon: React.ReactNode
}) {
  return (
    <div className='card p-5 flex items-center gap-4'>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='text-2xl font-bold text-white tabular-nums'>{value}</div>
        <div className='text-xs text-gray-500 mt-0.5'>{label}</div>
        {sub && <div className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</div>}
      </div>
    </div>
  )
}

export default async function CazaVisionOverviewPage() {
  const { projetos, financeiro, clientes } = await fetchAll3()

  // Pick worst status for the banner
  const worstStatus = [projetos, financeiro, clientes].find(
    (r) => r.status === 'api_error' || r.status === 'no_credentials'
  )?.status ?? (projetos.status === 'ok' ? 'ok' : projetos.status)

  const errorMsg = projetos.errorMessage ?? financeiro.errorMessage ?? clientes.errorMessage

  const m = deriveOverviewMetrics(projetos.data, financeiro.data, clientes.data)

  // Last 6 financial months with any data
  const mesesRecentes = financeiro.data.filter((r) => r.receita > 0).slice(-6)

  return (
    <>
      <Header title='Visão Geral' subtitle='CAZA VISION · Business Unit Overview' />
      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={worstStatus}
          errorMessage={errorMsg}
          fetchedAt={projetos.fetchedAt}
        />

        {/* KPI row */}
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <KPI
            label='Total de Projetos'
            value={String(m.totalProjetos)}
            icon={<FolderOpen size={18} className='text-amber-400' />}
            accent='bg-amber-500/10 border border-amber-500/20'
          />
          <KPI
            label='Em Andamento'
            value={String(m.projetosAtivos)}
            sub={m.projetosEntregues > 0 ? `${m.projetosEntregues} entregues` : undefined}
            subColor='text-emerald-400'
            icon={<FolderCheck size={18} className='text-brand-400' />}
            accent='bg-brand-500/10 border border-brand-500/20'
          />
          <KPI
            label='Clientes Ativos'
            value={String(m.clientesAtivos)}
            sub={m.totalBudgetAtivos > 0 ? `Budget: ${formatBRL(m.totalBudgetAtivos, true)}` : undefined}
            icon={<Users size={18} className='text-emerald-400' />}
            accent='bg-emerald-500/10 border border-emerald-500/20'
          />
          <KPI
            label={m.mesMaisRecente ? `Receita ${m.mesMaisRecente}` : 'Receita do Mês'}
            value={m.receitaMesAtual !== null ? formatBRL(m.receitaMesAtual) : '—'}
            icon={<DollarSign size={18} className='text-purple-400' />}
            accent='bg-purple-500/10 border border-purple-500/20'
          />
        </div>

        {/* YTD row */}
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>Receita YTD</div>
            <div className='text-2xl font-bold text-white mt-2 tabular-nums'>
              {m.receitaYTD > 0 ? formatBRL(m.receitaYTD, true) : '—'}
            </div>
          </div>
          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>Despesas YTD</div>
            <div className='text-2xl font-bold text-red-400 mt-2 tabular-nums'>
              {m.despesasYTD > 0 ? formatBRL(m.despesasYTD, true) : '—'}
            </div>
          </div>
          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>Lucro YTD</div>
            <div className={`text-2xl font-bold mt-2 tabular-nums ${m.lucroYTD >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {m.receitaYTD > 0 ? formatBRL(m.lucroYTD, true) : '—'}
            </div>
          </div>
          <div className='card p-5'>
            <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>Margem Média</div>
            <div className={`text-2xl font-bold mt-2 tabular-nums ${marginColorClass(m.margemMedia)}`}>
              {formatMargin(m.margemMedia)}
            </div>
          </div>
        </div>

        {/* Ticket médio */}
        {m.ticketMedio !== null && (
          <div className='card p-5 flex items-center justify-between'>
            <div>
              <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>Ticket Médio por Projeto</div>
              <div className='text-3xl font-bold text-white mt-1 tabular-nums'>{formatBRL(m.ticketMedio)}</div>
            </div>
            <TrendingUp size={32} className='text-brand-500/30' />
          </div>
        )}

        {/* Trend bars — últimos meses */}
        {mesesRecentes.length > 0 && (
          <div className='card p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='text-sm font-semibold text-white'>Receita Recente</h2>
                <p className='text-xs text-gray-500 mt-0.5'>Últimos {mesesRecentes.length} meses com movimento</p>
              </div>
              <BarChart2 size={15} className='text-gray-600' />
            </div>
            <div className='space-y-3'>
              {mesesRecentes.map((mes) => {
                const max = Math.max(...mesesRecentes.map((m) => m.receita))
                const pct = max > 0 ? (mes.receita / max) * 100 : 0
                return (
                  <div key={mes.id} className='flex items-center gap-3'>
                    <div className='text-xs text-gray-500 w-14 text-right shrink-0'>{mes.mes}</div>
                    <div className='flex-1 h-5 bg-gray-800 rounded-md overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded-md flex items-center px-2 transition-all'
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
          </div>
        )}

        {/* Empty state */}
        {projetos.status !== 'no_credentials' && projetos.status !== 'api_error' &&
          projetos.total === 0 && financeiro.total === 0 && (
          <div className='card p-10 text-center'>
            <AlertCircle size={24} className='text-gray-600 mx-auto mb-3' />
            <p className='text-sm text-gray-500'>Nenhum dado encontrado nas bases da CAZA VISION.</p>
          </div>
        )}
      </div>
    </>
  )
}
