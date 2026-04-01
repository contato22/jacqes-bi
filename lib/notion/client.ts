/**
 * Notion SDK Client — singleton para toda a aplicação.
 *
 * Requer a variável de ambiente NOTION_TOKEN no .env.local.
 * Obtenha o token em: https://www.notion.so/profile/integrations
 */

import { Client } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) {
  // Warn at startup; actual API calls will fail and be caught by safeFetch fallback.
  console.warn("[Notion] NOTION_TOKEN ausente — fetchers usarão dados mock de fallback.");
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN ?? "",
});

/**
 * IDs dos databases mapeados no workspace AWQ/JACQES.
 *
 * Estes IDs foram extraídos diretamente do workspace via Notion MCP.
 * Não devem mudar a menos que os databases sejam recriados.
 */
export const NOTION_DB = {
  // ── Caza Vision ─────────────────────────────────────────────
  CAZA_FINANCEIRO:  "9a8329e9-6d19-4bdc-8e80-2d59a2658be7",
  CAZA_CLIENTES:    "2a58b3e6-fc37-80ce-bb78-c33f19ee1829",
  CAZA_PROJETOS:    "308e2d13-dfa9-433e-a0f6-8439b5181845",

  // ── JACQES ───────────────────────────────────────────────────
  JACQES_CARTEIRA:  "af3b466e-c911-49f8-abdd-f5fc71fc9e97",
  // ERP sub-databases (Contas a Receber, Pagar, Fluxo de Caixa)
  // serão adicionados quando os IDs forem confirmados no workspace
} as const;
