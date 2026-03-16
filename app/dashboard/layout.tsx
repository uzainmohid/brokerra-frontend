import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
