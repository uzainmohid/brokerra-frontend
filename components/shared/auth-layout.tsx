'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BrokerraIcon } from '@/components/shared/brokerra-logo'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  footerText: string
  footerLinkLabel: string
  footerLinkHref: string
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#080f20] flex overflow-hidden">
      {/* ── Left panel — decorative ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_30%_50%,rgba(16,185,129,0.10),transparent)]" />
        <div className="absolute inset-0 dot-grid opacity-25" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <BrokerraIcon size={36} />
          <span className="text-white font-bold text-xl tracking-tight">
            Broker<span className="text-emerald-400">ra</span>
          </span>
        </div>

        {/* Central quote / benefit area */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Big decorative quote mark */}
            <div className="text-8xl text-emerald-500/15 font-serif leading-none mb-4 select-none">"</div>

            <blockquote className="text-2xl font-semibold text-white/80 leading-relaxed mb-8">
              I recovered a ₹2.4Cr deal because Brokerra
              flagged it as{' '}
              <span className="text-emerald-400">high risk</span>{' '}
              before it went cold.
            </blockquote>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm font-bold text-white">
                SV
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sunita Verma</div>
                <div className="text-xs text-white/40">Luxury Property Specialist · Delhi NCR</div>
              </div>
            </div>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 grid grid-cols-3 gap-3"
          >
            {[
              { value: '500+', label: 'Brokers' },
              { value: '₹2.4Cr', label: 'Avg recovered' },
              { value: '3.8×', label: 'More deals' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/4 border border-white/8 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-white/35">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom trust line */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Trusted by brokers across Mumbai, Pune, Delhi, Bangalore</span>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Subtle background for form side */}
        <div className="absolute inset-0 bg-[rgba(8,15,32,0.5)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(16,185,129,0.04),transparent)]" />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 relative">
          <BrokerraIcon size={32} />
          <span className="text-white font-bold text-lg">
            Broker<span className="text-emerald-400">ra</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-[rgba(15,26,53,0.75)] backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            {/* Card glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">{title}</h1>
              <p className="text-sm text-white/45">{subtitle}</p>
            </div>

            {children}

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-white/35">
              {footerText}{' '}
              <Link
                href={footerLinkHref}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
              >
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to landing link */}
        <div className="relative mt-6">
          <Link href="/landing" className="text-sm text-white/25 hover:text-white/50 transition-colors duration-200">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
