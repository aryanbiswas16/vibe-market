'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { Sparkles, ArrowLeft, Gamepad2, CheckCircle2 } from 'lucide-react'

export default function DevSignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!name.trim()) { setError('Name is required'); return }
    if (!handle.trim()) { setError('Handle is required'); return }
    setError('')
    signUp('dev', {
      name: name.trim(),
      handle: handle.trim().replace('@', ''),
      bio: bio.trim(),
    })
    setSubmitted(true)
    setTimeout(() => router.push('/dev'), 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full surface-3 mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green" />
          </div>
          <h1 className="text-heading text-zinc-50">Welcome to Vibe!</h1>
          <p className="mt-2 text-body text-zinc-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="shadow-divider sticky top-0 z-50 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <span className="text-caption font-bold text-zinc-50">Vibe</span>
          </Link>
          <Link href="/auth">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="mb-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl surface-3 mx-auto mb-4">
            <Gamepad2 className="h-8 w-8 text-cyan" />
          </div>
          <h1 className="text-heading text-zinc-50">Join as Developer</h1>
          <p className="mt-2 text-body text-zinc-500">Create your dev profile and start posting gigs.</p>
        </div>

        <Card>
          <CardContent className="space-y-5 p-6">
            <Input
              label="Studio/Dev Name"
              id="name"
              placeholder="e.g. NeonForge"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              label="Handle"
              id="handle"
              placeholder="e.g. neonforge"
              value={handle}
              onChange={e => setHandle(e.target.value)}
            />
            <Input
              label="Bio"
              id="bio"
              placeholder="Tell streamers about your games..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            {error && <p className="text-body text-red-500">{error}</p>}
            <Button className="w-full" size="lg" onClick={handleSubmit}>
              Create Developer Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
