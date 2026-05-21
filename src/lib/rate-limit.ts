interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000)

export function rateLimit(options: {
  key: string
  limit: number
  windowMs: number
}): { success: boolean; remaining: number; resetInMs: number } {
  const now = Date.now()
  const entry = store.get(options.key)

  if (!entry || entry.resetAt < now) {
    store.set(options.key, {
      count: 1,
      resetAt: now + options.windowMs,
    })
    return { success: true, remaining: options.limit - 1, resetInMs: options.windowMs }
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetInMs: entry.resetAt - now }
  }

  entry.count++
  return { success: true, remaining: options.limit - entry.count, resetInMs: entry.resetAt - now }
}

// Default rate limits
export const RATE_LIMITS = {
  default: { limit: 100, windowMs: 60_000 },       // 100 req/min
  auth: { limit: 10, windowMs: 60_000 },             // 10 req/min for auth
  register: { limit: 5, windowMs: 60_000 },           // 5 registrations/min
  createGig: { limit: 20, windowMs: 60_000 },         // 20 gigs/min
  createApplication: { limit: 30, windowMs: 60_000 }, // 30 applications/min
  payment: { limit: 10, windowMs: 60_000 },            // 10 payment ops/min
  webhook: { limit: 50, windowMs: 60_000 },            // 50 webhook calls/min
} as const