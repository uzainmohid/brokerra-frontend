'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, FileText } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LeadNote } from '@/types'
import { formatRelative } from '@/utils'
import { toast } from 'sonner'

interface NotesSectionProps {
  leadId: string
  notes?: LeadNote[]
}

const DEMO_NOTES: LeadNote[] = [
  {
    id: 'n1',
    leadId: '1',
    content: 'Very interested in 3BHK in Bandra West. Has a strict ₹1.8Cr ceiling but might go up to ₹2Cr for the right property. Wife prefers modern kitchen and floor-to-ceiling windows.',
    createdBy: 'You',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'n2',
    leadId: '1',
    content: 'Called today — site visit confirmed for Saturday 10AM. Will bring wife and mother-in-law. They want to see the sea-facing unit on 14th floor specifically.',
    createdBy: 'You',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
]

export function NotesSection({ leadId, notes: initialNotes = DEMO_NOTES }: NotesSectionProps) {
  const [notes, setNotes] = useState<LeadNote[]>(initialNotes)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSaving(true)
    try {
      // In production: await api call to add note
      await new Promise(r => setTimeout(r, 400))
      const newNote: LeadNote = {
        id: Date.now().toString(),
        leadId,
        content: text,
        createdBy: 'You',
        createdAt: new Date().toISOString(),
      }
      setNotes(prev => [newNote, ...prev])
      setText('')
      toast.success('Note saved')
    } catch {
      toast.error('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/6">
        <FileText className="w-4 h-4 text-white/40" />
        <h3 className="text-sm font-semibold text-white">Notes</h3>
        <span className="ml-auto text-xs text-white/30">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Add note */}
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a note about this lead — call outcome, property preferences, next steps…"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/20">⌘↵ to save quickly</span>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={saving}
              disabled={!text.trim()}
              className="gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Save Note
            </Button>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white/3 border border-white/6 rounded-xl p-4"
              >
                <p className="text-sm text-white/65 leading-relaxed mb-2">{note.content}</p>
                <div className="flex items-center gap-2 text-[11px] text-white/25">
                  <span>{note.createdBy}</span>
                  <span>·</span>
                  <span>{formatRelative(note.createdAt)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {notes.length === 0 && (
            <div className="py-6 text-center text-sm text-white/25">
              No notes yet. Start by adding one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
