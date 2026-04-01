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
  Building2,
  PieChart,
  BarChart3,
  Briefcase,
  DollarSign,
  GitBranch,
  Shield,
  Activity,
  Target,
  BookOpen,
  Eye,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── Navigation structure ─────────────────────────────────────────────────────

const awqNav = [
  { label: "Control Tower", href: "/awq", icon: LayoutDashboard, exact: true },
  { label: "Financial", href: "/awq/financial", icon: DollarSign },
  { label: "Cash Flow", href: "/awq/cashflow", icon: Activity },
  { label: "Budget", href: "/awq/budget", icon: Target },
  { label: "Forecast", href: "/awq/forecast", icon: TrendingUp },
  { label: "Allocations", href: "/awq/allocations", icon: PieChart },
  { label: "Risk", href: "/awq/risk", icon: Shield },
  { label: "KPIs", href: "/awq/kpis", icon: BarChart3 },
  { label: "Portfolio", href: "/awq/portfolio", icon: Briefcase },
];

const awqAdminNav = [
  { label: "Audit Log", href: "/awq/admin/audit", icon: BookOpen },
  { label: "Period Close", href: "/awq/admin/close", icon: GitBranch },
];

const buNav = [
  {
    label: "JACQES",
    id: "jacqes",
    color: "brand",
    items: [
      { label: "Overview", href: "/jacqes", icon: LayoutDashboard, exact: true },
      { label: "Revenue", href: "/jacqes/revenue", icon: TrendingUp },
      { label: "Customers", href: "/jacqes/customers", icon: Users },
    ],
  },
  {
    label: "Caza Vision",
    id: "caza-vision",
    color: "emerald",
    items: [
      { label: "Overview", href: "/caza-vision", icon: Eye, exact: true },
    ],
  },
  {
    label: "Advisor",
    id: "advisor",
    color: "blue",
    items: [
      { label: "Overview", href: "/advisor", icon: Building2, exact: true },
    ],
  },
  {
    label: "AWQ Venture",
    id: "awq-venture",
    color: "purple",
    items: [
      { label: "Overview", href: "/awq-venture", icon: GitBranch, exact: true },
    ],
  },
];

const buColorMap: Record<string, string> = {
  brand: "bg-brand-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ href, icon: Icon, label, exact = false }: { href: string; icon: React.ElementType; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
        isActive
          ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
      )}
    >
      <Icon
        size={15}
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-brand-400" : "text-gray-500 group-hover:text-gray-300"
        )}
      />
      <span className="flex-1 truncate">{label}</span>
      {isActive && <ChevronRight size={13} className="text-brand-500 shrink-0" />}
    </Link>
  );
}

// ─── BU Section ───────────────────────────────────────────────────────────────

function BUSection({ bu }: { bu: typeof buNav[0] }) {
  const pathname = usePathname();
  const isAnyActive = bu.items.some((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );
  const [open, setOpen] = useState(isAnyActive);
  const dotColor = buColorMap[bu.color] ?? "bg-gray-500";

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-lg hover:bg-gray-800/60 transition-colors"
      >
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
        <span className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-widest truncate">
          {bu.label}
        </span>
        <ChevronDown
          size={12}
          className={cn("text-gray-600 transition-transform shrink-0", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-0.5 ml-2 pl-3 border-l border-gray-800 space-y-0.5">
          {bu.items.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/40 shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">AWQ BI</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Group Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {/* AWQ Holding */}
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            AWQ Group · Holding
          </span>
        </div>

        {awqNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        <div className="px-3 mt-4 mb-2">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            AWQ Admin
          </span>
        </div>

        {awqAdminNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {/* BU Sections */}
        <div className="px-3 mt-4 mb-2">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Business Units
          </span>
        </div>

        <div className="space-y-1">
          {buNav.map((bu) => (
            <BUSection key={bu.id} bu={bu} />
          ))}
        </div>

        {/* System */}
        <div className="px-3 mt-4 mb-2">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            System
          </span>
        </div>

        <NavLink href="/settings" icon={Settings} label="Settings" exact />
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800 shrink-0">
        <div className="flex items-center gap-3 px-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-awq-gold to-amber-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
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
