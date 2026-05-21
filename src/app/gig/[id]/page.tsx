'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/input'
import { getGig, createApplication, updateApplicationStatus, getMyApplications, getGigPayment, createPaymentIntent, confirmPayment, releasePayment } from '@/lib/api-client'
import {
  cn,
  formatCurrency,
  timeAgo,
  getGameIcon,
  getStatusColor,
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
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Monitor,
  ChevronRight,
  Send,
} from 'lucide-react'
import type { Application, Gig } from '@/lib/types'
import { useAuth } from '@/lib/auth'

const gameGradients: Record<string, string> = {
  steam: 'from-brand/20 via-black to-black',
  fortnite: 'from-cyan/20 via-black to-black',
  roblox: 'from-pink/20 via-black to-black',
  minecraft: 'from-green/20 via-black to-black',
  other: 'from-yellow/20 via-black to-black',
}

function ApplyForm({
  gigId,
  gig,
  onClose,
  user,
  onApplied,
}: {
  gigId: string
  gig: Gig
  onClose: () => void
  user: NonNullable<ReturnType<typeof useAuth>['user']>
  onApplied: () => void
}) {
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please write a message to the dev')
      return
    }
    if (message.trim().length < 20) {
      setError('Message must be at least 20 characters')
      return
    }
    setLoading(true)
    try {
      await createApplication({ gigId, message: message.trim() })
      setSubmitted(true)
      setError('')
      onApplied()
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full surface-3">
            <CheckCircle2 className="h-8 w-8 text-green" />
          </div>
          <h3 className="text-heading text-zinc-50">Application Sent!</h3>
          <p className="text-body text-zinc-500 max-w-sm">
            The dev will review your application based on your vibe score, followers, and message.
            You&apos;ll hear back soon.
          </p>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Apply for this Gig</CardTitle>
        <CardDescription>Introduce yourself. Tell the dev why you&apos;re the perfect fit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Hey! I'd love to stream your game. I've got 12k followers, average 420 viewers, and my community loves this type of content. I can do the full 3-hour slot and clip highlights for your marketing. Let's make some great content together!"
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
          {error && <p className="text-small text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1 gap-2" disabled={loading}>
            <Send className="h-4 w-4" /> Send Application
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ApplicantsSection({
  apps,
  isDevView,
  gigStatus,
  gigBudget,
  payment,
  paymentLoading,
  onProcessPayment,
  onReleasePayment,
  onStatusChange,
}: {
  apps: Application[]
  isDevView: boolean
  gigStatus?: string
  gigBudget?: number
  payment?: any | null
  paymentLoading?: boolean
  onProcessPayment?: (applicationId: string) => void
  onReleasePayment?: () => void
  onStatusChange?: () => void
}) {
  if (apps.length === 0) return null

  return (
    <Card className="overflow-hidden">
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
        {apps.map(app => (
          <div
            key={app.id}
            className="rounded-lg surface-1 p-4 transition-colors hover:surface-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={app.streamerAvatar} name={app.streamerName} size="md" status={
                  app.status === 'accepted' ? 'online' :
                  app.status === 'rejected' ? 'offline' : 'away'
                } />
                <div className="min-w-0">
                  <p className="text-caption font-semibold text-zinc-50 truncate">{app.streamerName}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-small text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {formatNumber(app.streamerFollowers)} followers
                    </span>
                    <span className="text-zinc-700">&middot;</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(app.streamerAvgViewers)} avg viewers
                    </span>
                    <span className="text-zinc-700">&middot;</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Vibe {(app as any).streamerVibeScore ?? 0}
                    </span>
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

            <div className="mt-3 rounded-lg surface-1 p-3">
              <p className="text-small text-zinc-400 leading-relaxed">&ldquo;{app.message}&rdquo;</p>
            </div>

            {isDevView && app.status === 'pending' && (
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="gap-1.5 text-small"
                  onClick={async () => {
                    try {
                      await updateApplicationStatus(app.id, 'accepted')
                      onStatusChange?.()
                    } catch (err) {
                      console.error('Failed to accept:', err)
                    }
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-small text-red-400 hover:text-red-300"
                  onClick={async () => {
                    try {
                      await updateApplicationStatus(app.id, 'rejected')
                      onStatusChange?.()
                    } catch (err) {
                      console.error('Failed to reject:', err)
                    }
                  }}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </Button>
                <span className="text-small text-zinc-600 ml-auto">
                  Applied {timeAgo(app.appliedAt)}
                </span>
              </div>
            )}

            {isDevView && app.status === 'accepted' && payment && (
              <div className="mt-3 space-y-2">
                {payment.status === 'succeeded' && gigStatus === 'in_progress' && (
                  <Button size="sm" variant="primary" className="gap-1.5 w-full" onClick={onReleasePayment} disabled={paymentLoading}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {paymentLoading ? 'Processing...' : 'Mark Complete & Release Payment'}
                  </Button>
                )}
                {payment.status === 'released' && (
                  <div className="rounded-lg surface-2 p-3 text-center">
                    <Badge variant="green" size="md">Payment Released ✓</Badge>
                    <p className="text-small text-zinc-500 mt-1">Funds transferred to streamer</p>
                  </div>
                )}
                {(payment.status === 'requires_payment_method' || payment.status === 'requires_action' || payment.status === 'requires_confirmation') && (
                  <Button size="sm" variant="primary" className="gap-1.5 w-full" onClick={() => onProcessPayment?.(app.id)} disabled={paymentLoading}>
                    <DollarSign className="h-3.5 w-3.5" />
                    {paymentLoading ? 'Completing Payment...' : 'Complete Payment'}
                  </Button>
                )}
              </div>
            )}

            {isDevView && app.status === 'accepted' && !payment && (
              <div className="mt-3">
                <Button size="sm" variant="primary" className="gap-1.5 w-full" onClick={() => onProcessPayment?.(app.id)} disabled={paymentLoading}>
                  <DollarSign className="h-3.5 w-3.5" />
                  {paymentLoading ? 'Processing Payment...' : `Process Payment (${gigBudget ? formatCurrency(gigBudget) : '$0'})`}
                </Button>
              </div>
            )}

            {!isDevView && (
              <div className="mt-2 text-right">
                <span className="text-small text-zinc-600">
                  Applied {timeAgo(app.appliedAt)}
                </span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function GigDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gigId = params?.id as string
  const { user } = useAuth()

  const [gig, setGig] = useState<Gig | null>(null)
  const [gigApps, setGigApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [isDevView, setIsDevView] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [payment, setPayment] = useState<any>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDevView(new URLSearchParams(window.location.search).get('dev') === 'true')
    }
  }, [])

  const fetchGig = useCallback(async () => {
    if (!gigId) return
    setLoading(true)
    try {
      const data = await getGig(gigId)
      setGig(data.gig as Gig)
      setGigApps(data.applications as Application[])
    } catch (err) {
      console.error('Failed to load gig:', err)
      setGig(null)
    } finally {
      setLoading(false)
    }
  }, [gigId])

  useEffect(() => {
    fetchGig()
  }, [fetchGig, refreshKey])

  // Fetch payment status when viewing as dev
  useEffect(() => {
    if (gigId && isDevView) {
      getGigPayment(gigId).then(r => setPayment(r.payment)).catch(() => {})
    }
  }, [gigId, isDevView])

  // Payment handlers
  const handleProcessPayment = useCallback(async (applicationId: string) => {
    if (!gigId) return
    setPaymentLoading(true)
    try {
      const result = await createPaymentIntent({ gigId, applicationId })
      if (result.clientSecret) {
        const piId = result.clientSecret.split('_secret')[0]
        await confirmPayment({ paymentIntentId: piId })
        const updated = await getGigPayment(gigId)
        setPayment(updated.payment)
        // Wait a beat for webhook to process
        setTimeout(async () => {
          const refreshed = await getGigPayment(gigId)
          setPayment(refreshed.payment)
        }, 2000)
      }
    } catch (err: any) {
      console.error(err)
    }
    setPaymentLoading(false)
  }, [gigId])

  const handleReleasePayment = useCallback(async () => {
    if (!gigId) return
    setPaymentLoading(true)
    try {
      await releasePayment({ gigId })
      const updated = await getGigPayment(gigId)
      setPayment(updated.payment)
      // Reload page data
      const reload = await getGig(gigId)
      setGig(reload.gig as Gig)
      setGigApps(reload.applications as Application[])
    } catch (err: any) {
      console.error(err)
    }
    setPaymentLoading(false)
  }, [gigId])

  const hasApplied = useMemo(
    () => user ? gigApps.some(a => a.streamerId === user.id) : false,
    [gigApps, user],
  )
  const existingApp = useMemo(
    () => user ? gigApps.find(a => a.streamerId === user.id) : undefined,
    [gigApps, user],
  )

  const handleApplyClick = () => {
    if (!user) {
      router.push('/auth')
      return
    }
    setShowApplyForm(true)
  }

  const refreshData = () => setRefreshKey(k => k + 1)

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6 px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-body text-zinc-500">Loading gig...</p>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6 px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full surface-3">
          <Zap className="h-10 w-10 text-zinc-700" />
        </div>
        <h1 className="text-heading text-zinc-50">Gig Not Found</h1>
        <p className="text-body text-zinc-500">This gig doesn&apos;t exist or has been removed.</p>
        <Link href="/streamer">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Gigs
          </Button>
        </Link>
      </div>
    )
  }

  const gradient = gameGradients[gig.gameType] || gameGradients.steam

  return (
    <div className="min-h-screen bg-black">
      <header className="shadow-divider sticky top-0 z-50 bg-black">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href={isDevView ? '/dev' : '/streamer'} className="flex items-center gap-2 text-body text-zinc-400 hover:text-zinc-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {isDevView ? 'Back to Dashboard' : 'Back to Gigs'}
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <span className="text-caption font-bold text-zinc-50">Vibe</span>
          </Link>
        </div>
      </header>

      <div className={cn('relative bg-gradient-to-b', gradient)}>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-small text-zinc-600">
              <Link href={isDevView ? '/dev' : '/streamer'} className="hover:text-zinc-400">{isDevView ? 'Dashboard' : 'Gigs'}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-400">{gig.game}</span>
            </div>

            <div className="flex items-start gap-5">
              <span className="text-5xl">{getGameIcon(gig.gameType)}</span>
              <div className="min-w-0">
                <h1 className="text-display text-zinc-50">{gig.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge variant={gig.gameType === 'fortnite' ? 'cyan' : gig.gameType === 'roblox' ? 'pink' : gig.gameType === 'minecraft' ? 'green' : 'primary'} size="md">
                    {gig.gameType}
                  </Badge>
                  <span className="text-body text-zinc-400">{gig.game}</span>
                  <span className="text-zinc-600">&middot;</span>
                  <span className={cn('text-caption font-semibold', getStatusColor(gig.status))}>
                    {gig.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl surface-2 px-4 py-3">
              <Avatar src={gig.devAvatar} name={gig.devName} size="md" />
              <div>
                <p className="text-caption font-medium text-zinc-50">Posted by {gig.devName}</p>
                <p className="text-small text-zinc-500">{timeAgo(gig.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card className="p-4">
                <DollarSign className="mb-2 h-4 w-4 text-brand" />
                <p className="text-heading text-zinc-50">{formatCurrency(gig.budget)}</p>
                <p className="text-small text-zinc-500">{gig.payoutType === 'fixed' ? 'Fixed' : gig.payoutType === 'per_hour' ? 'Per Hour' : 'Per Viewer'}</p>
              </Card>
              <Card className="p-4">
                <Clock className="mb-2 h-4 w-4 text-cyan" />
                <p className="text-heading text-zinc-50">{gig.duration}</p>
                <p className="text-small text-zinc-500">Duration</p>
              </Card>
              <Card className="p-4">
                <Users className="mb-2 h-4 w-4 text-yellow" />
                <p className="text-heading text-zinc-50">{gig.applicants}</p>
                <p className="text-small text-zinc-500">Applicants</p>
              </Card>
              <Card className="p-4">
                <Monitor className="mb-2 h-4 w-4 text-green" />
                <p className="text-heading text-zinc-50">{gig.platform === 'both' ? 'Twitch + YouTube' : gig.platform === 'twitch' ? 'Twitch' : 'YouTube'}</p>
                <p className="text-small text-zinc-500">Platform</p>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body leading-relaxed text-zinc-300 whitespace-pre-line">{gig.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {gig.minFollowers && (
                    <div className="flex items-center gap-3 rounded-lg surface-1 px-4 py-3">
                      <Users className="h-5 w-5 text-zinc-600" />
                      <div>
                        <p className="text-small text-zinc-500">Min Followers</p>
                        <p className="text-caption font-semibold text-zinc-50">{formatNumber(gig.minFollowers)}</p>
                      </div>
                    </div>
                  )}
                  {gig.minAvgViewers && (
                    <div className="flex items-center gap-3 rounded-lg surface-1 px-4 py-3">
                      <Eye className="h-5 w-5 text-zinc-600" />
                      <div>
                        <p className="text-small text-zinc-500">Min Avg Viewers</p>
                        <p className="text-caption font-semibold text-zinc-50">{formatNumber(gig.minAvgViewers)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-lg surface-1 px-4 py-3">
                    <Monitor className="h-5 w-5 text-zinc-600" />
                    <div>
                      <p className="text-small text-zinc-500">Platform</p>
                      <p className="text-caption font-semibold text-zinc-50">{gig.platform === 'both' ? 'Twitch + YouTube' : gig.platform === 'twitch' ? 'Twitch' : 'YouTube'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg surface-1 px-4 py-3">
                    <Calendar className="h-5 w-5 text-zinc-600" />
                    <div>
                      <p className="text-small text-zinc-500">Scheduled</p>
                      <p className="text-caption font-semibold text-zinc-50">{new Date(gig.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              {gig.tags.map(tag => (
                <Badge key={tag} variant="outline" size="md">{tag}</Badge>
              ))}
            </div>

            {showApplyForm && user ? (
              <ApplyForm gigId={gig.id} gig={gig} onClose={() => setShowApplyForm(false)} user={user} onApplied={refreshData} />
            ) : (
              gig.status === 'open' && !hasApplied && (
                <Button size="lg" className="w-full gap-2" onClick={handleApplyClick}>
                  <Send className="h-5 w-5" /> Apply Now
                </Button>
              )
            )}

            {hasApplied && !showApplyForm && (
              <div className="rounded-xl surface-2 p-6 text-center">
                <Badge variant={existingApp?.status === 'accepted' ? 'green' : existingApp?.status === 'rejected' ? 'default' : 'primary'} size="lg">
                  {existingApp?.status === 'accepted' ? 'Accepted!' : existingApp?.status === 'rejected' ? 'Rejected' : 'Already Applied'}
                </Badge>
              </div>
            )}

            {gig.status !== 'open' && !showApplyForm && !hasApplied && (
              <div className="rounded-xl surface-2 p-6 text-center">
                <Badge variant={gig.status === 'completed' ? 'yellow' : 'default'} size="lg">
                  {gig.status === 'completed' ? 'Completed' : gig.status === 'in_progress' ? 'In Progress' : 'Cancelled'}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-small text-zinc-500">Date</p>
                    <p className="text-caption font-medium text-zinc-50">
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
                  <Clock className="h-4 w-4 text-cyan" />
                  <div>
                    <p className="text-small text-zinc-500">Duration</p>
                    <p className="text-caption font-medium text-zinc-50">{gig.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-green" />
                  <div>
                    <p className="text-small text-zinc-500">Payout</p>
                    <p className="text-caption font-medium text-zinc-50">{formatCurrency(gig.budget)} ({gig.payoutType === 'fixed' ? 'Fixed' : gig.payoutType === 'per_hour' ? 'Per Hour' : 'Per Viewer'})</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applicants ({gigApps.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gigApps.length === 0 ? (
                  <p className="text-small text-zinc-600">No applicants yet. Be the first!</p>
                ) : (
                  gigApps.slice(0, 4).map(app => (
                    <div key={app.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar src={app.streamerAvatar} name={app.streamerName} size="sm" />
                        <div className="min-w-0">
                          <p className="text-small font-medium text-zinc-50 truncate">{app.streamerName}</p>
                          <p className="text-small text-zinc-500">{formatNumber(app.streamerFollowers)} followers</p>
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
                  <p className="text-small text-zinc-600 text-center pt-2 shadow-divider">
                    +{gigApps.length - 4} more applicants
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <ApplicantsSection apps={gigApps} isDevView={isDevView} gigStatus={gig.status} gigBudget={gig.budget} payment={payment} paymentLoading={paymentLoading} onProcessPayment={handleProcessPayment} onReleasePayment={handleReleasePayment} onStatusChange={refreshData} />
        </div>
      </div>
    </div>
  )
}