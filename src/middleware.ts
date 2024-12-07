import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('userEmail');
  const isAuthPage = request.nextUrl.pathname === '/';
  
  // If user is not logged in and trying to access a protected route
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is logged in and trying to access login page
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/', '/home', '/quiz']
}; 