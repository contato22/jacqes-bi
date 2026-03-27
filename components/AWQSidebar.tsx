"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Settings,
  ChevronRight,
  TrendingUp,
  LogOut,
  BarChart3,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const businessUnits = [
  {
    id: "jacqes",
    name: "JACQES",
    description: "Agência · AWQ Group",
    href: "/awq/jacqes",
    color: "bg-indigo-600",
    initial: "JQ",
  },
  {
    id: "caza",
    name: "Caza Vision",
    description: "Tecnologia · AWQ Group",
    href: "/awq/caza",
    color: "bg-emerald-600",
    initial: "CV",
  },
  {
    id: "venture",
    name: "AWQ Venture",
    description: "Investimentos · AWQ Group",
    href: "/awq/venture",
    color: "bg-orange-500",
    initial: "AV",
  },
];

export default function AWQSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">AW</span>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 tracking-wide">AWQ Group</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">
              Plataforma Central
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* AWQ GROUP section */}
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            AWQ Group
          </span>
        </div>

        {/* Visão Geral */}
        <Link
          href="/awq"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            pathname === "/awq"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <LayoutGrid
            size={16}
            className={cn(
              "transition-colors",
              pathname === "/awq" ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
            )}
          />
          <span className="flex-1">Visão Geral</span>
          {pathname === "/awq" && <ChevronRight size={14} className="text-indigo-400" />}
        </Link>

        {/* Business Units link */}
        <Link
          href="/awq/business-units"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            pathname === "/awq/business-units"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <Building2
            size={16}
            className={cn(
              "transition-colors",
              pathname === "/awq/business-units"
                ? "text-indigo-600"
                : "text-gray-400 group-hover:text-gray-600"
            )}
          />
          <span className="flex-1">Business Units</span>
          {pathname === "/awq/business-units" && (
            <ChevronRight size={14} className="text-indigo-400" />
          )}
        </Link>

        {/* Financial — below Business Units */}
        <Link
          href="/awq/financial"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            pathname.startsWith("/awq/financial")
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <Landmark
            size={16}
            className={cn(
              "transition-colors",
              pathname.startsWith("/awq/financial")
                ? "text-indigo-600"
                : "text-gray-400 group-hover:text-gray-600"
            )}
          />
          <span className="flex-1">Financial</span>
          {pathname.startsWith("/awq/financial") && (
            <ChevronRight size={14} className="text-indigo-400" />
          )}
        </Link>

        {/* BUSINESS UNITS section */}
        <div className="px-3 mt-5 mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Business Units
          </span>
        </div>

        {businessUnits.map((bu) => {
          const isActive = pathname.startsWith(bu.href);
          return (
            <Link
              key={bu.id}
              href={bu.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-50 border border-indigo-100"
                  : "hover:bg-gray-50 border border-transparent"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                  bu.color
                )}
              >
                {bu.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-indigo-700" : "text-gray-800"
                  )}
                >
                  {bu.name}
                </div>
                <div className="text-[11px] text-gray-400 truncate">{bu.description}</div>
              </div>
              <ChevronRight
                size={14}
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-indigo-400" : "text-gray-300 group-hover:text-gray-400"
                )}
              />
            </Link>
          );
        })}

        {/* SISTEMA section */}
        <div className="px-3 mt-5 mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Sistema
          </span>
        </div>

        <Link
          href="/awq/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            pathname === "/awq/settings"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <Settings
            size={16}
            className={cn(
              "transition-colors",
              pathname === "/awq/settings"
                ? "text-indigo-600"
                : "text-gray-400 group-hover:text-gray-600"
            )}
          />
          <span className="flex-1">Settings</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-800 truncate">Admin</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                Admin
              </span>
            </div>
            <div className="text-[10px] text-gray-400 truncate">Administrador</div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
