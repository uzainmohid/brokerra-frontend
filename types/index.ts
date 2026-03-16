// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role?: string
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  phone?: string
  company?: string
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'follow-up'
  | 'site-visit'
  | 'negotiation'
  | 'closed'
  | 'lost'

export type LeadTemperature = 'hot' | 'warm' | 'cold'

export type LeadSource =
  | 'whatsapp'
  | 'referral'
  | 'website'
  | 'instagram'
  | 'facebook'
  | 'property-portal'
  | 'cold-call'
  | 'walk-in'
  | 'other'

export interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  status: LeadStatus
  temperature: LeadTemperature
  source: LeadSource
  budget?: number
  propertyType?: string
  location?: string
  noteText?: string
  notes?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  lastContactedAt?: string
  nextFollowUpAt?: string
  tags?: string[]
  aiSummary?: string
}

export interface LeadNote {
  id: string
  leadId: string
  content: string
  createdBy: string
  createdAt: string
}

export interface FollowUp {
  id: string
  leadId: string
  scheduledAt: string
  completedAt?: string
  type: 'call' | 'whatsapp' | 'email' | 'site-visit' | 'meeting'
  notes?: string
  outcome?: string
  status: 'pending' | 'completed' | 'missed'
}

export interface ActivityItem {
  id: string
  leadId: string
  type: 'status_change' | 'note_added' | 'follow_up' | 'ai_summary' | 'created' | 'contacted'
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
  createdBy?: string
}

export interface LeadWithDetails extends Omit<Lead, 'notes'> {
  notes: LeadNote[]
  noteText?: string
  followUps: FollowUp[]
  activities: ActivityItem[]
  aiSummary?: string
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  totalLeads: number
  hotLeads: number
  overdueLeads: number
  todayFollowUps: number
  conversionRate: number
  avgDealValue: number
  totalRevenuePotential: number
  leadsThisMonth: number
  changeFromLastMonth: {
    totalLeads: number
    hotLeads: number
    conversionRate: number
  }
}

export interface LeadSourceData {
  source: string
  count: number
  percentage: number
  color: string
}

export interface MonthlyTrendData {
  month: string
  leads: number
  closed: number
  revenue: number
}

export interface ConversionFunnelData {
  stage: string
  count: number
  percentage: number
}

export interface AnalyticsData {
  overview: AnalyticsOverview
  leadsBySource: LeadSourceData[]
  monthlyTrend: MonthlyTrendData[]
  conversionFunnel: ConversionFunnelData[]
  topPerformingBrokers?: Array<{
    name: string
    closedDeals: number
    revenue: number
  }>
}

// ─── Pipeline Types ───────────────────────────────────────────────────────────

export interface PipelineColumn {
  id: LeadStatus
  title: string
  color: string
  leads: Lead[]
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LeadFilters {
  search?: string
  status?: LeadStatus | 'all'
  temperature?: LeadTemperature | 'all'
  source?: LeadSource | 'all'
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

// ─── AI Agent Types ───────────────────────────────────────────────────────────

export type InsightUrgency = 'critical' | 'high' | 'medium' | 'low'

export type InsightType =
  | 'likely_to_convert'
  | 'going_cold'
  | 'stalled_deal'
  | 'high_value'
  | 'overdue_followup'
  | 'follow_up_today'
  | 'hot_new_lead'
  | 'reactivate'
  | 'close_opportunity'
  | 'healthy'

export interface LeadInsight {
  type: InsightType
  headline: string
  action: string
  urgency: InsightUrgency
  conversionPct: number
  lead: {
    id: string
    name: string
    phone: string
    status: LeadStatus
    temperature: LeadTemperature
    budget?: number
    location?: string
    propertyType?: string
    source: LeadSource
    priorityScore: number
    isOverdue: boolean
    nextFollowUpAt?: string
    updatedAt: string
  }
}

export interface InsightsResponse {
  insights: LeadInsight[]
  total: number
  critical: number
  high: number
}

export interface PriorityLead {
  id: string
  name: string
  phone: string
  status: LeadStatus
  temperature: LeadTemperature
  budget?: number
  location?: string
  propertyType?: string
  source: LeadSource
  priorityScore: number
  isOverdue: boolean
  nextFollowUpAt?: string
  updatedAt: string
  conversionPct: number
  stalledDays: number
  inactiveDays: number
  insight: LeadInsight | null
}

export interface PrioritiesResponse {
  priorities: PriorityLead[]
  total: number
}

export interface StageHealth {
  stage: string
  count: number
  stalledCount: number
  totalBudget: number
  avgConversionPct: number
}

export interface PipelineHealth {
  healthScore: number
  agentMessage: string
  winRate: number
  forecastRevenue: number
  closedRevenue: number
  overdueCount: number
  openCount: number
  totalLeads: number
  stageBreakdown: StageHealth[]
  bottleneck: StageHealth | null
}
