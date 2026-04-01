// ─── CAZA VISION — Formatting Utilities ────────────────────────────────────────

// ── Currency: BRL ──────────────────────────────────────────────────────────────

export function formatBRL(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)     return `R$ ${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('pt-BR', {
    style:                'currency',
    currency:             'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

// ── Margin display ─────────────────────────────────────────────────────────────

export function formatMargin(margin: number | null): string {
  if (margin === null) return '—'
  return `${margin.toFixed(1)}%`
}

export function marginColorClass(margin: number | null): string {
  if (margin === null) return 'text-gray-500'
  if (margin >= 60)   return 'text-emerald-400'
  if (margin >= 30)   return 'text-yellow-400'
  return 'text-red-400'
}

// ── Fetch status labels ────────────────────────────────────────────────────────

import type { FetchStatus } from './types'

export function fetchStatusLabel(status: FetchStatus): string {
  switch (status) {
    case 'ok':    return 'Dados carregados'
    case 'empty': return 'Base vazia'
  }
}
