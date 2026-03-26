import { NextRequest } from "next/server";
import { validateAgentKey, unauthorizedResponse, AgentStatus } from "@/lib/agent";

export async function GET(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  const status: AgentStatus = {
    agent: "openclaw",
    version: "1.0.0",
    connected: true,
    lastSeen: new Date().toISOString(),
    uptime: "operational",
    bu: "JACQES",
    accessLevel: "full",
    capabilities: [
      "read_data",
      "write_settings",
      "execute_tasks",
      "autocode",
      "manage_reports",
      "control_alerts",
      "full_platform_management",
    ],
  };

  return Response.json(status);
}
