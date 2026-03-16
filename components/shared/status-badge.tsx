import React from 'react'
import { Badge } from '@/components/ui/badge'
import { LeadStatus, LeadTemperature, LeadSource } from '@/types'
import { getStatusLabel, getSourceLabel, getTemperatureEmoji } from '@/utils'

interface StatusBadgeProps {
  status: LeadStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variantMap: Record<LeadStatus, 'new' | 'contacted' | 'follow-up' | 'site-visit' | 'negotiation' | 'closed' | 'lost'> = {
    'new': 'new',
    'contacted': 'contacted',
    'follow-up': 'follow-up',
    'site-visit': 'site-visit',
    'negotiation': 'negotiation',
    'closed': 'closed',
    'lost': 'lost',
  }

  return (
    <Badge variant={variantMap[status]}>
      {getStatusLabel(status)}
    </Badge>
  )
}

interface TempBadgeProps {
  temperature: LeadTemperature
}

export function TempBadge({ temperature }: TempBadgeProps) {
  const variantMap: Record<LeadTemperature, 'hot' | 'warm' | 'cold'> = {
    hot: 'hot',
    warm: 'warm',
    cold: 'cold',
  }

  return (
    <Badge variant={variantMap[temperature]}>
      {getTemperatureEmoji(temperature)} {temperature.charAt(0).toUpperCase() + temperature.slice(1)}
    </Badge>
  )
}

interface SourceBadgeProps {
  source: LeadSource
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <Badge variant="secondary">
      {getSourceLabel(source)}
    </Badge>
  )
}
