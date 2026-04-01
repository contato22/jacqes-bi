import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { getHoldingAuditLog } from "@/lib/awq/selectors/holding";

const ACTION_STYLES: Record<string, string> = {
  create: "bg-emerald-900/40 text-emerald-400",
  update: "bg-blue-900/40 text-blue-400",
  delete: "bg-red-900/40 text-red-400",
  view: "bg-gray-700/40 text-gray-400",
  export: "bg-purple-900/40 text-purple-400",
};

const BU_NAMES: Record<string, string> = {
  jacqes: "JACQES",
  "caza-vision": "Caza Vision",
  advisor: "Advisor",
  "awq-venture": "AWQ Venture",
  awq: "AWQ Holding",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AWQAuditLogPage() {
  const logs = getHoldingAuditLog();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Audit Log" subtitle="AWQ Group Admin · System Audit Trail" />

      <main className="flex-1 p-8 space-y-8">

        {/* Summary */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(["create", "update", "delete", "view", "export"] as const).map((action) => {
              const count = logs.filter((l) => l.action === action).length;
              return (
                <div key={action} className="card p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{action}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                      ACTION_STYLES[action] ?? "bg-gray-700/40 text-gray-400"
                    )}>
                      {action}
                    </span>
                    <span className="text-white font-semibold tabular-nums">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Audit Table */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Audit Trail — {logs.length} entries
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">BU</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Entity Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Entity ID</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Action</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Performed By</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-400 tabular-nums text-xs font-mono whitespace-nowrap">
                      {formatDateTime(log.performed_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {BU_NAMES[log.business_unit_id] ?? log.business_unit_id}
                    </td>
                    <td className="px-4 py-3 text-gray-400 capitalize">
                      {log.entity_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {log.entity_id}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        ACTION_STYLES[log.action] ?? "bg-gray-700/40 text-gray-400"
                      )}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{log.performed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-600">No audit log entries found.</div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
