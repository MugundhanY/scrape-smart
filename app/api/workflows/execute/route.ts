import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import parser from "cron-parser";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { AuthenticationError, ValidationError, WorkflowError, handleError } from "@/lib/observability/errors";

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

export async function GET(request: Request) {
    const ctx = requestContext.create({
        path: '/api/workflows/execute',
        method: 'GET',
    });

    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn('Workflow execution: missing auth header', {
                requestId: ctx.requestId,
            });

            requestContext.delete(ctx.requestId);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = authHeader.split(" ")[1];
        if (!isValidSecret(secret)) {
            logger.warn('Workflow execution: invalid secret', {
                requestId: ctx.requestId,
            });

            requestContext.delete(ctx.requestId);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const workflowId = searchParams.get("workflowId") as string;

        if (!workflowId) {
            throw new ValidationError("Missing workflowId parameter");
        }

        logger.info('Workflow execution initiated', {
            requestId: ctx.requestId,
            workflowId,
        });

        const workflow = await metrics.trackQuery('findUnique:workflow', () =>
            prisma.workflow.findUnique({ where: { id: workflowId } })
        );

        if (!workflow) {
            throw new ValidationError("Workflow not found", { workflowId });
        }

        requestContext.update(ctx.requestId, { userId: workflow.userId });

        const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;

        if (!executionPlan) {
            throw new WorkflowError("Invalid execution plan", { workflowId });
        }

        const options = {
            tz: 'UTC',
        };

        const cron = parser.parse(workflow.cron!, options);
        const nextRun = cron.next().toDate();

        // Update workflow with next run time
        await metrics.trackQuery('update:workflow:nextRun', () =>
            prisma.workflow.update({
                where: { id: workflowId },
                data: { nextRunAt: nextRun }
            })
        );

        // Create execution record
        const execution = await metrics.trackQuery('create:workflowExecution', () =>
            prisma.workflowExecution.create({
                data: {
                    workflowId,
                    userId: workflow.userId,
                    status: WorkflowExecutionStatus.PENDING,
                    startedAt: new Date(),
                    trigger: WorkflowExecutionTrigger.CRON,
                    definition: workflow.definition,
                    phases: {
                        create: executionPlan.flatMap((phase) => {
                            return phase.nodes.flatMap((node) => {
                                return {
                                    userId: workflow.userId,
                                    node: JSON.stringify(node),
                                    number: phase.phase,
                                    name: TaskRegistry[node.data.type].label,
                                    status: ExecutionPhaseStatus.CREATED,
                                };
                            });
                        }),
                    },
                },
            })
        );

        logger.info('Workflow execution record created', {
            requestId: ctx.requestId,
            workflowId,
            executionId: execution.id,
            userId: workflow.userId,
        });

        // Execute workflow
        await metrics.trackWorkflow(workflowId, async () => {
            await ExecuteWorkflow(execution.id);
        });

        const duration = requestContext.getDuration(ctx.requestId);

        logger.audit('Workflow executed successfully', {
            requestId: ctx.requestId,
            workflowId,
            executionId: execution.id,
            userId: workflow.userId,
            duration,
        });

        requestContext.delete(ctx.requestId);

        return new NextResponse(null, { status: 200 });

    } catch (error: any) {
        const duration = requestContext.getDuration(ctx.requestId);

        const errorResponse = handleError(error as Error, {
            requestId: ctx.requestId,
            endpoint: '/api/workflows/execute',
            duration,
        });

        requestContext.delete(ctx.requestId);

        return NextResponse.json({
            error: errorResponse.error,
            category: errorResponse.category,
        }, { status: errorResponse.statusCode });
    }
}