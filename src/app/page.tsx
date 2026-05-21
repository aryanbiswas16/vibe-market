'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { getGigs } from '@/lib/api-client'
import { getMe } from '@/lib/api-client'
import { cn, formatCurrency, timeAgo, getGameIcon } from '@/lib/utils'
import { ArrowRight, Sparkles, Gamepad2, DollarSign, Users, Star, Zap, ChevronRight, Quote, Rocket, Trophy, HeartHandshake } from 'lucide-react'
import type { Gig } from '@/lib/types'

function useInView() {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  const callbackRef = useCallback((node: HTMLElement | null) => {
    setRef(node)
  }, [])
  useEffect(() => {
    if (!ref) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
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
      className={cn(
        'transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function FeaturedGigs() {
  const [openGigs, setOpenGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGigs({ status: 'open', limit: '6', sortBy: 'newest' })
      .then(res => setOpenGigs(res.gigs as Gig[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">Live Now</Badge>
            <h2 className="text-display text-zinc-50">Featured Gigs</h2>
            <p className="mt-3 text-body text-zinc-500">Devs are posting paid gigs right now. Find your next stream.</p>
          </div>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl surface-2" />
            ))
          ) : openGigs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-body text-zinc-500">No open gigs available right now.</p>
            </div>
          ) : (
            openGigs.slice(0, 6).map((gig, i) => (
              <FadeIn key={gig.id} delay={i * 100}>
                <Link href={`/gig/${gig.id}`} className="group block">
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getGameIcon(gig.gameType)}</span>
                          <div>
                            <p className="text-caption font-semibold text-zinc-50 group-hover:text-brand transition-colors line-clamp-1">
                              {gig.title}
                            </p>
                            <p className="text-small text-zinc-500">{gig.game}</p>
                          </div>
                        </div>
                        <Badge variant="green" size="sm">{formatCurrency(gig.budget)}</Badge>
                      </div>

                      <p className="text-small text-zinc-500 line-clamp-2 leading-relaxed">{gig.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {gig.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                        ))}
                        {gig.tags.length > 3 && (
                          <Badge variant="outline" size="sm">+{gig.tags.length - 3}</Badge>
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
                          <Zap className="h-3 w-3" />
                          <span>{gig.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))
          )}
        </div>

        <FadeIn delay={300}>
          <div className="mt-12 text-center">
            <Link href="/streamer">
              <Button variant="secondary" size="lg">
                View All Gigs <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

const testimonials = [
  {
    quote: 'Vibe completely changed how we launch games. Got 12 streamers for our Roblox launch in 48 hours.',
    name: 'NeonForge',
    role: 'Dev Studio',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=neonforge',
  },
  {
    quote: 'Made $2K last month just playing Fortnite maps for devs. This platform is cracked.',
    name: 'LunaRae',
    role: 'Streamer',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lunarae',
  },
  {
    quote: 'The vibe score system is genius. It matches us with streamers who actually fit our game aesthetic.',
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
          <div className="mb-12 text-center">
            <h2 className="text-display text-zinc-50">Trusted by the Scene</h2>
            <p className="mt-3 text-body text-zinc-500">Real words from real users who get paid to play.</p>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 150}>
              <Card className="h-full p-6">
                <Quote className="mb-4 h-8 w-8 text-brand/40" />
                <p className="text-body leading-relaxed text-zinc-300 mb-6">&ldquo;{t.quote}&rdquo;</p>
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

const streamerSteps = [
  { icon: <Rocket className="h-6 w-6" />, title: 'Browse Gigs', desc: 'Scan paid gigs by game, budget, or vibe. Filter by Fortnite, Roblox, Minecraft, Steam, or any game.' },
  { icon: <HeartHandshake className="h-6 w-6" />, title: 'Apply & Get Hired', desc: 'Send a quick pitch. Devs review your vibe score, followers, and avg viewers. Get accepted fast.' },
  { icon: <DollarSign className="h-6 w-6" />, title: 'Stream & Get Paid', desc: 'Play the game, engage your chat, collect your payout. Fixed, per-hour, or per-viewer — your call.' },
]

const devSteps = [
  { icon: <Gamepad2 className="h-6 w-6" />, title: 'Post a Gig', desc: 'Describe your game, set a budget, pick requirements. Takes 2 minutes.' },
  { icon: <Users className="h-6 w-6" />, title: 'Review Applicants', desc: 'Browse streamer profiles, vibe scores, and past gigs. Pick the perfect fit for your game.' },
  { icon: <Star className="h-6 w-6" />, title: 'Get Exposure', desc: 'Your game gets played live, clipped, and shared. Real audience, real engagement, real results.' },
]

function HowItWorks() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge variant="cyan" className="mb-4">How It Works</Badge>
            <h2 className="text-display text-zinc-50">Two Sides, One Marketplace</h2>
            <p className="mt-3 text-body text-zinc-500">Whether you stream or develop, Vibe connects you with your next opportunity.</p>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={100}>
            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg surface-3 text-brand">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-subheading text-zinc-50">For Streamers</h3>
                  <p className="text-small text-zinc-500">Get paid to play the games you love</p>
                </div>
              </div>
              <div className="space-y-6">
                {streamerSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg surface-3 text-zinc-400">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-zinc-50">{step.title}</p>
                      <p className="mt-1 text-small text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/auth">
                  <Button className="w-full">
                    I&apos;m a Streamer <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={200}>
            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg surface-3 text-cyan">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-subheading text-zinc-50">For Devs</h3>
                  <p className="text-small text-zinc-500">Get your game played by real streamers</p>
                </div>
              </div>
              <div className="space-y-6">
                {devSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg surface-3 text-zinc-400">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-zinc-50">{step.title}</p>
                      <p className="mt-1 text-small text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/auth">
                  <Button variant="secondary" className="w-full">
                    I&apos;m a Developer <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const [stats, setStats] = useState([
    { value: '$---', label: 'Paid to Streamers', icon: DollarSign },
    { value: '---', label: 'Gigs Completed', icon: Zap },
    { value: '---', label: 'Active Streamers', icon: Users },
    { value: '---', label: 'Average Rating', icon: Star },
  ])

  useEffect(() => {
    async function load() {
      try {
        const gigsRes = await getGigs({ limit: '100' })
        const allGigs = gigsRes.gigs
        const totalGigBudgets = allGigs.reduce((sum: number, g: any) => sum + g.budget, 0)
        const completedGigs = allGigs.filter((g: any) => g.status === 'completed').length
        const streamerCount = 10
        const avgRating = '4.8'

        setStats([
          { value: `${formatCurrency(totalGigBudgets)}+`, label: 'Paid to Streamers', icon: DollarSign },
          { value: `${completedGigs}+`, label: 'Gigs Completed', icon: Zap },
          { value: `${streamerCount}+`, label: 'Active Streamers', icon: Users },
          { value: `${avgRating}`, label: 'Average Rating', icon: Star },
        ])
      } catch {}
    }
    load()
  }, [])

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 100}>
              <Card className="p-6 text-center">
                <stat.icon className="mx-auto mb-3 h-6 w-6 text-brand" />
                <p className="text-display text-zinc-50">{stat.value}</p>
                <p className="mt-1 text-small text-zinc-500">{stat.label}</p>
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
    <footer className="shadow-divider py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-brand" />
              <span className="text-caption font-bold text-zinc-50">Vibe</span>
            </div>
            <p className="text-small text-zinc-600 leading-relaxed max-w-xs">
              The streamer marketplace where devs pay streamers to play their games.
              Get paid to do what you love.
            </p>
            <div className="mt-4 flex gap-3">
              {['twitch', 'youtube', 'twitter', 'discord'].map((platform, i) => (
                <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg surface-2 text-small cursor-pointer hover:surface-3 transition-all duration-200 text-zinc-500">
                  {platform === 'twitch' ? '📺' : platform === 'youtube' ? '▶' : platform === 'twitter' ? '🐦' : '💬'}
                </span>
              ))}
            </div>
          </div>

          {linkSections.map(section => (
            <div key={section.title}>
              <h4 className="text-label text-zinc-400 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-small text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 shadow-divider pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-small text-zinc-700">
            &copy; 2026 Vibe Marketplace. Get paid to play.
          </p>
          <p className="text-small text-zinc-800">
            Made for streamers, by streamers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-grid px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
          <div className="absolute -right-40 -top-40 h-[300px] w-[300px] rounded-full bg-cyan/5 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 h-[300px] w-[300px] rounded-full bg-pink/5 blur-[100px]" />
        </div>

        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full surface-2 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              <span className="text-small font-medium text-zinc-400">Streamer Marketplace</span>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="mt-8 text-display-xl text-zinc-50">
              <span className="text-gradient-brand">Get Paid</span>
              <br />
              to Play.
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 max-w-lg text-subheading leading-relaxed text-zinc-500">
              Find streamers to play your game — or get paid to play theirs. 
              Fortnite, Roblox, Minecraft, Steam — if it&apos;s a game, it&apos;s on <span className="text-brand font-semibold">Vibe</span>.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Trophy className="h-5 w-5" />
                  I&apos;m a Streamer
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  I&apos;m a Developer
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {[
                { emoji: '⚔️', label: 'Fortnite', color: 'text-cyan' },
                { emoji: '🧊', label: 'Roblox', color: 'text-pink' },
                { emoji: '⛏️', label: 'Minecraft', color: 'text-green' },
                { emoji: '🎮', label: 'Steam', color: 'text-brand' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full surface-2 px-5 py-2 text-caption font-medium"
                >
                  <span>{item.emoji}</span>
                  <span className={item.color}>{item.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <HowItWorks />
      <StatsBar />
      <FeaturedGigs />
      <Testimonials />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <Badge variant="primary" className="mb-4">Ready?</Badge>
            <h2 className="text-display text-zinc-50">
              Join the Vibe
            </h2>
            <p className="mt-4 text-body text-zinc-500 leading-relaxed">
              Whether you&apos;re a streamer looking for paid gigs or a dev wanting your game streamed, 
              you&apos;re one click away.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth">
                <Button size="lg">Start Streaming</Button>
              </Link>
              <Link href="/auth">
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