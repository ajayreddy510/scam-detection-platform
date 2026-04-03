import { NextRequest, NextResponse } from 'next/server';

interface JWT {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Routes that require authentication
const protectedRoutes = {
  admin: ['/admin'],
  user: ['/dashboard', '/report'],
  all: ['/admin', '/dashboard', '/report'],
};

// Simple JWT decode function (does not verify signature)
function decodeJWT(token: string): JWT | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    return payload as JWT;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes
  if (
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.all.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    // Redirect to login for UI routes
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/report')
    ) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = decodeJWT(token);

    if (!decoded) {
      throw new Error('Invalid token format');
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/dashboard')
      ) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    // Check role-based access
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow request
    return NextResponse.next();
  } catch (error) {
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard')
    ) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};
