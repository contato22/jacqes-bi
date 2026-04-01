// ─── CAZA VISION — Notion Source Configuration ─────────────────────────────────
//
// Three real databases in the workspace:
//   Caza Vision — Projetos   (308e2d13-dfa9-433e-a0f6-8439b5181845)
//   Caza Vision — Financeiro (9a8329e9-6d19-4bdc-8e80-2d59a2658be7)
//   Caza Vision — Clientes   (ca1ba0fe-3d47-4356-8643-23a223a4e710)
//
// Required .env.local variables:
//   NOTION_TOKEN
//   CAZA_PROJETOS_DB_ID
//   CAZA_FINANCEIRO_DB_ID
//   CAZA_CLIENTES_DB_ID

export const CAZA_VISION_CONFIG = {
  notionToken:   process.env.NOTION_TOKEN           ?? '',
  notionVersion: '2022-06-28'                       as const,
  baseUrl:       'https://api.notion.com/v1'        as const,

  databases: {
    projetos:   process.env.CAZA_PROJETOS_DB_ID    ?? '',
    financeiro: process.env.CAZA_FINANCEIRO_DB_ID  ?? '',
    clientes:   process.env.CAZA_CLIENTES_DB_ID    ?? '',
  },

  // Exact property names as they exist in each Notion database
  fieldMaps: {
    projetos: {
      titulo:  'Título',
      cliente: 'Cliente',
      diretor: 'Diretor',
      inicio:  'Início',
      prazo:   'Prazo',
      status:  'Status',
      tipo:    'Tipo',
      valor:   'Valor',
    } as const,

    financeiro: {
      mes:       'Mês',
      receita:   'Receita',
      orcamento: 'Orçamento',
      despesas:  'Despesas',
      lucro:     'Lucro',
    } as const,

    clientes: {
      nome:        'Nome',
      email:       'Email',
      segmento:    'Segmento',
      status:      'Status',
      desde:       'Desde',
      telefone:    'Telefone',
      budgetAnual: 'Budget Anual',
      tipo:        'Tipo',
    } as const,
  },
} as const

export function hasCredentials(): boolean {
  const { notionToken, databases } = CAZA_VISION_CONFIG
  return !!(
    notionToken &&
    databases.projetos &&
    databases.financeiro &&
    databases.clientes
  )
}

export function missingCredentials(): string[] {
  const missing: string[] = []
  if (!CAZA_VISION_CONFIG.notionToken)             missing.push('NOTION_TOKEN')
  if (!CAZA_VISION_CONFIG.databases.projetos)      missing.push('CAZA_PROJETOS_DB_ID')
  if (!CAZA_VISION_CONFIG.databases.financeiro)    missing.push('CAZA_FINANCEIRO_DB_ID')
  if (!CAZA_VISION_CONFIG.databases.clientes)      missing.push('CAZA_CLIENTES_DB_ID')
  return missing
}
