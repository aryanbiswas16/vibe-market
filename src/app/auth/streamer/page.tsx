'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthHeader } from '@/components/auth-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, UserPlus, CheckCircle2, Radio, PlayCircle } from 'lucide-react'
import { register } from '@/lib/api-client'
import { signIn } from 'next-auth/react'

function BadgeLike({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1 text-small text-zinc-400 shadow-border">
      {icon}
      {label}
    </span>
  )
}

export default function StreamerSignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    if (!handle.trim()) { setError('Handle is required'); return }
    if (!email.trim()) { setError('Email is required'); return }
    if (!password.trim()) { setError('Password is required'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setError('')
    setLoading(true)
    try {
      await register({
        name: name.trim(),
        handle: handle.trim().replace('@', ''),
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword,
        role: 'streamer',
        bio: bio.trim(),
      })
      const result = await signIn('credentials', {
        email: email.trim(),
        password: password,
        redirect: false,
      })
      if (result?.error) {
        setError('Account created but sign in failed. Please try logging in.')
        setLoading(false)
        return
      }
      setSubmitted(true)
      setTimeout(() => router.push('/streamer'), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
      setLoading(false)
    }
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
      <AuthHeader />

      <div className="mx-auto max-w-lg px-6 py-16">
        <Button variant="ghost" size="sm" className="mb-6 gap-1" onClick={() => router.push('/auth')}>
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Button>

        <div className="mb-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl surface-3 mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-brand" />
          </div>
          <h1 className="text-heading text-zinc-50">Join as Streamer</h1>
          <p className="mt-2 text-body text-zinc-500">Create your streamer profile and start finding paid gigs.</p>
        </div>

        <Card>
          <CardContent className="space-y-5 p-6">
            <Input
              label="Display Name"
              id="name"
              placeholder="e.g. LunaRae"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              label="Handle"
              id="handle"
              placeholder="e.g. lunarae"
              value={handle}
              onChange={e => setHandle(e.target.value)}
            />
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <Input
              label="Bio"
              id="bio"
              placeholder="Tell streamers about yourself..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <div className="rounded-lg border border-white/[0.06] bg-zinc-950/60 p-4">
              <p className="text-label text-zinc-400">Streaming Platforms</p>
              <p className="mt-2 text-small leading-relaxed text-zinc-500">
                Create your account first, then connect Twitch or YouTube with the platform login. Manual checkboxes are not used for verification.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <BadgeLike icon={<Radio className="h-3.5 w-3.5" />} label="Twitch login required" />
                <BadgeLike icon={<PlayCircle className="h-3.5 w-3.5" />} label="YouTube login required" />
              </div>
            </div>
            {error && <p className="text-body text-red-500">{error}</p>}
            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
              Create Streamer Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
