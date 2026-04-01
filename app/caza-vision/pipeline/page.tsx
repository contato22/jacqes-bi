// ─── CAZA VISION — Pipeline ────────────────────────────────────────────────────
// This page EXISTS (no 404) but shows a structured empty state explaining
// what schema additions are needed in Notion to activate pipeline tracking.
//
// The CAZA VISION base currently lacks a Status/Stage field, so pipeline
// functionality cannot be built without inventing data.

import Header from '@/components/Header'
import { PipelineEmptyState } from '@/components/caza-vision/EmptyState'

export default function PipelinePage() {
  return (
    <>
      <Header
        title='Pipeline'
        subtitle='CAZA VISION · Estágios de produção'
      />

      <div className='px-8 py-12 flex justify-center'>
        <PipelineEmptyState />
      </div>
    </>
  )
}
