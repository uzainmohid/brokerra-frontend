'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  MessageSquareText,
  Bot,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/leads',        label: 'Leads',          icon: Users           },
  { href: '/analytics',    label: 'Analytics',      icon: BarChart3       },
  { href: '/ai-agent',    label: 'AI Deal Agent', icon: Bot,               badge: 'AI' },
  { href: '/ai-composer', label: 'AI Composer',   icon: MessageSquareText, badge: 'AI' },
  { href: '/settings',     label: 'Settings',       icon: Settings        },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname  = usePathname()
  const { user, logout } = useAuth()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative flex flex-col h-screen',
        'bg-[rgba(8,15,32,0.98)] backdrop-blur-xl',
        'border-r border-white/6',
        'overflow-hidden flex-shrink-0',
        className,
      )}
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Logo */}
        <div className="relative flex items-center gap-3 px-4 py-5 border-b border-white/6">
    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.4)]">
      <Image
        src="/brokerra-app-icon.svg"
        alt="Brokerra"
        width={20}
        height={20}
        className="object-contain"
      />
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white font-bold text-lg tracking-tight">
            Broker<span className="text-emerald-400">ra</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 z-10 w-6 h-6 rounded-full bg-navy-700 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-emerald-500/40 transition-all duration-200 shadow-lg"
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft  className="w-3.5 h-3.5" />
        }
      </button>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
            Main Menu
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon     = item.icon
          const isAI     = item.badge === 'AI'

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer',
                  'text-sm font-medium group relative',
                  isActive
                    ? isAI
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                      : 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20'
                    : isAI
                    ? 'text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/8 border border-emerald-500/10 hover:border-emerald-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent',
                )}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-emerald-400'
                      : isAI
                      ? 'text-emerald-400/60 group-hover:text-emerald-400'
                      : 'text-white/40 group-hover:text-white/70',
                  )}
                  style={{ width: collapsed ? 20 : 18, height: collapsed ? 20 : 18 }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && !collapsed && (
                  <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 leading-none">
                    {item.badge}
                  </span>
                )}

                {isActive && !collapsed && !item.badge && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="relative px-3 pb-4 space-y-1 border-t border-white/6 pt-3">
        <button className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
          'text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200',
          'text-sm font-medium',
        )}>
          <Bell style={{ width: 18, height: 18 }} className="flex-shrink-0 text-white/40" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group">
          <Avatar className="flex-shrink-0 w-7 h-7">
            <AvatarFallback className="text-[10px]">
              {user?.name ? getInitials(user.name) : user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white/80 truncate">{user?.name || 'Broker'}</p>
                <p className="text-[11px] text-white/35 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
            'text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200',
            'text-sm font-medium',
          )}
        >
          <LogOut style={{ width: 18, height: 18 }} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
