import { Client } from "@notionhq/client";

// ─── Singleton Notion Client ──────────────────────────────────────────────────
// Instantiated once per server process. The token is read only server-side;
// it is never referenced in any "use client" file.

let _client: Client | null = null;

export function getNotionClient(): Client {
  if (_client) return _client;

  const token = process.env.NOTION_TOKEN;
  if (!token || token.startsWith("REPLACE_WITH")) {
    throw new Error(
      "[Notion] NOTION_TOKEN is not configured. " +
        "Set it in .env.local before running the dev server."
    );
  }

  _client = new Client({ auth: token });
  return _client;
}
