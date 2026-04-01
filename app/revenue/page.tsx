"use client";
// ─── JACQES BI — Revenue Page ─────────────────────────────────────────────────
// This page remains "use client" because Recharts requires it.
// DATA REFACTOR: revenueData is now fetched from the Notion API route and
// mapped to the same RevenueDataPoint shape the chart already expects.
// Falls back to static mock data when Notion is not yet configured.

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import ChannelTable from "@/components/ChannelTable";
import { revenueData as mockRevenueData, type RevenueDataPoint } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import type { FinancialRecord, NormalizationResult } from "@/lib/data-sources";

// ─── Map Notion FinancialRecord → RevenueDataPoint ────────────────────────────

function mapToRevenueDataPoints(records: FinancialRecord[]): RevenueDataPoint[] {
  return records
    .filter((r) => r.date || r.month)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
    .map((r) => {
      const grossRevenue = r.grossRevenue ?? r.netRevenue ?? 0;
      const netRevenue   = r.netRevenue   ?? grossRevenue;
      const expenses     = r.opex ?? (grossRevenue - (r.grossProfit ?? 0));
      const profit       = r.grossProfit  ?? r.ebitda ?? (netRevenue - expenses);

      return {
        month:    r.month ?? r.date?.slice(0, 7) ?? "?",
        revenue:  grossRevenue,
        expenses: expenses,
        profit:   profit,
      };
    });
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 shadow-xl shadow-black/40 min-w-[140px]">
      <div className="text-xs font-semibold text-gray-400 mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span className="text-gray-400 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-white">
            {formatCurrency(entry.value, "USD", true)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>(mockRevenueData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch("/api/notion/jacqes/financial")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: NormalizationResult<FinancialRecord> | null) => {
        if (!data?.records?.length) return; // stay on mock
        const mapped = mapToRevenueDataPoints(data.records);
        if (mapped.length > 0) {
          setRevenueData(mapped);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Notion not configured — keep mock data
      });
  }, []);

  // Compute summary stats from whichever data source is active
  const totalRevenue  = revenueData.at(-1)?.revenue  ?? 0;
  const totalProfit   = revenueData.at(-1)?.profit   ?? 0;
  const totalExpenses = revenueData.at(-1)?.expenses ?? 0;
  const avgMonthly    = revenueData.length
    ? revenueData.reduce((s, d) => s + d.revenue, 0) / revenueData.length
    : 0;

  const summaryStats = [
    { label: "Total Revenue",     value: formatCurrency(totalRevenue,  "USD", true), sub: isLive ? "Live · Notion"      : "Mock data", positive: true  },
    { label: "Total Profit",      value: formatCurrency(totalProfit,   "USD", true), sub: isLive ? "Live · last period" : "Mock data", positive: true  },
    { label: "Total Expenses",    value: formatCurrency(totalExpenses, "USD", true), sub: isLive ? "Live · last period" : "Mock data", positive: false },
    { label: "Avg Monthly Rev.",  value: formatCurrency(avgMonthly,    "USD", true), sub: "per month",                                positive: true  },
  ];

  return (
    <>
      <Header
        title="Revenue"
        subtitle="Detailed financial performance and acquisition breakdown"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Data source indicator */}
        {isLive && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live data · JACQES Notion database
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              <div
                className={`text-xs font-medium mt-3 ${
                  stat.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white">Monthly Revenue vs Profit</h2>
            <p className="text-xs text-gray-500 mt-0.5">Grouped bar comparison</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueData}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
              barGap={4}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 1,
                  }).format(v)
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="revenue"  name="revenue"  fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit"   name="profit"   fill="#22d3ee" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="expenses" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Margin progression */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Gross Margin Progression</h2>
            <p className="text-xs text-gray-500 mt-0.5">Month-by-month profit margin trend</p>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {revenueData.map((d) => {
              const margin = d.revenue > 0
                ? ((d.profit / d.revenue) * 100).toFixed(1)
                : "0.0";
              const pct = parseFloat(margin);
              return (
                <div key={d.month} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-white">{margin}%</div>
                  <div className="w-full h-16 bg-gray-800 rounded-md overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-md transition-all"
                      style={{ height: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-600">{d.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel table */}
        <ChannelTable />
      </div>
    </>
  );
}
