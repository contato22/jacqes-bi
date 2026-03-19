# JACQES BI — Agente Claude Code

Dashboard de Business Intelligence operacional para **Danilo · CS & Operações · AWQ Group**.
Construído em Next.js 14 + Recharts + Tailwind CSS. Todos os dados vêm do **Notion**.

---

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **UI:** Tailwind CSS (dark theme, classes customizadas em `app/globals.css`)
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Fonte de dados:** Notion via MCP (`mcp__c0f61fac-abee-479c-ae00-4b1e9114563e__notion-*`)

---

## Estrutura do projeto

```
app/
  page.tsx           → Visão Geral (overview do score mensal)
  revenue/page.tsx   → Desempenho (radar chart, faixas de score)
  customers/page.tsx → Carteira (tabela de contas)
  analise/page.tsx   → Análise Recorrente (briefing semanal — "use client", checklist interativo)
  reports/page.tsx   → Relatórios
  settings/page.tsx  → Configurações

components/
  Sidebar.tsx           → Navegação lateral
  Header.tsx            → Cabeçalho com alertas
  KPICard.tsx           → Card de KPI (suporta lowerIsBetter, comparisonLabel, suffix)
  RevenueChart.tsx      → ScoreChart — barras empilhadas por dimensão
  CustomerSegmentChart.tsx → AccountHealthChart — pizza de saúde da carteira
  TopProductsTable.tsx  → ContasTable — tabela de contas com badges
  RegionTable.tsx       → ScoreDimensionsPanel — barras de progresso por dimensão
  AlertBanner.tsx       → Banner de alerta (warning/error/info/success)

lib/
  data.ts   → Todos os dados reais (fonte: Notion). EDITAR AQUI ao atualizar Notion.
  utils.ts  → formatCurrency, formatNumber, formatPercent, formatDate, cn
```

---

## Dados do Notion

### Workspace: BI do Danilo · AWQ Group
**Página principal:** `328e9381f1758169ad21cb8c3fbce065`

### Databases mapeados

| Database | ID Notion | Collection | Usado em |
|---|---|---|---|
| 🏢 Contas & Carteira | `af3b466ec91149f8abddf5fc71fc9e97` | `collection://f40a21c3-2b11-4109-ad8a-12055b1bc361` | `contasData` |
| 🏆 Score Mensal | `e057ce10934343da8213dec79118c8ce` | `collection://cc5c57dd-d927-46f2-9c17-17aa55ea8fb5` | `scoreMensal`, `scoreDimensions` |
| 🚗 Visitas | `ae7000a2224846bb973e605d9d065bbf` | `collection://2109a47e-f638-4eca-9c93-f6df2ac2496d` | (futuro) |
| 💬 Atendimento | `6d2d8dc92d8f45f29f61b0c93cc5c2ab` | `collection://92f849da-97c3-4483-9b5d-105f6b7dc434` | (futuro) |
| ⚙️ Execução Operacional | `335cad71990d4dfead9982f84b8a6827` | `collection://785b693d-0eec-487a-bcc6-20ba199b5be9` | (futuro) |
| 🧠 Processo & Ativos | `bf86e95c1ac147c9bcb9e2898f0fa62b` | `collection://dec691f4-08c5-4d48-a567-d9c499ce437c` | (futuro) |

### Contas na carteira (Março 2026)

| Conta | Saúde | Risco | Oportunidade | Pendências |
|---|---|---|---|---|
| JACQES | Saudável | Baixo | Forte | 2 |
| AWQ - Agência | Estável com Atenção | Médio | Leve | 3 |
| AWQ - Produtora | Saudável | Baixo | Média | 1 |
| Conta 04 — Prospecção | Sensível | Alto | Forte | 5 |

### Score Mensal · Março 2026

| Dimensão | Score | Máx |
|---|---|---|
| Atendimento | 16 | 20 |
| Operação | 15 | 20 |
| Visitas | 14 | 20 |
| Risco | 13 | 20 |
| Processo | 11 | 20 |
| **Total** | **69** | **100** |

**Status:** 🟡 Amarelo · **Fase:** Operador em Formação · **Variável:** não paga

---

## Como atualizar os dados do Notion

1. Use o MCP `notion-fetch` ou `notion-search` para buscar os dados mais recentes
2. Edite **apenas `lib/data.ts`** — o resto do app consome desse arquivo
3. Ao adicionar um novo mês no Score Mensal, busque a página pelo ID e atualize `scoreMensal` e `scoreDimensions`
4. Ao adicionar novas contas em Contas & Carteira, adicione entradas em `contasData`

### Buscar Score Mensal mais recente
```
notion-fetch: e057ce10934343da8213dec79118c8ce
```

### Buscar Contas atualizadas
```
notion-search: query="conta carteira", data_source_url="collection://f40a21c3-2b11-4109-ad8a-12055b1bc361"
```

---

## Comandos úteis

```bash
npm run dev      # servidor local em http://localhost:3000
npm run build    # build de produção (use: node_modules/.bin/next build)
npm run lint     # linting
```

> **Nota:** `next` não está no PATH global. Usar sempre `node_modules/.bin/next build` para builds.

---

## Convenções de código

- **Dados:** todos em `lib/data.ts`. Nunca hardcode dados nas páginas ou componentes.
- **Componentes de gráfico:** marcados com `"use client"` — obrigatório para Recharts.
- **Tipagem:** interfaces exportadas de `lib/data.ts`. Não criar tipos duplicados em componentes.
- **Cores:** paleta definida no Tailwind config. Classes brand-*, emerald-*, blue-*, red-*, yellow-*.
- **Badges:** usar classes globais `badge`, `badge-green`, `badge-red`, `badge-yellow`, `badge-blue`.
- **Cards:** usar classe `card` (definida em globals.css). Padding padrão: `p-5` ou `p-6`.

---

## Contexto de negócio

- **Danilo** é CS & Operações na AWQ Group
- A carteira tem 4 contas acompanhadas pelo modelo M4E
- **JACQES** é a conta âncora (D2C/e-commerce), com vesting em progresso
- O score de 69/100 em Março está abaixo da meta de 75 (limiar para variável)
- A Conta 04 é prospecção em risco (expectativa desalinhada, 5 pendências)
- Modelo de score: 5 dimensões × 20 pts = 100 pts total
- Faixas: 0–59 Abaixo · 60–74 Operação Mínima · 75–84 Bom · 85–94 Sólido · 95–100 Owner
