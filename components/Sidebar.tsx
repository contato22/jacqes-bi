"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  FileBarChart,
  Settings,
  ChevronRight,
  Zap,
  Activity,
  LogOut,
  DollarSign,
  HeartPulse,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { label: "Visão Geral", href: "/",           icon: LayoutDashboard },
  { label: "Desempenho",  href: "/revenue",    icon: TrendingUp      },
  { label: "Carteira",    href: "/customers",  icon: Users           },
  { label: "Análise",     href: "/analise",    icon: Activity        },
  { label: "CS Ops",      href: "/csops",      icon: HeartPulse      },
  { label: "Financial",   href: "/financial",  icon: DollarSign      },
  { label: "Relatórios",  href: "/reports",    icon: FileBarChart    },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open, close } = useSidebar();

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "AW";

  return (
    <aside
      className={cn(
        // Shared
        "w-[260px] flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full",
        "transition-transform duration-300 ease-in-out",
        // Mobile: fixed drawer
        "fixed inset-y-0 left-0 z-40",
        // Desktop: back in normal flow, reset mobile overrides
        "md:relative md:inset-auto md:z-auto md:translate-x-0",
        // Mobile open/close state (ignored on desktop due to md:translate-x-0)
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >

      {/* Logo + mobile close */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/40">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">JACQES BI</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">AWQ Group</div>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={close}
          className="md:hidden p-1 text-gray-500 hover:text-gray-200 rounded-lg transition-colors"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            Operações
          </span>
        </div>

        {navItems.filter((item) => user?.role === "admin" || item.href === "/").map((item) => {
          const Icon     = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "transition-colors",
                  isActive ? "text-brand-400" : "text-gray-500 group-hover:text-gray-300",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-brand-500" />}
            </Link>
          );
        })}

        <div className="px-3 mt-5 mb-3">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            System
          </span>
        </div>

        <Link
          href="/settings"
          onClick={close}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            pathname === "/settings"
              ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
          )}
        >
          <Settings
            size={16}
            className={cn(
              "transition-colors",
              pathname === "/settings"
                ? "text-brand-400"
                : "text-gray-500 group-hover:text-gray-300",
            )}
          />
          Settings
        </Link>
      </nav>

      {/* Footer — User Info */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0",
              user?.role === "admin"
                ? "bg-gradient-to-br from-awq-gold to-amber-600"
                : "bg-gradient-to-br from-brand-500 to-brand-700",
            )}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-300 truncate">
                {user?.displayName ?? "AWQ Group"}
              </span>
              {user?.role === "admin" && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-awq-gold/20 text-awq-gold border border-awq-gold/30 uppercase tracking-wide">
                  admin
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-600 truncate">
              {user?.role === "admin" ? "Administrador" : "CS & Operações"}
            </div>
          </div>

          <button
            onClick={logout}
            title="Sair"
            className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
