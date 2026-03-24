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
  Briefcase,
  Building2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { label: "Visão Geral", href: "/",          icon: LayoutDashboard },
  { label: "Desempenho",  href: "/revenue",   icon: TrendingUp      },
  { label: "Carteira",    href: "/customers", icon: Users           },
  { label: "Análise",     href: "/analise",   icon: Activity        },
  { label: "CS Ops",      href: "/csops",     icon: HeartPulse      },
  { label: "Financial",   href: "/financial", icon: DollarSign      },
  { label: "Relatórios",  href: "/reports",   icon: FileBarChart    },
];

const carreiraItem = { label: "Modo Carreira", href: "/carreira", icon: Briefcase };

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open, close } = useSidebar();

  const isAdmin = user?.role === "admin";
  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "AW";

  return (
    <aside
      className={cn(
        "w-[260px] flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full",
        "transition-transform duration-300 ease-in-out",
        "fixed inset-y-0 left-0 z-40",
        "md:relative md:inset-auto md:z-auto md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* ── AWQ Group branding ────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800">
        {/* AWQ Group header */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/group"
            onClick={close}
            className="flex items-center gap-2.5 group"
            title="AWQ Group — Plataforma Central"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-awq-gold to-amber-600 flex items-center justify-center shadow-sm shrink-0">
              <Zap size={13} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-awq-gold transition-colors tracking-wide">
                AWQ Group
              </div>
              <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                Plataforma Central
              </div>
            </div>
          </Link>
          {/* Mobile close */}
          <button
            onClick={close}
            className="md:hidden p-1 text-gray-500 hover:text-gray-200 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* BU Switcher */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-600/10 border border-brand-500/20">
          <div className="w-6 h-6 rounded-md bg-brand-600/20 flex items-center justify-center shrink-0">
            <Building2 size={12} className="text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-brand-300 truncate">JACQES BU</div>
            <div className="text-[9px] text-brand-600 truncate">CS & Operações</div>
          </div>
          <Link
            href="/group"
            onClick={close}
            title="Trocar de BU"
            className="text-brand-600 hover:text-brand-400 transition-colors shrink-0"
          >
            <ChevronDown size={13} />
          </Link>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
            JACQES · Operações
          </span>
        </div>

        {navItems
          .filter((item) => isAdmin || item.href === "/")
          .map((item) => {
            const Icon = item.icon;
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
                  size={15}
                  className={cn(
                    "transition-colors shrink-0",
                    isActive ? "text-brand-400" : "text-gray-500 group-hover:text-gray-300",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={13} className="text-brand-500" />}
              </Link>
            );
          })}

        {/* Modo Carreira */}
        {isAdmin && (
          <>
            <div className="px-3 mt-4 mb-2">
              <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
                Gestão
              </span>
            </div>
            <Link
              href={carreiraItem.href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                pathname.startsWith(carreiraItem.href)
                  ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
              )}
            >
              <carreiraItem.icon
                size={15}
                className={cn(
                  "transition-colors shrink-0",
                  pathname.startsWith(carreiraItem.href)
                    ? "text-brand-400"
                    : "text-gray-500 group-hover:text-gray-300",
                )}
              />
              <span className="flex-1">{carreiraItem.label}</span>
              {pathname.startsWith(carreiraItem.href) && (
                <ChevronRight size={13} className="text-brand-500" />
              )}
            </Link>
          </>
        )}

        <div className="px-3 mt-4 mb-2">
          <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
            Sistema
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
            size={15}
            className={cn(
              "transition-colors shrink-0",
              pathname === "/settings" ? "text-brand-400" : "text-gray-500 group-hover:text-gray-300",
            )}
          />
          <span className="flex-1">Settings</span>
        </Link>
      </nav>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
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
