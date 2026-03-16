'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { AuthLayout } from '@/components/shared/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'


const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    try {
      await login(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Invalid email or password. Please try again.')
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
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@brokerage.com"
          autoComplete="email"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          autoComplete="current-password"
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

      {/* Remember me */}
      <div className="flex items-center gap-2.5 pt-1">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border border-white/15 bg-white/5 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer accent-emerald-500"
        />
        <label htmlFor="remember" className="text-sm text-white/50 cursor-pointer select-none">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-11 text-sm font-semibold mt-2"
        loading={isLoading || isSubmitting}
      >
        Sign in to Brokerra
      </Button>

      {/* Divider */}
      <div className="relative flex items-center gap-4 py-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/25">OR</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Demo login hint */}
      <div className="bg-white/3 border border-white/6 rounded-xl p-3 text-center">
        <p className="text-xs text-white/35">
          <span className="text-white/50 font-medium">Demo account:</span>{' '}
          demo@brokerra.in / demo1234
        </p>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to your Brokerra account to continue closing deals."
        footerText="Don't have an account?"
        footerLinkLabel="Start free trial"
        footerLinkHref="/start-trial"
      >
        <LoginForm />
      </AuthLayout>
  )
}
