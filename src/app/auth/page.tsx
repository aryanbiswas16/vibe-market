'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { AuthHeader } from '@/components/auth-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { Gamepad2, Users, ChevronRight, LogIn } from 'lucide-react'

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
    <div className="min-h-screen bg-black flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="h-fit">
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

          <div>
          <div className="text-center mb-10">
            <Badge variant="primary" className="mb-4">Join the Vibe</Badge>
            <h2 className="text-display text-zinc-50">How do you want to use Vibe?</h2>
            <p className="mt-3 text-body text-zinc-500">Create the account type that matches your role.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Link href="/auth/streamer">
              <Card hover className="p-8 h-full group cursor-pointer">
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
              <Card hover className="p-8 h-full group cursor-pointer">
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
          </div>
        </div>
      </div>
    </div>
  )
}
