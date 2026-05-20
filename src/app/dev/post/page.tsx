'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input, Textarea, Select } from '@/components/ui/input'
import { devs } from '@/lib/data'
import {
  cn,
  formatCurrency,
  getGameIcon,
  getStatusColor,
  getPayoutLabel,
  getPlatformLabel,
} from '@/lib/utils'
import {
  ArrowLeft,
  Sparkles,
  Eye,
  Send,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Gamepad2,
  DollarSign,
  Users,
  Clock,
} from 'lucide-react'

/* ────────── Constants ────────── */
const GAME_TYPES = [
  { value: 'steam', label: '🎮 Steam' },
  { value: 'fortnite', label: '⚔️ Fortnite' },
  { value: 'roblox', label: '🧊 Roblox' },
  { value: 'minecraft', label: '⛏️ Minecraft' },
  { value: 'other', label: '🎯 Other' },
]

const PLATFORMS = [
  { value: 'twitch', label: 'Twitch' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'both', label: 'Twitch + YouTube' },
]

const PAYOUT_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'per_hour', label: 'Per Hour' },
  { value: 'per_viewer', label: 'Per Viewer' },
]

const SUGGESTED_TAGS = [
  'steam', 'fortnite', 'roblox', 'minecraft', 'creative',
  'competitive', 'casual', 'cozy', 'horror', 'indie',
  'launch', 'demo', 'sponsored', 'challenge', 'speedrun',
  'review', 'showcase', 'tutorial', 'multiplayer', 'solo',
]

/* ────────── Form Data Type ────────── */
interface FormData {
  title: string
  description: string
  game: string
  gameType: string
  platform: string
  budget: string
  payoutType: string
  minFollowers: string
  minAvgViewers: string
  duration: string
  scheduledDate: string
  tags: string[]
}

interface FormErrors {
  [key: string]: string
}

const initialForm: FormData = {
  title: '',
  description: '',
  game: '',
  gameType: '',
  platform: 'twitch',
  budget: '',
  payoutType: 'fixed',
  minFollowers: '',
  minAvgViewers: '',
  duration: '',
  scheduledDate: '',
  tags: [],
}

