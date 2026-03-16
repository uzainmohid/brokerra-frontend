'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowDown, Plus, Bell, TrendingUp, CheckCircle } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Plus,
    title: 'Capture Every Lead',
    description:
      'Add leads from WhatsApp, Instagram, property portals, walk-ins — all in one place. Take 10 seconds to log a lead. Never lose contact info to a sticky note again.',
    details: ['Manual entry or bulk import', 'Tag by source automatically', 'Attach property preferences', 'Assign temperature instantly'],
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]',
  },
  {
    number: '02',
    icon: Bell,
    title: 'Track Every Follow-Up',
    description:
      'Get AI-powered reminders for exactly when to follow up. Brokerra tracks your last contact, warns you about cold leads, and keeps your entire pipeline moving forward.',
    details: ['Smart follow-up scheduling', 'Overdue lead alerts', 'Lead heat monitoring', 'One-tap call/message logging'],
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'shadow-[0_0_40px_rgba(59,130,246,0.10)]',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Close More Deals',
    description:
      'With a clear pipeline, timely follow-ups, and AI insights — your conversion rate climbs. Top brokers using Brokerra report 3.8× more deals closed within 90 days.',
    details: ['Pipeline visibility dashboard', 'Revenue forecast tracking', 'Conversion analytics', 'Performance comparison reports'],
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.10)]',
  },
]

export function HowItWorksSection() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden">
      {/* Slight background shift */}
      <div className="absolute inset-0 bg-[#0a1228]" />
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-medium text-white/50">How It Works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5"
          >
            Up and running in{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              under 5 minutes
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/45 text-lg"
          >
            No complex onboarding. No 3-hour training sessions.
            Just sign up and start capturing leads immediately.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {STEPS.map((step, index) => {
            const ref = useRef(null)
            const inView = useInView(ref, { once: true, margin: '-80px' })
            const Icon = step.icon
            const isLast = index === STEPS.length - 1

            return (
              <div key={step.number} ref={ref}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className={`relative flex gap-6 md:gap-10 items-start bg-[rgba(15,26,53,0.5)] backdrop-blur-sm border ${step.border} rounded-2xl p-7 ${step.glow} group hover:border-opacity-40 transition-all duration-300`}
                >
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div className={`text-xs font-bold mt-2 ${step.color} opacity-50`}>{step.number}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-5">{step.description}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {step.details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2 text-sm text-white/50">
                          <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${step.color}`} />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step badge */}
                  <div className={`absolute top-5 right-5 text-5xl font-black ${step.color} opacity-6 select-none`}>
                    {step.number}
                  </div>
                </motion.div>

                {/* Connector arrow */}
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center my-2"
                  >
                    <ArrowDown className="w-5 h-5 text-white/15" />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA below steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <a
            href="/start-trial"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 text-base"
          >
            Start capturing leads now — it's free
          </a>
          <p className="text-sm text-white/25 mt-3">No credit card required. 14-day free trial.</p>
        </motion.div>
      </div>
    </section>
  )
}
