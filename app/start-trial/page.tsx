'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2,
  AlertCircle, CheckCircle2, Zap, ArrowRight, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { BrokerraIcon } from '@/components/shared/brokerra-logo'
import { AuthProvider } from '@/hooks/use-auth'

const trialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  company: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type TrialForm = z.infer<typeof trialSchema>

const BENEFITS = [
  'AI lead scoring activated immediately',
  'Pipeline board ready in 60 seconds',
  'Unlimited leads for 14 days',
  'No credit card required',
]

const SOCIAL_PROOF = [
  { initials: 'RS', color: 'from-emerald-600 to-teal-500' },
  { initials: 'PN', color: 'from-purple-600 to-pink-500' },
  { initials: 'AM', color: 'from-blue-600 to-cyan-500' },
  { initials: 'SV', color: 'from-amber-600 to-orange-500' },
  { initials: 'MR', color: 'from-red-600 to-pink-500' },
]

function TrialForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrialForm>({ resolver: zodResolver(trialSchema) })

  const onSubmit = async (data: TrialForm) => {
    setError(null)
    try {
      await registerUser(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            placeholder="Rajesh Kumar"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">WhatsApp / Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            icon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@brokerage.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company">
          Brokerage name{' '}
          <span className="text-white/25 font-normal">(optional)</span>
        </Label>
        <Input
          id="company"
          placeholder="Sharma Properties"
          icon={<Building2 className="w-4 h-4" />}
          {...register('company')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Create a password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 8 characters"
          icon={<Lock className="w-4 h-4" />}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        variant="premium"
        className="w-full h-12 text-sm font-bold mt-2 tracking-wide"
        loading={isLoading || isSubmitting}
      >
        <Zap className="w-4 h-4" fill="currentColor" />
        Start My Free 14-Day Trial
        {!isLoading && !isSubmitting && <ArrowRight className="w-4 h-4" />}
      </Button>

      <p className="text-center text-[11px] text-white/25 leading-relaxed">
        By signing up you agree to our{' '}
        <a href="#" className="text-emerald-500/60 hover:text-emerald-400">Terms</a>
        {' '}&{' '}
        <a href="#" className="text-emerald-500/60 hover:text-emerald-400">Privacy Policy</a>.
        No credit card required.
      </p>
    </form>
  )
}

function StartTrialContent() {
  return (
    <div className="min-h-screen bg-[#080f20] flex overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-blue-500/4 rounded-full blur-[80px]" />
      </div>

      {/* ── Left: Benefits panel ─────────────────────────────────── */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between p-14 relative">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-3">
          <BrokerraIcon size={36} />
          <span className="text-white font-bold text-xl tracking-tight">
            Broker<span className="text-emerald-400">ra</span>
          </span>
        </Link>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300 font-medium">Free 14-Day Trial</span>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Your first deal on Brokerra
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                closes within 2 weeks.
              </span>
            </h1>

            <p className="text-white/45 text-lg leading-relaxed mb-10">
              Join 500+ brokers who stopped losing deals to forgotten follow-ups.
            </p>

            {/* Benefits list */}
            <div className="space-y-3 mb-12">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-white/65">{b}</span>
                </motion.div>
              ))}
            </div>

            {/* Featured testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/4 border border-white/8 rounded-2xl p-5"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-white/60 italic leading-relaxed mb-4">
                "Brokerra paid for itself in the first week. I recovered two cold leads worth ₹1.2Cr that I'd completely forgotten about."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  PN
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Priya Nair</div>
                  <div className="text-[11px] text-white/35">Senior Property Consultant · Pune</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Social proof footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center -space-x-2">
            {SOCIAL_PROOF.map((p) => (
              <div
                key={p.initials}
                className={`w-8 h-8 rounded-full border-2 border-[#080f20] bg-gradient-to-br ${p.color} flex items-center justify-center text-[10px] font-bold text-white`}
              >
                {p.initials}
              </div>
            ))}
          </div>
          <div className="text-sm text-white/35">
            <span className="text-white/60 font-semibold">500+</span> brokers are already inside →
          </div>
        </motion.div>
      </div>

      {/* ── Right: Form panel ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Mobile logo */}
        <Link href="/landing" className="lg:hidden flex items-center gap-2.5 mb-8 relative">
          <BrokerraIcon size={32} />
          <span className="text-white font-bold text-lg">
            Broker<span className="text-emerald-400">ra</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md relative"
        >
          <div className="relative bg-[rgba(15,26,53,0.80)] backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-t-2xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-emerald-500/8 blur-xl" />

            {/* Header */}
            <div className="mb-6 relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-px bg-emerald-500/50" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Free 14-Day Trial
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
                Create your account
              </h2>
              <p className="text-sm text-white/40">
                Set up takes less than 2 minutes. Start free, upgrade anytime.
              </p>
            </div>

            <AuthProvider>
              <TrialForm />
            </AuthProvider>

            <div className="mt-5 pt-5 border-t border-white/6 text-center">
              <p className="text-sm text-white/35">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust badges below form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-5 relative"
        >
          {['SSL Encrypted', 'GDPR Ready', '99.9% Uptime', 'India Hosted'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 text-xs text-white/25">
              <CheckCircle2 className="w-3 h-3 text-emerald-500/40" />
              {badge}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function StartTrialPage() {
  return <StartTrialContent />
}
