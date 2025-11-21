import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyPassword } from "@/lib/auth/prisma-auth";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { AuthenticationError, ValidationError, handleError } from "@/lib/observability/errors";

export async function POST(req: NextRequest) {
  const ctx = requestContext.create({
    path: '/api/auth/change-password',
    method: 'POST',
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      logger.warn('Unauthorized password change attempt', {
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

    const { currentPassword, newPassword } = await req.json();

    logger.info('Password change attempt', {
      requestId: ctx.requestId,
      userId,
    });

    const user = await metrics.trackQuery('findUnique:user:password', () =>
      prisma.user.findUnique({ where: { id: userId } })
    );

    if (!user || !user.password) {
      logger.warn('Password change failed: no password set', {
        requestId: ctx.requestId,
        userId,
        reason: 'social_login',
      });

      requestContext.delete(ctx.requestId);

      return NextResponse.json(
        { message: "User not found or no password set (social login)" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(currentPassword, user.password);

    if (!isValid) {
      logger.warn('Password change failed: incorrect current password', {
        requestId: ctx.requestId,
        userId,
      });

      requestContext.delete(ctx.requestId);

      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await metrics.trackQuery('update:user:password', () =>
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      })
    );

    const duration = requestContext.getDuration(ctx.requestId);

    logger.audit('Password changed successfully', {
      requestId: ctx.requestId,
      userId,
      duration,
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorResponse = handleError(error as Error, {
      requestId: ctx.requestId,
      endpoint: '/api/auth/change-password',
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}