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
import { cn, formatCurrency, getGameIcon } from '@/lib/utils'
import type { Gig } from '@/lib/types'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  DollarSign,
  Filter,
  Gamepad2,
  HeartHandshake,
  MessageSquare,
  PlayCircle,
  Quote,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
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

const heroGigs = [
  { title: 'Roblox horror launch stream', game: 'Roblox', budget: '$450', meta: '8 applicants', tone: 'green' },
  { title: 'Fortnite UEFN map spotlight', game: 'Fortnite', budget: '$300', meta: '12 applicants', tone: 'cyan' },
  { title: 'Steam Next Fest demo run', game: 'Steam', budget: '$650', meta: '5 applicants', tone: 'yellow' },
]

function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-black">
      <Image
        src="/marketplace-hero.png"
        alt="Marketplace dashboard preview for game creators hiring streamers"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.88)_38%,rgba(0,0,0,0.48)_72%,#000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.68)_88%,#000_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.96fr_1.04fr] lg:py-14">
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/streamer">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
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

          <FadeIn delay={400}>
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
          <div className="relative ml-auto w-full max-w-[560px] rounded-xl border border-white/[0.08] bg-zinc-950/86 p-4 shadow-2xl shadow-black/50 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <p className="text-label text-zinc-500">Marketplace Pulse</p>
                <p className="mt-1 text-caption font-semibold text-zinc-50">Live paid campaigns</p>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-green/10 px-2.5 py-1 text-small font-medium text-green">
                <Radio className="h-3.5 w-3.5" />
                Open now
              </div>
            </div>

            <div className="grid gap-3">
              {heroGigs.map((gig) => (
                <div key={gig.title} className="rounded-lg border border-white/[0.06] bg-black/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <PlayCircle
                          className={cn(
                            'h-4 w-4',
                            gig.tone === 'green' && 'text-green',
                            gig.tone === 'cyan' && 'text-cyan',
                            gig.tone === 'yellow' && 'text-yellow',
                          )}
                        />
                        <p className="text-caption font-semibold text-zinc-50">{gig.title}</p>
                      </div>
                      <p className="mt-1 text-small text-zinc-500">{gig.game} campaign</p>
                    </div>
                    <Badge variant="green" size="sm">{gig.budget}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-small text-zinc-500">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {gig.meta}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> This week</span>
                    <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> Fixed</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Creator fit', value: '92%', icon: CheckCircle2 },
                { label: 'Avg budget', value: '$420', icon: DollarSign },
                { label: 'Filtered', value: '34', icon: Filter },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-zinc-900/80 p-3">
                  <item.icon className="mb-2 h-4 w-4 text-zinc-400" />
                  <p className="text-caption font-semibold text-zinc-50">{item.value}</p>
                  <p className="text-small text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
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
                          <span className="shrink-0 text-2xl">{getGameIcon(gig.gameType)}</span>
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
      <HowItWorks />
      <StatsBar />
      <FeaturedGigs />
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
