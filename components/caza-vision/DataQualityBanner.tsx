// ─── CAZA VISION — Data Quality Banner ────────────────────────────────────────

import { Info, CheckCircle } from 'lucide-react'
import type { FetchStatus } from '@/lib/caza-vision/types'

interface DataQualityBannerProps {
  status:       FetchStatus
  errorMessage?: string | null
  fetchedAt?:   string
}

export default function DataQualityBanner({ status, fetchedAt }: DataQualityBannerProps) {
  // Only render a banner when the base is empty
  if (status !== 'empty') return null

  return (
    <div className='rounded-xl border border-gray-700/40 bg-gray-800/60 p-4'>
      <div className='flex items-start gap-3'>
        <Info size={16} className='mt-0.5 shrink-0 text-gray-500' />
        <div className='flex-1 min-w-0'>
          <div className='text-sm font-semibold text-gray-400'>Base de dados vazia</div>
          <div className='text-xs text-gray-500 mt-1'>
            Nenhum registro encontrado.
            {fetchedAt && (
              <span className='ml-2 text-gray-600'>
                · {new Date(fetchedAt).toLocaleTimeString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
