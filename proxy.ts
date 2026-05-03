import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'family-bakery-super-secret-key-change-in-prod'
const key = new TextEncoder().encode(secretKey)

export default async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // Allow auth routes and public assets
  if (pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] })
    const user = payload.user as any

    // If manager tries to access restricted areas
    if (user.role === 'MANAGER') {
      if (pathname === '/' || pathname === '/reports' || pathname === '/stores') {
        if (user.storeId) {
          return NextResponse.redirect(new URL(`/stores/${user.storeId}`, request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url)) // Or a 'no store assigned' page
      }

      // If manager tries to access another store's page
      if (pathname.startsWith('/stores/') && !pathname.startsWith(`/stores/${user.storeId}`)) {
        return NextResponse.redirect(new URL(`/stores/${user.storeId}`, request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
}
