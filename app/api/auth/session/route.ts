import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    // Return the session data (filters out sensitive information)
    return NextResponse.json({
      user: session.user,
      userId: session.userId,
      isSignedIn: !!session.userId,
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { message: "Failed to get session", isSignedIn: false },
      { status: 500 }
    );
  }
}