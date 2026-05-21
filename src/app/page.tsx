'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getGigs } from '@/lib/api-client'
import { cn, formatCurrency } from '@/lib/utils'
import type { Gig } from '@/lib/types'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  CreditCard,
  DollarSign,
  Gamepad2,
  HeartHandshake,
  MessageSquare,
  PlayCircle,
  Quote,
  Radio,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Shield,
  Clock,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'

function useInView() {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  const callbackRef = useCallback((node: HTMLElement | null) => setRef(node), [])

  useEffect(() => {
    if (!ref) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(ref)
    return () => obs.disconnect()
  }, [ref])

  return { ref: callbackRef, inView }
}

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700', inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const marketplaceHighlights = [
  { icon: BriefcaseBusiness, label: 'Open gigs', value: '128' },
  { icon: Radio, label: 'Live creators', value: '4.8K' },
  { icon: ShieldCheck, label: 'Escrow-ready', value: '100%' },
  { icon: MessageSquare, label: 'Avg reply', value: '< 6h' },
]

const popularSearches = ['Roblox launch', 'Steam demo', 'UEFN map', 'Cozy indie', 'Horror playtest']

const categoryBlocks = [
  {
    title: 'Launch Campaigns',
    desc: 'Paid streams for trailers, demos, release weeks, and wishlists.',
    icon: Rocket,
    color: 'text-brand',
    href: '/streamer',
  },
  {
    title: 'Playtests',
    desc: 'Find creators who can stress test loops, onboarding, and retention.',
    icon: Gamepad2,
    color: 'text-cyan',
    href: '/streamer',
  },
  {
    title: 'Indie Spotlights',
    desc: 'Creator-led discovery for Steam, itch, Roblox, Minecraft, and UEFN.',
    icon: Sparkles,
    color: 'text-yellow',
    href: '/dev/post',
  },
  {
    title: 'Creator Bounties',
    desc: 'Brief-based gigs with budgets, deliverables, applicants, and payouts.',
    icon: Trophy,
    color: 'text-green',
    href: '/dev/post',
  },
]