/* ────────── Post Gig Page ────────── */
export default function PostGigPage() {
  const router = useRouter()
  const currentDev = devs[0] // NeonForge
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [tagInput, setTagInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  /* ── Update field ── */
  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  /* ── Tags ── */
  const addTag = (tag: string) => {
    const t = tag.toLowerCase().trim()
    if (t && !form.tags.includes(t) && form.tags.length < 8) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  /* ── Validation ── */
  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    else if (form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters'
    if (!form.description.trim()) errs.description = 'Description is required'
    else if (form.description.trim().length < 50) errs.description = 'Description must be at least 50 characters'
    if (!form.game.trim()) errs.game = 'Game name is required'
    if (!form.gameType) errs.gameType = 'Select a game type'
    if (!form.budget || Number(form.budget) <= 0) errs.budget = 'Budget must be greater than 0'
    if (!form.duration.trim()) errs.duration = 'Duration is required'
    if (!form.scheduledDate) errs.scheduledDate = 'Scheduled date is required'
    if (form.tags.length === 0) errs.tags = 'Add at least one tag'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  /* ── Submit ── */
  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true)
    }
  }

  /* ── Preview Data ── */
  const previewBudget = form.budget ? Number(form.budget) : 0

  return (
    <div className="min-h-screen bg-black">
      {/* ── Header ── */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF4500]" />
            <span className="text-sm font-bold text-zinc-100">Vibe</span>
          </Link>
          <Link href="/dev">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {submitted ? (
          /* ── Success State ── */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00FF88]/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-[#00FF88]" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-100">Gig Posted! 🎉</h1>
            <p className="mt-3 text-zinc-500 max-w-md text-center">
              Your gig <span className="text-zinc-300 font-semibold">&ldquo;{form.title}&rdquo;</span> is now live.
              Streamers will start applying soon.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/dev">
                <Button variant="secondary">Back to Dashboard</Button>
              </Link>
              <Button onClick={() => { setSubmitted(false); setForm(initialForm); setErrors({}) }}>
                Post Another
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Page Title ── */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">Post a New Gig</h1>
              <p className="mt-2 text-sm text-zinc-500">
                Describe your game, set your budget, and find the perfect streamer.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* ── Form ── */}
              <div className="space-y-6 lg:col-span-3">
                {/* Basic Info */}
                <Card glass>
                  <CardHeader>
                    <CardTitle>Basic Info</CardTitle>
                    <CardDescription>Tell streamers what your gig is about.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Gig Title"
                      id="title"
                      placeholder="e.g. Playtest & Showcase Our New Fortnite Map"
                      value={form.title}
                      onChange={e => updateField('title', e.target.value)}
                      error={errors.title}
                    />
                    <Textarea
                      label="Description"
                      id="description"
                      placeholder="Describe what you need the streamer to do. Include game details, expectations, and any special requirements. Be specific — better descriptions attract better applicants."
                      value={form.description}
                      onChange={e => updateField('description', e.target.value)}
                      error={errors.description}
                      rows={5}
                    />
                    <Input
                      label="Game Name"
                      id="game"
                      placeholder="e.g. Neon Rooftops, PNEUMA, Sky Ladder"
                      value={form.game}
                      onChange={e => updateField('game', e.target.value)}
                      error={errors.game}
                    />
                  </CardContent>
                </Card>

                {/* Game & Platform */}
                <Card glass>
                  <CardHeader>
                    <CardTitle>Game & Platform</CardTitle>
                    <CardDescription>What kind of game and where should they stream it?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Select
                        label="Game Type"
                        id="gameType"
                        options={GAME_TYPES}
                        placeholder="Select game type"
                        value={form.gameType}
                        onChange={e => updateField('gameType', e.target.value)}
                        error={errors.gameType}
                      />
                      <Select
                        label="Platform"
                        id="platform"
                        options={PLATFORMS}
                        value={form.platform}
                        onChange={e => updateField('platform', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Budget & Duration */}
                <Card glass>
                  <CardHeader>
                    <CardTitle>Budget & Duration</CardTitle>
                    <CardDescription>Set the pay and time commitment.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Budget (USD)"
                        id="budget"
                        type="number"
                        placeholder="e.g. 150"
                        value={form.budget}
                        onChange={e => updateField('budget', e.target.value)}
                        error={errors.budget}
                      />
                      <Select
                        label="Payout Type"
                        id="payoutType"
                        options={PAYOUT_TYPES}
                        value={form.payoutType}
                        onChange={e => updateField('payoutType', e.target.value)}
                      />
                    </div>
                    <Input
                      label="Duration"
                      id="duration"
                      placeholder="e.g. 2 hours, 1 stream (3-4 hrs), 6 hours split over 2 days"
                      value={form.duration}
                      onChange={e => updateField('duration', e.target.value)}
                      error={errors.duration}
                    />
                    <Input
                      label="Scheduled Date"
                      id="scheduledDate"
                      type="date"
                      value={form.scheduledDate}
                      onChange={e => updateField('scheduledDate', e.target.value)}
                      error={errors.scheduledDate}
                    />
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card glass>
                  <CardHeader>
                    <CardTitle>Requirements (Optional)</CardTitle>
                    <CardDescription>Filter streamers by their audience size.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Min Followers"
                        id="minFollowers"
                        type="number"
                        placeholder="e.g. 1000"
                        value={form.minFollowers}
                        onChange={e => updateField('minFollowers', e.target.value)}
                      />
                      <Input
                        label="Min Avg Viewers"
                        id="minAvgViewers"
                        type="number"
                        placeholder="e.g. 50"
                        value={form.minAvgViewers}
                        onChange={e => updateField('minAvgViewers', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card glass>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>Add up to 8 tags to help streamers find your gig.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map(tag => (
                        <Badge key={tag} variant="primary" size="md">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1.5 hover:text-white transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* Tag Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag(tagInput)
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addTag(tagInput)}
                        disabled={!tagInput.trim() || form.tags.length >= 8}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Suggested Tags */}
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Suggested</p>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_TAGS.filter(t => !form.tags.includes(t)).slice(0, 10).map(tag => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {errors.tags && <p className="text-xs text-red-500">{errors.tags}</p>}
                  </CardContent>
                </Card>

                {/* Submit */}
                <Button size="lg" className="w-full gap-2" onClick={handleSubmit}>
                  <Send className="h-5 w-5" /> Post Gig
                </Button>
              </div>

              {/* ── Preview Sidebar ── */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium text-zinc-400">Live Preview</span>
                  </div>

                  <Card glass glow className="overflow-hidden">
                    {/* Gradient header */}
                    <div className={cn(
                      'h-24 bg-gradient-to-br',
                      form.gameType === 'fortnite' ? 'from-[#00D4FF]/20 to-black' :
                      form.gameType === 'roblox' ? 'from-[#FF00FF]/20 to-black' :
                      form.gameType === 'minecraft' ? 'from-[#00FF88]/20 to-black' :
                      'from-[#FF4500]/20 to-black',
                    )} />

                    <CardContent className="space-y-4 -mt-8">
                      {/* Icon */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black text-2xl">
                        {form.gameType ? getGameIcon(form.gameType) : '🎯'}
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="text-base font-bold text-zinc-100 leading-tight">
                          {form.title || 'Your Gig Title'}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-0.5">{form.game || 'Game Name'}</p>
                      </div>

                      {/* Dev Info */}
                      <div className="flex items-center gap-2">
                        <Avatar src={currentDev.avatar} name={currentDev.name} size="sm" />
                        <span className="text-xs text-zinc-400">Posted by {currentDev.name}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                        {form.description || 'Your description will appear here...'}
                      </p>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                        <div className="text-center">
                          <p className="text-sm font-bold text-zinc-100">{previewBudget > 0 ? formatCurrency(previewBudget) : '$---'}</p>
                          <p className="text-[10px] text-zinc-600">{getPayoutLabel(form.payoutType)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-zinc-100">{form.duration || '---'}</p>
                          <p className="text-[10px] text-zinc-600">Duration</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-zinc-100">{getPlatformLabel(form.platform)}</p>
                          <p className="text-[10px] text-zinc-600">Platform</p>
                        </div>
                      </div>

                      {/* Tags */}
                      {form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                          {form.tags.map(tag => (
                            <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                          ))}
                        </div>
                      )}

                      {/* Requirements */}
                      {(form.minFollowers || form.minAvgViewers) && (
                        <div className="border-t border-white/5 pt-3 space-y-2">
                          {form.minFollowers && (
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <Users className="h-3 w-3" />
                              Min {Number(form.minFollowers).toLocaleString()} followers
                            </div>
                          )}
                          {form.minAvgViewers && (
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <Users className="h-3 w-3" />
                              Min {Number(form.minAvgViewers).toLocaleString()} avg viewers
                            </div>
                          )}
                        </div>
                      )}

                      {/* Apply Button */}
                      <div className="border-t border-white/5 pt-3">
                        <div className="h-10 w-full rounded-lg bg-zinc-800/50 flex items-center justify-center">
                          <span className="text-xs text-zinc-600">Preview — Apply button</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Validation Summary */}
                  {Object.keys(errors).length > 0 && (
                    <Card className="border-red-500/30 bg-red-500/5">
                      <CardContent className="p-4 space-y-1">
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Please fix the following:
                        </p>
                        {Object.values(errors).map((err, i) => (
                          <p key={i} className="text-[11px] text-red-300/70">• {err}</p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}