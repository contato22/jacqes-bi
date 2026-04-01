// ─── CAZA VISION — Notion Source Configuration ─────────────────────────────────
//
// Required environment variables (add to .env.local):
//   NOTION_TOKEN       = secret_xxxxxxx   (from Notion integration settings)
//   CAZA_VISION_DB_ID  = <database UUID>  (from the CAZA VISION database URL)
//
// The fieldMap maps semantic names to the EXACT property names in Notion.
// If the Notion database has a property renamed, update only here.

export const CAZA_VISION_CONFIG = {
  databaseId:     process.env.CAZA_VISION_DB_ID  ?? '',
  notionToken:    process.env.NOTION_TOKEN        ?? '',
  notionVersion:  '2022-06-28' as const,
  baseUrl:        'https://api.notion.com/v1'     as const,

  // Maps semantic field names → actual Notion property names
  fieldMap: {
    name:        'Nome do projeto',
    priority:    'Prioridade',
    responsible: 'Responsável',
    competencia: 'COMPETÊNCIA',
    recebimento: 'Recebimento',
    recebido:    'Recebido',
    valor:       'Valor',
    alimentacao: 'Alimentação',
    gasolina:    'Gasolina',
  } as const,
} as const

export type FieldKey = keyof typeof CAZA_VISION_CONFIG.fieldMap

export function hasCredentials(): boolean {
  return !!(CAZA_VISION_CONFIG.notionToken && CAZA_VISION_CONFIG.databaseId)
}
