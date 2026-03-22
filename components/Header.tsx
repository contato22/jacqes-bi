"use client";

import { Bell, Search, RefreshCw, LogOut, Menu } from "lucide-react";
import { alerts } from "@/lib/data";
import { useSidebar } from "@/contexts/SidebarContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { toggle } = useSidebar();
  const unreadCount = alerts.filter((a) => a.type === "warning" || a.type === "error").length;

  function handleLogout() {
    localStorage.removeItem("jacqes_session");
    localStorage.removeItem("jacqes_user");
    localStorage.removeItem("jacqes_role");
    const base = process.env.NODE_ENV === "production" ? "/jacqes-bi" : "";
    window.location.href = base + "/login";
  }

  return (
    <header className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-gray-800 bg-gray-950 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="md:hidden p-2 -ml-1 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          aria-label="Abrir menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Search — desktop only */}
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
        <button className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors" title="Refresh data">
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors" title="Alerts">
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-gray-950" />
          )}
        </button>

        {/* Live chip — tablet+ */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · Mar 2026
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
