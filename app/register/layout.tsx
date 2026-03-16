import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your free Brokerra account and start closing more deals.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
