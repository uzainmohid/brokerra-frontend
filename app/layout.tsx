import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/use-auth'

export const metadata: Metadata = {
  title: {
    default: 'Brokerra — Never Lose a Property Lead Again',
    template: '%s | Brokerra',
  },
  description: 'AI-powered follow-up intelligence CRM for modern real estate brokers. Stop losing ₹10L+ deals to missed follow-ups.',
  keywords: ['real estate CRM', 'lead management', 'AI follow-up', 'property broker', 'real estate broker'],
  authors: [{ name: 'Brokerra' }],
  openGraph: {
    title: 'Brokerra — Never Lose a Property Lead Again',
    description: 'AI-powered follow-up intelligence CRM for modern real estate brokers.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brokerra — Never Lose a Property Lead Again',
    description: 'AI-powered follow-up intelligence CRM for modern real estate brokers.',
  },
  icons: {
    icon: '/brokerra-favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 26, 53, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
