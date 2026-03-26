// ─── OpenClaw Agent — Types & Auth ────────────────────────────────────────────

import { NextRequest } from "next/server";

export type TaskStatus = "pending" | "running" | "completed" | "failed";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  type: "autocode" | "report" | "alert" | "settings" | "data_sync" | "custom";
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  result?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface AutocodeRequest {
  instruction: string;
  target:
    | "component"
    | "query"
    | "report"
    | "dashboard"
    | "config"
    | "migration";
  context?: Record<string, unknown>;
}

export interface AutocodeResult {
  id: string;
  instruction: string;
  target: AutocodeRequest["target"];
  code: string;
  language: string;
  description: string;
  generatedAt: string;
  appliedAt?: string;
}

export interface AgentStatus {
  agent: "openclaw";
  version: string;
  connected: boolean;
  lastSeen: string;
  uptime: string;
  capabilities: string[];
  bu: string;
  accessLevel: "full";
}

export interface AgentSettings {
  autocode: {
    enabled: boolean;
    autoApply: boolean;
    approvalRequired: boolean;
  };
  monitoring: {
    alertThreshold: "low" | "medium" | "high";
    notifyOnTask: boolean;
    healthCheckInterval: number;
  };
  access: {
    readData: boolean;
    writeSettings: boolean;
    executeTasks: boolean;
    autocode: boolean;
  };
}

// ─── In-memory store (replace with DB in production) ──────────────────────────

export const taskStore: AgentTask[] = [
  {
    id: "T001",
    title: "Monitor at-risk customers",
    description:
      "Watch enterprise customers with >45 days without order and trigger alerts.",
    type: "alert",
    status: "running",
    priority: "high",
    createdAt: "2026-03-20T08:00:00Z",
    updatedAt: "2026-03-26T00:00:00Z",
    metadata: { customersWatched: 12 },
  },
  {
    id: "T002",
    title: "Generate Q1 revenue report",
    description: "Auto-generate Q1 2026 board-level revenue report for AWQ.",
    type: "report",
    status: "completed",
    priority: "critical",
    createdAt: "2026-03-18T09:00:00Z",
    updatedAt: "2026-03-18T09:47:00Z",
    completedAt: "2026-03-18T09:47:00Z",
    result: "Report generated and dispatched to board@awqgroup.com",
  },
  {
    id: "T003",
    title: "APAC expansion autocode",
    description:
      "Generate new regional dashboard component for APAC sub-regions.",
    type: "autocode",
    status: "pending",
    priority: "medium",
    createdAt: "2026-03-25T14:00:00Z",
    updatedAt: "2026-03-25T14:00:00Z",
  },
];

export const autocodeStore: AutocodeResult[] = [
  {
    id: "AC001",
    instruction:
      "Create a KPI card component for APAC growth showing YoY % change",
    target: "component",
    code: `export function ApacGrowthCard() {\n  return (\n    <div className=\"bg-gray-900 border border-gray-800 rounded-xl p-5\">\n      <div className=\"text-xs text-gray-500 uppercase tracking-widest mb-1\">APAC Growth</div>\n      <div className=\"text-3xl font-bold text-emerald-400\">+22.5%</div>\n      <div className=\"text-xs text-gray-600 mt-1\">YoY — Asia Pacific</div>\n    </div>\n  );\n}`,
    language: "tsx",
    description: "APAC YoY Growth KPI card component",
    generatedAt: "2026-03-24T11:20:00Z",
    appliedAt: "2026-03-24T11:25:00Z",
  },
];

export const agentSettings: AgentSettings = {
  autocode: {
    enabled: true,
    autoApply: false,
    approvalRequired: true,
  },
  monitoring: {
    alertThreshold: "medium",
    notifyOnTask: true,
    healthCheckInterval: 60,
  },
  access: {
    readData: true,
    writeSettings: true,
    executeTasks: true,
    autocode: true,
  },
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function validateAgentKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  const expectedKey = process.env.OPENCLAW_API_KEY;

  if (!expectedKey) {
    // Key not configured — deny all access
    return false;
  }

  return token === expectedKey;
}

export function unauthorizedResponse() {
  return Response.json(
    {
      error: "Unauthorized",
      message: "Valid OPENCLAW_API_KEY required in Authorization: Bearer <key>",
    },
    { status: 401 }
  );
}

export function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}
