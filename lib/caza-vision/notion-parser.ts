// ─── CAZA VISION — Resilient Notion Property Parser ────────────────────────────
//
// Every extractor is safe: returns null/[] on missing/invalid input.
// Date parser handles: dd/mm/yyyy (BR), mm/dd/yyyy (US), ISO, Notion date objects.
// Ambiguous dates are flagged with dataQualityFlag, not silently discarded.

import type { DateParseResult, DateFormat } from './types'

type RawProp = Record<string, unknown>

// ── Safe property accessor ─────────────────────────────────────────────────────

export function getProp(
  properties: Record<string, unknown>,
  name: string
): unknown | undefined {
  return properties?.[name]
}

// ── Title ─────────────────────────────────────────────────────────────────────

export function extractTitle(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'title') return null
    const arr = p.title as Array<{ plain_text?: string }>
    if (!arr?.length) return null
    return arr.map((t) => t.plain_text ?? '').join('').trim() || null
  } catch {
    return null
  }
}

// ── Rich text ─────────────────────────────────────────────────────────────────

export function extractRichText(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'rich_text') return null
    const arr = p.rich_text as Array<{ plain_text?: string }>
    if (!arr?.length) return null
    return arr.map((t) => t.plain_text ?? '').join('').trim() || null
  } catch {
    return null
  }
}

// ── Number ────────────────────────────────────────────────────────────────────

export function extractNumber(prop: unknown): number | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'number') return null
    const v = p.number
    if (v === null || v === undefined) return null
    const n = Number(v)
    return isNaN(n) ? null : n
  } catch {
    return null
  }
}

// ── Checkbox ──────────────────────────────────────────────────────────────────

export function extractCheckbox(prop: unknown): boolean {
  try {
    const p = prop as RawProp
    if (p?.type !== 'checkbox') return false
    return Boolean(p.checkbox)
  } catch {
    return false
  }
}

// ── Select ────────────────────────────────────────────────────────────────────

export function extractSelect(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'select') return null
    const sel = p.select as { name?: string } | null
    return sel?.name?.trim() ?? null
  } catch {
    return null
  }
}

// ── Multi-select ──────────────────────────────────────────────────────────────

export function extractMultiSelect(prop: unknown): string[] {
  try {
    const p = prop as RawProp
    if (p?.type !== 'multi_select') return []
    const arr = p.multi_select as Array<{ name?: string }>
    return arr?.map((s) => s.name ?? '').filter(Boolean) ?? []
  } catch {
    return []
  }
}

// ── Status ────────────────────────────────────────────────────────────────────

export function extractStatus(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'status') return null
    const sel = p.status as { name?: string } | null
    return sel?.name?.trim() ?? null
  } catch {
    return null
  }
}

// ── People ────────────────────────────────────────────────────────────────────

export function extractPeople(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'people') return null
    const arr = p.people as Array<{ name?: string; id?: string }>
    if (!arr?.length) return null
    return arr
      .map((person) => person.name?.trim() ?? person.id ?? 'Desconhecido')
      .join(', ')
  } catch {
    return null
  }
}

// ── Formula ───────────────────────────────────────────────────────────────────

export function extractFormula(
  prop: unknown
): string | number | boolean | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'formula') return null
    const formula = p.formula as RawProp
    if (!formula) return null
    switch (formula.type) {
      case 'string':  return (formula.string  as string  | null) ?? null
      case 'number':  return (formula.number  as number  | null) ?? null
      case 'boolean': return (formula.boolean as boolean | null) ?? null
      case 'date': {
        const d = formula.date as { start?: string } | null
        return d?.start ?? null
      }
      default: return null
    }
  } catch {
    return null
  }
}

// ── Rollup ────────────────────────────────────────────────────────────────────

export function extractRollupNumber(prop: unknown): number | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'rollup') return null
    const rollup = p.rollup as RawProp
    if (rollup?.type === 'number') {
      const v = rollup.number
      if (v === null || v === undefined) return null
      const n = Number(v)
      return isNaN(n) ? null : n
    }
    return null
  } catch {
    return null
  }
}

// ── Email ─────────────────────────────────────────────────────────────────────

export function extractEmail(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'email') return null
    return (p.email as string | null) ?? null
  } catch {
    return null
  }
}

// ── Phone number ──────────────────────────────────────────────────────────────

