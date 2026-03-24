"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  FileBarChart,
  Settings,
  ChevronRight,
  Zap,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { businessUnits } from "@/lib/data";

const navItems = [
  { label: "Visão Geral", href: "/", icon: LayoutDashboard },
  { label: "Revenue", href: "/revenue", icon: TrendingUp },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Relatórios", href: "/reports", icon: FileBarChart },
];

// BU color accents by index
const buColors = [
  "from-brand-500 to-brand-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
];

function SidebarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buDropdownOpen, setBuDropdownOpen] = useState(false);

  const activeBuId = searchParams.get("bu");
  const activeBU = businessUnits.find((b) => b.id === activeBuId) ?? null;

  function selectBU(id: string) {
    setBuDropdownOpen(false);
    router.push(`/business-units?bu=${id}`);
  }

  function clearBU() {
    setBuDropdownOpen(false);
    router.push("/business-units");
  }

  return (
    <aside className="w-[260px] flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* ── Brand ── */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-awq-gold to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
            <Zap size={17} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">AWQ Group</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Plataforma Central</div>
          </div>
        </div>
      </div>

      {/* ── BU Selector ── */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <button
            onClick={() => setBuDropdownOpen((v) => !v)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
              activeBU
                ? "bg-brand-600/15 border border-brand-500/25 hover:bg-brand-600/25"
                : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
            )}
          >
            {/* BU icon */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                activeBU
                  ? buColors[businessUnits.findIndex((b) => b.id === activeBU.id) % buColors.length]
                  : "from-gray-600 to-gray-700"
              )}
            >
              <Building2 size={14} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {activeBU ? activeBU.name : "Selecionar BU"}
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                {activeBU ? "Business Unit · AWQ Group" : "Nenhuma BU selecionada"}
              </div>
            </div>

            <ChevronDown
              size={14}
              className={cn(
                "text-gray-500 flex-shrink-0 transition-transform duration-200",
                buDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown */}
          {buDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-700">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  AWQ Group · BUs
                </span>
              </div>

              <button
                onClick={clearBU}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <Building2 size={13} className="text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-300">Todas as BUs</div>
                  <div className="text-[10px] text-gray-600">Visão consolidada</div>
                </div>
                {!activeBU && <Check size={12} className="text-brand-400" />}
              </button>

              {businessUnits.map((bu, i) => (
                <button
                  key={bu.id}
                  onClick={() => selectBU(bu.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-700 transition-colors"
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                      buColors[i % buColors.length]
                    )}
                  >
                    <Building2 size={13} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-200 truncate">{bu.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{bu.description}</div>
                  </div>
                  {activeBU?.id === bu.id && <Check size={12} className="text-brand-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            {activeBU ? `${activeBU.name.split(" ").slice(-1)[0]} · Navegação` : "AWQ · Navegação"}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={activeBU ? `${item.href}?bu=${activeBU.id}` : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "transition-colors",
                  isActive ? "text-brand-400" : "text-gray-500 group-hover:text-gray-300"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-brand-500" />}
            </Link>
          );
        })}

        {/* BU detail link — shows when a BU is active */}
        {activeBU && (
          <Link
            href={`/business-units?bu=${activeBU.id}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
              pathname === "/business-units"
                ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            )}
          >
            <Building2
              size={16}
              className={cn(
                "transition-colors",
                pathname === "/business-units"
                  ? "text-brand-400"
                  : "text-gray-500 group-hover:text-gray-300"
              )}
            />
            <span className="flex-1">Sessão da BU</span>
            {pathname === "/business-units" && (
              <ChevronRight size={14} className="text-brand-500" />
            )}
          </Link>
        )}

        <div className="px-3 mt-5 mb-3">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            Sistema
          </span>
        </div>

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            pathname === "/settings"
              ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          )}
        >
          <Settings
            size={16}
            className={cn(
              "transition-colors",
              pathname === "/settings"
                ? "text-brand-400"
                : "text-gray-500 group-hover:text-gray-300"
            )}
          />
          Settings
        </Link>
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-awq-gold to-amber-600 flex items-center justify-center text-xs font-bold text-white">
            AW
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-300 truncate">AWQ Group</div>
            <div className="text-[10px] text-gray-600 truncate">admin@awqgroup.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={
      <aside className="w-[260px] flex-shrink-0 bg-gray-900 border-r border-gray-800" />
    }>
      <SidebarInner />
    </Suspense>
  );
}
