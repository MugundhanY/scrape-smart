import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { handleError } from "@/lib/observability/errors";

// Ensure Node.js runtime for Winston/fs/crypto support
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const ctx = requestContext.create({
    path: '/api/cron',
    method: 'GET',
  });

  try {
    const now = new Date();

    // Track cron execution
    await metrics.trackAPICall('cron_execution', async () => {
      const workflows = await prisma.workflow.findMany({
        select: { id: true, lastRunAt: true },
        where: {
          status: WorkflowStatus.PUBLISHED,
          cron: { not: null },
          nextRunAt: { lte: now },
        },
      });

      logger.info(`Cron job triggered: found ${workflows.length} workflows to run`, {
        workflowCount: workflows.length,
        requestId: ctx.requestId
      });

      for (const workflow of workflows) {
        triggerWorkflow(workflow.id);
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorResponse = handleError(error, ctx);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  } finally {
    const duration = requestContext.getDuration(ctx.requestId);
    logger.info('Cron job completed', {
      requestId: ctx.requestId,
      duration
    });
    requestContext.delete(ctx.requestId);
  }
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );

  logger.debug(`Triggering workflow execution: ${workflowId}`, {
    url: triggerApiUrl
  });

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    cache: "no-store",
  }).catch((error) => {
    logger.error("Error triggering workflow with cron", {
      error: error.message,
      workflowId
    });
  });
}

function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return `${appUrl}/${path}`;
}
