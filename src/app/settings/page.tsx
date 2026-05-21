'use client'

import { useEffect, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { getMe, updateMe } from '@/lib/api-client'
import { useAuth } from '@/lib/auth'
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Download,
  KeyRound,
  LinkIcon,
  LogOut,
  PlayCircle,
  Radio,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  User,
  WalletCards,
} from 'lucide-react'

type SettingsUser = {
  id: string
  name: string
  handle: string
  email: string
  role: string
  bio?: string
  image?: string
  avatar?: string
  twitchConnected?: boolean
  youtubeConnected?: boolean
  twitchUsername?: string | null
  youtubeChannelId?: string | null
  stripeOnboardingComplete?: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<SettingsUser | null>(null)
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (!user) return

    async function loadProfile() {
      try {
        const me = await getMe() as SettingsUser
        setProfile(me)
        setName(me.name ?? '')
        setHandle(me.handle ?? '')
        setBio(me.bio ?? '')
      } catch {
        setError('Could not load settings.')
      }
    }

    loadProfile()
  }, [user])

  const saveProfile = async () => {
    if (!name.trim()) { setError('Display name is required'); return }
    if (!handle.trim()) { setError('Handle is required'); return }

    setSaving(true)
    setError('')
    setMessage('')
    try {
      const updated = await updateMe({
        name: name.trim(),
        handle: handle.trim().replace('@', ''),
        bio: bio.trim(),
      }) as SettingsUser
      setProfile(updated)
      setMessage('Settings saved.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-black">
        <AppHeader />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <p className="text-body text-zinc-500">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={profile.avatar || profile.image || ''} name={profile.name} size="xl" status="online" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-heading text-zinc-50">Settings</h1>
                <Badge variant={profile.role === 'dev' ? 'cyan' : 'primary'} size="sm">
                  {profile.role === 'dev' ? 'Developer' : 'Streamer'}
                </Badge>
              </div>
              <p className="mt-1 text-body text-zinc-500">{profile.email}</p>
              <p className="mt-1 text-small text-zinc-600">Manage your profile, platform connections, payments, and account access.</p>
            </div>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand" />
                Profile
              </CardTitle>
              <CardDescription>Keep your marketplace identity clear for applicants and creators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Input
                label="Display Name"
                id="settings-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Input
                label="Handle"
                id="settings-handle"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
              />
              <Textarea
                label="Bio"
                id="settings-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder={profile.role === 'dev' ? 'Tell streamers what kind of games you build.' : 'Tell game creators what kind of streams you make.'}
              />

              {message && (
                <div className="flex items-center gap-2 rounded-lg bg-green/10 px-3 py-2 text-small text-green">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-small text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button className="w-full gap-2" onClick={saveProfile} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-cyan" />
                  Streaming Connections
                </CardTitle>
                <CardDescription>Verified platform logins are required before a connection should be trusted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ConnectionRow
                  icon={<Radio className="h-4 w-4" />}
                  title="Twitch"
                  description={profile.twitchConnected ? `Connected${profile.twitchUsername ? ` as ${profile.twitchUsername}` : ''}` : 'Use Twitch OAuth to verify your channel.'}
                  connected={!!profile.twitchConnected}
                  actionLabel={profile.twitchConnected ? 'Reconnect' : 'Connect Twitch'}
                  onClick={() => signIn('twitch', { callbackUrl: '/settings' })}
                />
                <ConnectionRow
                  icon={<PlayCircle className="h-4 w-4" />}
                  title="YouTube"
                  description={profile.youtubeConnected ? 'Connected with Google/YouTube.' : 'Use Google login with YouTube scope to verify your channel.'}
                  connected={!!profile.youtubeConnected}
                  actionLabel={profile.youtubeConnected ? 'Reconnect' : 'Connect YouTube'}
                  onClick={() => signIn('google', { callbackUrl: '/settings' })}
                />
                <ConnectionRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Kick"
                  description="Kick needs a custom OAuth provider before it can be a verified connection."
                  connected={false}
                  actionLabel="Coming Soon"
                  disabled
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletCards className="h-5 w-5 text-green" />
                  Payments
                </CardTitle>
                <CardDescription>Production payouts should use Stripe Connect onboarding and escrow status.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <StatusPanel
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Stripe Connect"
                  value={profile.stripeOnboardingComplete ? 'Ready' : 'Not connected'}
                  tone={profile.stripeOnboardingComplete ? 'green' : 'default'}
                />
                <StatusPanel
                  icon={<Settings className="h-4 w-4" />}
                  label="Platform Fee"
                  value="10%"
                  tone="default"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-yellow" />
                  Account Controls
                </CardTitle>
                <CardDescription>Security and data controls belong in the product shell, not hidden in support.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <Button variant="secondary" className="gap-2" disabled>
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="secondary" className="gap-2" disabled>
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="danger" className="gap-2" disabled>
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function ConnectionRow({
  icon,
  title,
  description,
  connected,
  actionLabel,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  connected: boolean
  actionLabel: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-zinc-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg surface-3 text-zinc-400">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-caption font-semibold text-zinc-50">{title}</p>
            <Badge variant={connected ? 'green' : 'default'} size="sm" dot={connected}>
              {connected ? 'Connected' : 'Not connected'}
            </Badge>
          </div>
          <p className="mt-1 text-small text-zinc-500">{description}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onClick} disabled={disabled}>
        {actionLabel}
      </Button>
    </div>
  )
}

function StatusPanel({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'green' | 'default'
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-zinc-950/70 p-4">
      <div className={tone === 'green' ? 'text-green' : 'text-zinc-400'}>
        {icon}
      </div>
      <p className="mt-3 text-small text-zinc-500">{label}</p>
      <p className="mt-1 text-caption font-semibold text-zinc-50">{value}</p>
    </div>
  )
}
