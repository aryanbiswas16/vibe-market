'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
      <Card className="max-w-md p-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-brand" />
        <h1 className="mt-4 text-heading text-zinc-50">Something went wrong</h1>
        <p className="mt-2 text-body text-zinc-500">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-small text-zinc-700">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
