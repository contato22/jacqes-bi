import { NextRequest } from "next/server";
import {
  validateAgentKey,
  unauthorizedResponse,
  taskStore,
  AgentTask,
  generateId,
} from "@/lib/agent";

// GET /api/agent/tasks — list all tasks (filter by ?status=&type=)
export async function GET(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const typeFilter = searchParams.get("type");

  let tasks = [...taskStore];
  if (statusFilter) tasks = tasks.filter((t) => t.status === statusFilter);
  if (typeFilter) tasks = tasks.filter((t) => t.type === typeFilter);

  return Response.json({ tasks, total: tasks.length });
}

// POST /api/agent/tasks — create a new task
export async function POST(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  let body: Partial<AgentTask>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.title || !body.type) {
    return Response.json(
      { error: "Fields 'title' and 'type' are required" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const task: AgentTask = {
    id: generateId("T"),
    title: body.title,
    description: body.description ?? "",
    type: body.type,
    status: "pending",
    priority: body.priority ?? "medium",
    createdAt: now,
    updatedAt: now,
    metadata: body.metadata,
  };

  taskStore.push(task);

  return Response.json({ task }, { status: 201 });
}

// PATCH /api/agent/tasks — update task status/result
export async function PATCH(request: NextRequest) {
  if (!validateAgentKey(request)) return unauthorizedResponse();

  let body: { id: string } & Partial<AgentTask>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const idx = taskStore.findIndex((t) => t.id === body.id);
  if (idx === -1) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  taskStore[idx] = {
    ...taskStore[idx],
    ...body,
    updatedAt: now,
    ...(body.status === "completed" && !taskStore[idx].completedAt
      ? { completedAt: now }
      : {}),
  };

  return Response.json({ task: taskStore[idx] });
}
