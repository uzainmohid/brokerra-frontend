'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="relative py-28 bg-[#080f20] overflow-hidden">
      {/* Strong emerald glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(16,185,129,0.08),transparent)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-14 overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          {/* Corner glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/10 blur-2xl" />

          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" fill="currentColor" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            Your next ₹1 crore deal
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              starts with one follow-up.
            </span>
          </h2>

          <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-2xl mx-auto">
            Join 500+ real estate brokers who never lose a lead to silence again.
            Start your free trial today — no credit card, no commitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/start-trial"
              className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 shadow-[0_4px_25px_rgba(16,185,129,0.5)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 text-base"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="text-base text-white/50 hover:text-white transition-colors duration-200"
            >
              Already have an account? Sign in →
            </Link>
          </div>

          <p className="text-sm text-white/25 mt-6">
            Free trial • No credit card • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
