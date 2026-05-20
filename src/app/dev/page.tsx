'use client'

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { DataStore, closeGig } from '@/lib/data'
import type { Gig } from '@/lib/types'
import {
  cn,
  formatCurrency,
  timeAgo,
  getGameIcon,
  getStatusColor,
  getPayoutLabel,
  formatNumber,
} from '@/lib/utils'
import {
  Search,
  Users,
  DollarSign,
  Star,
  Zap,
  Plus,
  Sparkles,
  Eye,
  XCircle,
  Clock,
  Gamepad2,
  Lightbulb,
  BarChart3,
  Loader2,
} from 'lucide-react'

const quickStartSteps = [
  { icon: <Gamepad2 className="h-5 w-5" />, title: 'Post a Gig', desc: 'Describe your game, set budget & requirements.' },
  { icon: <Users className="h-5 w-5" />, title: 'Review Streamers', desc: 'Browse profiles, vibe scores, and past work.' },
  { icon: <BarChart3 className="h-5 w-5" />, title: 'Track Results', desc: 'See views, clips, and engagement from your gigs.' },
]

function QuickStartGuide() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow" />
        <h3 className="text-caption font-bold text-zinc-50">Quick Start Guide</h3>
      </div>
      <div className="space-y-4">
        {quickStartSteps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg surface-3 text-zinc-400">
              {step.icon}
            </div>
            <div>
              <p className="text-caption font-medium text-zinc-50">{step.title}</p>
              <p className="text-small text-zinc-500">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/dev/post">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" /> Post Your First Gig
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function GigRow({ gig, onView, onClose }: { gig: Gig; onView: () => void; onClose?: () => void }) {
  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <p className="text-caption font-semibold text-zinc-50 truncate">{gig.title}</p>
            <span className={cn('text-small font-medium', getStatusColor(gig.status))}>
              &bull; {gig.status.replace('_', ' ')}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-small text-zinc-500">
            <span>{gig.game}</span>
            <span>&middot;</span>
            <span>{gig.platform === 'both' ? 'Twitch + YouTube' : gig.platform === 'twitch' ? 'Twitch' : 'YouTube'}</span>
            <span>&middot;</span>
            <span>{timeAgo(gig.createdAt)}</span>
          </div>
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          <div className="text-right">
            <p className="text-caption font-bold text-zinc-50">{formatCurrency(gig.budget)}</p>
            <p className="text-small text-zinc-500">{getPayoutLabel(gig.payoutType)}</p>
          </div>
          <div className="text-right">
            <p className="text-caption font-bold text-zinc-50">{gig.applicants}</p>
            <p className="text-small text-zinc-500">applicants</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="gap-1" onClick={onView}>
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Button>
          {gig.status === 'open' && (
            <Button size="sm" variant="ghost" className="gap-1 text-red-400 hover:text-red-300" onClick={onClose}>
              <XCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function DevDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  const allGigs = useSyncExternalStore(DataStore.subscribe, DataStore.getGigs, DataStore.getServerSnapshot)
  const allApps = useSyncExternalStore(DataStore.subscribe, DataStore.getApplications, DataStore.getAppServerSnapshot)

  const myGigs = useMemo(() => {
    if (!user) return []
    let filtered = allGigs.filter(g => g.devId === user.id)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        g =>
          g.title.toLowerCase().includes(q) ||
          g.game.toLowerCase().includes(q) ||
          g.tags.some(t => t.toLowerCase().includes(q)),
      )
    }
    return filtered
  }, [allGigs, search, user])

  const totalGigsPosted = user ? allGigs.filter(g => g.devId === user.id).length : 0
  const totalApplicants = user
    ? allGigs
        .filter(g => g.devId === user.id)
        .reduce((sum, g) => sum + g.applicants, 0)
    : 0
  const totalSpent = user
    ? allGigs
        .filter(g => g.devId === user.id && (g.status === 'completed' || g.status === 'in_progress'))
        .reduce((sum, g) => sum + g.budget, 0)
    : 0
  const avgRating = user?.rating ?? 0

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-body text-zinc-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <header className="shadow-divider sticky top-0 z-50 bg-black">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand" />
              <span className="text-caption font-bold text-zinc-50">Vibe</span>
            </Link>
          </div>
        </header>
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-6 pt-24 text-center">
          <Gamepad2 className="mb-4 h-12 w-12 text-zinc-700" />
          <h1 className="text-heading text-zinc-50">Dev Dashboard</h1>
          <p className="mt-2 text-body text-zinc-500">Sign in or create an account to manage your gigs.</p>
          <Link href="/auth">
            <Button className="mt-6 gap-2">
              <Sparkles className="h-4 w-4" /> Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="shadow-divider sticky top-0 z-50 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <span className="text-caption font-bold text-zinc-50">Vibe</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/streamer">
              <Button variant="ghost" size="sm">Streamer Portal</Button>
            </Link>
            <Avatar src={user.avatar} name={user.name} size="sm" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} name={user.name} size="xl" />
            <div>
              <h1 className="text-heading text-zinc-50">Dev Dashboard</h1>
              <p className="text-body text-zinc-500">{user.name} &middot; @{user.handle}</p>
              <p className="mt-1 text-small text-zinc-600 max-w-lg">{user.bio}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-brand">
              <Gamepad2 className="h-4 w-4" />
              <span className="text-small text-zinc-500">Gigs Posted</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{totalGigsPosted}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-green">
              <DollarSign className="h-4 w-4" />
              <span className="text-small text-zinc-500">Total Spent</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{formatCurrency(totalSpent)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-cyan">
              <Users className="h-4 w-4" />
              <span className="text-small text-zinc-500">Total Applicants</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{totalApplicants}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-yellow">
              <Star className="h-4 w-4" />
              <span className="text-small text-zinc-500">Rating</span>
            </div>
            <p className="mt-1 text-heading text-zinc-50">{avgRating}</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-heading text-zinc-50">Your Gigs</h2>
                <p className="text-small text-zinc-500">Manage all your posted gigs in one place.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-52">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
                  <Input
                    placeholder="Search your gigs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 h-9 text-small"
                  />
                </div>
                <Link href="/dev/post">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> New Gig
                  </Button>
                </Link>
              </div>
            </div>

            {myGigs.length === 0 ? (
              <Card className="p-12 text-center">
                <Gamepad2 className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-caption text-zinc-400 font-medium">
                  {search ? 'No gigs match your search' : 'No gigs posted yet'}
                </p>
                <p className="mt-1 text-small text-zinc-600">
                  {search ? 'Try different keywords.' : 'Post your first gig and get streamers playing your game.'}
                </p>
                {!search && (
                  <Link href="/dev/post">
                    <Button className="mt-4 gap-2">
                      <Plus className="h-4 w-4" /> Post a Gig
                    </Button>
                  </Link>
                )}
              </Card>
            ) : (
              <div className="space-y-3">
                {myGigs.map(gig => (
                  <GigRow
                    key={gig.id}
                    gig={gig}
                    onView={() => router.push(`/gig/${gig.id}?dev=true`)}
                    onClose={() => closeGig(gig.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {totalGigsPosted === 0 ? (
              <QuickStartGuide />
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-brand" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between shadow-divider pb-3">
                      <span className="text-small text-zinc-500">Open Gigs</span>
                      <span className="text-caption font-bold text-zinc-50">{myGigs.filter(g => g.status === 'open').length}</span>
                    </div>
                    <div className="flex items-center justify-between shadow-divider pb-3">
                      <span className="text-small text-zinc-500">In Progress</span>
                      <span className="text-caption font-bold text-zinc-50">{myGigs.filter(g => g.status === 'in_progress').length}</span>
                    </div>
                    <div className="flex items-center justify-between shadow-divider pb-3">
                      <span className="text-small text-zinc-500">Completed</span>
                      <span className="text-caption font-bold text-zinc-50">{myGigs.filter(g => g.status === 'completed').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-small text-zinc-500">Avg Budget</span>
                      <span className="text-caption font-bold text-zinc-50">
                        {myGigs.length > 0 ? formatCurrency(Math.round(myGigs.reduce((s, g) => s + g.budget, 0) / myGigs.length)) : '$0'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Link href="/dev/post">
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" /> Post New Gig
                  </Button>
                </Link>
              </>
            )}

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow" />
                <h3 className="text-label text-zinc-400">Tips</h3>
              </div>
              <ul className="space-y-2 text-small text-zinc-500">
                <li className="flex gap-2">
                  <span className="text-brand">&rarr;</span>
                  Include specific requirements for better applicants
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">&rarr;</span>
                  Streamers with 80+ vibe score are top performers
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">&rarr;</span>
                  Respond to applications within 48 hours
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">&rarr;</span>
                  Per-viewer payouts attract the most applicants
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
