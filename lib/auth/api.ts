import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "../auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Middleware function to handle authentication for API routes
 * @param handler The API route handler function
 * @returns A wrapped handler that checks authentication
 */
export function withAuth(
  handler: (req: NextRequest, auth: { userId: string }) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest) => {
    // Check authentication
    const auth = await getAuthFromRequest(req);
    
    // If not authenticated, return 401
    if (!auth.authenticated || !auth.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Call the handler with auth information
    return handler(req, { userId: auth.userId });
  };
}

/**
 * Get authentication status for server-side API handlers (not edge functions)
 */
export async function getAuthForApi() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { authenticated: false, userId: null, user: null };
  }
  
  return {
    authenticated: true,
    userId: session.user.id,
    user: session.user
  };
}