const BASE = ""

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return data as T
}

// ── Transform helpers ──────────────────────────────────────

function transformGig(gig: any) {
  return {
    ...gig,
    devId: gig.devId || gig.dev?.id,
    devName: gig.dev?.name || "",
    devAvatar: gig.dev?.image || "",
    tags: typeof gig.tags === "string" ? JSON.parse(gig.tags) : gig.tags,
  }
}

function transformApp(app: any) {
  return {
    ...app,
    streamerName: app.streamer?.name || "",
    streamerAvatar: app.streamer?.image || "",
    streamerFollowers: app.streamer?.followers ?? 0,
    streamerAvgViewers: app.streamer?.avgViewers ?? 0,
    streamerVibeScore: app.streamer?.vibeScore ?? 0,
  }
}

function transformUser(user: any) {
  return {
    ...user,
    avatar: user.image || user.avatar || "",
    joinedAt: user.createdAt || user.joinedAt,
  }
}

// ── Gigs ───────────────────────────────────────────────────

export async function getGigs(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  const res = await fetcher<{ gigs: any[]; total: number; page: number; totalPages: number }>(`/api/gigs${query}`)
  return {
    ...res,
    gigs: res.gigs.map(transformGig),
  }
}

export async function getGig(id: string) {
  const res = await fetcher<{ gig: any }>(`/api/gigs/${id}`)
  return {
    gig: transformGig(res.gig),
    applications: (res.gig?.applications || []).map(transformApp),
  }
}

export async function createGig(data: any) {
  const res = await fetcher<any>("/api/gigs", { method: "POST", body: JSON.stringify(data) })
  return transformGig(res)
}

// ── Applications ───────────────────────────────────────────

export async function getMyApplications(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  const res = await fetcher<{ applications: any[] }>(`/api/applications${query}`)
  return res.applications.map(transformApp)
}

export async function createApplication(data: { gigId: string; message: string }) {
  const res = await fetcher<any>("/api/applications", { method: "POST", body: JSON.stringify(data) })
  return transformApp(res.application)
}

export async function updateApplicationStatus(id: string, status: string) {
  const res = await fetcher<any>(`/api/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
  return transformApp(res.application)
}

// ── User ───────────────────────────────────────────────────

export async function getMe() {
  const res = await fetcher<any>("/api/users/me")
  return transformUser(res.user)
}

export async function updateMe(data: any) {
  const res = await fetcher<any>("/api/users/me", { method: "PATCH", body: JSON.stringify(data) })
  return transformUser(res.user)
}

export async function connectStream(data: { platform: string; username?: string; channelId?: string }) {
  return fetcher<any>("/api/stream/connect", { method: "POST", body: JSON.stringify(data) })
}

// ── Auth ───────────────────────────────────────────────────

export async function register(data: {
  name: string
  handle: string
  email: string
  password: string
  role: string
  bio?: string
  twitchConnected?: boolean
  youtubeConnected?: boolean
}) {
  return fetcher<any>("/api/register", { method: "POST", body: JSON.stringify(data) })
}

// ── Payments ─────────────────────────────────────────────────

export function createPaymentIntent(data: { gigId: string; applicationId: string }) {
  return fetcher<{ clientSecret: string; paymentId: string; amount: number; fee: number }>(
    "/api/payments/create-intent", { method: "POST", body: JSON.stringify(data) }
  )
}

export function confirmPayment(data: { paymentIntentId: string }) {
  return fetcher<{ ok: boolean; status: string }>(
    "/api/payments/confirm", { method: "POST", body: JSON.stringify(data) }
  )
}

export function releasePayment(data: { gigId: string }) {
  return fetcher<{ ok: boolean; payment: any; intentStatus: string; transferCreated: boolean }>(
    "/api/payments/release", { method: "POST", body: JSON.stringify(data) }
  )
}

export function getGigPayment(gigId: string) {
  return fetcher<{ payment: any | null }>(`/api/payments/gig/${gigId}`)
}