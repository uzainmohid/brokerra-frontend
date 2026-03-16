'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Key, Building2, Shield,
  Moon, Globe, Save, Eye, EyeOff,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'profile',      label: 'Profile',       icon: User },
  { id: 'company',     label: 'Company',        icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',    label: 'Security',       icon: Shield },
  { id: 'api',         label: 'API & Integrations', icon: Key },
]

function SettingSection({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl p-6"
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-white/40 mt-0.5">{description}</p>}
      </div>
      {children}
    </motion.div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
        checked ? 'bg-emerald-500' : 'bg-white/15'
      )}
    >
      <div className={cn(
        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
        checked && 'translate-x-5'
      )} />
    </button>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifs, setNotifs] = useState({
    overdueLeads: true,
    newLeads: true,
    weeklyReport: true,
    dealClosed: true,
    emailDigest: false,
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Settings saved')
  }

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Settings"
        subtitle="Manage your account, notifications, and integrations"
        action={
          <Button size="sm" onClick={handleSave} loading={saving} className="gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </Button>
        }
      />

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 pb-12">
          <div className="max-w-2xl space-y-5">

            {/* Profile */}
            <SettingSection title="Profile" description="Update your personal information">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-xl font-bold text-white">
                    {user?.name?.[0] || 'B'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name || 'Broker User'}</p>
                    <p className="text-xs text-white/40">{user?.email}</p>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 mt-1 transition-colors">
                      Change avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input defaultValue={user?.name || ''} placeholder="Your name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" defaultValue={user?.email || ''} />
                </div>
              </div>
            </SettingSection>

            {/* Company */}
            <SettingSection title="Company" description="Your brokerage details">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Brokerage Name</Label>
                  <Input placeholder="Prime Properties Mumbai" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>RERA Number</Label>
                    <Input placeholder="MH/1234/2024" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input placeholder="Mumbai" />
                  </div>
                </div>
              </div>
            </SettingSection>

            {/* Notifications */}
            <SettingSection title="Notifications" description="Choose what you want to be notified about">
              <div className="space-y-4">
                {[
                  { key: 'overdueLeads', label: 'Overdue follow-up alerts', desc: 'Get notified when leads need immediate attention' },
                  { key: 'newLeads', label: 'New lead added', desc: 'When a new lead enters your pipeline' },
                  { key: 'dealClosed', label: 'Deal closed', desc: 'Celebrate every win with a notification' },
                  { key: 'weeklyReport', label: 'Weekly performance report', desc: 'Summary every Monday at 9AM' },
                  { key: 'emailDigest', label: 'Email digest', desc: 'Daily pipeline summary to your inbox' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-white/80">{item.label}</p>
                      <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      checked={notifs[item.key as keyof typeof notifs]}
                      onChange={(v) => setNotifs(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </SettingSection>

            {/* Security */}
            <SettingSection title="Security" description="Manage your password and account security">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="New password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <Button variant="outline" size="sm">Update Password</Button>
              </div>
            </SettingSection>

            {/* API */}
            <SettingSection title="API & Integrations" description="Connect Brokerra to other tools">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Your API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value="bk_live_••••••••••••••••••••••••••••••••"
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-white/30">Use this key to connect Brokerra to WhatsApp Business, property portals, and custom tools.</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/70 mb-3">Connected Integrations</p>
                  {[
                    { name: 'WhatsApp Business', status: 'connected', color: 'text-green-400 bg-green-500/10' },
                    { name: '99acres / MagicBricks', status: 'not connected', color: 'text-white/30 bg-white/5' },
                    { name: 'Housing.com', status: 'not connected', color: 'text-white/30 bg-white/5' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-white/3 border border-white/6 rounded-xl">
                      <span className="text-sm text-white/70">{item.name}</span>
                      <span className={cn('text-xs px-2.5 py-1 rounded-full', item.color)}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SettingSection>

          </div>
        </div>
      </ScrollArea>
    </PageTransition>
  )
}
