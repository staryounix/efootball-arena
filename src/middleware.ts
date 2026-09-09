// src/middleware.ts
// Middleware to protect admin routes and redirect users based on their role.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run for admin routes (including the /admin page itself)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Retrieve auth token from cookies (the same name used in login API)
  const token = req.cookies.get('auth_token')?.value;

  // If no token, redirect to the generic login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const payload = await verifyToken(token);

  // Invalid token → redirect to login
  if (!payload) {
    // Clear the possibly stale cookie
    const resp = NextResponse.redirect(new URL('/login', req.url));
    resp.cookies.delete('auth_token');
    return resp;
  }

  // If the user is not a SUPER_ADMIN, send them to the normal dashboard
  if (payload.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Otherwise allow the request to continue to the admin UI
  return NextResponse.next();
}

// Apply only to admin routes – this matcher works with the new Next.js file‑structure.
export const config = {
  matcher: ['/admin/:path*']
};
