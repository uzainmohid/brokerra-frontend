import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
