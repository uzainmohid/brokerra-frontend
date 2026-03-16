import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const metadata: Metadata = { title: 'Lead Details' }

export default function LeadDetailLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
