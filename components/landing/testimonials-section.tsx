'use client'

import React, { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Rakesh Sharma',
    title: 'Independent Broker',
    location: 'Mumbai, Maharashtra',
    initials: 'RS',
    avatar_color: 'from-emerald-600 to-teal-500',
    rating: 5,
    deal: 'Recovered ₹1.8Cr in 60 days',
    quote:
      "I was losing at least 4-5 leads per week just because I forgot to follow up. Brokerra changed everything. Now I get alerts, I see who's hot, and I close deals I would have completely lost before. Last month alone, I recovered 3 leads that were 10+ days stale. That's ₹1.8 crore in transaction value.",
    highlight: 'recovered 3 stale leads in 30 days',
  },
  {
    name: 'Priya Nair',
    title: 'Senior Property Consultant',
    location: 'Pune, Maharashtra',
    initials: 'PN',
    avatar_color: 'from-purple-600 to-pink-500',
    rating: 5,
    deal: 'Closed 11 deals in first 90 days',
    quote:
      "Before Brokerra, my lead management was a disaster — sticky notes, WhatsApp groups, Excel sheets. It was chaos. Now everything is in one place. The AI summary for each lead is brilliant. I can see in 10 seconds where the conversation was, what the buyer wants, and what my next move should be.",
    highlight: 'closed 11 deals in the first 90 days',
  },
  {
    name: 'Aditya Mehta',
    title: 'Real Estate Broker & Consultant',
    location: 'Bangalore, Karnataka',
    initials: 'AM',
    avatar_color: 'from-blue-600 to-cyan-500',
    rating: 5,
    deal: 'Team of 6 now uses Brokerra daily',
    quote:
      "I manage a team of 6 brokers. Before this, tracking who was following up with which lead was a nightmare. Now everyone has their own dashboard, I can see the full pipeline, and I know exactly which stage every deal is at. Our conversion rate went from 8% to 19% in 3 months. Honestly shocked by the results.",
    highlight: 'conversion rate doubled in 3 months',
  },
  {
    name: 'Sunita Verma',
    title: 'Luxury Property Specialist',
    location: 'Delhi NCR',
    initials: 'SV',
    avatar_color: 'from-amber-600 to-orange-500',
    rating: 5,
    deal: 'Saved a ₹2.4Cr deal from going cold',
    quote:
      "There was a ₹2.4Cr villa deal I almost lost because I hadn't called in 12 days. Brokerra flagged it as 'high risk' with a red alert. I called the client immediately — he was literally about to sign with another broker. That one alert paid for a lifetime of subscription. This software pays for itself 100x over.",
    highlight: 'saved a ₹2.4Cr deal with one AI alert',
  },
  {
    name: 'Mohammed Riyaz',
    title: 'Commercial Real Estate Broker',
    location: 'Hyderabad, Telangana',
    initials: 'MR',
    avatar_color: 'from-red-600 to-pink-500',
    rating: 5,
    deal: 'From chaos to 40-deal pipeline',
    quote:
      "Commercial real estate moves fast. A deal can die in 48 hours if you don't follow up. Brokerra's overdue alerts are the first thing I check every morning. It's like having a personal assistant who never sleeps, never forgets, and always knows which deal needs my attention right now.",
    highlight: 'manages 40+ active commercial deals',
  },
]

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-sm border border-white/8 rounded-2xl p-7 h-full flex flex-col">
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${testimonial.avatar_color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
            {testimonial.initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{testimonial.name}</div>
            <div className="text-xs text-white/40">{testimonial.title}</div>
            <div className="text-xs text-white/30">{testimonial.location}</div>
          </div>
        </div>
        <Quote className="w-6 h-6 text-emerald-500/30 flex-shrink-0" />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-white/60 leading-relaxed mb-5 flex-1 italic">
        "{testimonial.quote}"
      </p>

      {/* Result badge */}
      <div className="flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-3 py-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-xs font-medium text-emerald-300">{testimonial.deal}</span>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [page, setPage] = useState(0)
  const perPage = 3
  const totalPages = Math.ceil(TESTIMONIALS.length / perPage)
  const visible = TESTIMONIALS.slice(page * perPage, page * perPage + perPage)

  return (
    <section id="testimonials" className="relative py-28 bg-[#080f20] overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(16,185,129,0.04),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-amber-300">Broker Success Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5"
          >
            Brokers who stopped
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
              losing deals.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/45 text-lg"
          >
            Real results from real brokers across India.
          </motion.p>
        </div>

        {/* Testimonial grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
          >
            {visible.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${i === page ? 'bg-emerald-400 w-6' : 'bg-white/20 hover:bg-white/40'}`}
            />
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
