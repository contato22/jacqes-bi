import { NextRequest } from "next/server";
import {
  validateAgentKey,
  unauthorizedResponse,
  agentSettings,
  AgentSettings,
} from "@/lib/agent";

// GET /api/agent/settings — read current agent settings
export async function GET(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  return Response.json({ settings: agentSettings });
}

// PUT /api/agent/settings — update agent settings (deep merge)
export async function PUT(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  let body: Partial<AgentSettings>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Deep merge top-level sections
  if (body.autocode) {
    Object.assign(agentSettings.autocode, body.autocode);
  }
  if (body.monitoring) {
    Object.assign(agentSettings.monitoring, body.monitoring);
  }
  if (body.access) {
    Object.assign(agentSettings.access, body.access);
  }

  return Response.json({
    settings: agentSettings,
    updatedAt: new Date().toISOString(),
  });
}
