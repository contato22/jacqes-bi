import { taskStore } from "@/lib/agent";

// Public endpoint — returns minimal agent status for the dashboard widget
// No auth required (no sensitive data exposed)
export async function GET() {
  const running = taskStore.filter((t) => t.status === "running");
  const pending = taskStore.filter((t) => t.status === "pending");
  const recent = [...taskStore]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3)
    .map(({ id, title, type, status, priority, updatedAt }) => ({
      id,
      title,
      type,
      status,
      priority,
      updatedAt,
    }));

  return Response.json({
    connected: true,
    bu: "JACQES",
    runningCount: running.length,
    pendingCount: pending.length,
    recentTasks: recent,
    checkedAt: new Date().toISOString(),
  });
}
