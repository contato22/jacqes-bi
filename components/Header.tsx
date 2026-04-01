"use client";

import { Search, RefreshCw } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="px-8 py-5 border-b border-gray-200 bg-white flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh data">
          <RefreshCw size={15} />
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · Mar 2026
        </div>
      </div>
    </header>
  );
}
