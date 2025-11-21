import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/signin',
  '/signup',
  '/api/webhooks/stripe',
  '/api/auth',
  '/api/health',
  '/api/cron',
  '/',
  // Add other public routes here
];

// Check if the requested path is a public route
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path === route || path.startsWith(`${route}/`)) ||
    path.match(/^\/api\/workflows\/.*/) !== null;
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public routes without authentication
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Check for authentication by looking for the session cookie
  const hasAuthCookie = request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token');

  // Redirect to signin if not authenticated
  if (!hasAuthCookie) {
    // Build the sign in URL with the current URL as callback
    const signInUrl = new URL('/signin', request.url);
    // Add the current URL as a callback parameter
    signInUrl.searchParams.set('callbackUrl', request.url);
    // Redirect to sign in page
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (hasAuthCookie && (path === '/signin' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Continue with the request for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and internal Next.js routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)',
  ],
};