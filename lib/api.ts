import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { AuthResponse, LoginCredentials, RegisterCredentials, Lead, LeadFilters, AnalyticsData, PaginatedResponse, LeadWithDetails } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ─── Axios instance ───────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Request interceptor — attach token ──────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('brokerra_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor — handle 401 ───────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('brokerra_token')
        localStorage.removeItem('brokerra_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Backend wraps all responses as: { success, message, data: { token, user } }
    // We unwrap the inner `data` field to get the actual { token, user } payload.
    const { data: envelope } = await api.post('/api/auth/login', credentials)
    return (envelope.data ?? envelope) as AuthResponse
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data: envelope } = await api.post('/api/auth/register', credentials)
    return (envelope.data ?? envelope) as AuthResponse
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('brokerra_token')
      localStorage.removeItem('brokerra_user')
    }
  },
}

// ─── Leads API ────────────────────────────────────────────────────────────────

export const leadsApi = {
  getLeads: async (filters?: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status)
    if (filters?.temperature && filters.temperature !== 'all') params.set('temperature', filters.temperature)
    if (filters?.source && filters.source !== 'all') params.set('source', filters.source)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    if (filters?.sortBy) params.set('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder)

    const { data } = await api.get<PaginatedResponse<Lead>>(`/api/leads?${params}`)
    return data
  },

  getLead: async (id: string): Promise<LeadWithDetails> => {
    const { data } = await api.get<LeadWithDetails>(`/api/leads/${id}`)
    return data
  },

  createLead: async (lead: Partial<Lead>): Promise<Lead> => {
    const { data } = await api.post<Lead>('/api/leads', lead)
    return data
  },

  updateLead: async (id: string, lead: Partial<Lead>): Promise<Lead> => {
    const { data } = await api.put<Lead>(`/api/leads/${id}`, lead)
    return data
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/api/leads/${id}`)
  },

  summarizeLead: async (id: string): Promise<{ summary: string }> => {
    const { data } = await api.post<{ summary: string }>(`/api/leads/${id}/summarize`)
    return data
  },
}

// ─── Analytics API ────────────────────────────────────────────────────────────

export const analyticsApi = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const { data } = await api.get<AnalyticsData>('/api/analytics')
    return data
  },
}

// ─── Export API ───────────────────────────────────────────────────────────────

export const exportApi = {
  exportLeadsCsv: async (): Promise<Blob> => {
    const response = await api.get('/api/export/leads-csv', {
      responseType: 'blob',
    })
    return response.data
  },

  exportMonthlyReport: async (): Promise<Blob> => {
    const response = await api.get('/api/export/monthly-report', {
      responseType: 'blob',
    })
    return response.data
  },

  downloadMonthlyReport: async (): Promise<Blob> => {
    const response = await api.get('/api/export/monthly-report', {
      responseType: 'blob',
    })
    return response.data
  },
}

// ─── AI Agent API ─────────────────────────────────────────────────────────────

export const aiAgentApi = {
  getInsights: async () => {
    const { data } = await api.get<{ success: boolean; data: any }>('/api/ai-agent/insights')
    return data.data
  },
  getPriorities: async () => {
    const { data } = await api.get<{ success: boolean; data: any }>('/api/ai-agent/priorities')
    return data.data
  },
  getPipelineHealth: async () => {
    const { data } = await api.get<{ success: boolean; data: any }>('/api/ai-agent/pipeline-health')
    return data.data
  },
}

// ---- AI Composer API ───────────────────────────────────────────────────────────
export const aiFollowupApi = {
  generate: async (leadId: string) => {
    const { data } = await api.post('/api/ai-followup/generate', {
      leadId,
    })

    return data?.data ?? data
  },
}
// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('brokerra_token')
}

export const setToken = (token: string): void => {
  localStorage.setItem('brokerra_token', token)
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export default api
