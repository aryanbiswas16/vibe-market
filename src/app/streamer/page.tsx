'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { getGigs, getMyApplications } from '@/lib/api-client'
import {
  cn,
  formatCurrency,
  timeAgo,
  getGameIcon,
  formatNumber,
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
  ArrowUpRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
} from 'lucide-react'
import type { Gig, Application } from '@/lib/types'

type TabId = 'open' | 'applications' | 'completed'

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'open', label: 'Open Gigs', icon: <Zap className="h-4 w-4" /> },
  { id: 'applications', label: 'My Applications', icon: <Clock className="h-4 w-4" /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" /> },
]

const GAME_TYPES = ['all', 'steam', 'fortnite', 'roblox', 'minecraft', 'other'] as const
const PLATFORMS = ['all', 'twitch', 'youtube', 'both'] as const

type SortKey = 'newest' | 'budget_high' | 'budget_low' | 'applicants'

function GigCard({ gig, hasApplied, appStatus }: { gig: Gig; hasApplied?: boolean; appStatus?: string }) {
  return (
    <Link href={`/gig/${gig.id}`} className="group block">
      <Card hover className="h-full">
        <CardContent className="flex flex-col gap-4 p-6">
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

          <p className="text-small text-zinc-500 line-clamp-2 leading-relaxed">{gig.description}</p>

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

          <div className="flex items-center justify-between shadow-divider pt-3 text-small text-zinc-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{gig.applicants} applicants</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{gig.payoutType === 'fixed' ? 'Fixed' : gig.payoutType === 'per_hour' ? 'Per Hour' : 'Per Viewer'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{gig.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between shadow-divider pt-3">
            <div className="flex items-center gap-2">
              <Avatar src={gig.devAvatar} name={gig.devName} size="sm" />
              <span className="text-small text-zinc-400">{gig.devName}</span>
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

function ApplicationCard({ app, gig }: { app: Application; gig?: Gig }) {
  if (!gig) return null
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>
          <div className="min-w-0">
            <p className="text-caption font-semibold text-zinc-50 line-clamp-1">{gig.title}</p>
            <p className="text-small text-zinc-500">{gig.game}</p>
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

      <p className="mt-3 text-small text-zinc-500 leading-relaxed line-clamp-2">{app.message}</p>

      <div className="mt-4 flex items-center justify-between shadow-divider pt-3 text-small text-zinc-500">
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

function SignUpPrompt() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full surface-3 mb-4">
          <Sparkles className="h-7 w-7 text-brand" />
        </div>
        <h2 className="text-heading text-zinc-50 mb-2">Welcome to Vibe</h2>
        <p className="text-body text-zinc-500 mb-6">Sign up or log in to start finding streamer gigs and manage your applications.</p>
        <Link href="/auth">
          <Button variant="primary" className="w-full">Sign Up / Log In</Button>
        </Link>
      </Card>
    </div>
  )
}

function FilterPanel({
  gameType,
  platform,
  budgetMin,
  budgetMax,
  sortBy,
  show,
  onGameTypeChange,
  onPlatformChange,
  onBudgetMinChange,
  onBudgetMaxChange,
  onSortByChange,
  onClose,
}: {
  gameType: string
  platform: string
  budgetMin: string
  budgetMax: string
  sortBy: SortKey
  show: boolean
  onGameTypeChange: (v: string) => void
  onPlatformChange: (v: string) => void
  onBudgetMinChange: (v: string) => void
  onBudgetMaxChange: (v: string) => void
  onSortByChange: (v: SortKey) => void
  onClose: () => void
}) {
  if (!show) return null

  return (
    <Card className="mb-6 p-4">
      <div className="flex items-center justify-between mb-4 sm:hidden">
        <span className="text-label text-zinc-400">Filters</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Close filters">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:flex-wrap sm:gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-label text-zinc-400">Game Type</span>
          <div className="flex flex-wrap gap-1.5">
            {GAME_TYPES.map(gt => (
              <button
                key={gt}
                onClick={() => onGameTypeChange(gt)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-small font-medium transition-all duration-200',
                  gameType === gt
                    ? 'bg-brand text-white'
                    : 'surface-2 text-zinc-500 hover:text-zinc-300 hover:surface-3',
                )}
                aria-label={`Filter by ${gt}`}
              >
                {gt === 'all' ? 'All' : gt.charAt(0).toUpperCase() + gt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label text-zinc-400">Platform</span>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => onPlatformChange(p)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-small font-medium transition-all duration-200',
                  platform === p
                    ? 'bg-brand text-white'
                    : 'surface-2 text-zinc-500 hover:text-zinc-300 hover:surface-3',
                )}
                aria-label={`Filter by platform ${p}`}
              >
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label text-zinc-400">Budget Range</span>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Min"
              value={budgetMin}
              onChange={e => onBudgetMinChange(e.target.value)}
              className="h-8 w-20 text-small"
              type="number"
              min={0}
              aria-label="Minimum budget"
            />
            <span className="text-small text-zinc-600">—</span>
            <Input
              placeholder="Max"
              value={budgetMax}
              onChange={e => onBudgetMaxChange(e.target.value)}
              className="h-8 w-20 text-small"
              type="number"
              min={0}
              aria-label="Maximum budget"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label text-zinc-400">Sort By</span>
          <select
            value={sortBy}
            onChange={e => onSortByChange(e.target.value as SortKey)}
            className="h-8 rounded-md bg-zinc-950 px-2.5 text-small text-zinc-300 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] focus:outline-none focus:shadow-[0_0_0_1px_rgba(255,69,0,0.5)]"
            aria-label="Sort gigs by"
          >
            <option value="newest">Newest</option>
            <option value="budget_high">Budget: High</option>
            <option value="budget_low">Budget: Low</option>
            <option value="applicants">Most Applicants</option>
          </select>
        </div>
      </div>
    </Card>
  )
}

export default function StreamerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<TabId>('open')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [gameType, setGameType] = useState('all')
  const [platform, setPlatform] = useState('all')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // API data state
  const [allGigs, setAllGigs] = useState<Gig[]>([])
  const [allApps, setAllApps] = useState<Application[]>([])
  const [fetching, setFetching] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [isLoading, user, router])

  // Fetch user data from API
  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        const { getMe } = await import('@/lib/api-client')
        const me = await getMe()
        setUserData(me)
      } catch {
        setUserData(user)
      }
    }
    load()
  }, [user])

  // Fetch gigs and applications
  const fetchData = useCallback(async () => {
    if (!user) return
    setFetching(true)
    try {
      const [gigsRes, apps] = await Promise.all([
        getGigs({ limit: '100' }),
        getMyApplications(),
      ])
      setAllGigs(gigsRes.gigs as Gig[])
      setAllApps(apps as Application[])
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setFetching(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const currentStreamer = userData || user

  const streamerApps = useMemo(() => {
    if (!currentStreamer) return []
    return allApps.filter(a => a.streamerId === currentStreamer.id)
  }, [allApps, currentStreamer])

  const completedApps = streamerApps.filter(a => a.status === 'completed')
  const totalEarnings = completedApps.reduce((sum, app) => {
    const g = allGigs.find(g => g.id === app.gigId)
    return sum + (g?.budget ?? 0)
  }, 0)

  const openGigs = useMemo(() => {
    let filtered = allGigs.filter(g => g.status === 'open')

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

    if (gameType !== 'all') {
      filtered = filtered.filter(g => g.gameType === gameType)
    }

    if (platform !== 'all') {
      filtered = filtered.filter(g => g.platform === platform)
    }

    const min = budgetMin ? parseFloat(budgetMin) : 0
    const max = budgetMax ? parseFloat(budgetMax) : Infinity
    if (min > 0 || (budgetMax !== '' && max < Infinity)) {
      filtered = filtered.filter(g => g.budget >= min && g.budget <= max)
    }

    const sorted = [...filtered]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'budget_high':
        sorted.sort((a, b) => b.budget - a.budget)
        break
      case 'budget_low':
        sorted.sort((a, b) => a.budget - b.budget)
        break
      case 'applicants':
        sorted.sort((a, b) => b.applicants - a.applicants)
        break
    }

    return sorted
  }, [allGigs, search, gameType, platform, budgetMin, budgetMax, sortBy])

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
        const g = allGigs.find(gg => gg.id === a.gigId)
        return g?.title.toLowerCase().includes(q) || g?.game.toLowerCase().includes(q)
      })
    }
    return apps
  }, [activeTab, search, streamerApps, allGigs])

  if (isLoading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-body text-zinc-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <AppHeader />
        <SignUpPrompt />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar src={currentStreamer.avatar || currentStreamer.image} name={currentStreamer.name} size="xl" status="online" />
            <div>
              <h1 className="text-heading text-zinc-50">Hey, {currentStreamer.name}</h1>
              <p className="text-body text-zinc-500">@{currentStreamer.handle} &middot; {currentStreamer.bio}</p>
              <div className="mt-2 flex items-center gap-3 text-small text-zinc-500">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {formatNumber(currentStreamer.followers ?? 0)} followers</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {currentStreamer.rating ?? 0} avg rating</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {formatNumber(currentStreamer.avgViewers ?? 0)} avg viewers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-green">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-small text-zinc-500">Completed</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{currentStreamer.totalGigsCompleted ?? 0}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-brand">
              <DollarSign className="h-4 w-4" />
              <span className="text-small text-zinc-500">Earnings</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{formatCurrency(totalEarnings)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-yellow">
              <Star className="h-4 w-4" />
              <span className="text-small text-zinc-500">Rating</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{currentStreamer.rating ?? 0}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-cyan">
              <Zap className="h-4 w-4" />
              <span className="text-small text-zinc-500">Gigs Available</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{allGigs.filter(g => g.status === 'open').length}</p>
          </Card>
        </div>

        <div className="mb-8">
          <VibeScore score={currentStreamer.vibeScore ?? 0} />
        </div>

        {/* Stripe Connect onboarding hint */}
        <div className="mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-yellow mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-label text-zinc-400">Get Paid</span>
            </div>
            <p className="text-small text-zinc-500 mb-3">
              Connect Stripe to receive payments for completed gigs.
            </p>
            <Button size="sm" variant="secondary" className="w-full gap-1.5 text-small" disabled>
              <DollarSign className="h-3.5 w-3.5" /> Connect Stripe (Coming Soon)
            </Button>
          </Card>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg surface-2 p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-small font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-brand text-white'
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
                className="pl-9 h-9 text-small"
                aria-label={activeTab === 'open' ? 'Search gigs' : 'Search applications'}
              />
            </div>
            {activeTab === 'open' && (
              <>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-small font-medium transition-all duration-200 surface-2',
                    showFilters
                      ? 'shadow-[0_0_0_1px_rgba(255,69,0,0.5)] text-brand'
                      : 'text-zinc-500 hover:text-zinc-300',
                  )}
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
                <div className="flex rounded-lg surface-2 p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('rounded p-1.5 transition-colors', viewMode === 'grid' ? 'surface-3 text-zinc-100' : 'text-zinc-600')}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('rounded p-1.5 transition-colors', viewMode === 'list' ? 'surface-3 text-zinc-100' : 'text-zinc-600')}
                    aria-label="List view"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {activeTab === 'open' && (
          <FilterPanel
            gameType={gameType}
            platform={platform}
            budgetMin={budgetMin}
            budgetMax={budgetMax}
            sortBy={sortBy}
            show={showFilters}
            onGameTypeChange={setGameType}
            onPlatformChange={setPlatform}
            onBudgetMinChange={setBudgetMin}
            onBudgetMaxChange={setBudgetMax}
            onSortByChange={setSortBy}
            onClose={() => setShowFilters(false)}
          />
        )}

        {activeTab === 'open' && (
          <>
            {openGigs.length === 0 ? (
              <Card className="p-12 text-center">
                <Zap className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-caption text-zinc-400 font-medium">No open gigs match your filters</p>
                <p className="mt-1 text-small text-zinc-600">Try different keywords or adjust your filters.</p>
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
              <Card className="p-12 text-center">
                <Clock className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-caption text-zinc-400 font-medium">No applications yet</p>
                <p className="mt-1 text-small text-zinc-600">Browse open gigs and apply to get started.</p>
                <Button className="mt-4" onClick={() => setActiveTab('open')}>Browse Gigs</Button>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredApps.map(app => (
                  <ApplicationCard key={app.id} app={app} gig={allGigs.find(g => g.id === app.gigId)} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {filteredApps.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-caption text-zinc-400 font-medium">No completed gigs yet</p>
                <p className="mt-1 text-small text-zinc-600">Your completed gigs will show up here.</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredApps.map(app => (
                  <ApplicationCard key={app.id} app={app} gig={allGigs.find(g => g.id === app.gigId)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