function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-black">
      <Image
        src="/indie-game-wall.png"
        alt="Original indie game scenes available for streamer campaigns"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-22"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(0,212,255,0.12),transparent_30%),linear-gradient(90deg,#000_0%,rgba(0,0,0,0.9)_46%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.66)_88%,#000_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green/70 to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[86vh] max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[0.86fr_1.14fr] lg:py-14">
        <div className="max-w-2xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-950/80 px-3 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              <span className="text-small font-medium text-zinc-300">Streamer creator marketplace</span>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="mt-7 max-w-2xl text-[48px] font-semibold leading-[0.98] tracking-normal text-zinc-50 sm:text-[64px] lg:text-[76px]">
              Hire streamers. Launch games. Pay for real play.
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 max-w-xl text-body text-zinc-300 sm:text-[17px]">
              Vibe is a paid gig marketplace where game creators post campaigns and streamers apply with audience fit, platform stats, and clear payout terms.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-8 max-w-xl rounded-xl border border-white/[0.08] bg-zinc-950/88 p-2 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex min-h-12 flex-1 items-center gap-3 rounded-lg bg-black/60 px-4">
                  <Search className="h-5 w-5 text-green" />
                  <span className="text-body text-zinc-400">Search paid gigs, games, creators...</span>
                </div>
                <Link href="/streamer">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    Search Marketplace <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 px-1 pb-1">
                {popularSearches.map((search) => (
                  <Link key={search} href="/streamer" className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-small text-zinc-400 transition-colors hover:border-green/30 hover:text-green">
                    {search}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={380}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/streamer">
                <Button variant="secondary" size="lg" className="w-full gap-2 sm:w-auto">
                  <Trophy className="h-5 w-5" />
                  Browse Gigs
                </Button>
              </Link>
              <Link href="/dev/post">
                <Button variant="secondary" size="lg" className="w-full gap-2 sm:w-auto">
                  <Gamepad2 className="h-5 w-5" />
                  Post a Gig
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={460}>
            <div className="mt-9 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {marketplaceHighlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/[0.06] bg-zinc-950/70 p-3 backdrop-blur">
                  <item.icon className="mb-2 h-4 w-4 text-brand" />
                  <p className="text-caption font-semibold text-zinc-50">{item.value}</p>
                  <p className="mt-0.5 text-small text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={250}>
          <div className="relative ml-auto hidden w-full max-w-[640px] lg:block">
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_35%_25%,rgba(34,197,94,0.18),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(0,212,255,0.16),transparent_30%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950/70 shadow-2xl shadow-black/50">
              <Image
                src="/indie-game-wall.png"
                alt="Original indie game scenes in a campaign marketplace"
                width={1200}
                height={900}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.82)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-label text-zinc-400">Featured Campaigns</p>
                    <p className="mt-1 max-w-sm text-subheading text-zinc-50">Original worlds ready for streamers, playtests, and launch weeks.</p>
                  </div>
                  <Badge variant="green" size="lg" dot>Live inventory</Badge>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function MarketplaceCategories() {
  return (
    <section className="border-b border-white/[0.05] bg-[#05070b] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="green" className="mb-4">Start with the right campaign</Badge>
              <h2 className="text-display text-zinc-50">Built like a marketplace, not a landing page</h2>
              <p className="mt-3 max-w-2xl text-body text-zinc-500">
                Creators should understand the inventory immediately: launch work, playtests, indie discovery, and bounty-style gigs.
              </p>
            </div>
            <Link href="/dev/post">
              <Button className="gap-2">
                List a Campaign <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryBlocks.map((category, index) => (
            <FadeIn key={category.title} delay={index * 80}>
              <Link href={category.href} className="group block h-full">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.045] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-green/25 hover:bg-white/[0.065]">
                  <div>
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-black/50 shadow-border">
                      <category.icon className={cn('h-6 w-6', category.color)} />
                    </div>
                    <h3 className="text-subheading text-zinc-50">{category.title}</h3>
                    <p className="mt-2 text-small leading-relaxed text-zinc-500">{category.desc}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4 text-small text-zinc-500">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function GameTypeMark({ type }: { type: Gig['gameType'] }) {
  const Icon = type === 'steam' ? Code2 : type === 'fortnite' ? Rocket : type === 'roblox' ? Sparkles : type === 'minecraft' ? Shield : Gamepad2
  const color = type === 'steam' ? 'text-brand' : type === 'fortnite' ? 'text-cyan' : type === 'roblox' ? 'text-pink' : type === 'minecraft' ? 'text-green' : 'text-yellow'

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-black/45">
      <Icon className={cn('h-5 w-5', color)} />
    </span>
  )
}

function FeaturedGigs() {
  const [openGigs, setOpenGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGigs({ status: 'open', limit: '6', sortBy: 'newest' })
      .then((res) => setOpenGigs(res.gigs as Gig[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="primary" className="mb-4">Live Marketplace</Badge>
              <h2 className="text-display text-zinc-50">Featured Paid Gigs</h2>
              <p className="mt-3 max-w-2xl text-body text-zinc-500">
                A marketplace should show inventory quickly: budget, game, creator, applicant demand, and payout style.
              </p>
            </div>
            <Link href="/streamer">
              <Button variant="secondary" size="sm">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-xl surface-2" />)
          ) : openGigs.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <p className="text-body text-zinc-500">No open gigs available right now.</p>
            </Card>
          ) : (
            openGigs.slice(0, 6).map((gig, i) => (
              <FadeIn key={gig.id} delay={i * 80}>
                <Link href={`/gig/${gig.id}`} className="group block">
                  <Card hover className="h-full">
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <GameTypeMark type={gig.gameType} />
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-caption font-semibold text-zinc-50 transition-colors group-hover:text-brand">{gig.title}</p>
                            <p className="text-small text-zinc-500">{gig.game}</p>
                          </div>
                        </div>
                        <Badge variant="green" size="sm">{formatCurrency(gig.budget)}</Badge>
                      </div>

                      <p className="line-clamp-2 text-small leading-relaxed text-zinc-500">{gig.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={gig.gameType === 'fortnite' ? 'cyan' : gig.gameType === 'roblox' ? 'pink' : gig.gameType === 'minecraft' ? 'green' : 'primary'} size="sm">
                          {gig.gameType}
                        </Badge>
                        {gig.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="outline" size="sm">{tag}</Badge>)}
                      </div>

                      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-4 text-small text-zinc-500">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {gig.applicants}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {gig.payoutType === 'fixed' ? 'Fixed' : gig.payoutType === 'per_hour' ? 'Hourly' : 'Viewer'}</span>
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {gig.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

const streamerSteps = [
  { icon: Rocket, title: 'Browse Like a Marketplace', desc: 'Filter by game, platform, payout type, timing, and budget before committing to a campaign.' },
  { icon: HeartHandshake, title: 'Apply With Context', desc: 'Send a pitch that includes fit, audience, and stream plan instead of negotiating in DMs.' },
  { icon: DollarSign, title: 'Stream and Get Paid', desc: 'Complete the agreed play session and track fixed, hourly, or per-viewer payouts from one workspace.' },
]

const devSteps = [
  { icon: Gamepad2, title: 'Post a Campaign', desc: 'Define the game, deliverables, creator requirements, budget, and preferred platforms in minutes.' },
  { icon: Users, title: 'Compare Applicants', desc: 'Review streamer profiles by audience size, vibe score, past work, and game fit.' },
  { icon: BarChart3, title: 'Track Results', desc: 'Keep applicants, status, spend, and campaign outcomes visible after the stream goes live.' },
]

function HowItWorks() {
  return (
    <section className="relative border-b border-white/[0.04] py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12 max-w-2xl">
            <Badge variant="cyan" className="mb-4">Marketplace Workflow</Badge>
            <h2 className="text-display text-zinc-50">Built for both sides of paid game discovery</h2>
            <p className="mt-3 text-body text-zinc-500">
              Streamers need trustworthy gigs. Game creators need qualified applicants. The interface should make both jobs obvious.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { title: 'For Streamers', subtitle: 'Find paid games worth streaming', icon: Trophy, color: 'text-brand', steps: streamerSteps, cta: 'Start Browsing', href: '/streamer' },
            { title: 'For Game Creators', subtitle: 'Hire creators who match the game', icon: Gamepad2, color: 'text-cyan', steps: devSteps, cta: 'Post a Gig', href: '/dev/post' },
          ].map((group, index) => (
            <FadeIn key={group.title} delay={index * 120}>
              <Card className="h-full p-7">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg surface-3">
                    <group.icon className={cn('h-5 w-5', group.color)} />
                  </div>
                  <div>
                    <h3 className="text-subheading text-zinc-50">{group.title}</h3>
                    <p className="text-small text-zinc-500">{group.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-5">
                  {group.steps.map((step) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-zinc-400 shadow-border">
                        <step.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-caption font-semibold text-zinc-50">{step.title}</p>
                        <p className="mt-1 text-small leading-relaxed text-zinc-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href={group.href}>
                  <Button variant={index === 0 ? 'primary' : 'secondary'} className="mt-8 w-full">
                    {group.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const [stats, setStats] = useState([
    { value: '$---', label: 'Marketplace budget', icon: DollarSign },
    { value: '---', label: 'Completed gigs', icon: Zap },
    { value: '---', label: 'Active streamers', icon: Users },
    { value: '---', label: 'Avg rating', icon: Star },
  ])

  useEffect(() => {
    async function load() {
      try {
        const gigsRes = await getGigs({ limit: '100' })
        const allGigs = gigsRes.gigs as Gig[]
        const totalGigBudgets = allGigs.reduce((sum, gig) => sum + gig.budget, 0)
        const completedGigs = allGigs.filter((gig) => gig.status === 'completed').length

        setStats([
          { value: `${formatCurrency(totalGigBudgets)}+`, label: 'Marketplace budget', icon: DollarSign },
          { value: `${completedGigs}+`, label: 'Completed gigs', icon: Zap },
          { value: '10+', label: 'Active streamers', icon: Users },
          { value: '4.8', label: 'Avg rating', icon: Star },
        ])
      } catch {}
    }
    load()
  }, [])

  return (
    <section className="py-14 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 80}>
              <Card className="p-5">
                <stat.icon className="mb-4 h-5 w-5 text-brand" />
                <p className="text-heading text-zinc-50">{stat.value}</p>
                <p className="mt-1 text-small text-zinc-500">{stat.label}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    quote: 'Vibe changed how we launch games. We filled a Roblox playtest slate in 48 hours and knew exactly who was streaming.',
    name: 'NeonForge',
    role: 'Dev Studio',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=neonforge',
  },
  {
    quote: 'The gigs are clear before I apply: payout, platform, game, and what the creator actually needs from my stream.',
    name: 'LunaRae',
    role: 'Streamer',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lunarae',
  },
  {
    quote: 'The applicant view gives us enough signal to choose creators who fit the game instead of chasing follower count alone.',
    name: 'VoidInteractive',
    role: 'Horror Game Studio',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=voidinteractive',
  },
]

function Testimonials() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-display text-zinc-50">Signals that make the marketplace credible</h2>
            <p className="mt-3 text-body text-zinc-500">The product tone is direct, operational, and focused on trust, speed, and game fit.</p>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 120}>
              <Card className="h-full p-6">
                <Quote className="mb-5 h-7 w-7 text-brand/45" />
                <p className="mb-6 text-body leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar src={t.avatar} name={t.name} size="sm" />
                  <div>
                    <p className="text-caption font-semibold text-zinc-50">{t.name}</p>
                    <p className="text-small text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const trustItems = [
  {
    icon: Shield,
    title: 'Verified creator profiles',
    desc: 'Platform connections, audience signals, ratings, and completion history make applicants easier to compare.',
  },
  {
    icon: CreditCard,
    title: 'Payment-first workflows',
    desc: 'Campaigns expose budget, payout type, fee assumptions, and release status before work starts.',
  },
  {
    icon: Clock,
    title: 'Launch-week speed',
    desc: 'Campaigns are structured for fast decisions: search, shortlist, hire, stream, and close the loop.',
  },
  {
    icon: Code2,
    title: 'Indie-ready briefs',
    desc: 'Post a trailer push, demo playtest, Roblox activation, UEFN map spotlight, or Steam wishlist campaign.',
  },
]

function TrustAndSafety() {
  return (
    <section className="border-y border-white/[0.05] bg-[linear-gradient(180deg,#05070b,#000)] py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <FadeIn>
          <div className="sticky top-28">
            <Badge variant="cyan" className="mb-4">Trust Layer</Badge>
            <h2 className="text-display text-zinc-50">The stuff a real marketplace needs before money moves.</h2>
            <p className="mt-4 text-body leading-relaxed text-zinc-500">
              The platform has to communicate safety, fit, payout clarity, and campaign quality from the first screen.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { label: 'Avg response', value: 'under 6h' },
                { label: 'Budget clarity', value: '100%' },
                { label: 'Creator fit', value: 'scored' },
                { label: 'Brief quality', value: 'guided' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                  <p className="text-caption font-semibold text-zinc-50">{item.value}</p>
                  <p className="mt-1 text-small text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustItems.map((item, index) => (
            <FadeIn key={item.title} delay={index * 80}>
              <Card className="h-full p-6">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-black/50 shadow-border">
                  <item.icon className="h-5 w-5 text-green" />
                </div>
                <h3 className="text-subheading text-zinc-50">{item.title}</h3>
                <p className="mt-3 text-small leading-relaxed text-zinc-500">{item.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const linkSections = [
    {
      title: 'Platform',
      links: [
        { label: 'For Streamers', href: '/streamer' },
        { label: 'For Developers', href: '/dev' },
        { label: 'Browse Gigs', href: '/streamer' },
        { label: 'Post a Gig', href: '/dev/post' },
      ],
    },
    {
      title: 'Games',
      links: [
        { label: 'Fortnite', href: '/streamer' },
        { label: 'Roblox', href: '/streamer' },
        { label: 'Minecraft', href: '/streamer' },
        { label: 'Steam', href: '/streamer' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Vibe', href: '/about' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Contact', href: '/' },
      ],
    },
  ]

  return (
    <footer className="border-t border-white/[0.05] py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand" />
              <span className="text-caption font-bold text-zinc-50">Vibe</span>
            </div>
            <p className="max-w-xs text-small leading-relaxed text-zinc-600">
              A marketplace for game creators to hire streamers, and for streamers to find paid games worth playing.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { label: 'Streams', icon: Radio },
                { label: 'Videos', icon: PlayCircle },
                { label: 'Community', icon: Users },
                { label: 'Messages', icon: MessageSquare },
              ].map((platform) => (
                <span key={platform.label} title={platform.label} className="flex h-8 w-8 items-center justify-center rounded-lg surface-2 text-zinc-500 transition-all duration-200 hover:surface-3">
                  <platform.icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {linkSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-label text-zinc-400">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-small text-zinc-600 transition-colors hover:text-zinc-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/[0.05] pt-8 sm:flex-row sm:justify-between">
          <p className="text-small text-zinc-700">Copyright 2026 Vibe Marketplace.</p>
          <p className="text-small text-zinc-800">Made for paid game discovery.</p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <AppHeader />
      <MarketplaceHero />
      <MarketplaceCategories />
      <HowItWorks />
      <StatsBar />
      <FeaturedGigs />
      <TrustAndSafety />
      <Testimonials />

      <section className="border-t border-white/[0.05] py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <Badge variant="primary" className="mb-4">Ready to trade attention for playtime?</Badge>
            <h2 className="text-display text-zinc-50">Start from the side of the marketplace that fits you.</h2>
            <p className="mt-4 text-body leading-relaxed text-zinc-500">
              Streamers can browse paid campaigns. Game creators can post a gig and compare applicants in one workspace.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/streamer">
                <Button size="lg">Browse Gigs</Button>
              </Link>
              <Link href="/dev/post">
                <Button variant="secondary" size="lg">Post a Gig</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
