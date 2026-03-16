'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, TrendingUp, Users, Zap, CheckCircle2 } from 'lucide-react'

const STAT_ITEMS = [
  { value: '₹2.4Cr', label: 'Avg deals recovered/month' },
  { value: '3.8×', label: 'Higher follow-up rate' },
  { value: '47%', label: 'Faster lead conversion' },
]

// Mini dashboard preview card
function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-emerald-500/8 blur-3xl rounded-3xl scale-110" />

      {/* Main dashboard card */}
      <div className="relative bg-[rgba(15,26,53,0.85)] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <div className="ml-3 flex-1 h-5 bg-white/5 rounded-md flex items-center px-3">
            <span className="text-[10px] text-white/25">app.brokerra.in/dashboard</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-5">
          {/* Top stats row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Leads', value: '284', color: 'text-white', change: '+12%', up: true },
              { label: 'Hot Leads', value: '47', color: 'text-red-400', change: '+8%', up: true },
              { label: 'Overdue', value: '13', color: 'text-amber-400', change: '-3%', up: false },
              { label: "Today's Follow Ups", value: '9', color: 'text-emerald-400', change: '', up: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white/4 border border-white/6 rounded-xl p-3"
              >
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-white/40 mt-0.5 leading-tight">{stat.label}</div>
                {stat.change && (
                  <div className={`text-[10px] mt-1 font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Chart + leads side by side */}
          <div className="grid grid-cols-5 gap-3">
            {/* Mini chart */}
            <div className="col-span-3 bg-white/3 border border-white/6 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-3">Monthly Lead Trend</div>
              <div className="flex items-end gap-1.5 h-16">
                {[35, 52, 43, 68, 57, 72, 84, 91, 76, 88, 95, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                    className="flex-1 rounded-sm"
                    style={{
                      background: i >= 10
                        ? 'linear-gradient(to top, #059669, #10b981)'
                        : 'rgba(255,255,255,0.08)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Lead list */}
            <div className="col-span-2 bg-white/3 border border-white/6 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-2">Recent Leads</div>
              <div className="space-y-2">
                {[
                  { name: 'Rajesh K.', status: '🔥', stage: 'Negotiation' },
                  { name: 'Priya M.', status: '⚡', stage: 'Site Visit' },
                  { name: 'Amit S.', status: '❄️', stage: 'Contacted' },
                ].map((lead, i) => (
                  <motion.div
                    key={lead.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
                      {lead.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-white/70 truncate">{lead.name}</div>
                      <div className="text-[9px] text-white/30">{lead.stage}</div>
                    </div>
                    <span className="text-xs">{lead.status}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* AI banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-3 flex items-center gap-2.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-3 py-2"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-[10px] text-emerald-300/80">
              <span className="font-semibold text-emerald-400">AI Insight:</span> Rajesh Kumar hasn't been contacted in 5 days — high risk of losing ₹85L deal.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating notification cards */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: -20, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute -left-6 top-1/3 bg-[rgba(15,26,53,0.95)] backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2.5 shadow-xl max-w-[160px]"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
            <span className="text-xs">🔥</span>
          </div>
          <span className="text-[10px] font-semibold text-white/80">Hot Lead Alert</span>
        </div>
        <p className="text-[9px] text-white/40 leading-tight">Priya Mehta viewed the property listing 3 times today</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 20, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="absolute -right-6 bottom-1/3 bg-[rgba(15,26,53,0.95)] backdrop-blur-xl border border-emerald-500/20 rounded-xl px-3 py-2.5 shadow-xl max-w-[150px]"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-400">Deal Closed!</span>
        </div>
        <p className="text-[9px] text-white/40 leading-tight">₹1.2Cr — Andheri 3BHK</p>
      </motion.div>
    </motion.div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080f20]">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-25" />
        {/* Edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_50%,rgba(8,15,32,0.8)_100%)]" />
        {/* Subtle orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">AI-Powered CRM for Real Estate Brokers</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-5"
          >
            Stop Losing{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Property Leads.
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-400/60 to-emerald-500/0 origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto"
          >
            AI-powered follow-up intelligence for modern real estate brokers.
            Never forget a follow-up, never lose a ₹10L+ deal to silence again.
          </motion.p>
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Link
            href="/start-trial"
            className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-[0_4px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.65)] hover:-translate-y-0.5 text-base"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button className="group flex items-center gap-2.5 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
            </div>
            See Demo
          </button>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-16 text-sm text-white/35"
        >
          <div className="flex items-center -space-x-2">
            {['R', 'P', 'A', 'S', 'M'].map((letter, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[#080f20] bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white"
              >
                {letter}
              </div>
            ))}
          </div>
          <span>Trusted by <strong className="text-white/60">500+</strong> brokers across India</span>
          <span className="hidden sm:inline text-white/15">•</span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★★★★★</span>
            <span>4.9/5 rating</span>
          </span>
        </motion.div>

        {/* Dashboard preview */}
        <DashboardPreview />

        {/* Stats below dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-12 mt-16"
        >
          {STAT_ITEMS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080f20] to-transparent pointer-events-none" />
    </section>
  )
}
