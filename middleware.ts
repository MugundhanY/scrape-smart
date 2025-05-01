import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Create a matcher for public routes that don't require authentication
const isPublicRoute = (path: string) => {
  const publicRoutes = [
    '/signin',
    '/signup',
    '/api/webhooks/stripe',
    '/api/auth'
  ];
  
  // Check if path starts with any of the public routes
  return publicRoutes.some(route => 
    path.startsWith(route) || 
    path.match(/^\/api\/workflows\/.*/)
  );
};

// Simple function to check if session token exists
function isAuthenticated(request: NextRequest): boolean {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                      request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  return !!sessionToken;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only redirect signin/signup pages for authenticated users, but not root path
  if (isAuthenticated(request) && (path === '/signin' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Allow public routes
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Simple authentication check - just verify token exists
  // We're avoiding JWT decoding here to prevent Edge Runtime errors
  if (!isAuthenticated(request)) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};