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

// ── Date display ───────────────────────────────────────────────────────────────

import type { DateParseResult } from './types'

export function formatDateResult(result: DateParseResult): string {
  if (!result.date) return result.raw ? `(${result.raw})` : '—'
  return result.date.toLocaleDateString('pt-BR', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  })
}

export function formatCompetencia(result: DateParseResult): string {
  if (!result.date) return result.raw ? `(${result.raw})` : '—'
  return result.date.toLocaleDateString('pt-BR', {
    month: 'short',
    year:  'numeric',
  })
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace('.', '')
}

// ── Fetch status labels ────────────────────────────────────────────────────────

import type { FetchStatus } from './types'

export function fetchStatusLabel(status: FetchStatus): string {
  switch (status) {
    case 'ok':             return 'Dados carregados'
    case 'empty':          return 'Base vazia'
    case 'no_credentials': return 'Credenciais não configuradas'
    case 'api_error':      return 'Erro na API do Notion'
    case 'parse_error':    return 'Erro ao processar dados'
  }
}

// ── Priority badge ─────────────────────────────────────────────────────────────

export function priorityBadgeClass(priority: string | null): string {
  if (!priority) return 'badge-gray'
  const p = priority.toLowerCase()
  if (p.includes('alta') || p.includes('urgente') || p.includes('high')) return 'badge-red'
  if (p.includes('média') || p.includes('media') || p.includes('medium')) return 'badge-yellow'
  if (p.includes('baixa') || p.includes('low'))  return 'badge-green'
  return 'badge-gray'
}
