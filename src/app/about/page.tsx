import Link from 'next/link'
import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, DollarSign, Zap, Users, Star, Target, HeartHandshake, Rocket, Gamepad2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — Vibe',
  description:
    'Learn about Vibe Marketplace — the streamer marketplace where devs pay streamers to play their games.',
}

const stats = [
  { value: '$50K+', label: 'Paid to Streamers', icon: DollarSign },
  { value: '500+', label: 'Gigs Completed', icon: Zap },
  { value: '200+', label: 'Active Streamers', icon: Users },
  { value: '4.8★', label: 'Average Rating', icon: Star },
]

const steps = [
  {
    icon: Gamepad2,
    title: 'Post a Gig / Browse Gigs',
    description:
      'Devs post paid gaming gigs with their budget and requirements. Streamers browse available gigs filtered by game, payout, and vibes.',
  },
  {
    icon: HeartHandshake,
    title: 'Apply / Review',
    description:
      'Streamers apply with a pitch. Devs review profiles, vibe scores, and past performance to find the perfect match for their game.',
  },
  {
    icon: Rocket,
    title: 'Stream / Get Paid',
    description:
      'Streamers play the game live, engage their audience, and get paid. Fixed price, per hour, or per viewer — whatever works for both sides.',
  },
]

const teamMembers = [
  { name: 'Alex Rivera', role: 'Founder & CEO', emoji: '🚀' },
  { name: 'Samantha Chen', role: 'Head of Product', emoji: '🎨' },
  { name: 'Marcus Johnson', role: 'Engineering Lead', emoji: '⚡' },
  { name: 'Priya Patel', role: 'Community Manager', emoji: '💬' },
]

function Header() {
  return (
    <header className="shadow-divider">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          <span className="text-caption font-bold text-zinc-50">Vibe</span>
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="shadow-divider py-8">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-small text-zinc-700">
          &copy; 2026 Vibe Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-4 text-display text-zinc-50">About Vibe</h1>
          <p className="mx-auto mt-4 max-w-2xl text-subheading text-zinc-500">
            The streamer marketplace where devs pay streamers to play their games.
          </p>
        </div>

        <div className="mb-24 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-brand" />
              <p className="text-display text-zinc-50">{stat.value}</p>
              <p className="mt-1 text-small text-zinc-500">{stat.label}</p>
            </Card>
          ))}
        </div>

        <section className="mb-24">
          <Card className="p-8 text-center sm:p-12">
            <Target className="mx-auto h-8 w-8 text-brand" />
            <h2 className="mt-4 text-heading text-zinc-50">Our Mission</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body leading-relaxed text-zinc-400">
              Vibe exists to bridge the gap between game developers and content creators. We believe
              every game deserves its moment in the spotlight, and every streamer deserves to get paid
              for their influence. By creating a transparent, fair marketplace, we empower devs to
              reach real audiences through authentic gameplay while helping streamers monetize their
              passion. No middlemen, no shady deals — just pure vibes.
            </p>
          </Card>
        </section>

        <section className="mb-24">
          <h2 className="mb-10 text-center text-heading text-zinc-50">How It Works</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title} className="p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl surface-3 text-brand">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-small font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-subheading text-zinc-50">{step.title}</h3>
                </div>
                <p className="mt-3 text-body leading-relaxed text-zinc-500">{step.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-10 text-center text-heading text-zinc-50">The Team</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.name} className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full surface-3 text-2xl">
                  {member.emoji}
                </div>
                <h3 className="mt-4 text-caption font-semibold text-zinc-50">{member.name}</h3>
                <p className="mt-1 text-small text-zinc-500">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
