'use client'

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

const FREE_FEATURES = [
  '50 leads/month',
  'Basic pipeline board',
  'Follow-up reminders',
  'Lead notes & activity log',
  'Email support',
]

const PRO_FEATURES = [
  'Unlimited leads',
  'AI lead scoring & insights',
  'AI-generated lead summaries',
  'Advanced analytics & charts',
  'CSV export & monthly reports',
  'WhatsApp integration (coming soon)',
  'Team collaboration (up to 10 members)',
  'Priority support',
  'API access',
  'Custom lead stages',
]

export function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [annual, setAnnual] = useState(true)

  const proPrice = annual ? 1499 : 1999

  return (
    <section id="pricing" className="relative py-28 bg-[#0a1228] overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-medium text-white/50">Simple Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5"
          >
            Invest less than a{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              property listing fee
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/45 text-lg mb-8"
          >
            One closed deal pays for years of Brokerra.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-1.5"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${!annual ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${annual ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              Annual
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                SAVE 25%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-[rgba(15,26,53,0.5)] backdrop-blur-sm border border-white/8 rounded-2xl p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white/50 uppercase tracking-wider">Free Trial</div>
                <div className="text-xs text-white/30">14 days, no card needed</div>
              </div>
            </div>

            <div className="flex items-baseline gap-2 my-6">
              <span className="text-4xl font-bold text-white">₹0</span>
              <span className="text-white/40 text-sm">/14 days</span>
            </div>

            <p className="text-sm text-white/45 leading-relaxed mb-8">
              Get started and experience the full power of AI-powered lead management completely free. No credit card required.
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/60">
                  <Check className="w-4 h-4 text-emerald-400/70 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/start-trial"
              className="block text-center border border-white/12 bg-white/5 hover:bg-white/8 text-white/80 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* Pro plan */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="relative bg-[rgba(15,26,53,0.7)] backdrop-blur-sm border border-emerald-500/25 rounded-2xl p-8 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.10)]"
          >
            {/* Glow top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-emerald-500/10 blur-xl rounded-b-full" />

            {/* Popular badge */}
            <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1">
              <Crown className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Most Popular</span>
            </div>

            <div className="flex items-center gap-3 mb-2 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Pro Plan</div>
                <div className="text-xs text-white/30">Full AI power. Zero limits.</div>
              </div>
            </div>

            <div className="flex items-baseline gap-2 my-6 relative">
              <span className="text-4xl font-bold text-white">₹{proPrice.toLocaleString('en-IN')}</span>
              <span className="text-white/40 text-sm">/month</span>
              {annual && (
                <span className="text-xs text-white/30 line-through ml-1">₹1,999</span>
              )}
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-8 relative">
              Everything you need to run a professional real estate brokerage. Unlimited leads, AI insights, and team collaboration.
            </p>

            <ul className="space-y-3 mb-8 flex-1 relative">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/start-trial"
              className="relative block text-center bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5"
            >
              Get Started — Free for 14 Days
            </Link>
            <p className="text-center text-xs text-white/25 mt-2 relative">Then ₹{proPrice.toLocaleString('en-IN')}/month. Cancel anytime.</p>
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-white/30"
        >
          {['No credit card required', 'Cancel anytime', 'Data encrypted', 'GDPR compliant', '24/7 support'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500/60" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
