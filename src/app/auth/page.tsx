'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { AuthHeader } from '@/components/auth-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { ArrowLeft, Gamepad2, Users, ChevronRight, LogIn, Search, ShieldCheck, Sparkles, Trophy } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    router.replace(user.role === 'streamer' ? '/streamer' : '/dev')
    return null
  }

  const handleLogin = async () => {
    if (!email.trim()) { setError('Email is required'); return }
    if (!password.trim()) { setError('Password is required'); return }
    setError('')
    setLoading(true)
    const result = await signIn('credentials', {
      email: email.trim(),
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
      return
    }

    router.refresh()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col">
      <Image
        src="/marketplace-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover opacity-20"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,69,0,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(0,212,255,0.12),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.72),#000_78%)]" />
      <AuthHeader />

      <main className="relative z-10 flex-1 px-6 py-10 lg:py-16">
        <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-body text-zinc-400 transition-colors hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>
          <Link href="/streamer">
            <Button variant="secondary" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Browse public gigs
            </Button>
          </Link>
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <Card className="h-fit border-white/[0.1] bg-[#08090b]/90 shadow-2xl shadow-black/40 backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg surface-3">
                  <LogIn className="h-6 w-6 text-brand" />
                </div>
                <h1 className="text-heading text-zinc-50">Login</h1>
                <p className="mt-2 text-body text-zinc-500">Use your Vibe account to get back to your dashboard.</p>
              </div>

              <Input
                label="Email"
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                id="login-password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleLogin()
                }}
              />

              {error && <p className="text-body text-red-500">{error}</p>}

              <Button className="w-full" size="lg" onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>

              <div className="rounded-lg border border-white/[0.06] bg-zinc-950/60 p-3">
                <p className="text-small text-zinc-500">Demo account</p>
                <p className="mt-1 text-small text-zinc-300">lunarae@vibe.dev / password123</p>
              </div>
            </CardContent>
          </Card>

          <section>
            <div className="mb-10 text-center lg:text-left">
              <Badge variant="primary" className="mb-4">Join the Vibe</Badge>
              <h2 className="text-display text-zinc-50">Choose your side of the marketplace.</h2>
              <p className="mt-3 max-w-xl text-body text-zinc-500 lg:mx-0">
                Streamers find paid games. Indie developers post campaigns, compare applicants, and launch with creators.
              </p>
            </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Link href="/auth/streamer">
              <Card hover className="p-8 h-full group cursor-pointer border-brand/20 bg-brand/[0.035]">
                <CardContent className="p-0 flex flex-col items-center text-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl surface-3">
                    <Users className="h-10 w-10 text-brand" />
                  </div>
                  <div>
                    <CardTitle className="text-heading mb-2">I&apos;m a Streamer</CardTitle>
                    <CardDescription>
                      Browse paid gigs, apply to play games you love, and get paid for your streams.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-caption text-brand font-medium group-hover:gap-2 transition-all">
                    Join as Streamer <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <Badge variant="outline" size="sm">Browse Gigs</Badge>
                    <Badge variant="outline" size="sm">Get Paid</Badge>
                    <Badge variant="outline" size="sm">Build Rep</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/dev">
              <Card hover className="p-8 h-full group cursor-pointer border-cyan/20 bg-cyan/[0.035]">
                <CardContent className="p-0 flex flex-col items-center text-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl surface-3">
                    <Gamepad2 className="h-10 w-10 text-cyan" />
                  </div>
                  <div>
                    <CardTitle className="text-heading mb-2">I&apos;m a Developer</CardTitle>
                    <CardDescription>
                      Post gigs, find streamers to play your game, and get real exposure.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-caption text-cyan font-medium group-hover:gap-2 transition-all">
                    Join as Developer <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <Badge variant="outline" size="sm">Post Gigs</Badge>
                    <Badge variant="outline" size="sm">Find Streamers</Badge>
                    <Badge variant="outline" size="sm">Get Exposure</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: 'Verified profiles' },
                { icon: Trophy, label: 'Paid gig history' },
                { icon: Sparkles, label: 'Indie launch tools' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.035] px-3 py-3 text-small text-zinc-400">
                  <item.icon className="h-4 w-4 text-green" />
                  {item.label}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
