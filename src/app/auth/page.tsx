'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { Sparkles, Gamepad2, Users, ChevronRight } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    router.replace(user.role === 'streamer' ? '/streamer' : '/dev')
    return null
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="shadow-divider sticky top-0 z-50 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <span className="text-caption font-bold text-zinc-50">Vibe</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <Badge variant="primary" className="mb-4">Join the Vibe</Badge>
            <h1 className="text-display text-zinc-50">How do you want to use Vibe?</h1>
            <p className="mt-3 text-body text-zinc-500">Choose your path to get started.</p>
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
  )
}
