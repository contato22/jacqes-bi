"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "@/lib/data";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-lg min-w-[160px]">
      <div className="text-xs font-semibold text-gray-500 mb-2">{label} 2025</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-gray-900">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Revenue Overview</h2>
          <p className="text-xs text-gray-500 mt-0.5">Monthly P&amp;L — FY 2025</p>
        </div>
        <div className="flex gap-1">
          {["6M", "9M", "1Y"].map((range, i) => (
            <button
              key={range}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                i === 2
                  ? "bg-brand-100 text-brand-700 border border-brand-200"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={revenueData}
          margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="expenses"
            name="expenses"
            stroke="#f59e0b"
            strokeWidth={1.5}
            fill="url(#gradExpenses)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="profit"
            name="profit"
            stroke="#22d3ee"
            strokeWidth={1.5}
            fill="url(#gradProfit)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gradRevenue)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
