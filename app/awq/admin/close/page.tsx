import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getHoldingConsolidatedFinancials } from "@/lib/awq/selectors/holding";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

type CloseItemStatus = "completed" | "pending" | "blocked";

interface CloseItem {
  id: string;
  label: string;
  description: string;
  status: CloseItemStatus;
  owner: string;
}

const CHECKLIST: CloseItem[] = [
  {
    id: "ci-1",
    label: "Reconcile all BU revenue transactions",
    description: "Verify and reconcile all revenue entries across JACQES, Caza Vision, Advisor, and AWQ Venture.",
    status: "pending",
    owner: "Finance Team",
  },
  {
    id: "ci-2",
    label: "Validate intercompany eliminations",
    description: "Review and eliminate intercompany balances and transactions to avoid double-counting.",
    status: "pending",
    owner: "Group Controller",
  },
  {
    id: "ci-3",
    label: "Lock budget vs actual",
    description: "Freeze the budget vs actuals comparison for the closed period.",
    status: "pending",
    owner: "FP&A",
  },
  {
    id: "ci-4",
    label: "Generate consolidated P&L",
    description: "Produce the group-level consolidated profit and loss statement.",
    status: "pending",
    owner: "Finance Team",
  },
  {
    id: "ci-5",
    label: "CFO sign-off",
    description: "Obtain final CFO approval and digital signature on the close package.",
    status: "pending",
    owner: "CFO",
  },
  {
    id: "ci-6",
    label: "Archive audit trail",
    description: "Archive all audit log entries and financial records to long-term storage.",
    status: "pending",
    owner: "IT / Compliance",
  },
  {
    id: "ci-7",
    label: "Distribute close pack to stakeholders",
    description: "Share the signed close package with board and senior leadership.",
    status: "pending",
    owner: "CFO Office",
  },
  {
    id: "ci-8",
    label: "Open next period in system",
    description: "Unlock the next fiscal period and reset budget carry-forwards.",
    status: "pending",
    owner: "Finance Team",
  },
];

const STATUS_CONFIG: Record<CloseItemStatus, { icon: React.ReactNode; label: string; style: string }> = {
  completed: {
    icon: <CheckCircle2 size={16} />,
    label: "Completed",
    style: "text-emerald-400",
  },
  pending: {
    icon: <Clock size={16} />,
    label: "Pending",
    style: "text-amber-400",
  },
  blocked: {
    icon: <XCircle size={16} />,
    label: "Blocked",
    style: "text-red-400",
  },
};

export default function AWQPeriodClosePage() {
  const fin = getHoldingConsolidatedFinancials();
  const latestMonth = fin.monthly[fin.monthly.length - 1];
  const latestMargin = latestMonth
    ? latestMonth.revenue > 0
      ? (latestMonth.profit / latestMonth.revenue) * 100
      : 0
    : 0;

  const completedCount = CHECKLIST.filter((i) => i.status === "completed").length;
  const blockedCount = CHECKLIST.filter((i) => i.status === "blocked").length;
  const pendingCount = CHECKLIST.filter((i) => i.status === "pending").length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header title="Period Close" subtitle="AWQ Group Admin · Month-End Close" />

      <main className="flex-1 p-8 space-y-8">

        {/* Current Period Summary */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Current Period — {latestMonth?.period ?? "N/A"}
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Period Revenue", value: latestMonth ? formatCurrency(latestMonth.revenue) : "—", color: "text-emerald-400" },
              { label: "Period Expenses", value: latestMonth ? formatCurrency(latestMonth.expenses) : "—", color: "text-red-400" },
              { label: "Period Profit", value: latestMonth ? formatCurrency(latestMonth.profit) : "—", color: "text-blue-400" },
              { label: "Margin %", value: formatPercent(latestMargin), color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className={cn("text-2xl font-semibold tabular-nums mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Close Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Close Checklist
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={13} /> {completedCount} completed
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock size={13} /> {pendingCount} pending
              </span>
              {blockedCount > 0 && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <XCircle size={13} /> {blockedCount} blocked
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${CHECKLIST.length > 0 ? (completedCount / CHECKLIST.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 tabular-nums">
              {completedCount} of {CHECKLIST.length} items complete
            </p>
          </div>

          <div className="space-y-2">
            {CHECKLIST.map((item, idx) => {
              const cfg = STATUS_CONFIG[item.status];
              return (
                <div key={item.id} className={cn(
                  "card p-4 flex items-start gap-4",
                  item.status === "blocked" && "border border-red-900/40",
                  item.status === "completed" && "opacity-70"
                )}>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gray-600 text-xs w-5 tabular-nums text-right">{idx + 1}</span>
                    <span className={cfg.style}>{cfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium",
                      item.status === "completed" ? "text-gray-400 line-through" : "text-white"
                    )}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      item.status === "completed" ? "bg-emerald-900/40 text-emerald-400" :
                      item.status === "blocked" ? "bg-red-900/40 text-red-400" :
                      "bg-amber-900/40 text-amber-400"
                    )}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">{item.owner}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Notice */}
        <section>
          <div className="card p-4 flex items-start gap-3 border border-amber-800/30">
            <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-400">
              Period close for <span className="text-white font-medium">{latestMonth?.period ?? "current period"}</span> is
              in progress. All checklist items must be completed before finalizing the close pack.
              Contact the Group Controller if any items are blocked.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
