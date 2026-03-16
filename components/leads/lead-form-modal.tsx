'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lead, LeadStatus, LeadTemperature, LeadSource } from '@/types'
import { leadsApi } from '@/lib/api'
import { toast } from 'sonner'

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  status: z.string(),
  temperature: z.string(),
  source: z.string(),
  budget: z.string().optional(),
  propertyType: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead
  onSuccess: (lead: Lead) => void
}

export function LeadFormModal({ open, onOpenChange, lead, onSuccess }: LeadFormModalProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!lead

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name || '',
      phone: lead?.phone || '',
      email: lead?.email || '',
      status: lead?.status || 'new',
      temperature: lead?.temperature || 'warm',
      source: lead?.source || 'other',
      budget: lead?.budget ? String(lead.budget) : '',
      propertyType: lead?.propertyType || '',
      location: lead?.location || '',
      notes: lead?.noteText || '',
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        budget: data.budget ? Number(data.budget) : undefined,
        status: data.status as LeadStatus,
        temperature: data.temperature as LeadTemperature,
        source: data.source as LeadSource,
      }
      let result: Lead
      if (isEditing && lead) {
        result = await leadsApi.updateLead(lead.id, payload)
        toast.success('Lead updated successfully')
      } else {
        result = await leadsApi.createLead(payload)
        toast.success('Lead added successfully')
      }
      onSuccess(result)
      onOpenChange(false)
      reset()
    } catch {
      toast.error(isEditing ? 'Failed to update lead' : 'Failed to create lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input placeholder="Rajesh Kumar" {...register('name')} error={errors.name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input placeholder="+91 98765 43210" {...register('phone')} error={errors.phone?.message} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="rajesh@email.com" {...register('email')} error={errors.email?.message} />
            </div>
            <div className="space-y-1.5">
              <Label>Budget (₹)</Label>
              <Input type="number" placeholder="5000000" {...register('budget')} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select defaultValue={watch('status')} onValueChange={(v) => setValue('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="follow-up">Follow Up</SelectItem>
                  <SelectItem value="site-visit">Site Visit</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Temperature</Label>
              <Select defaultValue={watch('temperature')} onValueChange={(v) => setValue('temperature', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">🔥 Hot</SelectItem>
                  <SelectItem value="warm">⚡ Warm</SelectItem>
                  <SelectItem value="cold">❄️ Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select defaultValue={watch('source')} onValueChange={(v) => setValue('source', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="property-portal">Property Portal</SelectItem>
                  <SelectItem value="cold-call">Cold Call</SelectItem>
                  <SelectItem value="walk-in">Walk In</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Property Type</Label>
              <Input placeholder="2BHK Apartment" {...register('propertyType')} />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Location</Label>
              <Input placeholder="Bandra, Mumbai" {...register('location')} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              placeholder="Any additional context about this lead..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? 'Update Lead' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
