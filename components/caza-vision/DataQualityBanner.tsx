// ─── CAZA VISION — Data Quality Banner ────────────────────────────────────────
// Shows structured warnings about data quality issues detected during fetch/parse.
// Used to surface problems WITHOUT hiding the page or falling back to mock data.

import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react'
import type { FetchStatus } from '@/lib/caza-vision/types'
import { fetchStatusLabel } from '@/lib/caza-vision/utils'

interface DataQualityBannerProps {
  status:        FetchStatus
  errorMessage?: string | null
  flags?:        string[]
  recordsTotal?:     number
  recordsValid?:     number
  recordsDiscarded?: number
  fetchedAt?:    string
}

export default function DataQualityBanner({
  status,
  errorMessage,
  flags = [],
  recordsTotal,
  recordsValid,
  recordsDiscarded,
  fetchedAt,
}: DataQualityBannerProps) {
  if (status === 'ok' && flags.length === 0) return null

  const isError   = status === 'api_error' || status === 'parse_error'
  const isWarning = status === 'ok' && flags.length > 0
  const isEmpty   = status === 'empty'
  const isNoCreds = status === 'no_credentials'

  const bgClass = isError || isNoCreds
    ? 'bg-red-500/10 border-red-500/20'
    : isEmpty
    ? 'bg-gray-800/60 border-gray-700/40'
    : 'bg-yellow-500/10 border-yellow-500/20'

  const iconClass = isError || isNoCreds
    ? 'text-red-400'
    : isEmpty
    ? 'text-gray-500'
    : 'text-yellow-400'

  const Icon = isError || isNoCreds
    ? XCircle
    : isEmpty
    ? Info
    : isWarning
    ? AlertTriangle
    : CheckCircle

  const title = isNoCreds
    ? 'Credenciais não configuradas'
    : isError
    ? 'Erro ao carregar dados'
    : isEmpty
    ? 'Base de dados vazia'
    : 'Aviso de qualidade de dados'

  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <div className='flex items-start gap-3'>
        <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} />
        <div className='flex-1 min-w-0'>
          <div className={`text-sm font-semibold ${iconClass}`}>{title}</div>

          {/* Status label + fetch info */}
          <div className='text-xs text-gray-500 mt-1'>
            {fetchStatusLabel(status)}
            {recordsTotal !== undefined && (
              <span className='ml-2'>
                · {recordsTotal} registros lidos
                {recordsValid !== undefined && ` / ${recordsValid} válidos`}
                {recordsDiscarded !== undefined && recordsDiscarded > 0 && (
                  <span className='text-yellow-500'>
                    {' '}· {recordsDiscarded} descartados
                  </span>
                )}
              </span>
            )}
            {fetchedAt && (
              <span className='ml-2 text-gray-600'>
                · {new Date(fetchedAt).toLocaleTimeString('pt-BR')}
              </span>
            )}
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className='mt-2 text-xs font-mono text-red-300 bg-red-900/20 rounded px-2 py-1.5 break-all'>
              {errorMessage}
            </div>
          )}

          {/* Setup instructions for missing credentials */}
          {isNoCreds && (
            <div className='mt-3 text-xs text-gray-400 space-y-1'>
              <p>Para conectar à base real do Notion:</p>
              <ol className='list-decimal list-inside space-y-0.5 text-gray-500'>
                <li>Crie um arquivo <code className='text-gray-300'>.env.local</code> na raiz do projeto</li>
                <li>Adicione <code className='text-gray-300'>NOTION_TOKEN=secret_xxx</code></li>
                <li>Adicione <code className='text-gray-300'>CAZA_VISION_DB_ID=&lt;uuid da base&gt;</code></li>
                <li>Reinicie o servidor de desenvolvimento</li>
              </ol>
            </div>
          )}

          {/* Data quality flags */}
          {flags.length > 0 && (
            <ul className='mt-2 space-y-0.5'>
              {[...new Set(flags)].map((flag, i) => (
                <li key={i} className='text-xs text-yellow-300/80 flex items-start gap-1.5'>
                  <span className='text-yellow-500 mt-0.5'>·</span>
                  {flag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
