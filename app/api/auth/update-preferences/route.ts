import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { handleError } from "@/lib/observability/errors";

export async function POST(req: NextRequest) {
  const ctx = requestContext.create({
    path: '/api/auth/update-preferences',
    method: 'POST',
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      logger.warn('Unauthorized preferences update attempt', {
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

    const { preferences } = await req.json();

    logger.info('Preferences update attempt', {
      requestId: ctx.requestId,
      userId,
      hasEmailNotifications: preferences.emailNotifications !== undefined,
      hasWorkflowAlerts: preferences.workflowAlerts !== undefined,
      hasMarketingEmails: preferences.marketingEmails !== undefined,
    });

    const existingPreferences = await metrics.trackQuery('findUnique:userPreference', () =>
      prisma.userPreference.findUnique({ where: { userId } })
    );

    if (existingPreferences) {
      await metrics.trackQuery('update:userPreference', () =>
        prisma.userPreference.update({
          where: { userId },
          data: {
            emailNotifications: preferences.emailNotifications,
            workflowAlerts: preferences.workflowAlerts,
            marketingEmails: preferences.marketingEmails,
          }
        })
      );

      logger.info('User preferences updated', {
        requestId: ctx.requestId,
        userId,
      });
    } else {
      await metrics.trackQuery('create:userPreference', () =>
        prisma.userPreference.create({
          data: {
            userId,
            emailNotifications: preferences.emailNotifications,
            workflowAlerts: preferences.workflowAlerts,
            marketingEmails: preferences.marketingEmails,
          }
        })
      );

      logger.info('User preferences created', {
        requestId: ctx.requestId,
        userId,
      });
    }

    const duration = requestContext.getDuration(ctx.requestId);

    logger.audit('Preferences updated successfully', {
      requestId: ctx.requestId,
      userId,
      duration,
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { message: "Preferences updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorResponse = handleError(error as Error, {
      requestId: ctx.requestId,
      endpoint: '/api/auth/update-preferences',
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}