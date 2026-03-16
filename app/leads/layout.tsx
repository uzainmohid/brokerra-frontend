import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const metadata: Metadata = { title: 'Leads' }

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
