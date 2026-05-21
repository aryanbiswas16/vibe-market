'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Gamepad2, LogIn, Sparkles, Users } from 'lucide-react'

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          <span className="text-caption font-bold text-zinc-50">Vibe</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Site</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
          <Link href="/auth/streamer">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Streamer</span>
            </Button>
          </Link>
          <Link href="/auth/dev">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Developer</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
