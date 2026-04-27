import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b-2 border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto max-w-4xl px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">Auth System</Link>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}
