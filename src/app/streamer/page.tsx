'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { streamers, gigs, applications } from '@/lib/data'
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
  getRatingStars,
} from '@/lib/utils'
import {
  Search,
  Users,
  DollarSign,
  Star,
  Zap,
  Trophy,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react'
import type { Gig, Application } from '@/lib/types'

/* ────────── Mock "current streamer" ────────── */
const currentStreamer = streamers[0] // LunaRae

/* ────────── Tab Config ────────── */
type TabId = 'open' | 'applications' | 'completed'

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'open', label: 'Open Gigs', icon: <Zap className="h-4 w-4" /> },
  { id: 'applications', label: 'My Applications', icon: <Clock className="h-4 w-4" /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" /> },
]

/* ────────── Gig Card ────────── */
function GigCard({ gig, hasApplied, appStatus }: { gig: Gig; hasApplied?: boolean; appStatus?: string }) {
  return (
    <Link href={`/gig/${gig.id}`} className="group block">
      <Card glass hover glow className="h-full">
        <CardContent className="flex flex-col gap-4 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-100 group-hover:text-[#FF4500] transition-colors line-clamp-1">
                  {gig.title}
                </p>
                <p className="text-xs text-zinc-500">{gig.game}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="green" size="sm">
                {formatCurrency(gig.budget)}
              </Badge>
              {hasApplied && appStatus && (
                <Badge
                  variant={
                    appStatus === 'accepted' ? 'green' :
                    appStatus === 'rejected' ? 'default' :
                    appStatus === 'completed' ? 'yellow' :
                    'primary'
                  }
                  size="sm"
                  dot
                >
                  {appStatus === 'pending' ? 'Applied' : appStatus}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{gig.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={gig.gameType === 'fortnite' ? 'cyan' : gig.gameType === 'roblox' ? 'pink' : gig.gameType === 'minecraft' ? 'green' : 'primary'} size="sm">
              {gig.gameType}
            </Badge>
            {gig.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
            ))}
            {gig.tags.length > 2 && (
              <Badge variant="outline" size="sm">+{gig.tags.length - 2}</Badge>
            )}
          </div>

          {/* Meta Row */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{gig.applicants} applicants</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{getPayoutLabel(gig.payoutType)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{gig.duration}</span>
            </div>
          </div>

          {/* Dev Info */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <Avatar src={gig.devAvatar} name={gig.devName} size="sm" />
              <span className="text-xs text-zinc-400">{gig.devName}</span>
            </div>
            {hasApplied ? (
              <Badge variant="outline" size="sm">View Application</Badge>
            ) : (
              <Button size="sm" variant="primary">Apply</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* ────────── Application Card ────────── */
function ApplicationCard({ app, gig }: { app: Application; gig?: Gig }) {
  if (!gig) return null
  return (
    <Card glass className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 line-clamp-1">{gig.title}</p>
            <p className="text-xs text-zinc-500">{gig.game}</p>
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

      <p className="mt-3 text-xs text-zinc-500 leading-relaxed line-clamp-2">{app.message}</p>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-zinc-500">
        <span>Applied {timeAgo(app.appliedAt)}</span>
        <div className="flex items-center gap-2">
          <span>{formatCurrency(gig.budget)}</span>
          <Link href={`/gig/${gig.id}`}>
            <Button size="sm" variant="ghost" className="gap-1">
              View <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

/* ────────── Vibe Score Display ────────── */
function VibeScore({ score }: { score: number }) {
  const level = score >= 90 ? 'Legendary' : score >= 80 ? 'Elite' : score >= 70 ? 'Pro' : 'Rising'
  const color = score >= 90 ? 'text-[#FFE600]' : score >= 80 ? 'text-[#FF4500]' : score >= 70 ? 'text-[#00D4FF]' : 'text-zinc-400'
  const barColor = score >= 90 ? 'bg-[#FFE600]' : score >= 80 ? 'bg-[#FF4500]' : score >= 70 ? 'bg-[#00D4FF]' : 'bg-zinc-500'

  return (
    <Card glass className="p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FF4500]/30 bg-[#FF4500]/10">
          <Trophy className={cn('h-6 w-6', color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-100">Vibe Score</p>
            <p className={cn('text-lg font-bold', color)}>{score}</p>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className={cn('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${score}%` }} />
          </div>
          <p className={cn('mt-1 text-xs font-medium', color)}>{level} Level</p>
        </div>
      </div>
    </Card>
  )
}

/* ────────── Streamer Dashboard ────────── */
export default function StreamerDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('open')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Compute stats
  const completedGigs = gigs.filter(g => g.status === 'completed')
  const streamerApps = applications.filter(a => a.streamerId === currentStreamer.id)
  const acceptedApps = streamerApps.filter(a => a.status === 'accepted')
  const completedApps = streamerApps.filter(a => a.status === 'completed')
  const totalEarnings = completedApps.reduce((sum, app) => {
    const g = gigs.find(g => g.id === app.gigId)
    return sum + (g?.budget ?? 0)
  }, 0)

  // Filter gigs
  const openGigs = useMemo(() => {
    let filtered = gigs.filter(g => g.status === 'open')
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        g =>
          g.title.toLowerCase().includes(q) ||
          g.game.toLowerCase().includes(q) ||
          g.tags.some(t => t.toLowerCase().includes(q)) ||
          g.devName.toLowerCase().includes(q),
      )
    }
    return filtered
  }, [search])

  // Filter applications
  const filteredApps = useMemo(() => {
    let apps = streamerApps.filter(a => a.status !== 'completed')
    if (activeTab === 'completed') {
      apps = streamerApps.filter(a => a.status === 'completed')
    } else if (activeTab === 'applications') {
      apps = streamerApps.filter(a => a.status !== 'completed')
    }
    if (search) {
      const q = search.toLowerCase()
      apps = apps.filter(a => {
        const g = gigs.find(g => g.id === a.gigId)
        return g?.title.toLowerCase().includes(q) || g?.game.toLowerCase().includes(q)
      })
    }
    return apps
  }, [activeTab, search, streamerApps])

  return (
    <div className="min-h-screen bg-black">
      {/* ── Header ── */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF4500]" />
            <span className="text-sm font-bold text-zinc-100">Vibe</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dev">
              <Button variant="ghost" size="sm">Dev Portal</Button>
            </Link>
            <Avatar src={currentStreamer.avatar} name={currentStreamer.name} size="sm" status="online" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ── Hero ── */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar src={currentStreamer.avatar} name={currentStreamer.name} size="xl" status="online" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Hey, {currentStreamer.name}</h1>
              <p className="text-sm text-zinc-500">@{currentStreamer.handle} · {currentStreamer.bio}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {formatNumber(currentStreamer.followers!)} followers</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {currentStreamer.rating} avg rating</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {formatNumber(currentStreamer.avgViewers!)} avg viewers</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#00FF88]">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Completed</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{currentStreamer.totalGigsCompleted}</p>
          </Card>
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#FF4500]">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Earnings</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{formatCurrency(totalEarnings)}</p>
          </Card>
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#FFE600]">
              <Star className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Rating</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{currentStreamer.rating}</p>
          </Card>
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#00D4FF]">
              <Zap className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Gigs Available</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{gigs.filter(g => g.status === 'open').length}</p>
          </Card>
        </div>

        {/* ── Vibe Score ── */}
        <div className="mb-8">
          <VibeScore score={currentStreamer.vibeScore} />
        </div>

        {/* ── Tabs ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg border border-white/5 bg-zinc-900/50 p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-[#FF4500] text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              <Input
                placeholder={activeTab === 'open' ? 'Search gigs...' : 'Search applications...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            {activeTab === 'open' && (
              <div className="flex rounded-lg border border-white/5 bg-zinc-900/50 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('rounded p-1.5 transition-colors', viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-600')}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('rounded p-1.5 transition-colors', viewMode === 'list' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-600')}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'open' && (
          <>
            {openGigs.length === 0 ? (
              <Card glass className="p-12 text-center">
                <Zap className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-zinc-400 font-medium">No open gigs match your search</p>
                <p className="mt-1 text-xs text-zinc-600">Try different keywords or check back later.</p>
              </Card>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col gap-3',
              )}>
                {openGigs.map(gig => {
                  const app = streamerApps.find(a => a.gigId === gig.id)
                  return <GigCard key={gig.id} gig={gig} hasApplied={!!app} appStatus={app?.status} />
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'applications' && (
          <>
            {filteredApps.length === 0 ? (
              <Card glass className="p-12 text-center">
                <Clock className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-zinc-400 font-medium">No applications yet</p>
                <p className="mt-1 text-xs text-zinc-600">Browse open gigs and apply to get started.</p>
                <Button className="mt-4" onClick={() => setActiveTab('open')}>Browse Gigs</Button>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredApps.map(app => (
                  <ApplicationCard key={app.id} app={app} gig={gigs.find(g => g.id === app.gigId)} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {filteredApps.length === 0 ? (
              <Card glass className="p-12 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-zinc-400 font-medium">No completed gigs yet</p>
                <p className="mt-1 text-xs text-zinc-600">Your completed gigs will show up here.</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredApps.map(app => (
                  <ApplicationCard key={app.id} app={app} gig={gigs.find(g => g.id === app.gigId)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}