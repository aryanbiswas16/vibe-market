'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
      <div className="mb-8 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-brand" />
        <span className="text-heading font-bold text-zinc-50">Vibe</span>
      </div>
      <Card className="max-w-md p-10 text-center">
        <p className="text-display-xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-heading text-zinc-50">Page not found</h1>
        <p className="mt-2 text-body text-zinc-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
