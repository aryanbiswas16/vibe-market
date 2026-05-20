'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/input'
import { gigs, applications, streamers, devs } from '@/lib/data'
import {
  cn,
  formatCurrency,
  timeAgo,
  getGameIcon,
  getStatusColor,
  getStatusBg,
  getPayoutLabel,
  getPlatformLabel,
  formatNumber,
} from '@/lib/utils'
import {
  Users,
  DollarSign,
  Star,
  Zap,
  Clock,
  Calendar,
  Eye,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Target,
  Monitor,
  ChevronRight,
  Send,
} from 'lucide-react'
import type { Application } from '@/lib/types'

/* ────────── Gradient background per game type ────────── */
const gameGradients: Record<string, string> = {
  steam: 'from-[#FF4500]/20 via-black to-black',
  fortnite: 'from-[#00D4FF]/20 via-black to-black',
  roblox: 'from-[#FF00FF]/20 via-black to-black',
  minecraft: 'from-[#00FF88]/20 via-black to-black',
  other: 'from-[#FFE600]/20 via-black to-black',
}

const gameAccents: Record<string, string> = {
  steam: 'text-[#FF4500]',
  fortnite: 'text-[#00D4FF]',
  roblox: 'text-[#FF00FF]',
  minecraft: 'text-[#00FF88]',
  other: 'text-[#FFE600]',
}

