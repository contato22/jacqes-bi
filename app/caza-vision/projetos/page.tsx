// ─── CAZA VISION — Projetos ────────────────────────────────────────────────────

import { FolderOpen, Clock, CheckCircle, Edit3, AlertCircle, Users } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchProjetos } from '@/lib/caza-vision/fetcher'
import { formatBRL } from '@/lib/caza-vision/utils'
import type { ProjetoRecord, ProjetoStatus, ProjetoTipo } from '@/lib/caza-vision/types'

// ── Status config ──────────────────────────────────────────────────────────────

const STATUS_CFG: Record<ProjetoStatus, { badge: string; icon: React.ReactNode }> = {
  'Em Produção':         { badge: 'badge-blue',   icon: <Clock size={10} /> },
  'Em Edição':           { badge: 'badge-yellow',  icon: <Edit3 size={10} /> },
  'Aguardando Aprovação':{ badge: 'badge-gray',    icon: <AlertCircle size={10} /> },
  'Entregue':            { badge: 'badge-green',   icon: <CheckCircle size={10} /> },
}

const TIPO_CFG: Record<ProjetoTipo, string> = {
  'Vídeo Publicitário': 'badge-blue',
  'Filme Institucional': 'badge-purple',
  'Evento / Live':       'badge-yellow',
  'Conteúdo Digital':    'badge-green',
  'Fotografia':          'badge-red',
}

function StatusBadge({ status }: { status: ProjetoStatus | null }) {
  if (!status) return <span className='text-gray-700'>—</span>
  const cfg = STATUS_CFG[status]
  return (
    <span className={`badge ${cfg.badge} flex items-center gap-1 w-fit`}>
      {cfg.icon}
      {status}
    </span>
  )
}

function TipoBadge({ tipo }: { tipo: ProjetoTipo | null }) {
  if (!tipo) return <span className='text-gray-700'>—</span>
  return <span className={`badge ${TIPO_CFG[tipo]}`}>{tipo}</span>
}

function SummaryCard({ label, value, icon, accent }: {
  label: string; value: string; icon: React.ReactNode; accent: string
}) {
  return (
    <div className='card p-5 flex items-center gap-4'>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
      <div>
        <div className='text-2xl font-bold text-white tabular-nums'>{value}</div>
        <div className='text-xs text-gray-500 mt-0.5'>{label}</div>
      </div>
    </div>
  )
}

export default async function ProjetosPage() {
  const result  = await fetchProjetos()
  const records: ProjetoRecord[] = result.data

  const ativos    = records.filter((r) => r.status && r.status !== 'Entregue')
  const entregues = records.filter((r) => r.status === 'Entregue')
  const comValor  = records.filter((r) => r.valor !== null)
  const receita   = comValor.reduce((s, r) => s + r.valor!, 0)
  const clientes  = [...new Set(records.map((r) => r.cliente).filter(Boolean))]

  return (
    <>
      <Header title='Projetos' subtitle='CAZA VISION · Todos os projetos' />
      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={result.status}
          fetchedAt={result.fetchedAt}
        />

        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <SummaryCard label='Total' value={String(records.length)}
            icon={<FolderOpen size={18} className='text-amber-400' />}
            accent='bg-amber-500/10 border border-amber-500/20' />
          <SummaryCard label='Em Andamento' value={String(ativos.length)}
            icon={<Clock size={18} className='text-brand-400' />}
            accent='bg-brand-500/10 border border-brand-500/20' />
          <SummaryCard label='Entregues' value={String(entregues.length)}
            icon={<CheckCircle size={18} className='text-emerald-400' />}
            accent='bg-emerald-500/10 border border-emerald-500/20' />
          <SummaryCard label='Clientes Únicos' value={String(clientes.length)}
            icon={<Users size={18} className='text-purple-400' />}
            accent='bg-purple-500/10 border border-purple-500/20' />
        </div>

        {receita > 0 && (
          <div className='card p-5 flex items-center justify-between'>
            <div>
              <div className='text-xs text-gray-500 uppercase tracking-widest font-semibold'>
                Volume Total de Projetos
              </div>
              <div className='text-3xl font-bold text-white mt-1 tabular-nums'>
                {formatBRL(receita)}
              </div>
            </div>
            <div className='text-right text-xs text-gray-600'>
              <div>Ticket médio</div>
              <div className='text-lg font-bold text-gray-300 mt-1 tabular-nums'>
                {formatBRL(receita / comValor.length)}
              </div>
            </div>
          </div>
        )}

        {records.length > 0 ? (
          <div className='card p-6'>
            <div className='mb-5'>
              <h2 className='text-sm font-semibold text-white'>Tabela de Projetos</h2>
              <p className='text-xs text-gray-500 mt-0.5'>Fonte: Caza Vision — Projetos</p>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-800'>
                    {['Título', 'Cliente', 'Tipo', 'Status', 'Início', 'Prazo', 'Valor'].map((h) => (
                      <th key={h} className='text-left pb-3 pr-5 text-[10px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'>
                      <td className='py-3 pr-5'>
                        <div className='font-medium text-gray-200 max-w-[200px] truncate'>{r.titulo}</div>
                        {r.diretor && (
                          <div className='text-xs text-gray-600 mt-0.5'>Dir.: {r.diretor}</div>
                        )}
                      </td>
                      <td className='py-3 pr-5 text-gray-400 text-xs'>
                        {r.cliente ?? <span className='text-gray-700'>—</span>}
                      </td>
                      <td className='py-3 pr-5'><TipoBadge tipo={r.tipo} /></td>
                      <td className='py-3 pr-5'><StatusBadge status={r.status} /></td>
                      <td className='py-3 pr-5 text-gray-500 text-xs tabular-nums whitespace-nowrap'>
                        {r.inicio ? r.inicio.toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className='py-3 pr-5 text-gray-500 text-xs tabular-nums whitespace-nowrap'>
                        {r.prazo ? r.prazo.toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className='py-3 text-white font-semibold tabular-nums'>
                        {r.valor !== null ? formatBRL(r.valor) : <span className='text-gray-700'>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
