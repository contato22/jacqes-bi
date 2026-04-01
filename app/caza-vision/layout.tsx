"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  BarChart3,
  GitBranch,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const cazaNavItems = [
  { label: 'Visão Geral',    href: '/caza-vision',                icon: LayoutDashboard },
  { label: 'Projetos',       href: '/caza-vision/projetos',       icon: FolderKanban    },
  { label: 'Financial',      href: '/caza-vision/financial',      icon: DollarSign      },
  { label: 'Unit Economics', href: '/caza-vision/unit-economics', icon: BarChart3       },
  { label: 'Pipeline',       href: '/caza-vision/pipeline',       icon: GitBranch       },
  { label: 'Relatórios',     href: '/caza-vision/relatorios',     icon: FileText        },
]

function CazaSubNav() {
  const pathname = usePathname()

  return (
    <div className='px-8 pt-5 border-b border-gray-800 bg-gray-950'>
      {/* BU Header */}
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center'>
          <span className='text-[9px] font-black text-white tracking-tight'>CV</span>
        </div>
        <div>
          <span className='text-xs font-bold text-amber-400 uppercase tracking-widest'>
            CAZA VISION
          </span>
          <span className='ml-2 text-[10px] text-gray-600'>Business Unit</span>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <nav className='flex items-center gap-1 overflow-x-auto'>
        {cazaNavItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/caza-vision'
              ? pathname === '/caza-vision'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors border-b-2 -mb-px',
                isActive
                  ? 'text-amber-400 border-amber-500 bg-amber-500/5'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50'
              )}
            >
              <Icon size={13} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function CazaVisionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-full'>
      <CazaSubNav />
      <div className='flex-1'>{children}</div>
    </div>
  )
}
