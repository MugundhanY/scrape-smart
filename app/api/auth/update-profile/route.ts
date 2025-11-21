import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { AuthenticationError, handleError } from "@/lib/observability/errors";

export async function POST(req: NextRequest) {
  const ctx = requestContext.create({
    path: '/api/auth/update-profile',
    method: 'POST',
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      logger.warn('Unauthorized profile update attempt', {
        requestId: ctx.requestId,
      });

      requestContext.delete(ctx.requestId);

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    requestContext.update(ctx.requestId, { userId });

    const { name } = await req.json();

    logger.info('Profile update attempt', {
      requestId: ctx.requestId,
      userId,
      hasName: !!name,
    });

    const updatedUser = await metrics.trackQuery('update:user:profile', () =>
      prisma.user.update({
        where: { id: userId },
        data: { name }
      })
    );

    const duration = requestContext.getDuration(ctx.requestId);

    logger.audit('Profile updated', {
      requestId: ctx.requestId,
      userId,
      duration,
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    const errorResponse = handleError(error as Error, {
      requestId: ctx.requestId,
      endpoint: '/api/auth/update-profile',
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}