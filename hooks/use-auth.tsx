'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, LoginCredentials, RegisterCredentials } from '@/types'
import { authApi, setToken } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Hydrate user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('brokerra_user')
      const token = localStorage.getItem('brokerra_token')
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
    } catch {
      // noop
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const { token, user } = await authApi.login(credentials)
      setToken(token)
      localStorage.setItem('brokerra_user', JSON.stringify(user))
      setUser(user)
      toast.success('Welcome back! 👋')
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Invalid email or password')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    try {
      const { token, user } = await authApi.register(credentials)
      setToken(token)
      localStorage.setItem('brokerra_user', JSON.stringify(user))
      setUser(user)
      toast.success('Account created! Let\'s close some deals 🎯')
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    toast.info('Logged out successfully')
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
