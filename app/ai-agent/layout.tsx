import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const metadata: Metadata = {
  title: 'AI Deal Agent',
  description: 'AI-powered pipeline intelligence and deal insights',
}

export default function AiAgentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
