'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '@/components/shared/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'


const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  company: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' }
  if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' }
  return { score, label: 'Strong', color: 'bg-emerald-500' }
}

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const strength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        password: data.password,
      })
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name + Phone row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Rajesh Kumar"
            autoComplete="name"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            icon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="rajesh@mybrokerage.com"
          autoComplete="email"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Company (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="company">
          Brokerage / Company{' '}
          <span className="text-white/25 font-normal">(optional)</span>
        </Label>
        <Input
          id="company"
          placeholder="Sharma Properties"
          icon={<Building2 className="w-4 h-4" />}
          {...register('company')}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
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

        {/* Password strength meter */}
        <AnimatePresence>
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5"
            >
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.color : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                strength.label === 'Weak' ? 'text-red-400' :
                strength.label === 'Fair' ? 'text-amber-400' :
                strength.label === 'Good' ? 'text-blue-400' :
                'text-emerald-400'
              }`}>
                {strength.label} password
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repeat your password"
          autoComplete="new-password"
          icon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5 pt-1">
        <input
          id="terms"
          type="checkbox"
          required
          className="mt-0.5 w-4 h-4 rounded border border-white/15 bg-white/5 cursor-pointer accent-emerald-500"
        />
        <label htmlFor="terms" className="text-xs text-white/45 leading-relaxed cursor-pointer">
          I agree to the{' '}
          <a href="#" className="text-emerald-400 hover:text-emerald-300">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-11 text-sm font-semibold mt-1"
        loading={isLoading || isSubmitting}
      >
        Create your free account
      </Button>

      {/* Trust line */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-white/25">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50" />
        No credit card required · 14-day free trial
      </div>
    </form>
  )
}

export default function RegisterPage() {
  return (
      <AuthLayout
        title="Create your account"
        subtitle="Start closing more deals in under 5 minutes."
        footerText="Already have an account?"
        footerLinkLabel="Sign in"
        footerLinkHref="/login"
      >
        <RegisterForm />
      </AuthLayout>
  )
}
