"use client";

import { Bell, Search, RefreshCw } from "lucide-react";
import { alerts } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const unreadCount = alerts.filter((a) => a.type === "warning" || a.type === "error").length;
  const [spinning, setSpinning] = useState(false);
  const now = useNow();

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    // Reload all client-side data by triggering a page router refresh
    window.dispatchEvent(new CustomEvent("jacqes:refresh"));
    setTimeout(() => setSpinning(false), 800);
  }, []);

  const timeLabel = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="px-8 py-5 border-b border-gray-800 bg-gray-950 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw size={15} className={spinning ? "animate-spin" : ""} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors" title="Alerts">
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-gray-950" />
          )}
        </button>

        {/* Live clock chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 tabular-nums">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · {timeLabel}
        </div>
      </div>
    </header>
  );
}
