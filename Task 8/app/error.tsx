'use client'

import Link from 'next/link'
import { Button } from '@/components/UI'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Oops! Something went wrong</h1>
        <p className="text-xl text-gray-600">{error.message || 'An unexpected error occurred'}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </Button>
        <Link href="/">
          <Button className="bg-gray-600 hover:bg-gray-700">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
