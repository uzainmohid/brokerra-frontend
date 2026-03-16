import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start Free Trial',
  description: 'Start your free 14-day Brokerra trial. No credit card required.',
}

export default function StartTrialLayout({ children }: { children: React.ReactNode }) {
  return children
}
