import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { AuthMiddlewareResult, AuthResult } from "@/types/auth";
import { Session } from "next-auth";

// Clerk-like auth() function for server components and actions
export async function auth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions) as Session;
  
  const userId = session?.user?.id || null;
  
  return {
    userId,
    sessionId: session?.user?.id || null,
    session,
    user: session?.user || null,
    // Clerk-like protect method for server components and actions
    protect: async () => {
      if (!session?.user) {
        redirect('/signin');
      }
      return session;
    }
  };
}

// Used in middleware to check authentication from request
export async function getAuthFromRequest(request: NextRequest): Promise<AuthMiddlewareResult> {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  if (!sessionToken) {
    return { userId: null, sessionId: null, session: null, authenticated: false };
  }
  
  // With NextAuth, we don't need to decode the token here
  // The existence of the cookie is enough for the middleware
  // Actual validation happens in the getServerSession call
  return { 
    authenticated: true,
    userId: 'authenticated-user', // Placeholder, actual userId comes from getServerSession
    sessionId: 'authenticated-session', // Placeholder
    session: { token: sessionToken }
  };
}

// For client components
export function getClientAuth() {
  return {
    isLoaded: true,
    isSignedIn: false, // Will be updated by AuthProvider
    userId: null,
    sessionId: null,
    user: null,
  };
}