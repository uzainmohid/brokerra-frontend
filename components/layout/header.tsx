'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { getInitials } from '@/utils'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user } = useAuth()

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-8 py-5 border-b border-white/6 bg-[rgba(8,15,32,0.5)] backdrop-blur-sm"
    >
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {action && action}

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        {/* User avatar */}
        <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-white/8 hover:ring-emerald-500/40 transition-all duration-200">
          <AvatarFallback className="text-xs">
            {user?.name ? getInitials(user.name) : user?.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  )
}
