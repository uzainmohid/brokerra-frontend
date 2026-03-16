'use client'

import React from 'react'

interface BrokerraIconProps {
  /** Size of the square icon in px. Default: 36 */
  size?: number
  className?: string
}

/**
 * Brokerra standalone icon mark — the "Neural Peak" symbol.
 * Three ascending columns (building skyline + data bars) connected
 * by a neural network line with an apex glow node.
 * Use in sidebar collapsed state, favicons, and app tiles.
 */
export function BrokerraIcon({ size = 36, className }: BrokerraIconProps) {
  const id = React.useId().replace(/:/g, '')

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Brokerra"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id={`glow-${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`lg-${id}`} x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`bg-${id}`} cx="60%" cy="10%" r="65%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="10" fill="#0A1628" />
      <rect width="40" height="40" rx="10" fill={`url(#bg-${id})`} />

      {/* Column 1 — shortest */}
      <rect x="5" y="22" width="8" height="12" rx="1.5" fill={`url(#g-${id})`} opacity={0.52} />
      {/* Column 2 — medium */}
      <rect x="16" y="15" width="8" height="19" rx="1.5" fill={`url(#g-${id})`} opacity={0.76} />
      {/* Column 3 — tallest */}
      <rect x="27" y="9" width="8" height="25" rx="1.5" fill={`url(#g-${id})`} />

      {/* Neural connector line */}
      <polyline
        points="9,22 20,15 31,9"
        stroke="#10b981"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#lg-${id})`}
        opacity={0.9}
      />

      {/* Node — column 1 */}
      <circle cx="9"  cy="22" r="1.8" fill="#0A1628" stroke="#10b981" strokeWidth="1.2" opacity={0.7} />
      {/* Node — column 2 */}
      <circle cx="20" cy="15" r="1.8" fill="#0A1628" stroke="#10b981" strokeWidth="1.2" opacity={0.85} />
      {/* Apex node — column 3, full glow */}
      <circle cx="31" cy="9" r="2.5" fill="#10b981" filter={`url(#glow-${id})`} />
      <circle cx="31" cy="9" r="1.2" fill="#d1fae5" />
    </svg>
  )
}

interface BrokerraLogoProps {
  /** Show the text wordmark alongside the icon. Default: true */
  showWordmark?: boolean
  /** Icon size. Default: 36 */
  iconSize?: number
  className?: string
}

/**
 * Full Brokerra logo — icon + "Broker" + emerald "ra" wordmark.
 * Used in sidebar expanded state, login pages, and marketing.
 */
export function BrokerraLogo({
  showWordmark = true,
  iconSize = 36,
  className,
}: BrokerraLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <BrokerraIcon size={iconSize} />
      {showWordmark && (
        <span
          className="font-bold tracking-tight text-white leading-none"
          style={{ fontSize: iconSize * 0.5 }}
        >
          Broker<span className="text-emerald-400">ra</span>
        </span>
      )}
    </div>
  )
}
