// ─── JACQES BI — Customers Page ───────────────────────────────────────────────
// Server Component: fetches customer data from Notion API route.
// Falls back to static mock data when Notion is not yet configured.

import Header from "@/components/Header";
import { customers as mockCustomers, type CustomerRecord as MockCustomerRecord } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UserCheck, UserX, AlertTriangle, Users } from "lucide-react";
import type { CustomerRecord, NormalizationResult } from "@/lib/data-sources";

// ─── Unified display type ─────────────────────────────────────────────────────
// Both mock records and live Notion records are coerced to this shape before
// reaching the render layer so the JSX never needs to branch on data source.

interface DisplayCustomer {
  id: string;
  name: string;
  company: string;
  email: string;
  segment: string;
  ltv: number;
  lastOrder: string;
  status: "active" | "at-risk" | "churned" | "unknown";
  country: string;
}

function fromMock(c: MockCustomerRecord): DisplayCustomer {
  return {
    id:        c.id,
    name:      c.name,
    company:   c.company,
    email:     c.email,
    segment:   c.segment,
    ltv:       c.ltv,
    lastOrder: c.lastOrder,
    status:    c.status,
    country:   c.country,
  };
}

function fromLive(c: CustomerRecord): DisplayCustomer {
  return {
    id:        c.id,
    name:      c.clientName ?? "—",
    company:   c.company    ?? "—",
    email:     c.email      ?? "—",
    segment:   c.segment    ?? c.plan ?? "—",
    ltv:       c.ltv        ?? 0,
    lastOrder: c.lastActivityDate ?? "—",
    status:    c.status === "unknown" ? "active" : c.status,
    country:   c.country ?? "—",
  };
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getCustomers(): Promise<{ customers: DisplayCustomer[]; isLive: boolean }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/notion/jacqes/customers`,
      { next: { revalidate: parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10) } }
    );

    if (!res.ok) return { customers: mockCustomers.map(fromMock), isLive: false };

    const data: NormalizationResult<CustomerRecord> = await res.json();
    if (!data?.records?.length) return { customers: mockCustomers.map(fromMock), isLive: false };

    return { customers: data.records.map(fromLive), isLive: true };
  } catch {
    return { customers: mockCustomers.map(fromMock), isLive: false };
  }
}

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  active:  { label: "Active",  classes: "badge-green",  Icon: UserCheck    },
  "at-risk":{ label: "At Risk", classes: "badge-yellow", Icon: AlertTriangle },
  churned: { label: "Churned", classes: "badge-red",    Icon: UserX        },
  unknown: { label: "Active",  classes: "badge-green",  Icon: UserCheck    },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CustomersPage() {
  const { customers, isLive } = await getCustomers();

  const activeCount  = customers.filter((c) => c.status === "active").length;
  const atRiskCount  = customers.filter((c) => c.status === "at-risk").length;
  const churnedCount = customers.filter((c) => c.status === "churned").length;
  const totalLTV     = customers.reduce((sum, c) => sum + c.ltv, 0);

  return (
    <>
      <Header
        title="Customers"
        subtitle="Customer directory, health scores, and lifetime value"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Data source indicator */}
        {isLive && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live data · JACQES Notion database
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Users size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{customers.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total Accounts</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Active</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{atRiskCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">At Risk</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <UserX size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{churnedCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Churned</div>
            </div>
          </div>
        </div>

        {/* Total LTV highlight */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Portfolio Lifetime Value
            </div>
            <div className="text-3xl font-bold text-white mt-1 tabular-nums">
              {formatCurrency(totalLTV)}
            </div>
          </div>
          <div className="text-xs text-gray-600 text-right">
            <div>Avg LTV per account</div>
            <div className="text-lg font-bold text-gray-300 mt-1">
              {formatCurrency(customers.length > 0 ? Math.round(totalLTV / customers.length) : 0)}
            </div>
          </div>
        </div>

        {/* Customer table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Customer Directory</h2>
              <p className="text-xs text-gray-500 mt-0.5">All accounts with health status</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Customer", "Company", "Segment", "LTV", "Last Activity", "Country", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left pb-3 pr-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const statusCfg = statusConfig[c.status] ?? statusConfig.unknown;

                  return (
                    <tr
                      key={c.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {c.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">{c.name}</div>
                            <div className="text-xs text-gray-600">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{c.company}</td>
                      <td className="py-3 pr-4">
                        <span className="badge badge-blue">{c.segment}</span>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-white tabular-nums">
                        {formatCurrency(c.ltv, "USD", true)}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 tabular-nums">
                        {c.lastOrder !== "—" ? formatDate(c.lastOrder) : "—"}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 font-mono text-xs">
                        {c.country}
                      </td>
                      <td className="py-3">
                        <span className={`badge ${statusCfg.classes}`}>{statusCfg.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
