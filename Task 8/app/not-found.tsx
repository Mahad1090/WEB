import Link from 'next/link'
import { Button } from '@/components/UI'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-xl text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link href="/">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Go Back Home
        </Button>
      </Link>
    </div>
  )
}
