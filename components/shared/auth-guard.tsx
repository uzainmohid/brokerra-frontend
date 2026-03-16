// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { isAuthenticated } from '@/lib/api'

// interface AuthGuardProps {
//   children: React.ReactNode
// }

// export function AuthGuard({ children }: AuthGuardProps) {
//   const router = useRouter()

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push('/login')
//     }
//   }, [router])

//   if (typeof window !== 'undefined' && !isAuthenticated()) {
//     return null
//   }

//   return <>{children}</>
// }

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Only redirect once the context has finished reading from localStorage.
    // Without the isLoading check, the guard fires on the very first render
    // when isAuthenticated is still false (user hasn't been hydrated yet),
    // which causes a premature redirect to /login even for logged-in users.
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Show nothing while hydrating — prevents both a flash of protected
  // content and an incorrect redirect before localStorage has been read.
  if (isLoading) return null

  // Not authenticated after hydration — render nothing, redirect fires above.
  if (!isAuthenticated) return null

  return <>{children}</>
}