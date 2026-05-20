'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { devs, gigs, applications } from '@/lib/data'
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
  Search,
  Users,
  DollarSign,
  Star,
  Zap,
  Plus,
  ArrowUpRight,
  Sparkles,
  Eye,
  XCircle,
  Clock,
  Gamepad2,
  Lightbulb,
  Rocket,
  BarChart3,
  ExternalLink,
} from 'lucide-react'
import type { Gig } from '@/lib/types'

/* ────────── Mock "current dev" ────────── */
const currentDev = devs[0] // NeonForge

/* ────────── Quick Start Guide ────────── */
const quickStartSteps = [
  { icon: <Gamepad2 className="h-5 w-5" />, title: 'Post a Gig', desc: 'Describe your game, set budget & requirements.' },
  { icon: <Users className="h-5 w-5" />, title: 'Review Streamers', desc: 'Browse profiles, vibe scores, and past work.' },
  { icon: <BarChart3 className="h-5 w-5" />, title: 'Track Results', desc: 'See views, clips, and engagement from your gigs.' },
]

function QuickStartGuide() {
  return (
    <Card glass glow className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-[#FFE600]" />
        <h3 className="text-sm font-bold text-zinc-100">Quick Start Guide</h3>
      </div>
      <div className="space-y-4">
        {quickStartSteps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
              {step.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">{step.title}</p>
              <p className="text-xs text-zinc-500">{step.desc}</p>
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

/* ────────── Gig Row ────────── */
function GigRow({ gig, onView }: { gig: Gig; onView: () => void }) {
  const appCount = applications.filter(a => a.gigId === gig.id).length
  return (
    <Card glass hover className="p-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl shrink-0">{getGameIcon(gig.gameType)}</span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-zinc-100 truncate">{gig.title}</p>
            <span className={cn('text-xs font-medium', getStatusColor(gig.status))}>
              ● {gig.status.replace('_', ' ')}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
            <span>{gig.game}</span>
            <span>·</span>
            <span>{getPlatformLabel(gig.platform)}</span>
            <span>·</span>
            <span>{timeAgo(gig.createdAt)}</span>
          </div>
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-100">{formatCurrency(gig.budget)}</p>
            <p className="text-[10px] text-zinc-500">{getPayoutLabel(gig.payoutType)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-100">{appCount}</p>
            <p className="text-[10px] text-zinc-500">applicants</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="gap-1" onClick={onView}>
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Button>
          {gig.status === 'open' && (
            <Button size="sm" variant="ghost" className="gap-1 text-red-400 hover:text-red-300">
              <XCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ────────── Dev Dashboard ────────── */
export default function DevDashboard() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  // Gigs posted by this dev
  const myGigs = useMemo(() => {
    let filtered = gigs.filter(g => g.devId === currentDev.id)
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
  }, [search])

  // Stats
  const totalGigsPosted = gigs.filter(g => g.devId === currentDev.id).length
  const totalApplicants = gigs
    .filter(g => g.devId === currentDev.id)
    .reduce((sum, g) => sum + g.applicants, 0)
  const totalSpent = gigs
    .filter(g => g.devId === currentDev.id && (g.status === 'completed' || g.status === 'in_progress'))
    .reduce((sum, g) => sum + g.budget, 0)
  const avgRating = currentDev.rating

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
            <Link href="/streamer">
              <Button variant="ghost" size="sm">Streamer Portal</Button>
            </Link>
            <Avatar src={currentDev.avatar} name={currentDev.name} size="sm" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ── Hero ── */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar src={currentDev.avatar} name={currentDev.name} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Dev Dashboard</h1>
              <p className="text-sm text-zinc-500">{currentDev.name} · @{currentDev.handle}</p>
              <p className="mt-1 text-xs text-zinc-600 max-w-lg">{currentDev.bio}</p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#FF4500]">
              <Gamepad2 className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Gigs Posted</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{totalGigsPosted}</p>
          </Card>
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#00FF88]">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Total Spent</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{formatCurrency(totalSpent)}</p>
          </Card>
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#00D4FF]">
              <Users className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Total Applicants</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{totalApplicants}</p>
          </Card>
          <Card glass className="p-4">
            <div className="flex items-center gap-2 text-[#FFE600]">
              <Star className="h-4 w-4" />
              <span className="text-xs text-zinc-500">Rating</span>
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-100">{avgRating}</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Gigs List */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Your Gigs</h2>
                <p className="text-xs text-zinc-500">Manage all your posted gigs in one place.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-52">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
                  <Input
                    placeholder="Search your gigs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Link href="/dev/post">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> New Gig
                  </Button>
                </Link>
              </div>
            </div>

            {/* Gig List */}
            {myGigs.length === 0 ? (
              <Card glass className="p-12 text-center">
                <Gamepad2 className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <p className="text-zinc-400 font-medium">
                  {search ? 'No gigs match your search' : 'No gigs posted yet'}
                </p>
                <p className="mt-1 text-xs text-zinc-600">
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
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Start or Summary */}
            {totalGigsPosted === 0 ? (
              <QuickStartGuide />
            ) : (
              <>
                <Card glass>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-[#FF4500]" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs text-zinc-500">Open Gigs</span>
                      <span className="text-sm font-bold text-zinc-100">{myGigs.filter(g => g.status === 'open').length}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs text-zinc-500">In Progress</span>
                      <span className="text-sm font-bold text-zinc-100">{myGigs.filter(g => g.status === 'in_progress').length}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs text-zinc-500">Completed</span>
                      <span className="text-sm font-bold text-zinc-100">{myGigs.filter(g => g.status === 'completed').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Avg Budget</span>
                      <span className="text-sm font-bold text-zinc-100">
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

            {/* Tips */}
            <Card glass className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-[#FFE600]" />
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Tips</h3>
              </div>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li className="flex gap-2">
                  <span className="text-[#FF4500]">→</span>
                  Include specific requirements for better applicants
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FF4500]">→</span>
                  Streamers with 80+ vibe score are top performers
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FF4500]">→</span>
                  Respond to applications within 48 hours
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FF4500]">→</span>
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