import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth')
    const { pathname } = request.nextUrl

    // Define paths that require authentication
    // We explicitly list them or protect everything except public paths
    // Strategy: Protect everything except /login and static assets

    if (pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/public')) {
        // Allow access to login and static files
        if (pathname === '/login' && authCookie?.value === 'true') {
            // If already logged in, redirect to dashboard
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    // Check authentication for all other routes
    if (!authCookie || authCookie.value !== 'true') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
