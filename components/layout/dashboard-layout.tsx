// 'use client'

// import React from 'react'
// import { Sidebar } from './sidebar'
// import { AuthGuard } from '@/components/shared/auth-guard'
// import { AuthProvider } from '@/hooks/use-auth'

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   return (
//     <AuthProvider>
//       <AuthGuard>
//         <div className="flex h-screen bg-[#080f20] overflow-hidden">
//           {/* Background effects */}
//           <div className="fixed inset-0 pointer-events-none">
//             <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
//             <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl" />
//             <div className="absolute inset-0 dot-grid opacity-20" />
//           </div>

//           <Sidebar />

//           <main className="relative flex-1 flex flex-col overflow-hidden">
//             {children}
//           </main>
//         </div>
//       </AuthGuard>
//     </AuthProvider>
//   )
// }

'use client'

import React from 'react'
import { Sidebar } from './sidebar'
import { AuthGuard } from '@/components/shared/auth-guard'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // AuthProvider is now at the root layout — do NOT wrap it here again.
  // A second provider would create an isolated context that starts with
  // user: null on every dashboard render, breaking the auth state.
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#080f20] overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl" />
          <div className="absolute inset-0 dot-grid opacity-20" />
        </div>

        <Sidebar />

        <main className="relative flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}