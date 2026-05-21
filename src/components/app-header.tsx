'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { BriefcaseBusiness, Gamepad2, LogIn, LogOut, Plus, Settings, Sparkles, Trophy } from 'lucide-react'

export function AppHeader() {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          <span className="text-caption font-bold text-zinc-50">Vibe</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/streamer" className="text-small font-medium text-zinc-500 transition-colors hover:text-zinc-200">
            Marketplace
          </Link>
          <Link href="/dev" className="text-small font-medium text-zinc-500 transition-colors hover:text-zinc-200">
            Dev Dashboard
          </Link>
          <Link href="/dev/post" className="text-small font-medium text-zinc-500 transition-colors hover:text-zinc-200">
            Post Gig
          </Link>
          <Link href="/settings" className="text-small font-medium text-zinc-500 transition-colors hover:text-zinc-200">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!isLoading && user ? (
            <>
              <Badge variant={user.role === 'dev' ? 'cyan' : 'primary'} size="sm" className="hidden sm:inline-flex">
                {user.role === 'dev' ? 'Developer' : 'Streamer'}
              </Badge>
              <Link href={user.role === 'dev' ? '/dev' : '/streamer'}>
                <Button variant="ghost" size="sm" className="hidden gap-1.5 md:inline-flex">
                  {user.role === 'dev' ? <BriefcaseBusiness className="h-3.5 w-3.5" /> : <Trophy className="h-3.5 w-3.5" />}
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
              <Avatar src={user.image || ''} name={user.name || 'User'} size="sm" />
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Button>
              </Link>
              <Link href="/streamer">
                <Button variant="secondary" size="sm" className="hidden gap-1.5 sm:inline-flex">
                  <Gamepad2 className="h-3.5 w-3.5" />
                  Browse
                </Button>
              </Link>
              <Link href="/dev/post">
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Post Gig
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