export function extractPhoneNumber(prop: unknown): string | null {
  try {
    const p = prop as RawProp
    if (p?.type !== 'phone_number') return null
    return (p.phone_number as string | null) ?? null
  } catch {
    return null
  }
}

// ── Date parsing ───────────────────────────────────────────────────────────────
//
// Supported formats:
//   ISO:       2025-09-04  /  2025-09-04T00:00:00.000Z
//   BR:        04/09/2025  (day/month/year)
//   US:        09/04/2025  (month/day/year) — inferred when day > 12
//   Ambiguous: 04/09/2025  → both BR and US valid → flagged, defaulted to BR
//
// Heuristic for slash dates:
//   first part > 12  → must be DD → BR  (dd/mm/yyyy)
//   second part > 12 → must be DD → US  (mm/dd/yyyy)
//   both ≤ 12        → ambiguous  → BR assumed, flagged

function makeDateResult(
  date: Date | null,
  format: DateFormat,
  ambiguous: boolean,
  raw: string | null,
  dataQualityFlag: string | null
): DateParseResult {
  return { date, format, ambiguous, raw, dataQualityFlag }
}

export function parseDate(raw: string | null | undefined): DateParseResult {
  if (!raw) {
    return makeDateResult(null, 'unknown', false, null, null)
  }

  const str = raw.trim()
  if (!str) {
    return makeDateResult(null, 'unknown', false, null, null)
  }

  // ── ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss...Z ────────────────────
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str.includes('T') ? str : `${str}T00:00:00`)
    if (!isNaN(d.getTime())) {
      return makeDateResult(d, 'iso', false, str, null)
    }
    return makeDateResult(
      null,
      'unknown',
      false,
      str,
      `Data ISO inválida: "${str}"`
    )
  }

  // ── Slash-separated: xx/xx/xxxx ───────────────────────────────────────────
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const a = parseInt(slashMatch[1], 10)
    const b = parseInt(slashMatch[2], 10)
    const y = parseInt(slashMatch[3], 10)

    const aCanBeMonth = a >= 1 && a <= 12
    const bCanBeMonth = b >= 1 && b <= 12

    // Neither part can be a month — invalid
    if (!aCanBeMonth && !bCanBeMonth) {
      return makeDateResult(
        null,
        'unknown',
        false,
        str,
        `Data inválida — nenhuma parte é um mês válido: "${str}"`
      )
    }

    // 'a' > 12 → a is the day (DD/MM/YYYY — BR)
    if (!aCanBeMonth) {
      const d = new Date(y, b - 1, a)
      if (!isNaN(d.getTime()) && d.getDate() === a) {
        return makeDateResult(d, 'br', false, str, null)
      }
    }

    // 'b' > 12 → b is the day (MM/DD/YYYY — US)
    if (!bCanBeMonth) {
      const d = new Date(y, a - 1, b)
      if (!isNaN(d.getTime()) && d.getDate() === b) {
        return makeDateResult(d, 'us', false, str, null)
      }
    }

    // Both ≤ 12 → ambiguous — default to BR (dd/mm/yyyy), flag it
    const d = new Date(y, b - 1, a) // BR assumption
    return makeDateResult(
      isNaN(d.getTime()) ? null : d,
      'br',
      true,
      str,
      `Data ambígua "${str}" — interpretada como DD/MM/AAAA (padrão BR)`
    )
  }

  // ── Could not parse ────────────────────────────────────────────────────────
  return makeDateResult(
    null,
    'unknown',
    false,
    str,
    `Formato de data não reconhecido: "${str}"`
  )
}

// Extracts a date from a Notion property of type 'date', 'rich_text', or 'formula'
export function extractDate(prop: unknown): DateParseResult {
  try {
    const p = prop as RawProp

    if (p?.type === 'date') {
      const dateObj = p.date as { start?: string } | null
      if (!dateObj?.start) {
        return makeDateResult(null, 'notion-date', false, null, null)
      }
      return { ...parseDate(dateObj.start), format: 'notion-date' }
    }

    if (p?.type === 'rich_text') {
      return parseDate(extractRichText(prop))
    }

    if (p?.type === 'formula') {
      const val = extractFormula(prop)
      return parseDate(typeof val === 'string' ? val : null)
    }

    // Property type not date-related — no date available
    return makeDateResult(null, 'unknown', false, null, null)
  } catch {
    return makeDateResult(
      null,
      'unknown',
      false,
      null,
      'Erro interno ao extrair data da propriedade'
    )
  }
}
