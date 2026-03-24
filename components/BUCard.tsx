"use client";

import { useState } from "react";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import { BusinessUnit } from "@/lib/data";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

interface BUCardProps {
  bu: BusinessUnit;
}

const statusConfig = {
  growing: { label: "Growing", color: "text-emerald-400", badgeClass: "badge-green", Icon: TrendingUp },
  stable: { label: "Stable", color: "text-blue-400", badgeClass: "badge-blue", Icon: Minus },
  declining: { label: "Declining", color: "text-red-400", badgeClass: "badge-red", Icon: TrendingDown },
};

export default function BUCard({ bu }: BUCardProps) {
  const [expanded, setExpanded] = useState(false);

  const delta = ((bu.revenue - bu.previousRevenue) / bu.previousRevenue) * 100;
  const status = statusConfig[bu.status];
  const StatusIcon = status.Icon;

  const totalSessions = bu.sessions.reduce((s, c) => s + c.sessions, 0);
  const totalConversions = bu.sessions.reduce((s, c) => s + c.conversions, 0);

  return (
    <div
      className={cn(
        "card overflow-hidden transition-all duration-200",
        expanded && "ring-1 ring-brand-500/30"
      )}
    >
      {/* Header — always visible, click to expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-6 py-5 flex items-center gap-4 group"
        aria-expanded={expanded}
      >
        {/* BU identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">{bu.name}</span>
            <span className={cn("flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full", status.badgeClass)}>
              <StatusIcon size={10} />
              {status.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{bu.description}</p>
        </div>

        {/* Summary metrics */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold text-white tabular-nums">
              {formatCurrency(bu.revenue, "USD", true)}
            </div>
            <div className={cn("text-[10px] font-medium", delta >= 0 ? "text-emerald-400" : "text-red-400")}>
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% YoY
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white tabular-nums">
              {formatNumber(bu.customers)}
            </div>
            <div className="text-[10px] text-gray-500">customers</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white tabular-nums">
              {bu.margin.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-500">margin</div>
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={cn(
            "text-gray-500 flex-shrink-0 transition-transform duration-200 group-hover:text-gray-300",
            expanded && "rotate-180 text-brand-400"
          )}
        />
      </button>

      {/* Expanded session — only visible after click */}
      {expanded && (
        <div className="border-t border-gray-800">
          {/* Session summary bar */}
          <div className="px-6 py-4 bg-gray-800/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600/20 flex items-center justify-center">
                <DollarSign size={13} className="text-brand-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tabular-nums">
                  {formatCurrency(bu.revenue, "USD", true)}
                </div>
                <div className="text-[10px] text-gray-500">Revenue</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                <Users size={13} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tabular-nums">
                  {formatNumber(bu.customers)}
                </div>
                <div className="text-[10px] text-gray-500">Customers</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                <Activity size={13} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tabular-nums">
                  {formatNumber(totalSessions, true)}
                </div>
                <div className="text-[10px] text-gray-500">Sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <TrendingUp size={13} className="text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tabular-nums">
                  {totalConversions > 0
                    ? ((totalConversions / totalSessions) * 100).toFixed(1)
                    : "0.0"}%
                </div>
                <div className="text-[10px] text-gray-500">Conv. Rate</div>
              </div>
            </div>
          </div>

          {/* Channel breakdown table */}
          <div className="px-6 pb-5">
            <div className="mt-4 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
              Acquisition Channels
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Channel</th>
                    <th className="text-right py-2 px-4 text-gray-500 font-medium">Sessions</th>
                    <th className="text-right py-2 px-4 text-gray-500 font-medium">Conversions</th>
                    <th className="text-right py-2 px-4 text-gray-500 font-medium">Conv. Rate</th>
                    <th className="text-right py-2 px-4 text-gray-500 font-medium">Revenue</th>
                    <th className="text-right py-2 pl-4 text-gray-500 font-medium">CAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {bu.sessions.map((ch) => {
                    const convRate = ch.sessions > 0
                      ? ((ch.conversions / ch.sessions) * 100).toFixed(1)
                      : "0.0";
                    return (
                      <tr key={ch.channel} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-2.5 pr-4 text-gray-300 font-medium">{ch.channel}</td>
                        <td className="py-2.5 px-4 text-right text-gray-400 tabular-nums">
                          {formatNumber(ch.sessions)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-gray-400 tabular-nums">
                          {formatNumber(ch.conversions)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-gray-400 tabular-nums">
                          {convRate}%
                        </td>
                        <td className="py-2.5 px-4 text-right text-white font-semibold tabular-nums">
                          {formatCurrency(ch.revenue, "USD", true)}
                        </td>
                        <td className="py-2.5 pl-4 text-right tabular-nums">
                          {ch.cac === 0 ? (
                            <span className="text-emerald-400 font-medium">Organic</span>
                          ) : (
                            <span className="text-gray-400">${ch.cac}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
