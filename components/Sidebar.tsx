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
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState } from "react";

// ── BU definitions ─────────────────────────────────────────────────────────────

type BUId = "jacqes" | "m4e";

interface BUDef {
  id: BUId;
  label: string;
  sublabel: string;
  rootHref: string;
  cor: string;          // Tailwind color key
  navItems: { label: string; href: string; icon: React.ElementType }[];
}

const busDefinidas: BUDef[] = [
  {
    id: "jacqes",
    label: "JACQES BU",
    sublabel: "CS & Operações",
    rootHref: "/",
    cor: "brand",
    navItems: [
      { label: "Visão Geral", href: "/",          icon: LayoutDashboard },
      { label: "Desempenho",  href: "/revenue",   icon: TrendingUp      },
      { label: "Carteira",    href: "/customers", icon: Users           },
      { label: "Análise",     href: "/analise",   icon: Activity        },
      { label: "CS Ops",      href: "/csops",     icon: HeartPulse      },
      { label: "Financial",   href: "/financial", icon: DollarSign      },
      { label: "Relatórios",  href: "/reports",   icon: FileBarChart    },
    ],
  },
  {
    id: "m4e",
    label: "Media for Equity",
    sublabel: "M4E · AWQ Group",
    rootHref: "/m4e",
    cor: "emerald",
    navItems: [
      { label: "Visão Geral", href: "/m4e",            icon: LayoutDashboard },
      { label: "Carteira",    href: "/m4e/customers",  icon: Users           },
      { label: "Financial",   href: "/m4e/financial",  icon: DollarSign      },
    ],
  },
];

const corClasses: Record<string, { pill: string; active: string; accent: string }> = {
  brand: {
    pill:   "bg-brand-600/10 border-brand-500/20",
    active: "bg-brand-600/20 text-brand-400 border border-brand-500/20",
    accent: "text-brand-400",
  },
  emerald: {
    pill:   "bg-emerald-600/10 border-emerald-500/20",
    active: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20",
    accent: "text-emerald-400",
  },
};

// ── detect active BU from pathname ────────────────────────────────────────────

function detectBU(pathname: string): BUId {
  if (pathname.startsWith("/m4e")) return "m4e";
  return "jacqes";
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open, close } = useSidebar();
  const [buMenuOpen, setBuMenuOpen] = useState(false);

  const isAdmin    = user?.role === "admin";
  const initials   = user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : "AW";
  const activeBUId = detectBU(pathname);
  const activeBU   = busDefinidas.find((b) => b.id === activeBUId) ?? busDefinidas[0];
  const cor        = corClasses[activeBU.cor];

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
      {/* ── AWQ Group Header ────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800">
        {/* AWQ Group branding */}
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
          <button
            onClick={close}
            className="md:hidden p-1 text-gray-500 hover:text-gray-200 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* BU Switcher */}
        <div className="relative">
          <button
            onClick={() => setBuMenuOpen((v) => !v)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
              cor.pill,
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
              activeBU.cor === "brand" ? "bg-brand-600/20" : "bg-emerald-600/20"
            )}>
              <Building2 size={12} className={cor.accent} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className={cn("text-xs font-semibold truncate", cor.accent)}>{activeBU.label}</div>
              <div className="text-[9px] text-gray-600 truncate">{activeBU.sublabel}</div>
            </div>
            <ChevronDown
              size={13}
              className={cn("transition-transform shrink-0", cor.accent, buMenuOpen && "rotate-180")}
            />
          </button>

          {/* Dropdown */}
          {buMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {busDefinidas.map((bu) => {
                const isActive = bu.id === activeBUId;
                return (
                  <Link
                    key={bu.id}
                    href={bu.rootHref}
                    onClick={() => { setBuMenuOpen(false); close(); }}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-700 transition-colors",
                      isActive && "bg-gray-700/60"
                    )}
                  >
                    <div className="w-5 h-5 rounded-md bg-gray-700 flex items-center justify-center shrink-0">
                      <Building2 size={11} className={isActive ? corClasses[bu.cor].accent : "text-gray-500"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-xs font-semibold", isActive ? corClasses[bu.cor].accent : "text-gray-300")}>
                        {bu.label}
                      </div>
                      <div className="text-[9px] text-gray-600">{bu.sublabel}</div>
                    </div>
                    {isActive && <ChevronRight size={11} className={corClasses[bu.cor].accent} />}
                  </Link>
                );
              })}
              {/* Ver todas as BUs */}
              <Link
                href="/group"
                onClick={() => { setBuMenuOpen(false); close(); }}
                className="flex items-center gap-2 px-3 py-2 border-t border-gray-700 text-[10px] text-gray-600 hover:text-gray-400 hover:bg-gray-700/40 transition-colors"
              >
                <Zap size={10} className="text-awq-gold" />
                Ver todas as BUs · AWQ Group
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
            {activeBU.label} · Navegação
          </span>
        </div>

        {activeBU.navItems
          .filter((item) => isAdmin || item.href === activeBU.rootHref)
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === activeBU.rootHref
                ? pathname === activeBU.rootHref
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive ? cor.active : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
                )}
              >
                <Icon
                  size={15}
                  className={cn(
                    "transition-colors shrink-0",
                    isActive ? cor.accent : "text-gray-500 group-hover:text-gray-300",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={13} className={cor.accent} />}
              </Link>
            );
          })}

        {/* Modo Carreira — apenas JACQES + admin */}
        {isAdmin && activeBUId === "jacqes" && (
          <>
            <div className="px-3 mt-4 mb-2">
              <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
                Gestão
              </span>
            </div>
            <Link
              href="/carreira"
              onClick={close}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                pathname.startsWith("/carreira") ? cor.active : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
              )}
            >
              <Briefcase
                size={15}
                className={cn(
                  "transition-colors shrink-0",
                  pathname.startsWith("/carreira") ? cor.accent : "text-gray-500 group-hover:text-gray-300",
                )}
              />
              <span className="flex-1">Modo Carreira</span>
              {pathname.startsWith("/carreira") && <ChevronRight size={13} className={cor.accent} />}
            </Link>
          </>
        )}

        {/* M4E: link para metodologia doc (futuro) */}
        {activeBUId === "m4e" && isAdmin && (
          <>
            <div className="px-3 mt-4 mb-2">
              <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">
                Produto
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 cursor-not-allowed">
              <BookOpen size={15} className="text-gray-700 shrink-0" />
              <span className="flex-1">Metodologia Docs</span>
              <span className="text-[9px] text-gray-700">em breve</span>
            </div>
          </>
        )}

        {/* System */}
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
            pathname === "/settings" ? cor.active : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
          )}
        >
          <Settings
            size={15}
            className={cn(
              "transition-colors shrink-0",
              pathname === "/settings" ? cor.accent : "text-gray-500 group-hover:text-gray-300",
            )}
          />
          <span className="flex-1">Settings</span>
        </Link>
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────── */}
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
          <button onClick={logout} title="Sair" className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
