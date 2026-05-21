'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { streamers } from '@/lib/data'
import { getGigs, getMyApplications } from '@/lib/api-client'
import {
  cn,
  formatCurrency,
  formatNumber,
  timeAgo,
  getGameIcon,
} from '@/lib/utils'
import {
  Users,
  Star,
  Trophy,
  Gamepad2,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  MapPin,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'
import type { Gig, Application } from '@/lib/types'

function VibeScore({ score }: { score: number }) {
  const level = score >= 90 ? 'Legendary' : score >= 80 ? 'Elite' : score >= 70 ? 'Pro' : 'Rising'
  const color = score >= 90 ? 'text-yellow' : score >= 80 ? 'text-brand' : score >= 70 ? 'text-cyan' : 'text-zinc-400'
  const barColor = score >= 90 ? 'bg-yellow' : score >= 80 ? 'bg-brand' : score >= 70 ? 'bg-cyan' : 'bg-zinc-500'

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full surface-3">
          <Trophy className={cn('h-6 w-6', color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-caption font-semibold text-zinc-50">Vibe Score</p>
            <p className={cn('text-heading font-bold', color)}>{score}</p>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className={cn('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${score}%` }} />
          </div>
          <p className={cn('mt-1 text-small font-medium', color)}>{level} Level</p>
        </div>
      </div>
    </Card>
  )
}

function CompletedGigCard({ gig }: { gig: Gig }) {
  return (
    <Link href={`/gig/${gig.id}`} className="group block" aria-label={`View gig: ${gig.title}`}>
      <Card hover className="h-full">
        <CardContent className="flex flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>
              <div className="min-w-0">
                <p className="text-caption font-semibold text-zinc-50 group-hover:text-brand transition-colors line-clamp-1">
                  {gig.title}
                </p>
                <p className="text-small text-zinc-500">{gig.game}</p>
              </div>
            </div>
            <Badge variant="yellow" size="sm" dot>
              completed
            </Badge>
          </div>
          <div className="flex items-center justify-between text-small text-zinc-500 shadow-divider pt-3">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{formatCurrency(gig.budget)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(gig.scheduledDate)}</span>
            </div>
            <ExternalLink className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <header className="shadow-divider sticky top-0 z-50 bg-black">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="h-4 w-24 rounded shimmer" />
          <div className="h-5 w-16 rounded shimmer" />
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full shimmer" />
          <div className="space-y-3 flex-1">
            <div className="h-6 w-48 rounded shimmer" />
            <div className="h-4 w-32 rounded shimmer" />
            <div className="h-4 w-64 rounded shimmer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl shimmer" />
          ))}
        </div>
        <div className="h-24 rounded-xl shimmer" />
      </div>
    </div>
  )
}

export default function StreamerProfilePage() {
  const params = useParams()
  const id = params?.id as string

  const [allGigs, setAllGigs] = useState<Gig[]>([])
  const [allApps, setAllApps] = useState<Application[]>([])
  const [streamerData, setStreamerData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [gigsRes, apps] = await Promise.all([
          getGigs({ limit: '100' }),
          getMyApplications(),
        ])
        const fetchedGigs = gigsRes.gigs as Gig[]
        const fetchedApps = apps as Application[]
        setAllGigs(fetchedGigs)
        setAllApps(fetchedApps)

        // Find streamer data from the application streamer info
        const streamerApp = fetchedApps.find(a => a.streamerId === id)
        if (streamerApp) {
          setStreamerData({
            id: streamerApp.streamerId,
            name: streamerApp.streamerName,
            avatar: streamerApp.streamerAvatar,
            followers: streamerApp.streamerFollowers,
            avgViewers: streamerApp.streamerAvgViewers,
            vibeScore: (streamerApp as any).streamerVibeScore ?? 50,
          })
        }
      } catch (err) {
        console.error('Failed to load profile data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const completedApps = useMemo(
    () => allApps.filter(a => a.streamerId === id && a.status === 'completed'),
    [allApps, id],
  )

  const completedGigs = useMemo(
    () => allGigs.filter(g => completedApps.some(a => a.gigId === g.id)),
    [allGigs, completedApps],
  )

  const totalEarnings = useMemo(
    () => completedGigs.reduce((sum, g) => sum + g.budget, 0),
    [completedGigs],
  )

  if (loading && !streamerData) {
    return <ProfileSkeleton />
  }

  // Default streamer info from mock data if needed
  const streamer = streamerData || streamers.find((s: any) => s.id === id)

  if (!streamer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6 px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full surface-3">
          <Users className="h-10 w-10 text-zinc-700" />
        </div>
        <h1 className="text-heading text-zinc-50">Streamer Not Found</h1>
        <p className="text-body text-zinc-500">This streamer doesn&apos;t exist or has been removed.</p>
        <Link href="/streamer">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Gigs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="shadow-divider sticky top-0 z-50 bg-black">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/streamer" className="flex items-center gap-2 text-body text-zinc-400 hover:text-zinc-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Gigs
          </Link>
          <Link href="/" className="flex items-center gap-2" aria-label="Vibe home">
            <Sparkles className="h-5 w-5 text-brand" />
            <span className="text-caption font-bold text-zinc-50">Vibe</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <section aria-label="Streamer profile">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-b from-brand/10 via-transparent to-transparent p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <Avatar src={streamer.avatar} name={streamer.name} alt={`${streamer.name}'s avatar`} size="xl" status="online" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-display text-zinc-50">{streamer.name}</h1>
                  <p className="mt-1 text-body text-zinc-500">@{streamer.handle}</p>
                  <p className="mt-2 text-body text-zinc-400 leading-relaxed max-w-lg">{streamer.bio}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-small text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-600" />
                      Joined {new Date(streamer.joinedAt || streamer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green" />
                      {streamer.totalGigsCompleted ?? 0} gigs completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="text-small text-zinc-600 font-medium">Connected:</span>
                <Badge
                  variant={streamer.twitchConnected ? 'green' : 'default'}
                  size="sm"
                  dot={streamer.twitchConnected}
                >
                  Twitch
                </Badge>
                <Badge
                  variant={streamer.youtubeConnected ? 'green' : 'default'}
                  size="sm"
                  dot={streamer.youtubeConnected}
                >
                  YouTube
                </Badge>
              </div>
            </div>
          </Card>
        </section>

        <section aria-label="Streamer statistics">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="p-4">
              <Users className="mb-2 h-4 w-4 text-brand" />
              <p className="text-heading text-zinc-50">{formatNumber(streamer.followers ?? 0)}</p>
              <p className="text-small text-zinc-500">Followers</p>
            </Card>
            <Card className="p-4">
              <Gamepad2 className="mb-2 h-4 w-4 text-cyan" />
              <p className="text-heading text-zinc-50">{formatNumber(streamer.avgViewers ?? 0)}</p>
              <p className="text-small text-zinc-500">Avg Viewers</p>
            </Card>
            <Card className="p-4">
              <Star className="mb-2 h-4 w-4 text-yellow" />
              <p className="text-heading text-zinc-50">{streamer.rating ?? 0}</p>
              <p className="text-small text-zinc-500">Rating</p>
            </Card>
            <Card className="p-4">
              <DollarSign className="mb-2 h-4 w-4 text-green" />
              <p className="text-heading text-zinc-50">{formatCurrency(totalEarnings)}</p>
              <p className="text-small text-zinc-500">Earnings</p>
            </Card>
          </div>
        </section>

        <section aria-label="Vibe score">
          <VibeScore score={streamer.vibeScore ?? 0} />
        </section>

        <section aria-label="Completed gigs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading text-zinc-50">Completed Gigs</h2>
            <Badge variant="outline" size="sm">{completedGigs.length} total</Badge>
          </div>
          {completedGigs.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
              <p className="text-caption text-zinc-400 font-medium">No completed gigs yet</p>
              <p className="mt-1 text-small text-zinc-600">This streamer hasn&apos;t completed any gigs.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {completedGigs.map(gig => (
                <CompletedGigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </section>

        <section aria-label="Application history">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading text-zinc-50">Application History</h2>
            <Badge variant="outline" size="sm">{completedApps.length} completed</Badge>
          </div>
          {completedApps.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
              <p className="text-caption text-zinc-400 font-medium">No applications yet</p>
              <p className="mt-1 text-small text-zinc-600">This streamer hasn&apos;t submitted any applications.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedApps.map(app => {
                const gig = allGigs.find(g => g.id === app.gigId)
                if (!gig) return null
                return (
                  <Card key={app.id} className="overflow-hidden">
                    <div className="flex items-start justify-between gap-4 p-6">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>
                        <div className="min-w-0">
                          <p className="text-caption font-semibold text-zinc-50 line-clamp-1">{gig.title}</p>
                          <p className="text-small text-zinc-500">{gig.game}</p>
                          <p className="mt-2 text-small text-zinc-500 leading-relaxed line-clamp-2">&ldquo;{app.message}&rdquo;</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant="yellow" size="sm" dot>completed</Badge>
                        <span className="text-small text-zinc-600">{timeAgo(app.appliedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between shadow-divider px-6 py-3">
                      <div className="flex items-center gap-2 text-small text-zinc-500">
                        <Users className="h-3 w-3" />
                        <span>by {gig.devName}</span>
                      </div>
                      <Link href={`/gig/${gig.id}`}>
                        <Button size="sm" variant="ghost" className="gap-1 text-small">
                          View Gig <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}