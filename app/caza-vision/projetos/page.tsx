// ─── CAZA VISION — Projetos ────────────────────────────────────────────────────
// Shows all project records from the real Notion database.
// Margin is only displayed when expense data is available.
// RULE: missing expenses → margin = "—", NOT 100%.

import { FolderOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchCazaVisionRecords } from '@/lib/caza-vision/fetcher'
import {
  formatBRL,
  formatMargin,
  marginColorClass,
  formatDateResult,
  formatCompetencia,
  priorityBadgeClass,
} from '@/lib/caza-vision/utils'
import type { ProjectRecord } from '@/lib/caza-vision/types'

// ── Margin cell — strict rule ──────────────────────────────────────────────────

function MarginCell({ record }: { record: ProjectRecord }) {
  if (record.valor === null) {
    return <span className='text-gray-700 text-xs'>sem receita</span>
  }
  if (!record.hasExpenses) {
    return (
      <span className='text-gray-600 text-xs' title='Dados de despesa não preenchidos na base'>
        —
      </span>
    )
  }
  return (
    <span className={`font-semibold tabular-nums ${marginColorClass(record.margin)}`}>
      {formatMargin(record.margin)}
    </span>
  )
}

// ── Status badge ───────────────────────────────────────────────────────────────

function RecebidoBadge({ recebido }: { recebido: boolean }) {
  return recebido ? (
    <span className='badge badge-green flex items-center gap-1 w-fit'>
      <CheckCircle size={10} />
      Recebido
    </span>
  ) : (
    <span className='badge badge-yellow flex items-center gap-1 w-fit'>
      <Clock size={10} />
      Pendente
    </span>
  )
}

// ── Summary card ───────────────────────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon:   React.ReactNode
  label:  string
  value:  string
  accent: string
}) {
  return (
    <div className='card p-5 flex items-center gap-4'>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <div className='text-2xl font-bold text-white tabular-nums'>{value}</div>
        <div className='text-xs text-gray-500 mt-0.5'>{label}</div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ProjetosPage() {
  const result = await fetchCazaVisionRecords()
  const records = result.data

  const recebidos  = records.filter((r) => r.recebido)
  const pendentes  = records.filter((r) => !r.recebido)
  const comValor   = records.filter((r) => r.valor !== null)
  const receitaTotal = comValor.reduce((s, r) => s + r.valor!, 0)

  const allFlags = result.missingFields

  return (
    <>
      <Header
        title='Projetos'
        subtitle='CAZA VISION · Todos os projetos da base real'
      />

      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={result.status}
          errorMessage={result.errorMessage}
          flags={allFlags}
          recordsTotal={result.recordsTotal}
          recordsValid={result.recordsValid}
          recordsDiscarded={result.recordsDiscarded}
          fetchedAt={result.fetchedAt}
        />

        {/* Summary row */}
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <SummaryCard
            icon={<FolderOpen size={18} className='text-amber-400' />}
            label='Total de Projetos'
            value={String(records.length)}
            accent='bg-amber-500/10 border border-amber-500/20'
          />
          <SummaryCard
            icon={<CheckCircle size={18} className='text-emerald-400' />}
            label='Recebidos'
            value={String(recebidos.length)}
            accent='bg-emerald-500/10 border border-emerald-500/20'
          />
          <SummaryCard
            icon={<Clock size={18} className='text-yellow-400' />}
            label='Pendentes'
            value={String(pendentes.length)}
            accent='bg-yellow-500/10 border border-yellow-500/20'
          />
          <SummaryCard
            icon={<AlertCircle size={18} className='text-brand-400' />}
            label='Receita Total'
            value={receitaTotal > 0 ? formatBRL(receitaTotal, true) : '—'}
            accent='bg-brand-500/10 border border-brand-500/20'
          />
        </div>

        {/* Projects table */}
        {records.length > 0 ? (
          <div className='card p-6'>
            <div className='mb-5'>
              <h2 className='text-sm font-semibold text-white'>
                Tabela de Projetos
              </h2>
              <p className='text-xs text-gray-500 mt-0.5'>
                Dados diretos da base Notion · margem exibida apenas quando despesas estão disponíveis
              </p>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-800'>
                    {[
                      'Projeto',
                      'Responsável',
                      'Prioridade',
                      'Competência',
                      'Valor',
                      'Alimentação',
                      'Gasolina',
                      'Margem',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className='text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'
                    >
                      {/* Project name */}
                      <td className='py-3 pr-4'>
                        <div className='font-medium text-gray-200 max-w-[200px] truncate'>
                          {r.name}
                        </div>
                        {r.dataQualityFlags.length > 0 && (
                          <div className='text-[10px] text-yellow-600 mt-0.5 flex items-center gap-1'>
                            <AlertCircle size={9} />
                            {r.dataQualityFlags.length} aviso(s)
                          </div>
                        )}
                      </td>

                      {/* Responsible */}
                      <td className='py-3 pr-4 text-gray-400 text-xs'>
                        {r.responsible ?? <span className='text-gray-700'>—</span>}
                      </td>

                      {/* Priority */}
                      <td className='py-3 pr-4'>
                        {r.priority ? (
                          <span className={`badge ${priorityBadgeClass(r.priority)}`}>
                            {r.priority}
                          </span>
                        ) : (
                          <span className='text-gray-700'>—</span>
                        )}
                      </td>

                      {/* Competência */}
                      <td className='py-3 pr-4 text-gray-400 text-xs tabular-nums whitespace-nowrap'>
                        {formatCompetencia(r.competencia)}
                        {r.competencia.ambiguous && (
                          <span className='ml-1 text-yellow-600' title={r.competencia.dataQualityFlag ?? ''}>⚠</span>
                        )}
                      </td>

                      {/* Valor */}
                      <td className='py-3 pr-4 text-white tabular-nums font-semibold'>
                        {r.valor !== null ? formatBRL(r.valor) : <span className='text-gray-700'>—</span>}
                      </td>

                      {/* Alimentação */}
                      <td className='py-3 pr-4 text-gray-400 tabular-nums'>
                        {r.alimentacao !== null ? formatBRL(r.alimentacao) : <span className='text-gray-700'>—</span>}
                      </td>

                      {/* Gasolina */}
                      <td className='py-3 pr-4 text-gray-400 tabular-nums'>
                        {r.gasolina !== null ? formatBRL(r.gasolina) : <span className='text-gray-700'>—</span>}
                      </td>

                      {/* Margem — never assumed */}
                      <td className='py-3 pr-4'>
                        <MarginCell record={r} />
                      </td>

                      {/* Recebido status */}
                      <td className='py-3'>
                        <RecebidoBadge recebido={r.recebido} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div className='mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-xs text-gray-600'>
              <AlertCircle size={12} />
              Margem exibida como "—" indica ausência de dados de despesa no Notion — não representa lucro de 100%.
            </div>
          </div>
        ) : (
          result.status === 'ok' || result.status === 'empty' ? (
            <div className='card p-10 text-center'>
              <FolderOpen size={24} className='text-gray-600 mx-auto mb-3' />
              <p className='text-sm text-gray-500'>Nenhum projeto encontrado na base.</p>
            </div>
          ) : null
        )}

      </div>
    </>
  )
}
