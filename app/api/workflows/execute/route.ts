import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import parser from "cron-parser";

function isValidSecret(secret: string){
    const API_SECRET = process.env.API_SECRET;
    if(!API_SECRET) return false;
    try {
        return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    } catch (error) {
        return false;
    }
}

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {searchParams} = new URL(request.url);
    const workflowId = searchParams.get("workflowId") as string;

    if(!workflowId) {
        return Response.json({error: "bad request"}, {status: 400});
    }

    const workflow = await prisma.workflow.findUnique({
        where: {id: workflowId},
    });

    if(!workflow) {
        return Response.json({error: "bad request"}, {status: 400});
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;

    if(!executionPlan) {
        return Response.json({error: "bad request"}, {status: 400});
    }

    try{
        const options = {
            tz: 'UTC',
          };
        const cron = parser.parse(workflow.cron!, options);
        const nextRun = cron.next().toDate();
        const execution = await prisma.workflowExecution.create({
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
        });
    
        await ExecuteWorkflow(execution.id);
        return new Response(null, {status: 200});
    } catch(error) {
        return Response.json({error: "internal server error"}, {status: 500});
    }
}