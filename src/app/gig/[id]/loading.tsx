import { Sparkles } from 'lucide-react'

export default function GigDetailLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF4500]" />
            <div className="h-4 w-10 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>
      </header>

      {/* Hero skeleton */}
      <div className="bg-gradient-to-b from-zinc-900/50 via-black to-black">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex flex-col gap-6">
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-800" />
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 animate-pulse rounded-xl bg-zinc-800" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
                <div className="h-2 w-20 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 animate-pulse">
                  <div className="mb-2 h-4 w-4 rounded bg-zinc-800" />
                  <div className="h-5 w-16 rounded bg-zinc-800 mb-1" />
                  <div className="h-3 w-12 rounded bg-zinc-800" />
                </div>
              ))}
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 animate-pulse">
                <div className="mb-4 h-5 w-28 rounded bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-zinc-800" />
                  <div className="h-3 w-5/6 rounded bg-zinc-800" />
                  <div className="h-3 w-4/6 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 animate-pulse">
                <div className="mb-4 h-5 w-20 rounded bg-zinc-800" />
                <div className="space-y-3">
                  <div className="h-3 w-full rounded bg-zinc-800" />
                  <div className="h-3 w-3/4 rounded bg-zinc-800" />
                  <div className="h-3 w-1/2 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}