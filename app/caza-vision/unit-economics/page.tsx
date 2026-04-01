// ─── CAZA VISION — Unit Economics ─────────────────────────────────────────────
// Shows only metrics the current schema can actually support.
// Does NOT display CAC, LTV, director margins, or other metrics that require
// fields not present in the CAZA VISION Notion base.
//
// Supported with current schema:
//   - Receita média por projeto (requires: Valor)
//   - Despesa média por projeto (requires: Alimentação + Gasolina)
//   - Margem média ponderada    (requires: Valor + any expense field)
//   - Distribuição projetos com/sem despesas
//
// NOT supported (flagged explicitly, not invented):
//   - CAC — requires canal de aquisição + custo de marketing (campo ausente)
//   - LTV — requires recorrência/histórico por cliente (campo ausente)
//   - Margem por diretor — requires campo Diretor (campo ausente)
//   - Ticket por tipo de projeto — requires campo Tipo (campo ausente)

import { BarChart3, AlertCircle, Info } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import {
  fetchCazaVisionRecords,
  deriveUnitEconomics,
} from '@/lib/caza-vision/fetcher'
import {
  formatBRL,
  formatMargin,
  marginColorClass,
} from '@/lib/caza-vision/utils'

// ── Metric card ────────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  colorClass = 'text-white',
  unavailable = false,
}: {
  label:        string
  value:        string
  sub?:         string
  colorClass?:  string
  unavailable?: boolean
}) {
  return (
    <div className='card p-5'>
      <div className={`text-2xl font-bold tabular-nums ${unavailable ? 'text-gray-600' : colorClass}`}>
        {value}
      </div>
      <div className='text-xs text-gray-500 mt-1'>{label}</div>
      {sub && (
        <div className={`text-xs mt-1 ${unavailable ? 'text-gray-700' : 'text-gray-600'}`}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ── "Not available" card ───────────────────────────────────────────────────────

function UnsupportedMetric({
  label,
  reason,
}: {
  label:  string
  reason: string
}) {
  return (
    <div className='card p-5 opacity-50 border-dashed'>
      <div className='flex items-start gap-2'>
        <Info size={13} className='text-gray-600 mt-0.5 shrink-0' />
        <div>
          <div className='text-sm font-semibold text-gray-600'>{label}</div>
          <div className='text-xs text-gray-700 mt-0.5'>{reason}</div>
        </div>
      </div>
    </div>
  )
}

// ── Distribution bar ───────────────────────────────────────────────────────────

function DistributionBar({
  withExpenses,
  withoutExpenses,
  total,
}: {
  withExpenses:    number
  withoutExpenses: number
  total:           number
}) {
  const pctWith = total > 0 ? (withExpenses / total) * 100 : 0
  return (
    <div className='card p-5'>
      <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4'>
        Cobertura de Dados de Despesa
      </h3>
      <div className='flex items-center gap-3 mb-3'>
        <div className='flex-1 h-3 rounded-full bg-gray-800 overflow-hidden'>
          <div
            className='h-full bg-emerald-500 rounded-full transition-all'
            style={{ width: `${pctWith}%` }}
          />
        </div>
        <span className='text-xs text-gray-400 tabular-nums w-12 text-right'>
          {pctWith.toFixed(0)}%
        </span>
      </div>
      <div className='flex items-center justify-between text-xs text-gray-500'>
        <div className='flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-emerald-500' />
          Com despesas: {withExpenses}
        </div>
        <div className='flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-gray-700' />
          Sem despesas: {withoutExpenses}
        </div>
      </div>
      {withoutExpenses > 0 && (
        <div className='mt-3 text-xs text-yellow-600/80 flex items-center gap-1.5'>
          <AlertCircle size={11} />
          {withoutExpenses} projeto(s) sem dados de despesa reduzem a acurácia das médias
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function UnitEconomicsPage() {
  const result  = await fetchCazaVisionRecords()
  const metrics = deriveUnitEconomics(result.data)

  const allFlags = [...result.missingFields, ...metrics.dataQualityFlags]

  return (
    <>
      <Header
        title='Unit Economics'
        subtitle='CAZA VISION · Métricas por unidade — somente o que a base suporta'
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

        {result.data.length > 0 && (
          <>
            {/* Metrics supported by current schema */}
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <BarChart3 size={13} className='text-gray-500' />
                <span className='text-[10px] font-semibold text-gray-600 uppercase tracking-widest'>
                  Métricas disponíveis com o schema atual
                </span>
              </div>
              <div className='grid grid-cols-2 xl:grid-cols-3 gap-4'>
                <MetricCard
                  label='Receita Média por Projeto'
                  value={metrics.receitaMedia !== null ? formatBRL(metrics.receitaMedia) : '—'}
                  sub={metrics.receitaMedia !== null ? `base: ${metrics.totalProjetos - (metrics.totalProjetos - result.recordsValid)} projetos` : 'Campo Valor ausente'}
                  colorClass='text-brand-400'
                  unavailable={metrics.receitaMedia === null}
                />
                <MetricCard
                  label='Despesa Média por Projeto'
                  value={metrics.despesaMediaPorProjeto !== null ? formatBRL(metrics.despesaMediaPorProjeto) : '—'}
                  sub={
                    metrics.projetosComDespesas > 0
                      ? `base: ${metrics.projetosComDespesas} projetos c/ despesa`
                      : 'Campos Alimentação/Gasolina ausentes'
                  }
                  colorClass='text-red-400'
                  unavailable={metrics.despesaMediaPorProjeto === null}
                />
                <MetricCard
                  label='Margem Média Ponderada'
                  value={formatMargin(metrics.margemMediaPonderada)}
                  sub={
                    metrics.margemMediaPonderada !== null
                      ? `${metrics.projetosComDespesas} projetos com dados completos`
                      : 'Indisponível sem dados de despesa'
                  }
                  colorClass={marginColorClass(metrics.margemMediaPonderada)}
                  unavailable={metrics.margemMediaPonderada === null}
                />
              </div>
            </div>

            {/* Coverage distribution */}
            <DistributionBar
              withExpenses={metrics.projetosComDespesas}
              withoutExpenses={metrics.projetosSemDespesas}
              total={metrics.totalProjetos}
            />

            {/* Metrics NOT supported — explicit, not hidden */}
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Info size={13} className='text-gray-600' />
                <span className='text-[10px] font-semibold text-gray-600 uppercase tracking-widest'>
                  Métricas não disponíveis com o schema atual
                </span>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <UnsupportedMetric
                  label='CAC (Custo de Aquisição por Cliente)'
                  reason='Requer campos: Canal de Aquisição + Custo de Marketing — ausentes na base atual'
                />
                <UnsupportedMetric
                  label='LTV (Lifetime Value por Cliente)'
                  reason='Requer campo Cliente com histórico de recorrência — ausente na base atual'
                />
                <UnsupportedMetric
                  label='Margem por Diretor / Responsável'
                  reason='O campo Responsável existe mas não está suficientemente preenchido para esta análise'
                />
                <UnsupportedMetric
                  label='Ticket por Tipo de Projeto'
                  reason='Requer campo Tipo de Projeto (ex: Foto, Vídeo, Live) — ausente na base atual'
                />
              </div>
            </div>

            {/* Improvement note */}
            <div className='card p-5 bg-gray-900/50 border border-gray-800'>
              <div className='flex items-start gap-3'>
                <AlertCircle size={14} className='text-amber-500 mt-0.5 shrink-0' />
                <div>
                  <div className='text-xs font-semibold text-amber-400'>
                    Como melhorar as Unit Economics da CAZA VISION
                  </div>
                  <ul className='mt-2 space-y-1.5 text-xs text-gray-500'>
                    <li>· Preencher <strong className='text-gray-400'>Alimentação</strong> e <strong className='text-gray-400'>Gasolina</strong> em todos os projetos para habilitar margem real</li>
                    <li>· Adicionar campo <strong className='text-gray-400'>Tipo de Projeto</strong> (select) para análise por categoria</li>
                    <li>· Adicionar campo <strong className='text-gray-400'>Cliente</strong> para rastrear recorrência e calcular LTV</li>
                    <li>· Garantir que <strong className='text-gray-400'>COMPETÊNCIA</strong> esteja preenchido em todos os registros</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  )
}
