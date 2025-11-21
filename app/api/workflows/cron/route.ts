import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/types/appUrl";
import { WorkflowStatus } from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { handleError } from "@/lib/observability/errors";

export const dynamic = 'force-dynamic';

function isValidSecret(secret: string) {
    const API_SECRET = process.env.API_SECRET;
    if (!API_SECRET) return false;
    try {
        return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    } catch (error) {
        return false;
    }
}

export async function GET(req: Request) {
    const ctx = requestContext.create({
        path: '/api/workflows/cron',
        method: 'GET',
    });

    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn('Workflow cron: missing auth header', {
                requestId: ctx.requestId,
            });

            requestContext.delete(ctx.requestId);
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = authHeader.split(" ")[1];
        if (!isValidSecret(secret)) {
            logger.warn('Workflow cron: invalid secret', {
                requestId: ctx.requestId,
            });

            requestContext.delete(ctx.requestId);
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const lookAheadTime = new Date(now);
        lookAheadTime.setMinutes(lookAheadTime.getMinutes() + 10);

        logger.info('Workflow cron job started', {
            requestId: ctx.requestId,
            lookAheadTime: lookAheadTime.toISOString(),
        });

        const workflows = await metrics.trackQuery('findMany:workflows:scheduled', () =>
            prisma.workflow.findMany({
                select: { id: true },
                where: {
                    status: WorkflowStatus.PUBLISHED,
                    cron: {
                        not: null,
                    },
                    nextRunAt: {
                        lte: lookAheadTime,
                    }
                }
            })
        );

        logger.info('Scheduled workflows found', {
            requestId: ctx.requestId,
            count: workflows.length,
            workflowIds: workflows.map(w => w.id),
        });

        for (const workflow of workflows) {
            triggerWorkflow(workflow.id, ctx.requestId);
        }

        const duration = requestContext.getDuration(ctx.requestId);

        logger.audit('Workflow cron job completed', {
            requestId: ctx.requestId,
            workflowsTriggered: workflows.length,
            duration,
        });

        requestContext.delete(ctx.requestId);

        return Response.json({ workflowsToRun: workflows.length }, { status: 200 });

    } catch (error) {
        const errorResponse = handleError(error as Error, {
            requestId: ctx.requestId,
            endpoint: '/api/workflows/cron',
        });

        requestContext.delete(ctx.requestId);

        return Response.json({
            error: errorResponse.error,
        }, { status: errorResponse.statusCode });
    }
}

function triggerWorkflow(workflowId: string, parentRequestId?: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);

    logger.info('Triggering workflow execution', {
        parentRequestId,
        workflowId,
        triggerUrl: triggerApiUrl,
    });

    fetch(triggerApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.API_SECRET!}`,
            'Content-Type': 'application/json',
        },
        cache: "no-store",
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }

            logger.info('Workflow triggered successfully', {
                parentRequestId,
                workflowId,
            });
        })
        .catch((error) => {
            logger.error('Failed to trigger workflow', {
                parentRequestId,
                workflowId,
                error: error.message,
            });
        });
}