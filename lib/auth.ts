import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { AuthMiddlewareResult, AuthResult } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { Session } from "next-auth";

// Replacement for Clerk's auth() function
export async function auth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions) as Session;
  
  // Convert undefined to null to satisfy the AuthResult type
  const userId = session?.user?.id || null;
  
  return {
    userId,
    sessionId: session?.user?.id || null, // Convert undefined to null
    session,
    user: session?.user || null, // Convert undefined to null
    // Add protect method similar to Clerk
    protect: async () => {
      if (!session?.user) {
        redirect('/signin');
      }
      return session;
    }
  };
}

// For middleware to check authentication
export async function getAuthFromRequest(request: NextRequest): Promise<AuthMiddlewareResult> {
  const cookies = request.cookies;
  
  // Extract the session token from cookies that Next Auth uses
  const sessionToken = cookies.get('next-auth.session-token')?.value ||
                      cookies.get('__Secure-next-auth.session-token')?.value;
  
  if (!sessionToken) {
    return { userId: null, sessionId: null, session: null, authenticated: false };
  }
  
  try {
    // Basic JWT decoding to extract user information
    // Note: In production, you'd want more validation here
    const decoded = jwtDecode<{ sub: string }>(sessionToken);
    
    return { 
      authenticated: true,
      userId: decoded.sub, // The JWT subject is the user ID
      sessionId: decoded.sub,
      session: { token: sessionToken }
    };
  } catch (error) {
    console.error("Error decoding session token:", error);
    return { userId: null, sessionId: null, session: null, authenticated: false };
  }
}

// For client-side auth state
export function getClientAuth() {
  return {
    isLoaded: true,
    isSignedIn: false, // This will be updated by the AuthProvider
    userId: null,
    sessionId: null,
    user: null,
  };
}