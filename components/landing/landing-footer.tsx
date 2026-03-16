import React from 'react'
import Link from 'next/link'
import { BrokerraIcon } from '@/components/shared/brokerra-logo'

export function LandingFooter() {
  return (
    <footer className="relative bg-[#080f20] border-t border-white/6 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <BrokerraIcon size={32} />
              <span className="text-white font-bold text-lg">Broker<span className="text-emerald-400">ra</span></span>
            </div>
            <p className="text-sm text-white/35 leading-relaxed">
              AI-powered follow-up intelligence for modern real estate brokers.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'How It Works', 'Changelog'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/45 hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/45 hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/45 hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/25">
            © {new Date().getFullYear()} Brokerra. All rights reserved.
          </p>
          <p className="text-sm text-white/25">
            Made with ❤️ for Indian real estate brokers
          </p>
        </div>
      </div>
    </footer>
  )
}
