// ─── CAZA VISION — Empty State ─────────────────────────────────────────────────
// Used for pages that lack sufficient schema support in the current Notion base.
// Never shows mock data — explains clearly what's missing and what needs to be done.

import { type LucideIcon, Database, GitBranch, FileText } from 'lucide-react'

interface SchemaRequirement {
  field:       string
  description: string
  required:    boolean
}

interface EmptyStateProps {
  icon?:         LucideIcon
  title:         string
  description:   string
  schemaNeeds?:  SchemaRequirement[]
  hint?:         string
}

export default function EmptyState({
  icon: Icon = Database,
  title,
  description,
  schemaNeeds,
  hint,
}: EmptyStateProps) {
  return (
    <div className='card p-10 flex flex-col items-center text-center max-w-xl mx-auto'>
      <div className='w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4'>
        <Icon size={22} className='text-gray-500' />
      </div>
      <h3 className='text-sm font-semibold text-white'>{title}</h3>
      <p className='text-xs text-gray-500 mt-1.5 max-w-sm'>{description}</p>

      {schemaNeeds && schemaNeeds.length > 0 && (
        <div className='mt-6 w-full text-left'>
          <p className='text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3'>
            Campos necessários na base do Notion
          </p>
          <div className='space-y-2'>
            {schemaNeeds.map((need) => (
              <div
                key={need.field}
                className='flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-800'
              >
                <span
                  className={`mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    need.required
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {need.required ? 'obrigatório' : 'opcional'}
                </span>
                <div>
                  <div className='text-xs font-semibold text-gray-300 font-mono'>
                    {need.field}
                  </div>
                  <div className='text-xs text-gray-600 mt-0.5'>{need.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hint && (
        <p className='mt-5 text-xs text-gray-600 italic'>{hint}</p>
      )}
    </div>
  )
}

// ── Pre-configured empty states ────────────────────────────────────────────────

export function PipelineEmptyState() {
  return (
    <EmptyState
      icon={GitBranch}
      title='Pipeline indisponível'
      description='A página de Pipeline requer um campo de status ou estágio de produção na base do Notion para funcionar. Atualmente a base da CAZA VISION não possui esse campo.'
      schemaNeeds={[
        {
          field:       'Status',
          description: 'Campo select ou status com estágios como: Negociação, Pré-produção, Produção, Pós-produção, Entregue, Cancelado',
          required:    true,
        },
        {
          field:       'Data de início',
          description: 'Data prevista de início do projeto',
          required:    false,
        },
        {
          field:       'Prazo de entrega',
          description: 'Data prevista de entrega ao cliente',
          required:    false,
        },
        {
          field:       'Cliente',
          description: 'Nome do cliente contratante',
          required:    false,
        },
      ]}
      hint='Adicione o campo "Status" à base do Notion e atualize as credenciais para ativar esta página.'
    />
  )
}

export function RelatoriosEmptyState() {
  return (
    <EmptyState
      icon={FileText}
      title='Relatórios em construção'
      description='Os relatórios são gerados automaticamente a partir dos dados reais da base. Para visualizá-los, a base precisa ter dados suficientes e os campos mínimos configurados.'
      schemaNeeds={[
        {
          field:       'Valor',
          description: 'Receita por projeto — necessário para relatório financeiro',
          required:    true,
        },
        {
          field:       'COMPETÊNCIA',
          description: 'Mês de competência — necessário para agrupamento mensal',
          required:    true,
        },
        {
          field:       'Alimentação + Gasolina',
          description: 'Campos de despesa — necessários para relatório de custos',
          required:    false,
        },
      ]}
      hint='Com pelo menos Valor e COMPETÊNCIA preenchidos, os relatórios básicos serão exibidos automaticamente.'
    />
  )
}
