import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TokenPayload {
  id?: string;
  role?: string;
  email?: string;
  exp?: number;
}

function parseToken(token?: string): TokenPayload | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    // Invalidate if token has expired
    if (parsed.exp && Date.now() >= parsed.exp * 1000) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const payload = parseToken(token);
  const userRole = payload?.role || null;
  const isAuthenticated = Boolean(payload && userRole);

  // Allow static files, Next.js internals, and favicon
  const isStaticFile = 
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname === '/favicon.ico';
  if (isStaticFile) return NextResponse.next();

  // ----------------------------------------------------
  // 1. ADMIN PORTAL ROUTING & PROTECTION
  // ----------------------------------------------------
  if (pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    if (isAuthenticated && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated || userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 2. INSTRUCTOR ROUTING & PROTECTION
  // ----------------------------------------------------
  if (pathname.startsWith('/instructor')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole !== 'instructor' && userRole !== 'admin') {
      // Non-instructors cannot access instructor portal
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/instructor')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }
    if (userRole !== 'instructor' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Instructor access required' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 3. STUDENT & LEARNER DASHBOARD PROTECTION
  // ----------------------------------------------------
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLearningRoute = pathname.includes('/learn') || pathname.includes('/quiz');
  const isPaymentRoute = pathname.startsWith('/payment');

  if (isDashboardRoute || isLearningRoute || isPaymentRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 4. API ROUTE PROTECTION
  // ----------------------------------------------------
  const isAuthApi = 
    pathname.startsWith('/api/auth/login') || 
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname === '/api/auth/me';

  const isPublicCoursesGet = request.method === 'GET' && pathname.startsWith('/api/courses');

  if (pathname.startsWith('/api/')) {
    if (isAuthApi || isPublicCoursesGet) {
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    // Course mutations require instructor or admin role
    if (pathname.startsWith('/api/courses') && ['POST', 'PATCH', 'DELETE'].includes(request.method)) {
      if (userRole !== 'instructor' && userRole !== 'admin') {
        return NextResponse.json({ error: 'Forbidden: Instructor privileges required' }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 5. GUEST ONLY ROUTES (/login, /register)
  // ----------------------------------------------------
  const guestOnlyRoutes = ['/login', '/register'];
  if (isAuthenticated && guestOnlyRoutes.includes(pathname)) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (userRole === 'instructor') {
      return NextResponse.redirect(new URL('/instructor', request.url));
    }
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
