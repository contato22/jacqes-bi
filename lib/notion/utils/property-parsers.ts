// ─── Notion Property Parsers ──────────────────────────────────────────────────
// Each function receives the raw value from a Notion page's `properties` map
// and returns a typed value, never throwing. Missing/malformed values produce
// the documented fallback so dashboards degrade gracefully instead of crashing.

// Notion's SDK exposes property values as a discriminated union.
// We use `unknown` for the input type and narrow with type guards internally,
// which is safer than casting and works regardless of SDK version.

type NotionPropertyValue = Record<string, unknown> | null | undefined;

// ─── title ────────────────────────────────────────────────────────────────────
// Notion property type: title
// Returns: string | null

export function parseTitle(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "title") return null;
  const arr = prop.title as Array<{ plain_text?: string }> | undefined;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.map((t) => t.plain_text ?? "").join("") || null;
}

// ─── rich_text ────────────────────────────────────────────────────────────────
// Notion property type: rich_text
// Returns: string | null

export function parseRichText(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "rich_text") return null;
  const arr = prop.rich_text as Array<{ plain_text?: string }> | undefined;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.map((t) => t.plain_text ?? "").join("") || null;
}

// ─── number ───────────────────────────────────────────────────────────────────
// Notion property type: number
// Returns: number | null

export function parseNumber(prop: NotionPropertyValue): number | null {
  if (!prop || prop.type !== "number") return null;
  const val = prop.number;
  if (typeof val !== "number" || isNaN(val)) return null;
  return val;
}

// ─── select ───────────────────────────────────────────────────────────────────
// Notion property type: select
// Returns: string | null

export function parseSelect(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "select") return null;
  const sel = prop.select as { name?: string } | null | undefined;
  return sel?.name ?? null;
}

// ─── multi_select ─────────────────────────────────────────────────────────────
// Notion property type: multi_select
// Returns: string[]

export function parseMultiSelect(prop: NotionPropertyValue): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  const arr = prop.multi_select as Array<{ name?: string }> | undefined;
  if (!Array.isArray(arr)) return [];
  return arr.map((s) => s.name ?? "").filter(Boolean);
}

// ─── status ───────────────────────────────────────────────────────────────────
// Notion property type: status
// Returns: string | null

export function parseStatus(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "status") return null;
  const s = prop.status as { name?: string } | null | undefined;
  return s?.name ?? null;
}

// ─── date ─────────────────────────────────────────────────────────────────────
// Notion property type: date
// Returns: string | null  (ISO 8601 start date, e.g. "2025-01-01")

export function parseDate(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "date") return null;
  const d = prop.date as { start?: string } | null | undefined;
  return d?.start ?? null;
}

// ─── checkbox ─────────────────────────────────────────────────────────────────
// Notion property type: checkbox
// Returns: boolean (false as fallback)

export function parseCheckbox(prop: NotionPropertyValue): boolean {
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox === true;
}

// ─── email ────────────────────────────────────────────────────────────────────
// Notion property type: email
// Returns: string | null

export function parseEmail(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "email") return null;
  return typeof prop.email === "string" ? prop.email : null;
}

// ─── url ──────────────────────────────────────────────────────────────────────
// Notion property type: url
// Returns: string | null

export function parseUrl(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "url") return null;
  return typeof prop.url === "string" ? prop.url : null;
}

// ─── phone_number ─────────────────────────────────────────────────────────────
// Returns: string | null

export function parsePhone(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "phone_number") return null;
  return typeof prop.phone_number === "string" ? prop.phone_number : null;
}

// ─── formula ──────────────────────────────────────────────────────────────────
// Notion property type: formula — result can be string, number, boolean, or date.
// Returns the inner value coerced to the requested type, or null.

export function parseFormulaNumber(prop: NotionPropertyValue): number | null {
  if (!prop || prop.type !== "formula") return null;
  const f = prop.formula as { type?: string; number?: number } | undefined;
  if (f?.type !== "number" || typeof f.number !== "number") return null;
  return isNaN(f.number) ? null : f.number;
}

export function parseFormulaString(prop: NotionPropertyValue): string | null {
  if (!prop || prop.type !== "formula") return null;
  const f = prop.formula as { type?: string; string?: string } | undefined;
  if (f?.type !== "string") return null;
  return typeof f.string === "string" ? f.string : null;
}

// ─── rollup ───────────────────────────────────────────────────────────────────
// Notion property type: rollup — result type varies by aggregation.
// We support the most common: number.

export function parseRollupNumber(prop: NotionPropertyValue): number | null {
  if (!prop || prop.type !== "rollup") return null;
  const r = prop.rollup as { type?: string; number?: number } | undefined;
  if (r?.type !== "number" || typeof r.number !== "number") return null;
  return isNaN(r.number) ? null : r.number;
}

// ─── relation ─────────────────────────────────────────────────────────────────
// Notion property type: relation
// Returns: string[]  (array of related page IDs)

export function parseRelation(prop: NotionPropertyValue): string[] {
  if (!prop || prop.type !== "relation") return [];
  const arr = prop.relation as Array<{ id?: string }> | undefined;
  if (!Array.isArray(arr)) return [];
  return arr.map((r) => r.id ?? "").filter(Boolean);
}

// ─── people ───────────────────────────────────────────────────────────────────
// Returns display names of all assigned people.

export function parsePeople(prop: NotionPropertyValue): string[] {
  if (!prop || prop.type !== "people") return [];
  const arr = prop.people as Array<{ name?: string }> | undefined;
  if (!Array.isArray(arr)) return [];
  return arr.map((p) => p.name ?? "").filter(Boolean);
}

// ─── Utility: resolve a property by one of several possible names ─────────────
// Notion databases can have different property names across BUs.
// This function tries each candidate key in order and returns the first match.

export function resolveProp(
  properties: Record<string, unknown>,
  candidates: string[]
): NotionPropertyValue {
  for (const key of candidates) {
    if (key in properties) {
      return properties[key] as NotionPropertyValue;
    }
  }
  return null;
}

// ─── Utility: coerce currency strings to numbers ─────────────────────────────
// Some Notion databases store money as "R$ 1.200,00" or "1200.00".
// Returns null if the string cannot be parsed.

export function parseCurrencyString(value: string | null): number | null {
  if (!value) return null;
  // Remove currency symbols, spaces, and thousand separators (. and ,)
  const cleaned = value
    .replace(/[^0-9,.-]/g, "")   // keep digits, comma, dot, dash
    .replace(/\.(?=\d{3})/g, "") // remove thousands dot: 1.200 → 1200
    .replace(",", ".");           // Brazilian decimal comma → dot
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}
