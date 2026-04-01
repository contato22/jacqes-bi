"use client";

import { Bell, Search, RefreshCw } from "lucide-react";
import { alerts } from "@/lib/data";
import { useState, useEffect } from "react";

/**
 * STATIC EXPORT NOTE:
 *   window.dispatchEvent("jacqes:refresh") removed — no server-side
 *   data to refresh in static export. Refresh button triggers a
 *   hard page reload instead, which re-runs client hydration.
 *
 * MIGRATION NOTE (server runtime):
 *   Restore custom event dispatch + useRealtimeData listeners to
 *   enable live data refresh across all panels simultaneously.
 */

interface HeaderProps {
  title: string;
  subtitle?: string;
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const unreadCount = alerts.filter((a) => a.type === "warning" || a.type === "error").length;
  const [spinning, setSpinning] = useState(false);
  const now = useNow();

  function handleRefresh() {
    setSpinning(true);
    setTimeout(() => { window.location.reload(); }, 150);
  }

  const timeLabel = now
    ? now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";

  return (
    <header className="px-8 py-5 border-b border-gray-800 bg-gray-950 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          title="Refresh page"
        >
          <RefreshCw size={15} className={spinning ? "animate-spin" : ""} />
        </button>

        <button className="relative p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors" title="Alerts">
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-gray-950" />
          )}
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 tabular-nums">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · {timeLabel}
        </div>
      </div>
    </header>
  );
}
