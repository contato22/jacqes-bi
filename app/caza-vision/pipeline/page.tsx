// ─── CAZA VISION — Pipeline ────────────────────────────────────────────────────
// Projetos agrupados por estágio de produção.
// Usa o campo Status da base Projetos: Em Produção → Em Edição → Aguardando Aprovação → Entregue

import { Clock, Edit3, AlertCircle, CheckCircle, FolderOpen } from 'lucide-react'
import Header from '@/components/Header'
import DataQualityBanner from '@/components/caza-vision/DataQualityBanner'
import { fetchProjetos, derivePipeline } from '@/lib/caza-vision/fetcher'
import { formatBRL } from '@/lib/caza-vision/utils'
import type { ProjetoStatus, ProjetoRecord } from '@/lib/caza-vision/types'

// ── Stage config ───────────────────────────────────────────────────────────────

const STAGE_CFG: Record<ProjetoStatus, {
  label: string
  icon:  React.ReactNode
  card:  string
  badge: string
  dot:   string
}> = {
  'Em Produção': {
    label: 'Em Produção',
    icon:  <Clock size={14} />,
    card:  'border-brand-500/30 bg-brand-500/5',
    badge: 'badge-blue',
    dot:   'bg-brand-500',
  },
  'Em Edição': {
    label: 'Em Edição',
    icon:  <Edit3 size={14} />,
    card:  'border-amber-500/30 bg-amber-500/5',
    badge: 'badge-yellow',
    dot:   'bg-amber-500',
  },
  'Aguardando Aprovação': {
    label: 'Aguardando Aprovação',
    icon:  <AlertCircle size={14} />,
    card:  'border-gray-600/40 bg-gray-800/30',
    badge: 'badge-gray',
    dot:   'bg-gray-500',
  },
  'Entregue': {
    label: 'Entregue',
    icon:  <CheckCircle size={14} />,
    card:  'border-emerald-500/30 bg-emerald-500/5',
    badge: 'badge-green',
    dot:   'bg-emerald-500',
  },
}

// ── Project card ───────────────────────────────────────────────────────────────

function ProjetoCard({ projeto, cfg }: { projeto: ProjetoRecord; cfg: typeof STAGE_CFG[ProjetoStatus] }) {
  return (
    <div className={`rounded-xl border p-4 ${cfg.card}`}>
      <div className='font-medium text-gray-100 text-sm leading-snug truncate'>{projeto.titulo}</div>
      {projeto.cliente && (
        <div className='text-xs text-gray-500 mt-1 truncate'>{projeto.cliente}</div>
      )}
      <div className='mt-3 flex items-center justify-between gap-2'>
        {projeto.tipo ? (
          <span className='text-[10px] text-gray-500 bg-gray-800 rounded px-2 py-0.5 truncate max-w-[120px]'>
            {projeto.tipo}
          </span>
        ) : <span />}
        {projeto.valor !== null ? (
          <span className='text-xs font-semibold text-white tabular-nums shrink-0'>
            {formatBRL(projeto.valor, true)}
          </span>
        ) : (
          <span className='text-xs text-gray-700 shrink-0'>Sem valor</span>
        )}
      </div>
      {(projeto.prazo || projeto.diretor) && (
        <div className='mt-2 flex items-center justify-between gap-2'>
          {projeto.diretor && (
            <span className='text-[10px] text-gray-600 truncate'>Dir.: {projeto.diretor}</span>
          )}
          {projeto.prazo && (
            <span className='text-[10px] text-gray-600 tabular-nums shrink-0'>
              {projeto.prazo.toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Stage column ───────────────────────────────────────────────────────────────

function StageColumn({
  status, projetos, total, valor,
}: {
  status:   ProjetoStatus
  projetos: ProjetoRecord[]
  total:    number
  valor:    number
}) {
  const cfg = STAGE_CFG[status]
  return (
    <div className='flex flex-col min-w-[260px] flex-1'>
      {/* Column header */}
      <div className='flex items-center gap-2 mb-3'>
        <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        <span className='text-xs font-semibold text-gray-300'>{cfg.label}</span>
        <span className='ml-auto text-[10px] text-gray-600 tabular-nums'>{total}</span>
      </div>

      {/* Valor total da coluna */}
      {valor > 0 && (
        <div className='text-xs text-gray-600 tabular-nums mb-3 -mt-1 pl-4'>
          {formatBRL(valor, true)}
        </div>
      )}

      {/* Cards */}
      <div className='space-y-3'>
        {projetos.map((p) => (
          <ProjetoCard key={p.id} projeto={p} cfg={cfg} />
        ))}
        {projetos.length === 0 && (
          <div className='rounded-xl border border-gray-800/50 border-dashed p-4 text-center'>
            <span className='text-xs text-gray-700'>Nenhum projeto</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function PipelinePage() {
  const result   = await fetchProjetos()
  const pipeline = derivePipeline(result.data)

  const totalAtivos = pipeline
    .filter((g) => g.status !== 'Entregue')
    .reduce((s, g) => s + g.total, 0)

  const valorEmAberto = pipeline
    .filter((g) => g.status !== 'Entregue')
    .reduce((s, g) => s + g.valor, 0)

  return (
    <>
      <Header title='Pipeline' subtitle='CAZA VISION · Estágios de produção' />
      <div className='px-8 py-6 space-y-6'>

        <DataQualityBanner
          status={result.status}
          fetchedAt={result.fetchedAt}
        />

        {result.data.length > 0 && (
          <>
            {/* Summary strip */}
            <div className='flex flex-wrap items-center gap-4'>
              <div className='card px-5 py-3 flex items-center gap-3'>
                <FolderOpen size={14} className='text-gray-500' />
                <span className='text-sm font-bold text-white tabular-nums'>{result.total}</span>
                <span className='text-xs text-gray-500'>projetos total</span>
              </div>
              <div className='card px-5 py-3 flex items-center gap-3'>
                <Clock size={14} className='text-brand-400' />
                <span className='text-sm font-bold text-white tabular-nums'>{totalAtivos}</span>
                <span className='text-xs text-gray-500'>em andamento</span>
              </div>
              {valorEmAberto > 0 && (
                <div className='card px-5 py-3 flex items-center gap-3'>
                  <span className='text-xs text-gray-500'>Volume em aberto</span>
                  <span className='text-sm font-bold text-white tabular-nums'>
                    {formatBRL(valorEmAberto, true)}
                  </span>
                </div>
              )}
            </div>

            {/* Kanban board */}
            <div className='overflow-x-auto pb-2'>
              <div className='flex gap-5 min-w-max'>
                {pipeline.map((group) => (
                  <StageColumn
                    key={group.status}
                    status={group.status}
                    projetos={group.projetos}
                    total={group.total}
                    valor={group.valor}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {result.status === 'empty' && (
          <div className='card p-10 text-center'>
            <FolderOpen size={24} className='text-gray-600 mx-auto mb-3' />
            <p className='text-sm text-gray-500'>Nenhum projeto encontrado na base.</p>
          </div>
        )}

      </div>
    </>
  )
}
