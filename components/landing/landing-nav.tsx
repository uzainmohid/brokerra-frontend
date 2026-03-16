'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { BrokerraIcon } from '@/components/shared/brokerra-logo'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[rgba(8,15,32,0.92)] backdrop-blur-xl border-b border-white/6 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrokerraIcon size={32} className="transition-transform duration-300 group-hover:scale-105" />
          <span className="text-white font-bold text-lg tracking-tight">
            Broker<span className="text-emerald-400">ra</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-white/55 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            href="/start-trial"
            className="text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_4px_15px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.55)] hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/60 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[rgba(8,15,32,0.98)] border-t border-white/6 px-6 py-4 space-y-2"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/6">
            <Link href="/login" className="block text-center px-4 py-2.5 text-sm text-white/60 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
              Sign In
            </Link>
            <Link href="/start-trial" className="block text-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-all">
              Start Free Trial
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
