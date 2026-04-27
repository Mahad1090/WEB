import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie } from './lib/auth/cookies'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/signup', '/']

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes - check authentication
  if (pathname.startsWith('/dashboard')) {
    const session = await getAuthCookie()

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
