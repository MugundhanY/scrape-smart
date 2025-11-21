import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { handleError } from "@/lib/observability/errors";

export const dynamic = 'force-dynamic';

export async function GET() {
  const ctx = requestContext.create({
    path: '/api/auth/session',
    method: 'GET',
  });

  try {
    const session = await auth();

    logger.debug('Session retrieved', {
      requestId: ctx.requestId,
      isAuthenticated: !!session.userId,
      userId: session.userId || undefined,
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json({
      user: session.user,
      userId: session.userId,
      isSignedIn: !!session.userId,
    });
  } catch (error) {
    const errorResponse = handleError(error as Error, {
      requestId: ctx.requestId,
      endpoint: '/api/auth/session',
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { message: "Failed to get session", isSignedIn: false },
      { status: 500 }
    );
  }
}