/* ────────── Apply Form ────────── */
function ApplyForm({
  gigId,
  onClose,
}: {
  gigId: string
  onClose: () => void
}) {
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!message.trim()) {
      setError('Please write a message to the dev')
      return
    }
    if (message.trim().length < 20) {
      setError('Message must be at least 20 characters')
      return
    }
    setSubmitted(true)
    setError('')
  }

  if (submitted) {
    return (
      <Card glass glow className="overflow-hidden">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF88]/10">
            <CheckCircle2 className="h-8 w-8 text-[#00FF88]" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">Application Sent!</h3>
          <p className="text-sm text-zinc-500 max-w-sm">
            The dev will review your application based on your vibe score, followers, and message.
            You&apos;ll hear back soon.
          </p>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card glass glow className="overflow-hidden">
      <CardHeader>
        <CardTitle>Apply for this Gig</CardTitle>
        <CardDescription>Introduce yourself. Tell the dev why you&apos;re the perfect fit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Hey! I'd love to stream your game. I've got 12k followers, average 420 viewers, and my community loves this type of content. I can do the full 3-hour slot and clip highlights for your marketing. Let's make some great content together! 🔥"
          value={message}
          onChange={e => {
            setMessage(e.target.value)
            if (error) setError('')
          }}
          rows={5}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">{message.length} chars</Badge>
            {message.length < 20 && (
              <Badge variant="default" size="sm">min 20</Badge>
            )}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1 gap-2">
            <Send className="h-4 w-4" /> Send Application
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ────────── Applicants Section ────────── */
function ApplicantsSection({
  apps,
  isDevView,
}: {
  apps: Application[]
  isDevView: boolean
}) {
  if (apps.length === 0) return null

  return (
    <Card glass className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Applicants ({apps.length})</CardTitle>
          {isDevView && (
            <Badge variant="primary" size="sm">Dev View</Badge>
          )}
        </div>
        <CardDescription>
          {isDevView
            ? 'Review applications and manage streamers.'
            : 'Streamers who have applied for this gig.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apps.map(app => {
          const streamer = streamers.find(s => s.id === app.streamerId)
          return (
            <div
              key={app.id}
              className="rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={app.streamerAvatar} name={app.streamerName} size="md" status={
                    app.status === 'accepted' ? 'online' :
                    app.status === 'rejected' ? 'offline' : 'away'
                  } />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{app.streamerName}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {formatNumber(app.streamerFollowers)} followers
                      </span>
                      <span className="text-zinc-700">·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatNumber(app.streamerAvgViewers)} avg viewers
                      </span>
                      {streamer && (
                        <>
                          <span className="text-zinc-700">·</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Vibe {streamer.vibeScore}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    app.status === 'accepted' ? 'green' :
                    app.status === 'rejected' ? 'default' :
                    app.status === 'completed' ? 'yellow' :
                    'primary'
                  }
                  size="sm"
                  dot
                >
                  {app.status}
                </Badge>
              </div>

              {/* Message */}
              <div className="mt-3 rounded-lg bg-white/[0.02] border border-white/5 p-3">
                <p className="text-xs text-zinc-400 leading-relaxed">&ldquo;{app.message}&rdquo;</p>
              </div>

              {/* Dev Controls */}
              {isDevView && app.status === 'pending' && (
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      const btn = document.getElementById(`accept-${app.id}`)
                      if (btn) {
                        btn.textContent = '✓ Accepted'
                        btn.setAttribute('disabled', 'true')
                      }
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-xs text-red-400 hover:text-red-300"
                    onClick={() => {
                      const btn = document.getElementById(`reject-${app.id}`)
                      if (btn) {
                        btn.textContent = '✕ Rejected'
                        btn.setAttribute('disabled', 'true')
                      }
                    }}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                  <span className="text-[10px] text-zinc-600 ml-auto">
                    Applied {timeAgo(app.appliedAt)}
                  </span>
                </div>
              )}

              {!isDevView && (
                <div className="mt-2 text-right">
                  <span className="text-[10px] text-zinc-600">
                    Applied {timeAgo(app.appliedAt)}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ────────── Gig Detail Page ────────── */
export default function GigDetailPage() {
  const params = useParams()
  const gigId = params?.id as string

  const gig = useMemo(() => gigs.find(g => g.id === gigId), [gigId])
  const gigApps = useMemo(() => applications.filter(a => a.gigId === gigId), [gigId])
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [isDevView, setIsDevView] = useState(false)

  // Check for ?dev=true query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setIsDevView(params.get('dev') === 'true')
    }
  }, [])

  if (!gig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6 px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900">
          <Zap className="h-10 w-10 text-zinc-700" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Gig Not Found</h1>
        <p className="text-sm text-zinc-500">This gig doesn&apos;t exist or has been removed.</p>
        <Link href="/streamer">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Gigs
          </Button>
        </Link>
      </div>
    )
  }

  const gradient = gameGradients[gig.gameType] || gameGradients.steam
  const accent = gameAccents[gig.gameType] || gameAccents.steam

  return (
    <div className="min-h-screen bg-black">
      {/* ── Header ── */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/streamer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Gigs
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF4500]" />
            <span className="text-sm font-bold text-zinc-100">Vibe</span>
          </Link>
        </div>
      </header>

      {/* ── Hero Area ── */}
      <div className={cn('relative bg-gradient-to-b', gradient)}>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <Link href="/streamer" className="hover:text-zinc-400">Gigs</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-400">{gig.game}</span>
            </div>

            {/* Title & Game */}
            <div className="flex items-start gap-5">
              <span className="text-5xl">{getGameIcon(gig.gameType)}</span>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">{gig.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge variant={gig.gameType === 'fortnite' ? 'cyan' : gig.gameType === 'roblox' ? 'pink' : gig.gameType === 'minecraft' ? 'green' : 'primary'} size="md">
                    {gig.gameType}
                  </Badge>
                  <span className="text-sm text-zinc-400">{gig.game}</span>
                  <span className="text-zinc-600">·</span>
                  <span className={cn('text-sm font-semibold', getStatusColor(gig.status))}>
                    {gig.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Dev Info */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
              <Avatar src={gig.devAvatar} name={gig.devName} size="md" />
              <div>
                <p className="text-sm font-medium text-zinc-100">Posted by {gig.devName}</p>
                <p className="text-xs text-zinc-500">{timeAgo(gig.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card glass className="p-4">
                <DollarSign className="mb-2 h-4 w-4 text-[#FF4500]" />
                <p className="text-lg font-bold text-zinc-100">{formatCurrency(gig.budget)}</p>
                <p className="text-xs text-zinc-500">{getPayoutLabel(gig.payoutType)}</p>
              </Card>
              <Card glass className="p-4">
                <Clock className="mb-2 h-4 w-4 text-[#00D4FF]" />
                <p className="text-lg font-bold text-zinc-100">{gig.duration}</p>
                <p className="text-xs text-zinc-500">Duration</p>
              </Card>
              <Card glass className="p-4">
                <Users className="mb-2 h-4 w-4 text-[#FFE600]" />
                <p className="text-lg font-bold text-zinc-100">{gig.applicants}</p>
                <p className="text-xs text-zinc-500">Applicants</p>
              </Card>
              <Card glass className="p-4">
                <Monitor className="mb-2 h-4 w-4 text-[#00FF88]" />
                <p className="text-lg font-bold text-zinc-100">{getPlatformLabel(gig.platform)}</p>
                <p className="text-xs text-zinc-500">Platform</p>
              </Card>
            </div>

            {/* Description */}
            <Card glass>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">{gig.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card glass>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {gig.minFollowers && (
                    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3">
                      <Users className="h-5 w-5 text-zinc-600" />
                      <div>
                        <p className="text-xs text-zinc-500">Min Followers</p>
                        <p className="text-sm font-semibold text-zinc-100">{formatNumber(gig.minFollowers)}</p>
                      </div>
                    </div>
                  )}
                  {gig.minAvgViewers && (
                    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3">
                      <Eye className="h-5 w-5 text-zinc-600" />
                      <div>
                        <p className="text-xs text-zinc-500">Min Avg Viewers</p>
                        <p className="text-sm font-semibold text-zinc-100">{formatNumber(gig.minAvgViewers)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3">
                    <Monitor className="h-5 w-5 text-zinc-600" />
                    <div>
                      <p className="text-xs text-zinc-500">Platform</p>
                      <p className="text-sm font-semibold text-zinc-100">{getPlatformLabel(gig.platform)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3">
                    <Calendar className="h-5 w-5 text-zinc-600" />
                    <div>
                      <p className="text-xs text-zinc-500">Scheduled</p>
                      <p className="text-sm font-semibold text-zinc-100">{new Date(gig.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {gig.tags.map(tag => (
                <Badge key={tag} variant="outline" size="md">{tag}</Badge>
              ))}
            </div>

            {/* Apply Form */}
            {showApplyForm ? (
              <ApplyForm gigId={gig.id} onClose={() => setShowApplyForm(false)} />
            ) : (
              gig.status === 'open' && (
                <Button size="lg" className="w-full gap-2" onClick={() => setShowApplyForm(true)}>
                  <Send className="h-5 w-5" /> Apply Now
                </Button>
              )
            )}

            {gig.status !== 'open' && !showApplyForm && (
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 text-center backdrop-blur-xl">
                <Badge variant={gig.status === 'completed' ? 'yellow' : 'default'} size="lg">
                  {gig.status === 'completed' ? '🎉 This gig is completed' : gig.status === 'in_progress' ? '🔄 In progress' : '🚫 Cancelled'}
                </Badge>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card glass>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#FF4500]" />
                  <div>
                    <p className="text-xs text-zinc-500">Date</p>
                    <p className="text-sm font-medium text-zinc-100">
                      {new Date(gig.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#00D4FF]" />
                  <div>
                    <p className="text-xs text-zinc-500">Duration</p>
                    <p className="text-sm font-medium text-zinc-100">{gig.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-[#00FF88]" />
                  <div>
                    <p className="text-xs text-zinc-500">Payout</p>
                    <p className="text-sm font-medium text-zinc-100">{formatCurrency(gig.budget)} ({getPayoutLabel(gig.payoutType)})</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicants */}
            <Card glass>
              <CardHeader>
                <CardTitle>Applicants ({gigApps.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gigApps.length === 0 ? (
                  <p className="text-xs text-zinc-600">No applicants yet. Be the first!</p>
                ) : (
                  gigApps.slice(0, 4).map(app => (
                    <div key={app.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar src={app.streamerAvatar} name={app.streamerName} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-100 truncate">{app.streamerName}</p>
                          <p className="text-[10px] text-zinc-500">{formatNumber(app.streamerFollowers)} followers</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          app.status === 'accepted' ? 'green' :
                          app.status === 'rejected' ? 'default' :
                          'primary'
                        }
                        size="sm"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
                {gigApps.length > 4 && (
                  <p className="text-xs text-zinc-600 text-center pt-2 border-t border-white/5">
                    +{gigApps.length - 4} more applicants
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Full Applicants Section ── */}
        <div className="mt-12">
          <ApplicantsSection apps={gigApps} isDevView={isDevView} />
        </div>
      </div>
    </div>
  )
}