'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Clock, TrendingDown, Eye } from 'lucide-react'

const PAIN_POINTS = [
  {
    icon: MessageSquare,
    emoji: '💬',
    title: 'WhatsApp Lead Chaos',
    description: 'Leads flooding in from WhatsApp, Instagram, portals — all mixed in a single chat. No system, no structure. You lose track within hours.',
    stat: '68% of leads',
    statLabel: 'never get a second follow-up',
    color: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/15',
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-400',
  },
  {
    icon: Clock,
    emoji: '⏰',
    title: 'Forgotten Follow-Ups',
    description: 'You told yourself you\'d call back Monday. It\'s Thursday. The lead went cold, called your competitor, and bought elsewhere.',
    stat: '3.2 days',
    statLabel: 'average follow-up delay',
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/15',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
  },
  {
    icon: TrendingDown,
    emoji: '💸',
    title: 'Lost Deals Worth ₹10L+',
    description: 'Every forgotten lead is a lost commission. A single missed 3BHK follow-up in Mumbai can cost you ₹2–5 lakh in brokerage.',
    stat: '₹14.8L',
    statLabel: 'avg revenue lost per broker/year',
    color: 'from-red-500/20 to-red-500/5',
    border: 'border-red-500/15',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
  },
  {
    icon: Eye,
    emoji: '🌫️',
    title: 'Zero Pipeline Visibility',
    description: 'You have no idea where your leads stand. Which ones are hot? Who needs a follow-up today? You\'re flying blind every single day.',
    stat: '0 clarity',
    statLabel: 'on deal pipeline status',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/15',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
  },
]

function PainCard({ item, index }: { item: typeof PAIN_POINTS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className={`relative bg-[rgba(15,26,53,0.5)] backdrop-blur-sm border ${item.border} rounded-2xl p-6 overflow-hidden group hover:border-opacity-40 transition-all duration-300`}
    >
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} rounded-bl-full opacity-60`} />

      <div className="relative">
        {/* Icon + emoji */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${item.iconColor}`} />
          </div>
          <span className="text-2xl">{item.emoji}</span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
        <p className="text-sm text-white/50 leading-relaxed mb-5">{item.description}</p>

        {/* Stat */}
        <div className={`border-t ${item.border} pt-4 flex items-baseline gap-2`}>
          <span className="text-2xl font-bold text-white">{item.stat}</span>
          <span className="text-xs text-white/35">{item.statLabel}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="problem" className="relative py-28 bg-[#080f20] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-medium text-red-400">The Problem</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5"
          >
            Every broker has a graveyard
            <br />
            <span className="text-white/40">of forgotten leads.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/45 text-lg leading-relaxed"
          >
            The average Indian real estate broker loses 4–6 potential deals every month.
            Not from bad leads — from zero follow-up systems.
          </motion.p>
        </div>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PAIN_POINTS.map((item, i) => (
            <PainCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-red-950/40 to-amber-950/20 border border-red-500/15 rounded-2xl p-6 text-center"
        >
          <p className="text-lg text-white/70">
            The brutal truth:{' '}
            <span className="text-white font-semibold">
              Your leads didn't disappear. You just forgot to follow up.
            </span>
          </p>
          <p className="text-sm text-white/35 mt-1">Brokerra exists to fix exactly that.</p>
        </motion.div>
      </div>
    </section>
  )
}
