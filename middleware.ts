import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/leads',
  '/pipeline',
  '/analytics',
  '/settings',
]

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/start-trial',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('brokerra_token')?.value

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Check if it's an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Note: Since we use localStorage for JWT (not cookies),
  // the middleware can't directly check auth state.
  // Protection is handled client-side via AuthGuard component.
  // This middleware handles basic routing logic.

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
