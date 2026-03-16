'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Brain,
  GitBranch,
  BarChart3,
  Clock,
  Download,
  Zap,
  ArrowRight,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    label: 'AI Follow-Up Intelligence',
    title: 'Know exactly who to call and when',
    description:
      'Our AI scores every lead, detects inactivity patterns, and surfaces who\'s at risk of going cold — before it\'s too late. Never make a gut-feel follow-up decision again.',
    benefits: ['Lead heat scoring', 'Inactivity detection alerts', 'Optimal contact timing', 'AI-written follow-up suggestions'],
    color: 'emerald',
    gradient: 'from-emerald-500/15 to-teal-500/5',
    border: 'border-emerald-500/20',
    tag: 'Most Loved',
  },
  {
    icon: GitBranch,
    label: 'Visual Pipeline Board',
    title: 'See every deal in motion at once',
    description:
      'Drag-and-drop Kanban board with 7 pipeline stages. See your entire deal pipeline in one glance — from first contact to keys in hand.',
    benefits: ['7 deal stages', 'Drag & drop', 'Revenue potential tracking', 'Stage conversion rates'],
    color: 'blue',
    gradient: 'from-blue-500/15 to-blue-500/5',
    border: 'border-blue-500/20',
    tag: null,
  },
  {
    icon: BarChart3,
    label: 'Conversion Analytics',
    title: 'Find what\'s working. Kill what\'s not.',
    description:
      'Real-time charts showing where your leads come from, how fast they convert, and which pipeline stages are bleeding deals.',
    benefits: ['Source attribution', 'Conversion funnel', 'Revenue forecasting', 'Monthly trend reports'],
    color: 'purple',
    gradient: 'from-purple-500/15 to-purple-500/5',
    border: 'border-purple-500/20',
    tag: null,
  },
  {
    icon: Clock,
    label: 'Lead Timeline History',
    title: 'Every conversation. Every detail. Forever.',
    description:
      'Full activity log for every lead — calls, notes, follow-ups, status changes — so you always know the complete history before you pick up the phone.',
    benefits: ['Complete activity log', 'Follow-up history', 'Notes & attachments', 'AI-generated lead summary'],
    color: 'amber',
    gradient: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/20',
    tag: null,
  },
  {
    icon: Download,
    label: 'Export & Reports',
    title: 'Share reports that close more deals',
    description:
      'One-click export of your full lead database and monthly performance reports. Present professional numbers to developers and property owners.',
    benefits: ['CSV lead export', 'Monthly PDF reports', 'Custom date ranges', 'Broker performance analytics'],
    color: 'pink',
    gradient: 'from-pink-500/15 to-pink-500/5',
    border: 'border-pink-500/20',
    tag: null,
  },
  {
    icon: Zap,
    label: 'Smart Automation',
    title: 'Your CRM runs even while you sleep',
    description:
      'Automated reminders, follow-up nudges, and lead scoring updates happen in the background — so your pipeline is always fresh and prioritized.',
    benefits: ['Auto follow-up reminders', 'WhatsApp integration', 'Overdue lead alerts', 'Daily digest notifications'],
    color: 'cyan',
    gradient: 'from-cyan-500/15 to-cyan-500/5',
    border: 'border-cyan-500/20',
    tag: 'Coming Soon',
  },
]

const COLOR_MAP = {
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/12', dot: 'bg-emerald-400' },
  blue: { icon: 'text-blue-400', bg: 'bg-blue-500/12', dot: 'bg-blue-400' },
  purple: { icon: 'text-purple-400', bg: 'bg-purple-500/12', dot: 'bg-purple-400' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/12', dot: 'bg-amber-400' },
  pink: { icon: 'text-pink-400', bg: 'bg-pink-500/12', dot: 'bg-pink-400' },
  cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/12', dot: 'bg-cyan-400' },
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon
  const colors = COLOR_MAP[feature.color as keyof typeof COLOR_MAP]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative bg-[rgba(15,26,53,0.5)] backdrop-blur-sm border ${feature.border} rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}
    >
      {/* Gradient top-right decoration */}
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${feature.gradient} rounded-bl-full opacity-70`} />

      {/* Tag */}
      {feature.tag && (
        <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
          {feature.tag}
        </div>
      )}

      <div className="relative">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center mb-5`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        {/* Label */}
        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${colors.icon}`}>
          {feature.label}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-snug mb-3">{feature.title}</h3>

        {/* Description */}
        <p className="text-sm text-white/45 leading-relaxed mb-5">{feature.description}</p>

        {/* Benefits list */}
        <ul className="space-y-1.5">
          {feature.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-white/60">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-28 bg-[#080f20] overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-medium text-emerald-300">Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5"
          >
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              close more deals.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/45 text-lg leading-relaxed"
          >
            Built specifically for Indian real estate brokers.
            Not a generic CRM you spend weeks configuring.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.label} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
