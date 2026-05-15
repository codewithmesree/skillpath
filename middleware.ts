import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes (pages)
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Define public API routes
  const isAuthApi = pathname.startsWith('/api/auth/login') || 
                    pathname.startsWith('/api/auth/register') ||
                    pathname.startsWith('/api/auth/logout');

  // Allow static files and common public assets
  const isStaticFile = pathname.startsWith('/_next') || 
                       pathname.includes('.') || 
                       pathname === '/favicon.ico';

  // 1. If user is NOT logged in and trying to access a protected route
  if (!token && !isPublicRoute && !isAuthApi && !isStaticFile) {
    // Allow /api/auth/me even without token as it handles null internally
    if (pathname === '/api/auth/me') return NextResponse.next();
    
    // Redirect to login for pages, return 401 for other API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If user IS logged in and trying to access login/register, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
